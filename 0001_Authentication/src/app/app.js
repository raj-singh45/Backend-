import express from "express";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js"
import { authenticate } from "../middleware/auth.middleware.js";
const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).json({
    message: "Authentication app",
  });
});

 
  app.post("/api/auth/reg",async(req,res)=>{
    const {email,name,password} = req.body;

    // save user in db ; 
     const user = await userModel.create({
      name,email,password
     })



    const token = jwt.sign({
       id :  user._id
    }, 
    "7fca772511a627f0f51c61c82804efa5a3ca5fb12f3dbb623dc442c026f1713d" ); //jwt secret key 
    res.status(201).json({
       message : "User created succesfully", 
        data :{
            email,
            name,
            id:user._id, 
        },
        token
    })
  })

  
app.get("/api/auth/me",authenticate,async(req,res)=>{
 
  res.status(200).json({
    user : req.user,
  }) 
})
export default app;
