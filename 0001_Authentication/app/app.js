import express from "express";
import jwt from "jsonwebtoken";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Authentication app",
  });
});

 
  app.post("/api/auth/reg",(req,res)=>{
    const {email,name,password} = req.body;
    const token = jwt.sign({
        email,
        name,
    },
    "7fca772511a627f0f51c61c82804efa5a3ca5fb12f3dbb623dc442c026f1713d" ); //jwt secret key 
    res.status(201).json({
       message : "User created succesfully", 
        data :{
            email,
            name,
            token
        }
    })
  })

  
export default app;
