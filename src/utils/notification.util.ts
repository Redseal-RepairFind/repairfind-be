import mongoose, { ObjectId } from "mongoose";
import { CONVERSATION_TYPE, ConversationModel, IConversation } from "../database/common/conversations.schema";
import { IJobDispute } from "../database/common/job_dispute.model";
import { MessageModel, MessageType } from "../database/common/messages.schema";
import { ConversationEvent } from "../events";
import { JobModel } from "../database/common/job.model";
import { Logger } from "../services/logger";

const redAlerts = async (userId: ObjectId) => {
    const ticketConversations = await ConversationModel.find({
        type: CONVERSATION_TYPE.TICKET,
        members: { $elemMatch: { member: userId } }
    });

    // Find the ticket conversations that have unread messages for the contractor
    const unreadTickets = await Promise.all(
        ticketConversations.map(async (conversation) => {
            const unreadMessagesCount = await MessageModel.countDocuments({
                conversation: conversation._id,
                readBy: { $ne: userId }
            });

            return unreadMessagesCount > 0 ? conversation : null;
        })
    );

    // Filter out null values (conversations without unread messages)
    const disputeAlerts = unreadTickets.filter(conversation => conversation !== null).map(conversation => conversation?.entity);

    // Fetch only the IDs of jobs where bookingViewByContractor is false
    const unseenJobIds = await JobModel.find({
        contractor: userId, 
        bookingViewByContractor: false
    }).select('_id');

    Logger.info('unseenJobIds', unseenJobIds)

    // Map to get only the _id values
    const unseenBookings = unseenJobIds.map((job: any) => job._id);

    return { disputeAlerts, unseenBookings };
};

export const NotificationUtil = {
    redAlerts
}
