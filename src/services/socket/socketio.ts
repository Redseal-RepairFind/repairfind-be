import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { BadRequestError } from "../../utils/custom.errors";
import { ContractorModel } from "../../database/contractor/models/contractor.model";
import CustomerModel from "../../database/customer/models/customer.model";

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
                socket.join('customer@repairfind.com'); // to test call - remove
                console.log(`User ${socket.user.email} joined channels:`);
                console.log(socket.rooms)
            }

            // Handle notification events from client here
            socket.on("join_channel", (channel: string) => {
                console.log(`user explicitly joined a channel here ${channel}`)
                socket.join(channel); // Join a room based on user email to enable private notifications
            });

            // Handle notification events from client here
            socket.on("start_call", async (payload: any) => {
                
                console.log(`user started a call `, payload)
                const { toUser, toUserType } = payload
                if (!toUserType || !toUser) return // Ensure userType and userId are valid
                const user = toUserType === 'contractors' ? await ContractorModel.findById(toUser) : await CustomerModel.findById(toUser)
                if (!user) return // Ensure user exists
                
                this.io.to(socket.user.email).emit('OUTGOING_CALL', payload);
                this.io.to(user.email).emit('INCOMING_CALL', {name: 'Aaron', image: 'asdasd', channel: '234324234', });

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
