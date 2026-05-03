import multer, { Multer } from "multer";
import path from "path";
import { Request } from "express";
const uploadsDir = path.join(__dirname, "../uploads/");
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
    const allowedFiles = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/ogg',
    ];
    if(allowedFiles.includes(file.mimetype)){
        cb(null,true)
    }
    else{
        cb(new Error('Only images or videos are allowed'));
    }
}
 export const upload:Multer = multer({
    storage,
    fileFilter,
    limits:{
        fileSize:25*1024*1024
    }
});
