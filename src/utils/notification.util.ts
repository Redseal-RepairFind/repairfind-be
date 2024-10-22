import { ObjectId } from "mongoose";
import { JobModel } from "../database/common/job.model";
import { Logger } from "../services/logger";
import { CONVERSATION_TYPE, ConversationModel } from "../database/common/conversations.schema";
import { MessageModel } from "../database/common/messages.schema";



const contractorRedAlerts = async (contractorId: ObjectId) => {
    // Fetch ticket-type conversations and unseen job IDs in parallel
    const [ticketConversations, unseenJobs] = await Promise.all([
        ConversationModel.find({
            type: CONVERSATION_TYPE.TICKET,
            "members.member": contractorId,
            "members.memberType": "contractors",
        }),
        JobModel.find({
            contractor: contractorId,
            bookingViewedByContractor: { $eq: false }
        }).select('_id contractor bookingViewedByContractor').lean()
    ]);

    // Process ticket conversations to find unread messages and disputed jobs
    const disputeAlerts: any = [];
    const unreadTicketPromises = ticketConversations.map(async (conversation) => {
        const unreadMessagesCount = await MessageModel.countDocuments({
            conversation: conversation._id,
            readBy: { $ne: contractorId }
        });

        if (unreadMessagesCount > 0 && conversation.entity) {
            try {
                const job = await JobModel.findById(conversation.entity);
                if (job?.status === "DISPUTED") {
                    disputeAlerts.push(job.id);
                }
            } catch (error) {
                console.error(`Error fetching job for entity ${conversation.entity}:`, error);
            }
        }
    });

    // Wait for all unread ticket checks to complete
    await Promise.all(unreadTicketPromises);

    // Extract job IDs from unseen bookings
    const unseenBookings = unseenJobs.map(job => job._id);

    return { disputeAlerts, unseenBookings };
};


const customerRedAlerts = async (customerId: ObjectId) => {

    // Fetch ticket-type conversations where the user is a member
    const ticketConversations = await ConversationModel.find({
        type: CONVERSATION_TYPE.TICKET,
        "members.member": customerId,
        "members.memberType": "customers",
    });

    // Find ticket conversations with unread messages for the contractor
    const unreadTickets = await Promise.all(
        ticketConversations.map(async (conversation) => {
            const unreadMessagesCount = await MessageModel.countDocuments({
                conversation: conversation._id,
                readBy: { $ne: customerId }
            });

            // Return conversation if it has unread messages
            return unreadMessagesCount > 0 ? conversation : null;
        })
    );

    const getDisputedJobEntities = async (unreadTickets: any) => {
        const disputeAlerts = [];

        for (const conversation of unreadTickets) {
            if (!conversation || !conversation.entity) continue;
            try {
                const job = await JobModel.findById(conversation.entity);
                if (job && job.status === "DISPUTED") {
                    disputeAlerts.push(job.id);
                }
            } catch (error) {
            }
        }
        return disputeAlerts;
    };
    const disputeAlerts = await getDisputedJobEntities(unreadTickets);


    // Fetch job bookings where the contractor hasn't viewed the booking yet
    const unseenBookings: any = []
    return { disputeAlerts, unseenBookings };
};


const redAlerts = async (userId: ObjectId) => {
    // Fetch ticket-type conversations where the user is a member
    const ticketConversations = await ConversationModel.find({
        type: CONVERSATION_TYPE.TICKET,
        "members.member": userId
    });

    // Find ticket conversations with unread messages for the contractor
    const unreadTickets = await Promise.all(
        ticketConversations.map(async (conversation) => {
            const unreadMessagesCount = await MessageModel.countDocuments({
                conversation: conversation._id,
                readBy: { $ne: userId }
            });

            // Return conversation if it has unread messages
            return unreadMessagesCount > 0 ? conversation : null;
        })
    );

    // Filter out null values and get dispute-related alerts (entities of conversations with unread messages)
    const disputeAlerts = unreadTickets.filter(conversation => conversation !== null).map(conversation => conversation?.entity);

    // Fetch job bookings where the contractor hasn't viewed the booking yet
    const unseenJobIds = await JobModel.find({
        contractor: userId,
        bookingViewedByContractor: { $eq: false }
    }).select('_id contractor bookingViewedByContractor').lean();

    // Extract job IDs from unseen bookings
    const unseenBookings = unseenJobIds.map((job: any) => job._id);

    // Return both dispute alerts and unseen bookings
    return { disputeAlerts, unseenBookings };
};



export const NotificationUtil = {
    contractorRedAlerts,
    customerRedAlerts,
    redAlerts
};

