import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { BadRequestError } from "../../utils/custom.errors";
import { ContractorModel } from "../../database/contractor/models/contractor.model";
import CustomerModel from "../../database/customer/models/customer.model";
import { JobDayModel } from "../../database/common/job_day.model";
import { JobModel } from "../../database/common/job.model";

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
            socket.on("join_channel", (channel: string) => {
                console.log(`user explicitly joined a channel here ${channel}`)
                socket.join(channel); // Join a room based on user email to enable private notifications
            });

            // Handle notification events from client here
            socket.on("start_call", async (payload: any) => {
                // console.log(`user started a call `, payload)
                // const { toUser, toUserType } = payload
                // if (!toUserType || !toUser) return // Ensure userType and userId are valid
                // const user = toUserType === 'contractors' ? await ContractorModel.findById(toUser) : await CustomerModel.findById(toUser)
                // if (!user) return // Ensure user exists
                
                // this.io.to(socket.user.email).emit('OUTGOING_CALL', payload);
                // this.io.to(user.email).emit('INCOMING_CALL', {name: 'Aaron', image: 'asdasd', channel: '234324234', });

            });

            // Handle notification events from client here
            socket.on("send_jobday_contractor_location", async (payload: any) => {
                console.log(`Jobday contractor location update `, payload)
                // JOB_DAY_UPDATES
                
                const { toUser, toUserType, jobdayId } = payload
                // if (!toUserType || !toUser) return // Ensure userType and userId are valid
                // const user = toUserType === 'contractors' ? await ContractorModel.findById(toUser) : await CustomerModel.findById(toUser)
                // if (!user) return // Ensure user exists
                
                const jobday = await JobDayModel.findById(payload.jobdayId)
                if(!jobday)return

                

                const customer = await CustomerModel.findById(jobday.customer)
                let contractor = await ContractorModel.findById(jobday.contractor)
                const job = await JobModel.findById(jobday.job)
                if(!customer || !contractor)return
                
                // console.log(customer)

                const  data = {
                    ...payload,
                    name:contractor.name,
                    profilePhoto: contractor.profilePhoto
                }
                this.sendNotification(customer.email, 'JOB_DAY_CONTRACTOR_LOCATION', data);

                if(job && job.isAssigned){
                    contractor = await ContractorModel.findById(job.contractor)
                    if(!contractor)return
                    this.sendNotification(contractor.email, 'JOB_DAY_CONTRACTOR_LOCATION', data);
                }

            });
        });
    }

    static sendNotification(channels: string | string[], type: string, payload: object) {
        const channelArray = typeof channels === 'string' ? [channels] : channels;
        console.log('sendNotification socket event is fired inside socketio', {payload, channels, type})
        for (const channel of channelArray) {
            this.io.to(channel).emit(type, { payload });
        }
    }
    static broadcastMessage(type: string, payload: object) {
        this.io.emit(type, payload);
    }

    // defind broadcast channels = alerts
    static broadcastChannel(channel:string, type: string, payload: object) {
        console.log(' broadcastChannel socket event is fired inside socketio', payload, channel)
        this.io.to(channel).emit(type, payload);
    }
}

export default SocketIOService;
