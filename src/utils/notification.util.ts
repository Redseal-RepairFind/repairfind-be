import  { ObjectId } from "mongoose";
import { JobModel } from "../database/common/job.model";
import { Logger } from "../services/logger";
import { CONVERSATION_TYPE, ConversationModel } from "../database/common/conversations.schema";
import { MessageModel } from "../database/common/messages.schema";



const contractorRedAlerts = async (userId: ObjectId) => {
    const alertConditions = {
        contractor: userId,
        status: { $in: ['DISPUTED'] },
        $or: [
            { bookingViewedByContractor: { $eq: false } },
            { "contractorAlerts.hasNewDisputeMessage": { $eq: false } }
        ]
    };

    // Fetch relevant job IDs for unseen bookings and dispute alerts
    const jobs = await JobModel.find(alertConditions)
        .select('_id contractor bookingViewedByContractor contractorAlerts')
        .lean();

    // Split jobs based on the conditions
    const unseenBookings = jobs.filter(job => !job.bookingViewedByContractor).map(job => job._id);
    const disputeAlerts = jobs.filter(job => job.contractorAlerts?.hasNewDisputeMessage === false);

    return { disputeAlerts, unseenBookings };
};



const customerRedAlerts = async (customerId: ObjectId) => {
    const alertConditions = {
        customer: customerId,
        status: { $in: ['DISPUTED'] },
        $or: [
            { "customerAlerts.hasNewDisputeMessage": { $eq: false } }
        ]
    };

    // Fetch relevant job IDs for unseen bookings and dispute alerts
    const jobs = await JobModel.find(alertConditions)
        .select('_id customer customerAlerts')
        .lean();

    // Split jobs based on the conditions
    const unseenBookings: any = [];
    const disputeAlerts = jobs.filter(job => job.contractorAlerts?.hasNewDisputeMessage === false);

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

