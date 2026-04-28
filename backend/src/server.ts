import express, { Application } from "express";
import "dotenv/config";
import db from "./config/database";
import authRoutes from "./routes/authRoutes";
import { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import tweetRoutes from "./routes/tweetRoutes";
import multer, { Multer } from "multer";
import path from "node:path";

const PORT = process.env.PORT;
const app: Application = express();
const uploadsDir = path.join(__dirname, "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});
const fileFilter = (req:Request,file:Express.Multer.File, cb:multer.FileFilterCallback)=>{
    const allowedFiles = ['image/jpeg','image/png', 'image/gif'];
    if(allowedFiles.includes(file.mimetype)){
        cb(null,true)
    }
    else{
        cb(new Error('Only images or videos are allowed'));
    }
}
const upload:Multer = multer({
    storage,
    fileFilter,
    limits:{
        fileSize:5*1024*1024 // 5mb
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
db;
app.use("/api/users", userRoutes);
app.use("/api/tweets", tweetRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
