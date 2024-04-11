import WebSocket from "ws";

interface CustomWebSocket extends WebSocket {
    user?: any; // Define a custom property to store user information
}

class WebSocketService {
    private wss: WebSocket.Server;

    constructor(wss: WebSocket.Server) {
        this.wss = wss;
        this.initializeWebSocketEvents();
    }

    private initializeWebSocketEvents() {
        this.wss.on("connection", (ws: CustomWebSocket) => {
            console.log("A user connected");

            ws.on("message", (message: string) => {
                // Handle incoming messages here
                console.log(`Received message: ${message}`);

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

            ws.on("close", () => {
                console.log("A user disconnected");
            });
        });
    }

    public broadcastMessage(message: string) {
        // Broadcast message to all connected clients
        // You may need to implement user filtering logic if necessary
        // For example, sending a message only to authenticated users
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}

export default WebSocketService;
