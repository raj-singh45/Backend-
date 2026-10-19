import { Server } from "socket.io";
import app from "./app/app.js";
import { createServer } from "node:http";

const httpServer = createServer(app) ;
const io = new Server(httpServer) ;

io.on("connection" ,(socket)=>{
    console.log("User connected successfully") ; 
    socket.on("disconnect" ,()=>{
        console.log("User disconnected succesfully") ; 
    })
})
 
httpServer.listen(3000,()=>{
    console.log("server is running on port 3000")
})