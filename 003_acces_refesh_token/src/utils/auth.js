import config from "../config/config.env.js"
import jwt from "jsonwebtoken"

export const generateTokens = ({userId})=>{
    const accessToken = jwt.sign({_id:userId},config.ACCESS_TOKEN,{expiresIn:"15m"})
    const refreshToken = jwt.sign({_id:userId},config.REFRESH_TOKEN,{expiresIn:"7d"})
    return {accessToken,refreshToken}
}

export const verifyAccessToken = (token)=>{

    const decoded =  jwt.verify(token,config.ACCESS_TOKEN)
    return decoded
}

export const verifyRefreshToken = (token)=>{
    const decoded =  jwt.verify(token, config.REFRESH_TOKEN)
    return decoded ; 
}