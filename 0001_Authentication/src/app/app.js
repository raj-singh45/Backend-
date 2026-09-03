import express from "express";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
import { authenticate } from "../middleware/auth.middleware.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Authentication app",
  });
});

app.post("/api/auth/reg", async (req, res) => {
  const { email, name, password } = req.body;

  // save user in db ;
  const user = await userModel.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  ); //jwt secret key
  res.status(201).json({
    message: "User created succesfully",
    data: {
      email,
      name,
      id: user._id,
    },
    token,
  });
});

app.get("/api/auth/me", authenticate, async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({email})

  const isValid = bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({
      message: "Invalid creds",
    });
  }
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );
 res.status(200).json({
    message: "user login succesfully",
    data : {
      user:{
        email: user.email,
        name : user.name, 
      }
    }
  },
token);
});
export default app;
