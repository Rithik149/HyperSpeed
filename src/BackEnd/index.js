import express from "express";
const app = express();
import multer from "multer";
import fs from "fs";
import path from "path";

const upload = multer({ dest: "src/BackEnd/user_temps/uploads" });

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
  
  res.json({
    success:true,
    file:{
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
