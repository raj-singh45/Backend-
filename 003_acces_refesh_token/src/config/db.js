import config from "./config.env.js"
import mongoose from "mongoose"

const connectDb = async()=>{
  await  mongoose.connect(config.MONGO_URI) ;
  console.log("mongoDb connected")
}
export default connectDb