"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var WebSocketService = /** @class */ (function () {
    function WebSocketService(wss) {
        this.wss = wss;
        this.initializeWebSocketEvents();
    }
    WebSocketService.prototype.initializeWebSocketEvents = function () {
        this.wss.on("connection", function (ws) {
            console.log("A user connected");
            ws.on("message", function (message) {
                // Handle incoming messages here
                console.log("Received message: ".concat(message));
                // Example: Authenticate user based on token
                // const token = JSON.parse(message).token;
                // const secret = process.env.JWT_CONTRACTOR_SECRET_KEY as string;
                // jwt.verify(token, secret, (err: any, decoded: any) => {
                //     if (err) {
                //         // Authentication failed
                //         console.error("Authentication error:", err);
                //         return;
                //     }
                //     // Authentication successful, attach user information to the WebSocket instance
                //     ws.user = decoded.user;
                //     console.log("User authenticated:", ws.user);
                // });
            });
            ws.on("close", function () {
                console.log("A user disconnected");
            });
        });
    };
    WebSocketService.prototype.broadcastMessage = function (message) {
        // Broadcast message to all connected clients
        // You may need to implement user filtering logic if necessary
        // For example, sending a message only to authenticated users
        this.wss.clients.forEach(function (client) {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(message);
            }
        });
    };
    return WebSocketService;
}());
exports.default = WebSocketService;
