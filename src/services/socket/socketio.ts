import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { BadRequestError } from "../../utils/custom.errors";
import { ContractorModel } from "../../database/contractor/models/contractor.model";
import CustomerModel from "../../database/customer/models/customer.model";
import { JobDayModel } from "../../database/common/job_day.model";
import { JobModel } from "../../database/common/job.model";
import { Logger } from "../logger";
import { MessageModel } from "../../database/common/messages.schema";
import { ConversationModel } from "../../database/common/conversations.schema";
import { isValidObjectId } from "mongoose";
import { NotificationService } from "../notifications";

interface CustomSocket extends Socket {
    user?: any; // Define a custom property to store user information
}

class SocketIOService {
    private static io: Server;

    static initialize(server: any) {
        const io = new Server(server, {
            cors: {
                origin: "*",
            },
        });

        this.io = io;
        this.initializeSocketEvents();
    }

    private static initializeSocketEvents() {
        this.io.use((socket: CustomSocket, next) => {
            const token = socket.handshake.headers.token as string;
            if (!token) {
                Logger.info('Authentication token is missing.')
                return next(new BadRequestError("Authentication token is missing."));
            }

            const secret = process.env.JWT_SECRET_KEY as string;
            jwt.verify(token, secret, (err: any, decoded: any) => {
                if (err) {
                    // Authentication failed
                    console.log('err', err)
                    return next(new BadRequestError("Authentication error"));
                }
                // Authentication successful, attach user information to the socket
                socket.user = decoded;
                next();
            });
        });

        this.io.on("connection", (socket: CustomSocket) => {
            if (socket.user && socket.user.email) {
                socket.join(socket.user.email);
                socket.join('alerts'); // also join alerts channel

                const channels: any = []
                socket.rooms.forEach(cha => {
                    channels.push(cha)
                })
                Logger.info(`User ${socket.user.email} joined channels: ${channels}`);
            }

            // Handle notification events from client here
            socket.on("join_channel", (channel: string) => {
                Logger.info(`user explicitly joined a channel here ${channel}`)
                socket.join(channel); // Join a room based on user email to enable private notifications
            });

            // Handle notification events from client here
            socket.on("start_call", async (payload: any) => {

            });

            // Handle notification events from client here
            socket.on("send_jobday_contractor_location", async (payload: any) => {
                Logger.info(`Jobday contractor location update `, payload)
                const { toUser, toUserType, jobdayId } = payload
                const jobday = await JobDayModel.findById(payload.jobdayId)
                if (!jobday) return

                const customer = await CustomerModel.findById(jobday.customer)
                let contractor = await ContractorModel.findById(jobday.contractor)
                const job = await JobModel.findById(jobday.job)
                if (!customer || !contractor) return

                const data = {
                    ...payload,
                    name: contractor.name,
                    profilePhoto: contractor.profilePhoto
                }
                this.sendNotification(customer.email, 'JOB_DAY_CONTRACTOR_LOCATION', data);

                if (job && job.isAssigned) {
                    contractor = await ContractorModel.findById(job.contractor)
                    if (!contractor) return
                    this.sendNotification(contractor.email, 'JOB_DAY_CONTRACTOR_LOCATION', data);
                }

            });

            // Handle conversation marked as read
            socket.on("send_mark_conversation_as_read", async (payload: any) => {
               
                try {

                    Logger.info(`Marking conversation as read via socket `, payload)
                    const conversationId = payload.conversationId
                    const loggedInUserId = socket.user.id
                    const loggedInUserType = socket.user.userType

                    if (!isValidObjectId(conversationId)){
                        Logger.error(`conversationId was not passed`)
                        return
                    }

                    const conversation = await ConversationModel.findById(conversationId)
                    if (!conversation){
                        Logger.error(`Conversation not found`)
                        return
                    }
                    await MessageModel.updateMany(
                        { conversation: conversationId, readBy: { $ne: loggedInUserId } },
                        { $addToSet: { readBy: loggedInUserId } }
                    );

                    //emit conversation read event
                    const members = conversation?.members;

                    if (!conversation || !members) return

                    members.forEach(async member => {
                        const user = member.memberType === 'contractors' ? await ContractorModel.findById(member.member) : await CustomerModel.findById(member.member)
                        if (!user) return

                        const toUserId = member.member
                        const toUserType = member.memberType

                        if(toUserId == loggedInUserId)return

                        NotificationService.sendNotification({
                            user: toUserId,
                            userType: toUserType,
                            title: 'Conversation read',
                            type: 'CONVERSATION_READ',
                            message: `Conversation messages marked as read`,
                            heading: { name: `${user.name}`, image: user.profilePhoto?.url },
                            payload: {
                                entity: conversation.id,
                                entityType: 'conversations',
                                message: 'Conversation messages marked as read',
                                readBy: loggedInUserId,
                                readByType: loggedInUserType,
                                event: 'CONVERSATION_READ',
                            }
                        }, { socket: true })
                    })

                } catch (error) {
                    Logger.error(`Error marking conversation as read via socket `, payload)
                }

            });

        });
    }

    static sendNotification(channels: string | string[], type: string, payload: any) {
        const channelArray = typeof channels === 'string' ? [channels] : channels;
        Logger.info(`sendNotification socket event is fired inside socketio`, { payload: JSON.stringify(payload), channels, type })
        for (const channel of channelArray) {
            this.io.to(channel).emit(type, { payload });
        }
    }
    static broadcastMessage(type: string, payload: object) {
        this.io.emit(type, payload);
    }

    // defined broadcast channels = alerts
    static broadcastChannel(channel: string, type: string, payload: object) {
        Logger.info(' broadcastChannel socket event is fired inside socketio', { payload: JSON.stringify(payload), channel })
        this.io.to(channel).emit(type, payload);
    }
}

export default SocketIOService;
