import config from './config.js';
import mongoose from 'mongoose';
async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with an error code
    }   
}
export default connectDB;