"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var io = new socket_io_1.Server();
var socketapi = {
    io: io
};
// Add your socket.io logic here!
io.on("connection", function (socket) {
    console.log("A user connected");
});
// end of socket.io logic
exports.default = socketapi;
