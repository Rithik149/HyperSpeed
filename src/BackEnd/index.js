import express from "express";
const app = express();
import multer from "multer";
import fs from "fs";
import path from "path";
import cors from "cors";
import { error } from "console";
import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  user: "postgres",
  password: "2004",
  host: "localhost",
  port: 5432,
  database: "hyperspeed",
});

app.use(
  cors({
    origin: "http://localhost:5173", // allow Vite frontend because js in not reading in f_end
  })
);

const upload = multer({ dest: "src/BackEnd/user_temps/uploads" });

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

//db cleanup
setInterval(async () => {
  try {
    const result = await pool.query(
      `
      SELECT code, file_path
      FROM shared_files
      WHERE expires_at < NOW()
      `
    );

    if (result.rowCount === 0) return;

    for (const row of result.rows) {
      try {
        await fs.promises.unlink(row.file_path);
      } catch (err) {
        console.error("Failed to delete file:", row.file_path, err);
      }
    }

    await pool.query(
      `
      DELETE FROM shared_files
      WHERE expires_at < NOW()
      `
    );
  } catch (err) {
    console.error("Cleanup job failed:", err);
  }
}, 60 * 1000);


//check if the code if already in the db
async function insertWithUniqueCode({
  filePath,
  originalName,
  size,
  mimeType,
  expiresAt,
}) {
  const maxRetries = 5;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const code = generateCode();

    try {
      await pool.query(
        `
        INSERT INTO shared_files
        (code, file_path, original_name, size, mime_type, expires_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [code, filePath, originalName, size, mimeType, expiresAt]
      );

      return code;
    } catch (err) {
      //retry
      if (err.code === "23505") continue;

      throw err;
    }
  }

  throw new Error("Could not generate unique code");
}

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { originalname, filename, destination, size, mimetype } = req.file;

    const ext = path.extname(originalname); //extension
    const base = path.basename(originalname, ext); //name

    const safebase = base.replace(/[^a-zA-Z0-9_]/g, "_"); //sanitize it means that replace something like space to _

    const newName = `${safebase}-${Date.now()}${ext}`;

    const oldPath = path.join(destination, filename);
    const newPath = path.join(destination, newName);

    await fs.promises.rename(oldPath, newPath);

    const expiresAt = Date.now() + 10 * 60 * 1000;
    const expiresAtforpg = new Date(expiresAt);

    const code = await insertWithUniqueCode({
      filePath: newPath,
      originalName: newName,
      size,
      mimeType: mimetype,
      expiresAt: expiresAtforpg,
    });

    res.json({
      success: true,
      code,
      expiresAt,
      file: {
        name: newName,
        size,
        type: mimetype,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/download/:code", async (req, res) => {
  const { code } = req.params;
  console.log("Download requested for code:", code);

  const result = await pool.query(
    `
      SELECT * FROM shared_files WHERE code = $1
      `,
    [code]
  );

  if (result.rowCount === 0) {
    return res.status(404).send("Invalid code");
  }

  const { file_path, original_name, expires_at } = result.rows[0];

  if (expires_at < new Date()) {
    await pool.query(`
        DELETE FROM shared_files WHERE code=$1
      `),
      [code];
    return res.status(410).send("Code expired!");
  }

  res.download(file_path, original_name, async (err) => {
    if (err) {
      await pool.query(`DELETE FROM shared_files WHERE code = $1`, [code]);
      await fs.promises.unlink(file_path, (err) => {
        console.log(err);
      });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
