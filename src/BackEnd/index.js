import express from "express";
import multer from "multer"
const app = express();

const upload = multer({dest:'src/BackEnd/user_temps/uploads'})

app.post("/upload",upload.single("file"),(req,res)=>{
  console.log(req.file);
  res.send("File received!");
});


app.get("/",(req,res)=>{
  res.send("Server is running");
});

app.listen(3000,()=>{
  console.log("Server is running on http://localhost:3000");
});