export const register = async(req,res)=>{

const errors = []; 
if(!email){
    errors.push({
        field : "email",
        message : "Email is required"
    })
}
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 

if(!(emailRegex.test(email))){
     errors.push({
        field : "email",
        message : "Invalid email address", 
    })

}

if(!phone){
    errors.push({
        field : "phone",
        message : "Phone number is required", 
    })
}
const phoneRegex  = /^(?:\+91[\-\s]?)?0?[6-9]\d{9}$/;

if(!(phoneRegex.test(phone))){
     errors.push({
        field : "email",
        message : "Invalid phone number ", 
    })

}

if(!password && !(password.trim())){
     errors.push({
        field : "password",
        message : "Password is required", 
    })

}

if(password.trim<6){
     errors.push({
        field : "password",
        message : "password field minimum have 6 characters", 
    })
}

if(errors.length>0){
    return res.status(400).json({
        message :  "Invalid Request" ,
        errors, 
    })
}

}
