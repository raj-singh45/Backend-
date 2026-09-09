import mongoose, { mongo } from "mongoose";

const userSchema  = new mongoose.Schema({
    name :{
        type : String ,
        required : true , 
        minLength : 3,
        maxLength : 50, 
    }, 
    email :{
        type : String, 
        required : true,
        unique : true ,
        match : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    passwordHash:{
        type: String,
        required: true
    },
    refreshToken :{
        type:String, 
    }

})

const userModel = mongoose.model("users",userSchema)
export default userModel ; 