import { Server } from "socket.io";

const io = new Server();

const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", (socket) => {
    console.log("A user connected");
});
// end of socket.io logic

export default socketapi;
