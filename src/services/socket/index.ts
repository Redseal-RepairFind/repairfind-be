import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

interface CustomSocket extends Socket {
    user?: any; // Define a custom property to store user information
}

class SocketService {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.initializeSocketEvents();
    }

    private initializeSocketEvents() {
        this.io.use((socket: CustomSocket, next) => {
            const token = socket.handshake.auth.token;
            const secret = process.env.JWT_CONTRACTOR_SECRET_KEY as string;
            jwt.verify(token, secret, (err: any, decoded: any) => {
                if (err) {
                    // Authentication failed
                    return next(new Error("Authentication error"));
                }
                // Authentication successful, attach user information to the socket
                socket.user = decoded.user;
                next();
            });
        });

        this.io.on("connection", (socket: CustomSocket) => {
            console.log("A user connected");
            socket.join(socket.user.email);

            // Handle notification events from client here
            socket.on("joinChannel", (channel: string) => {
                socket.join(channel); //// Join a room based on user email to enable private notifications
            });
        });
    }

    public static sendNotification(channels: string | string[], type: string, payload: object) {
        const io = SocketService.getInstance().io;
        const channelArray = typeof channels === 'string' ? [channels] : channels;
        
        for (const channel of channelArray) {
            io.to(channel).emit(type, { payload });
        }
    }

    public static broadcastMessage(type: string, payload: object) {
        const io = SocketService.getInstance().io;
        io.emit(type, payload);
    }

    private static instance: SocketService;

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            throw new Error("SocketService instance not initialized.");
        }
        return SocketService.instance;
    }

    public static initialize(io: Server): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService(io);
        }
        return SocketService.instance;
    }
}

export default SocketService;
