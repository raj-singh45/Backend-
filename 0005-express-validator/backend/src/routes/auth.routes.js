import express from "express";
import { register } from "../controller/auth.controller.js";
import userModel from "../model/user.model.js";
const router = express.Router()


/**
 * POST /api/auth/register
 * req.body = {email,phone,password}
 */
router.post("/register",register)
const { email, phone, password } = req.body


const user = await userModel.create({
    email,
        phone,
        password: password// hash(password)
})
 res.status(201).json({
        message: "User registered Successfully",
        data: {
            email,
            phone,
            id: user._id
        }
    })
export default router