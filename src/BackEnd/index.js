import express from "express";
const app = express();
import multer from "multer";
import fs from "fs";
import path from "path";
import cors from "cors";
import { error } from "console";
import pg from "pg";
const { Pool } = pg;
const pool=new Pool({
  user:"postgres",
  password:"2004",
  host:"localhost",
  port:5432,
  database:"hyperspeed",
});

app.use(
  cors({
    origin: "http://localhost:5173", // allow Vite frontend because js in not reading in f_end
  })
);

const upload = multer({ dest: "src/BackEnd/user_temps/uploads" });
const shareStore = new Map();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/upload", upload.single("file"),async (req, res) => {
  const { originalname, filename, destination, size, mimetype } = req.file;

  const ext = path.extname(originalname); //extension
  const base = path.basename(originalname, ext); //name

  const safebase = base.replace(/[^a-zA-Z0-9_]/g, "_"); //sanitize it means that replace something like space to _

  //final name
  const newName = `${safebase}-${Date.now()}${ext}`;

  const oldPath = path.join(destination, filename);
  const newPath = path.join(destination, newName);

  fs.renameSync(oldPath, newPath);

  //code generation
  let code;
  do {
    code = generateCode();
  } while (shareStore.has(code));

  await pool.query(
    `
    INSERT INTO shared_files(code,file_path,original_name,size,mime_type,expires_at) VALUES($1,$2,$3,$4,$5,$6)
    `,
    [code,newPath,newName,size,mimetype,new Date(Date.now() + 10 * 60 * 1000)]
  );
  const expires_at=Date.now()+10*60*1000;
  
  res.json({
    success: true,
    code,
    expiresAt: expires_at,
    file: {
      name: newName,
      size,
      type: mimetype,
    },
  });
});

app.get("/download/:code", (req, res) => {
  const { code } = req.params;
  console.log("Download requested for code:", code);

  const entry = shareStore.get(code); // get set delete

  if (!entry) {
    // console.log("fucked");
    return res.status(404).json({ error: "Invalid code" });
  }

  if (entry.expiresAt < Date.now()) {
    shareStore.delete(code);
    return res.status(410).json({ error: "Code expired!" });
  }

  res.download(entry.path, entry.name, (err) => {
    if (!err) {
      shareStore.delete(code); // invalid also res.send("something stupid") works better i guess
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
