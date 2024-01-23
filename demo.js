//files.js
import express from "express";
const router=express.Router();
import{getfilesById,deletefiles ,getAllfiles,updatefiles,createfiles} from '../helper.js';
import { auth } from "./auth.js";
import multer from "multer";
import path from "path";
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

      //index.js
      import express from 'express';
import {MongoClient } from 'mongodb';
import {filesRouter } from './routes/files.js';
import { usersRouter } from './routes/users.js';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
console.log(process.env.MONGO_URL);
const PORT=process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
app.use(cors({
  origin: 'http://localhost:3000'
 }));

app.use('/uploads',express.static('uploads'));
//app.use('/uploads', express.static(path.join(__dirname,'uploads')))
/*
app.use(express.static(path.join(__dirname,'../../basicfendloginusercurd/src/uploads')));
//app.use('/uploads', express.static(path.join(__dirname,'uploads')))
 //  cb(null,'../../basicfendloginusercurd/src/uploads')
*/
async function createConnection()
{
    const client=new MongoClient(MONGO_URL);
    await client.connect();
    console.log('mongo is connect')
return client;
}
  export const client = await createConnection();
app.get('/', function (req, res) {
  res.send('Hello Worldggg')
})
app.use('/files',filesRouter);
app.use('/users',usersRouter);
app.listen(PORT,function()
{console.log(`server start from PORT ${PORT}` )});


//addfile.js
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { mockapi } from './mockapi';
export function AddFile() {
 const [filelist,setFileList]=useState([]);
  const [filedata, setFiledata] = useState("");
  const [heading, setHeading] = useState(" ");
   const [subheading, setSubheading] = useState("");
   const [description, setDescription] = useState("");
   const history=useNavigate();

const addfile=async(e)=>{
  e.preventDefault();
  const data = new FormData();
  data.append('filedata', filedata);
  data.append('heading', heading);
  data.append('subheading', subheading);
  data.append('description', description);

  try {
    const response = await fetch(`${mockapi}/files/add`, {
      method: 'POST',
      body: data,
      headers: {
             
              'x-auth-token': localStorage.getItem('token'),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const filelist = await response.json();
    console.log('Success:', filelist);
   setFileList(filelist);
    history('/File');
  } catch (error) {
    console.error('Error:', error.message);
    // Handle errors, such as showing an error message to the user
  }
};
 
  return (
    <div className="add-movie-form">
      <form onSubmit={addfile}> 
      <input type="file" onChange={(event)=>
                          setFiledata(event.target.files[0])} className="upload-box-input" required/>
      <input label="Heading" placeholder="Heading" onChange={(event) => setHeading(event.target
        .value)} />
      <input label="Subheading" placeholder="Subheading" onChange={(event) => setSubheading(event.target
        .value)} />
      <input label="Description" placeholder="Description" onChange={(event) => setDescription(event.target
        .value)} />
      <button variant="contained" type="submit">Add file</button>
      </form> </div>
  );

}

//fileDetails.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { mockapi } from './mockapi';

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const supportedFileTypes = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  pdf: 'pdf',
  txt: 'text',
  docx: 'word',   // Microsoft Word
  xlsx: 'excel',  // Microsoft Excel
  pptx: 'powerpoint',
  // Add more as needed
};
export function FileDetails() {
  const history=useNavigate();
 const{id}=useParams();
 const [filedata1, setFiledata1] = useState([]);
  useEffect(() => {
     dataviewid();
  }, [id]);
  const dataviewid = async () => {
    try {
      const response = await fetch(`${mockapi}/files/${id}`, {
        method:'GET',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          "Access-Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET" ,
        },
             });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
          setFiledata1(data);
            } catch (err) {
      console.error('Error:', err);
    }
  };
  console.log(filedata1.filedata)

  const getFileType = (fileName) => {
    if (!fileName) {
      return 'unknown';
    }
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return supportedFileTypes[fileExtension] || 'unknown';
  };
  const renderFileContent = () => {
    if (!filedata1 || !filedata1.filedata) {
      return <p>Loading...</p>; // or some other loading indicator
    }
  
    const fileType = getFileType(filedata1.filedata);
  
    switch (fileType) {
      case 'image':
        return <img src={`http://localhost:8000/${filedata1.filedata}`} className="imagesize" alt="not found" />;
      case 'pdf':
        return <iframe src= {`http://localhost:8000/${filedata1.filedata}`}  width="100%"
        height="800" />;
        case 'text':
          return <p>Text content goes here</p>;
        case 'word':
          // Handle Microsoft Word document
          return <div className="imagesize1">
                     <iframe
         id='id12321'
         title='dummy'
         width="100%"
         height="800"
         frameborder="0"
         src={`http://localhost:8000/${filedata1.filedata}`}
       ></iframe>
         </div> ;
        case 'excel':
          // Handle Microsoft Excel document
          return <div className="imagesize1">
           
          <iframe
         id='id12321'
         title='dummy'
         width="100%"
         height="800"
         frameborder="0"
         src={`http://localhost:8000/${filedata1.filedata}`}
       ></iframe>
         </div>
        case 'powerpoint':
          // Handle Microsoft PowerPoint presentation
          return <div className="imagesize1">
           <iframe
         id='id12321'
         title='dummy'
         width="100%"
         height="800"
         frameborder="0"
         src={`http://localhost:8000/${filedata1.filedata}`}
       ></iframe>
         </div>
      default:
        return <p>Unsupported file type</p>;
    }
  };

  return (
    <div>
      <div className="viewdata">
        <h1>{filedata1.heading}</h1>
        {renderFileContent()}
        <button onClick={() => { history('/File'); }}>Back</button>
      </div>
    </div>
  );
}