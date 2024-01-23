import jwt from "jsonwebtoken";
export const auth=(req,res,next)=>{
    try{
const token=req.header("x-auth-token");
console.log(token);
const decodedtoken=jwt.verify(token,process.env.SECRET_KEY);
req.user={
    email:decodedtoken.email,
    username:decodedtoken.username,
    userid:decodedtoken.id,
}
next();
    }
    catch(err){
        res.status(401).send({error:err.message});
    }
}