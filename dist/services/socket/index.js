"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var SocketService = /** @class */ (function () {
    function SocketService(io) {
        this.io = io;
        this.initializeSocketEvents();
    }
    SocketService.prototype.initializeSocketEvents = function () {
        this.io.use(function (socket, next) {
            var _a;
            var token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
            if (!token) {
                return next(new Error("Authentication token is missing."));
            }
            var secret = process.env.JWT_CONTRACTOR_SECRET_KEY;
            jsonwebtoken_1.default.verify(token, secret, function (err, decoded) {
                if (err) {
                    // Authentication failed
                    return next(new Error("Authentication error"));
                }
                // Authentication successful, attach user information to the socket
                socket.user = decoded.user;
                next();
            });
        });
        this.io.on("connection", function (socket) {
            console.log("A user connected");
            if (socket.user && socket.user.email) {
                socket.join(socket.user.email);
            }
            // Handle notification events from client here
            socket.on("joinChannel", function (channel) {
                if (socket.user && socket.user.email) {
                    socket.join(channel); // Join a room based on user email to enable private notifications
                }
            });
        });
    };
    SocketService.sendNotification = function (channels, type, payload) {
        var io = SocketService.getInstance().io;
        var channelArray = typeof channels === 'string' ? [channels] : channels;
        for (var _i = 0, channelArray_1 = channelArray; _i < channelArray_1.length; _i++) {
            var channel = channelArray_1[_i];
            io.to(channel).emit(type, { payload: payload });
        }
    };
    SocketService.broadcastMessage = function (type, payload) {
        var io = SocketService.getInstance().io;
        io.emit(type, payload);
    };
    SocketService.getInstance = function () {
        if (!SocketService.instance) {
            throw new Error("SocketService instance not initialized.");
        }
        return SocketService.instance;
    };
    SocketService.initialize = function (io) {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService(io);
        }
        return SocketService.instance;
    };
    return SocketService;
}());
exports.default = SocketService;
