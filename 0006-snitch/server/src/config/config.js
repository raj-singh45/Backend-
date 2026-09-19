import dotenv from "dotenv"

dotenv.config() ;

const config = {
    MONGO_URI: process.env.MONGO_URI ,
    ACCESSTOKEN_SECRET :process.env.ACCESSTOKEN_SECRET,
    REFRESHTOKEN_SECRET : process.env.REFRESHTOKEN_SECRET,
}
export default config