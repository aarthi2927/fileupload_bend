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
/*
app.use(cors({
  origin: 'https://merry-paletas-5154f7.netlify.app'
 }));

*/
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


