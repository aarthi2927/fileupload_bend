import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { client } from "../index.js";
import { auth } from "./auth.js";
const router=express.Router();
async function genPassword(password){
    const salt=await bcrypt.genSalt(10)
  const hashPassword=await bcrypt.hash(password,salt);
  console.log({salt,hashPassword});
  return hashPassword;
  }
  router.post("/register", async function (req, res) {// db.users.insertOne(data)
      const {username,password,email}= req.body;
      const hashPassword=await genPassword(password) ;
      const newUser={
          username:username,
          email:email,
          password:hashPassword,
      }
      console.log(newUser);
      const result = await client.db("filesystem")
      .collection("users").insertOne(newUser);
      res.send(result);});

      router.post("/login", async function (req, res)
       {
        const { username, password } = req.body;
      // db.users.findOne({username: "tamil"})
      const userFromDB = await client.db("filesystem").collection("users")
      .findOne({ username:username});
      console.log(userFromDB);
      if (!userFromDB) 
      {res.status(401).send({ message: "Invalid credentials" });
    } 
    else {
      const storedPassword = userFromDB.password; // hashed password
    const isPasswordMatch = await bcrypt.compare(password, storedPassword);
    console.log("isPasswordMatch", isPasswordMatch);
    if (isPasswordMatch) {
      //token generate
      const token=jwt.sign({id:userFromDB._id},process.env.SECRET_KEY);
      const user=username;
      const id=userFromDB._id;
      res.send({ message: "Successfull login",token:token,user:userFromDB });
    
    } 

    else {res.status(401).send({ message: "Invalid credentials" });}}});
       
  //
  router.get('/profile',auth,async(req,res)=>{
    const id=req.user.userid;
    console.log(req.user.userid);
    const o_id=new ObjectId(id);
    const singleuser=await client.db("filesystem").collection("users")
    .findOne({_id:o_id});
    res.status(200).send({user:singleuser});
    console.log(singleuser);
 })  

 //
 router.put('/profile/update',auth,async(req,res)=>{
  const id=req.user.userid;
  console.log(req.user.userid);
  const o_id=new ObjectId(id);
  const updateuser=req.body;
  const singleuseredit=await client.db("filesystem").collection("users")
  .UpdateOne({_id:o_id},{$set:updateuser});
  res.status(200).send({user:singleuseredit});
  console.log(singleuseredit);
}) 
 
 //
 router.put('/profile/delete',auth,async(req,res)=>{
  const id=req.user.userid;
  console.log(req.user.userid);
  const o_id=new ObjectId(id);
  const singleuserdelete=await client.db("filesystem").collection("users")
  .deleteOne({_id:o_id});
  res.status(200).send({user:singleuserdelete});
  console.log(singleuserdelete);
}) 
      

      export const usersRouter=router;