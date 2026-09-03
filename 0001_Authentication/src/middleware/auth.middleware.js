import jwt from "jsonwebtoken"
import userModel from "../model/userModel.js";

export const authenticate = async(req,res,next)=>{
    const token = req.headers.authorization
    if(!token){
        return res.status(401).json({
            message : "Token not found"
        })
    } 

    const data = jwt.decode(token); 
    console.log(data)

    const user = await userModel.findById(data.id) ;
    
    req.user = user ; //new property create req me user naam ki properti and user data pass on it 
     next()


}