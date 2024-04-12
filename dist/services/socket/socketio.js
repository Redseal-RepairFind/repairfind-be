"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var custom_errors_1 = require("../../utils/custom.errors");
var SocketIOService = /** @class */ (function () {
    function SocketIOService() {
    }
    SocketIOService.initialize = function (io) {
        this.io = io;
        this.initializeSocketEvents();
    };
    SocketIOService.initializeSocketEvents = function () {
        this.io.use(function (socket, next) {
            var token = socket.handshake.headers.token;
            if (!token) {
                console.log('Authentication token is missing.');
                return next(new custom_errors_1.BadRequestError("Authentication token is missing."));
            }
            var secret = process.env.JWT_CONTRACTOR_SECRET_KEY;
            jsonwebtoken_1.default.verify(token, secret, function (err, decoded) {
                if (err) {
                    // Authentication failed
                    console.log('Authentication failed:', err.message);
                    return next(new custom_errors_1.BadRequestError("Authentication error"));
                }
                // Authentication successful, attach user information to the socket
                console.log('Token decoded successfully:', decoded);
                socket.user = decoded;
                next();
            });
        });
        this.io.on("connection", function (socket) {
            console.log("A user connected to socket here");
            console.log(socket.user);
            if (socket.user && socket.user.email) {
                console.log("user joined a channel ".concat(socket.user.email));
                socket.join(socket.user.email);
            }
            // Handle notification events from client here
            socket.on("joinChannel", function (channel) {
                console.log("user joined a channel here ".concat(channel));
                socket.join(channel); // Join a room based on user email to enable private notifications
            });
        });
    };
    SocketIOService.sendNotification = function (channels, type, payload) {
        var channelArray = typeof channels === 'string' ? [channels] : channels;
        console.log('socket notification is fired inside socketio', payload, channels);
        for (var _i = 0, channelArray_1 = channelArray; _i < channelArray_1.length; _i++) {
            var channel = channelArray_1[_i];
            this.io.to(channel).emit(type, { payload: payload });
        }
    };
    SocketIOService.broadcastMessage = function (type, payload) {
        this.io.emit(type, payload);
    };
    return SocketIOService;
}());
exports.default = SocketIOService;
