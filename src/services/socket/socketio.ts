import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { BadRequestError } from "../../utils/custom.errors";

interface CustomSocket extends Socket {
    user?: any; // Define a custom property to store user information
}

class SocketIOService {
    private static io: Server;

    static initialize(io: Server) {
        this.io = io;
        this.initializeSocketEvents();
    }

    private static initializeSocketEvents() {
        this.io.use((socket: CustomSocket, next) => {
            const token = socket.handshake.headers.token as string;
            if (!token) {
                console.log('Authentication token is missing.')
                return next(new BadRequestError("Authentication token is missing."));
            }
            
            const secret = process.env.JWT_CONTRACTOR_SECRET_KEY as string;
            jwt.verify(token, secret, (err: any, decoded: any) => {
                if (err) {
                    // Authentication failed
                    console.log('Authentication failed:', err.message);
                    return next(new BadRequestError("Authentication error"));
                }
                // Authentication successful, attach user information to the socket
                console.log('Token decoded successfully:', decoded);
                socket.user = decoded;
                next();
            }); 
        });

        this.io.on("connection", (socket: CustomSocket) => {
            console.log("A user connected to socket here");
            console.log(socket.user)
            if (socket.user && socket.user.email) {
                console.log(`user joined a channel ${socket.user.email}`)
                socket.join(socket.user.email);
            }

            // Handle notification events from client here
            socket.on("joinChannel", (channel: string) => {
                console.log(`user joined a channel here ${channel}`)
                socket.join(channel); // Join a room based on user email to enable private notifications

                this.sendNotification(channel, 'Notification', {channel})
            });
        });
    }

    static sendNotification(channels: string | string[], type: string, payload: object) {
        const channelArray = typeof channels === 'string' ? [channels] : channels;
        
        for (const channel of channelArray) {
            this.io.to(channel).emit(type, { payload });
        }
    }

    static broadcastMessage(type: string, payload: object) {
        this.io.emit(type, payload);
    }
}

export default SocketIOService;
