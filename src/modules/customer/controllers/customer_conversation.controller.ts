import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { applyAPIFeature } from "../../../utils/api.feature";
import { CONVERSATION_TYPE, ConversationModel } from "../../../database/common/conversations.schema";
import { MessageModel, MessageType } from "../../../database/common/messages.schema";
import { ConversationEvent } from "../../../events";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import { ConversationUtil } from "../../../utils/conversation.util";
import { BlockedUserUtil } from "../../../utils/blockeduser.util";
import { bool } from "aws-sdk/clients/signer";

 
export const getConversations = async (req: any, res: Response): Promise<void> => {
    try {
        const { startDate, endDate, read, unread } = req.query;
        const customerId = req.customer.id
        const filter: any = { 'members.member': customerId, 'members.memberType': 'customers', type: CONVERSATION_TYPE.DIRECT_MESSAGE};

        // Filtering by startDate and endDate
        if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
        }

        const {data, error} = await applyAPIFeature(ConversationModel.find(filter).populate('entity'), req.query)

        if(data){
            // Map through each conversation and fetch heading info
            await Promise.all(data.data.map(async (conversation: any) => {
                conversation.heading = await conversation.getHeading(customerId);
            }));
        }
       
        res.status(200).json({
            success: true, message: "Conversations retrieved", 
            data: data
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getSingleConversation = async (req: any, res: Response) => {
    try {
        const { conversationId } = req.params;
        const customerId = req.customer.id
        // const query: any = { 'members.member': customerId, _id: conversationId };
        const conversation = await ConversationModel.findById(conversationId).populate(['entity', 'members']);
        
        if(!conversation){
            return res.status(500).json({ success: false, message: "Conversation not found" });
        }
        const conversationMembers = conversation.members
        
        conversation.isBlocked = await conversation.getIsBlocked() as bool
        conversation.heading = await conversation.getHeading(customerId);
        if(conversation.entityType == 'jobs'){
            // try to get contractor
            const contractor = conversation.members.find((member: any) => member.memberType == 'contractors');
            const contractorId = contractor?.member
            // @ts-ignore
            conversation.entity.myQuotation = await conversation.entity.getMyQuotation(conversation.entity.id, contractorId);
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
        const customerId = req.customer.id;

        // Find the conversation by ID and populate its members
        const conversation = await ConversationModel.findOne({ _id: conversationId })
            .populate(['members']);

        // Check if the conversation exists
        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        // Check if the customer is a member of the conversation
        const customerIsMember = conversation.members.some((member: any) => member.member.toString() === customerId);
        if (!customerIsMember) {
            return res.status(403).json({ success: false, message: 'Unauthorized: You do not have access to this conversation' });
        }

  
        // Retrieve messages for the conversation
        const { data, error } = await applyAPIFeature(
            MessageModel.find({ conversation: conversationId })
                // .populate({
                //     path: 'sender',
                //     select: 'firstName lastName profilePhoto', // Select the fields you want to populate
                // })
            ,
            req.query
        );

        if(data){
            await Promise.all(data.data.map(async (message: any) => {
                message.isOwn = await message.getIsOwn(customerId);
            }));
        }

        res.status(200).json({ success: true, message: 'Conversation messages retrieved', data:  data  });
    } catch (error) {
        console.error('Error fetching conversation messages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


export const sendMessage = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { conversationId } = req.params;
        const { message, media, type } = req.body; // Assuming you pass message content in the request body
        const customerId = req.customer.id;


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation error occurred', errors: errors.array() });
        }

        // Find the conversation by ID
        const conversation = await ConversationModel.findById(conversationId);

        // Check if the conversation exists
        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        // Check if the customer is a member of the conversation
        const customerIsMember = conversation.members.some((member: any) => member.member.toString() === customerId);
        if (!customerIsMember) {
            return res.status(403).json({ success: false, message: 'Unauthorized: You do not have access to this conversation' });
        }


        const isBlocked = await conversation.getIsBlocked()
        if (!isBlocked) {
            return res.status(403).json({ success: false, message: 'You can not send message to this contractor' });
        }



        // Create a new message in the conversation
        const newMessage = new MessageModel({
            conversation: conversationId,
            sender: customerId, // Assuming the customer sends the message
            senderType: 'customers', // Type of the sender
            message: message, // Message content from the request body
            messageType: type, 
            media: media, 
            createdAt: new Date()
        });


        if(message){
            const restrictedContentCheck = ConversationUtil.containsRestrictedMessageContent(message);
            if (restrictedContentCheck.isRestricted) {
                newMessage.messageType  = MessageType.ALERT
                newMessage.message  =  restrictedContentCheck.errorMessage
            }
        }


        
        await newMessage.save()

        if (newMessage) {
            await ConversationModel.updateOne(
                { _id: conversationId }, // Filter criteria to find the conversation document
                {
                    $set: { // Use $set to update specific fields
                        lastMessage: newMessage.message,
                        lastMessageAt: newMessage.createdAt,
                    }
                }
            );
            newMessage.readBy.push(customerId)
            await  newMessage.save()
        }

        ConversationEvent.emit('NEW_MESSAGE', { message: newMessage })


        res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
    } catch (error: any) {
        return next(new BadRequestError('Error sending message', error));
    }
};


export const markAllMessagesAsRead = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Update all messages where the conversation matches and the logged-in user is in the readBy array
        const conversationId = req.params.conversationId
        const customerId = req.customer.id
        
        const result = await MessageModel.updateMany(
            { conversation: conversationId, readBy: { $ne: customerId } }, // Assuming req.contractor.id contains the ID of the logged-in user
            { $addToSet: { readBy: customerId } } // Add the logged-in user to the readBy array if not already present
        );
        res.status(200).json({ success: true, message: 'All messages marked as read.' });
    } catch (error: any) {
        return next(new InternalServerError('An error occurred while marking messages as read.', error) )
    }
};

export const CustomerConversationController = {
    getConversations,
    getSingleConversation,
    getConversationMessages,
    sendMessage,
    markAllMessagesAsRead
}