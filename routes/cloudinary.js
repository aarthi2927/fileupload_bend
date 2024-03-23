
import { v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: 'dx0aapq6p',
  api_key: '111215594174789',
  api_secret: 'JL5dkFM2n2ON8q2JTi46SB4igp0'
});

/*
import express from "express";
const router=express.Router();
import{getfilesById,deletefiles ,getAllfiles,updatefiles,createfiles} from '../helper.js';
import { auth } from "./auth.js";

import multer from "multer";
import path from "path";
import { client } from "../index.js";
const filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
 })
 const uploadStorage = multer({ storage: storage,
limits:{
  fileSize: 12 * 1024 * 1024,
},
filefilter:(req,file,cb)=>{
          const mimeType = fileTypes.test(file.mimetype)  
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper files formate to upload')
}
})

router.post("/add",auth,uploadStorage.single("filedata",'text'),async(req,res)=>{
    //const filedata =req.file;
    //`${process.env.Backend_url}/${req.file.filename}`
 try{ 
    const filedata=req.file.path;
      const heading =req.body.heading;
      const subheading =req.body.subheading;
      const description =req.body.description;
      const userId=req.user.userid;
     const data1 ={heading,subheading,description,filedata,userId};
      console.log(heading)
    const result=await client.db("filesystem")
    .collection("files").insertOne(data1);
        res.status(200).send(result);
          console.log(data1);
    }
    catch (error) {
      res.status(500).send({ error: error.message });
    }
*/