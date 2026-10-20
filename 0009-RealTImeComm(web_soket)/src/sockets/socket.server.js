import { Server } from "socket.io";

export default function initializeSocket(httpServer) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("user connected ", socket.id);

    socket.on("elon", (msg) => {
      console.log(msg);
      io.emit("musk", "hello from server via socket");
    });
    //      socket.on("elon",(msg)=>{
    //     console.log(msg);
    //     socket.emmit("musk", "hello from server")
    //    })

    //     socket.on("elon", (msg) => {
    //     console.log(msg)
    //     socket.broadcast.emit("musk","hello from server via socket")
    // })

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}
