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
                    // console.log('Authentication failed:', err.message);
                    return next(new BadRequestError("Authentication error"));
                }
                // Authentication successful, attach user information to the socket
                // console.log('Token decoded successfully:', decoded);
                socket.user = decoded;
                next();
            }); 
        });

        this.io.on("connection", (socket: CustomSocket) => {
            if (socket.user && socket.user.email) {
                socket.join(socket.user.email);
                socket.join('alerts'); // also join alerts channel
                console.log(`User ${socket.user.email} joined channels:`);
                console.log(socket.rooms)
            }

            // Handle notification events from client here
            socket.on("joinChannel", (channel: string) => {
                console.log(`user explicitly joined a channel here ${channel}`)
                socket.join(channel); // Join a room based on user email to enable private notifications
            });
        });
    }

    static sendNotification(channels: string | string[], type: string, payload: object) {
        const channelArray = typeof channels === 'string' ? [channels] : channels;
        console.log('sendNotification socket event is fired inside socketio', payload, channels)
        for (const channel of channelArray) {
            this.io.to(channel).emit(type, { payload });
        }
    }
    static broadcastMessage(type: string, payload: object) {
        this.io.emit(type, payload);
    }

    // defind broadcast channels = alerts
    static broadcastChannel(channel:string, type: string, payload: object) {
        // type example NEW_JOB_LISTING
        // channel example alerts
        console.log(' broadcastChannel socket event is fired inside socketio', payload, channel)
        this.io.to(channel).emit(type, payload);
    }
}

export default SocketIOService;
