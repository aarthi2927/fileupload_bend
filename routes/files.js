import express from "express";
const router=express.Router();
import{getfilesById,deletefiles ,getAllfiles,updatefiles,createfiles} from '../helper.js';
import { auth } from "./auth.js";
import { v2 as cloudinary} from 'cloudinary';
import multer from "multer";
import path from "path";
import { client } from "../index.js";
cloudinary.config({
  cloud_name: 'dx0aapq6p',
  api_key: '111215594174789',
  api_secret: 'JL5dkFM2n2ON8q2JTi46SB4igp0'
});
const uploadStorage = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
}).single("filedata");

router.post("/add", auth, uploadStorage, async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "cloudinary"
    });

   const data = {
      heading:req.body.heading,
      subheading:req.body.subheading,
      description:req.body.description,
      filedata: { public_id: result.public_id, url: result.secure_url },
      userId:req.user.userid
    };

    await client.db("filesystem").collection("files").insertOne(data);

    res.status(200).json({ message: 'File uploaded successfully', data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
     //submenu
     router.get("/heading",auth,async function (req, res){
      const filteredData1 =await client.db("filesystem").collection("files")
      .find({}).toArray();
      console.log(filteredData1);
 res.send(filteredData1)
    });
 router.get("/heading/:submenu", auth, async function (req, res) {
  const { newheading, submenu } = req.params;
  //console.log("New Heading:", newheading);
  console.log("Submenu:", submenu);

  // Define a regular expression to match the submenu in subheading
  const submenuRegex = new RegExp(submenu, "i"); // "i" for case-insensitive matching

  // Find documents where heading matches and subheading contains the specified submenu
  const filteredData = await client.db("filesystem").collection("files")
    .find({subheading: { $regex: submenuRegex } })
    .toArray();

  res.json(filteredData);
});

    router.get("/view",auth,async function (req, res) {
    const files=await getAllfiles();
    console.log(files);
    res.send(files);
     })
 //delete
 router.get("/:id",auth,async function (req, res) {
  console.log(req.params);
  const{id}=req.params;
  const file=await getfilesById(id);
  console.log(file);
 res.send(file)
      })

      router.delete("/:id",auth, async function (req, res) {
     console.log(req.params);
     try {
         const{id}=req.params;
      const o_id=new ObjectId(id);
      const file = await client.db("filesystem").collection("files").findOne({ _id: o_id });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete the file from Cloudinary using its public_id
    await cloudinary.uploader.destroy(file.filedata.public_id);

    // Delete the file record from MongoDB
    const result = await client.db("filesystem")
      .collection("files")
      .deleteMany({ _id: o_id });

    res.status(200).json({ message: 'File deleted successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
      })
       router.put("/:id", auth,async function (req, res) {
    try{
      console.log(req.params);
      const{id}=req.params;
      const o_id=new ObjectId(id);
      const updateData=req.body;
      const result=await client.db("filesystem")
      .collection("files") 
      .updateOne({ _id: o_id }, { $set: updateData });
      console.log(result);
      res.send(result);
    }
    catch (error) {
      console.error('Error updating file:', error);
      res.status(500).send('Internal Server Error');
    }

     })
      //
     
      export const filesRouter=router;

        /*
  router.get("/heading/:newheading",auth,async function (req, res){
  const { newheading } = req.params;
    const filteredData =await client.db("filesystem").collection("files")
.find({heading:newheading}).toArray();
const d1= filteredData.heading;
if(filteredData){
  res.send(filteredData);
 }
  else{
    res.send('Heading not found');
  }
   });
  
   router.get("/heading/:newheading", auth, async function (req, res) {
    const { newheading } = req.params;
    const filteredData = data.filter(item => item.heading === newheading);
  
    if (filteredData.length > 0) {
      res.send(filteredData);
    } else {
      res.send('Heading not found');
    }
  });
*/
//
/*
router.get("/heading/:newheading",auth,async function (req, res){
  const { newheading } = req.params;
    const filteredData =await client.db("filesystem").collection("files")
.find({heading:newheading}).toArray();
 if(filteredData){
  res.send(filteredData);
 }
  else{
    res.send('Heading not found');
  }
   });
*/
/*
router.get("/heading/:newheading", auth, async function (req, res) {
  const { newheading } = req.params;
  const filteredData =await client.db("filesystem").collection("files")
.find({heading:newheading}).toArray();
  const filteredData1 = filteredData.filter(item => item.heading === newheading);

  if (filteredData1.length > 0) {
    res.send(filteredData1);
  } else {
    res.send('Heading not found');
  }
});

    */