import express from "express";
const app = express();
import multer from "multer";
import fs from "fs";
import path from "path";
import cors from "cors";

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

app.post("/upload", upload.single("file"), (req, res) => {
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

  shareStore.set(code, {
    path: newPath,
    name: newName,
    size,
    type: mimetype,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
  const entry=shareStore.get(code);

  res.json({
    success: true,
    code,
    expiresAt:entry.expiresAt,
    file: {
      name: newName,
      size,
      type: mimetype,
    },
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
