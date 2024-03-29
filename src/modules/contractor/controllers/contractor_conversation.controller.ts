import { Request, Response } from "express";
import { applyAPIFeature } from "../../../utils/api.feature";
import { ConversationModel } from "../../../database/common/conversations.schema";
import { MessageModel } from "../../../database/common/messages.schema";

export const getConversations = async (req: any, res: Response) => {
    try {
        const { startDate, endDate, read, unread } = req.query;
        const contractorId = req.contractor.id;
        const filter: any = { 'members.member': contractorId, 'members.memberType': 'contractors'};

        // Filtering by startDate and endDate
        if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
        }

        const {data, error} = await applyAPIFeature(ConversationModel.find(filter), req.query);
        if(data){
            // Map through each conversation and fetch heading info
            await Promise.all(data.data.map(async (conversation: any) => {
                conversation.heading = await conversation.getHeading(contractorId);
            }));
        }

        res.status(200).json({
            success: true, message: "Conversations retrieved", 
            data: data
        });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getSingleConversation = async (req: any, res: Response)=> {
    try {
        const { conversationId } = req.params;
        const contractorId = req.contractor.id;
        const query: any = { 'members.member': contractorId, _id: conversationId };
        const conversation = await ConversationModel.findOne(query).populate(['entity', 'members']);
        if(conversation){
            conversation.heading = await conversation.getHeading(contractorId);
        }
        res.status(200).json({ success: true, message: "Conversation retrieved", data: conversation });
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getConversationMessages = async (req: any, res: Response) => {
    try {
        const { conversationId } = req.params;
        const contractorId = req.contractor.id;

        // Find the conversation by ID and populate its members
        const conversation = await ConversationModel.findOne({ _id: conversationId })
            .populate('members');

        // Check if the conversation exists
        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        // Check if the contractor is a member of the conversation
        const contractorIsMember = conversation.members.some((member: any) => member.member.toString() === contractorId);
        if (!contractorIsMember) {
            return res.status(403).json({ success: false, message: 'Unauthorized: You do not have access to this conversation' });
        }

        // Retrieve messages for the conversation
        const {data, error} = await  applyAPIFeature(MessageModel.find({ conversation: conversationId }), req.query);

        res.status(200).json({ success: true, message: 'Conversation messages retrieved', data:  data  });
    } catch (error) {
        console.error('Error fetching conversation messages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const ContractorConversationController = {
    getConversations,
    getSingleConversation,
    getConversationMessages
};
