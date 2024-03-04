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
    const result=await createfiles(data1);
        res.status(200).send(result);
          console.log(data1);
    }
    catch (error) {
      res.status(500).send({ error: error.message });
    }
     })
     //submenu
     router.get("/heading",auth,async function (req, res){
      const filteredData1 =await client.db("filesystem").collection("files")
      .find({}).toArray();
      console.log(filteredData1);
 res.send(filteredData1)
    });
 

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
      const{id}=req.params;
      const result=await deletefiles(id);
      console.log(result);
      res.send(result);
      })
     
  router.put("/:id", auth,async function (req, res) {
    try{
      console.log(req.params);
      const{id}=req.params;
      const updateData=req.body;
      const result=await updatefiles(id, updateData);
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