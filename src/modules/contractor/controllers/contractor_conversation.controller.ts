import { NextFunction, Request, Response } from "express";
import { applyAPIFeature } from "../../../utils/api.feature";
import { ConversationModel } from "../../../database/common/conversations.schema";
import { MessageModel, MessageType } from "../../../database/common/messages.schema";
import { ConversationEvent } from "../../../events";
import { BadRequestError } from "../../../utils/custom.errors";
import { validationResult } from "express-validator";

export const getConversations = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { startDate, endDate, read, unread } = req.query;
        const contractorId = req.contractor.id;
        const filter: any = { 'members.member': contractorId, 'members.memberType': 'contractors'};

        // Filtering by startDate and endDate
        if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
        }

        const {data, error} = await applyAPIFeature(ConversationModel.find(filter).populate('entity'), req.query);
        if(data){
            // Map through each conversation and fetch heading info
            await Promise.all(data.data.map(async (conversation: any) => {
                conversation.heading = await conversation.getHeading(contractorId);
                if(conversation.entityType == 'jobs'){
                    conversation.entity.myQuotation = await conversation.entity.getMyQoutation(conversation.entity.id, contractorId);
                }
            }));
        }

        res.status(200).json({
            success: true, message: "Conversations retrieved", 
            data: data
        });
    } catch (error: any) {
        return next(new BadRequestError('An error occured ', error))
    }
};

export const getSingleConversation = async (req: any, res: Response, next: NextFunction)=> {
    try {
        const { conversationId } = req.params;
        const contractorId = req.contractor.id;
        const query: any = { 'members.member': contractorId, _id: conversationId };

        const conversation = await ConversationModel.findOne(query).populate(['entity', 'members']).exec();
        if(conversation){
            conversation.heading = await conversation.getHeading(contractorId);
            
            if(conversation.entityType == 'jobs'){
                //@ts-ignore
                conversation.entity.myQuotation = await conversation.entity.getMyQoutation(conversation.entity.id, contractorId);
            }
        }
        res.status(200).json({ success: true, message: "Conversation retrieved", data: conversation });
    } catch (error: any) {
        return next(new BadRequestError('An error occured ', error))
    }
};

export const getConversationMessages = async (req: any, res: Response, next: NextFunction) => {
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
        const { data, error } = await applyAPIFeature(
            MessageModel.find({ conversation: conversationId }),
            req.query
        );

        if(data){
            await Promise.all(data.data.map(async (message: any) => {
                message.isOwn = await message.getIsOwn(contractorId);
                message.heading = await message.getHeading(contractorId);
            }));
        }



        res.status(200).json({ success: true, message: 'Conversation messages retrieved', data:  data  });
    } catch (error: any) {
        return next(new BadRequestError('An error occured ', error))
    }
};

export const sendMessage = async (req: any, res: Response, next: NextFunction) => {
    try {

         // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        
        const { conversationId } = req.params;
        const { message, media, type } = req.body; // Assuming you pass message content in the request body
        const contractorId = req.contractor.id;


        // Find the conversation by ID
        const conversation = await ConversationModel.findById(conversationId);

        // Check if the conversation exists
        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        // Check if the customer is a member of the conversation
        const customerIsMember = conversation.members.some((member: any) => member.member.toString() === contractorId);
        if (!customerIsMember) {
            return res.status(403).json({ success: false, message: 'Unauthorized: You do not have access to this conversation' });
        }

        // Create a new message in the conversation
        const newMessage = await MessageModel.create({
            conversation: conversationId,
            sender: contractorId, // Assuming the customer sends the message
            senderType: 'contractors', // Type of the sender
            message: message, // Message content from the request body
            messageType: type, 
            media: media, 
            createdAt: new Date()
        });

        if(newMessage){
            ConversationModel.updateOne(conversationId, {
                lastMessage: newMessage.message,
                lastMessageAt: newMessage.createdAt,
            })
            
        }

        ConversationEvent.emit('NEW_MESSAGE', { message: newMessage })
        res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
    } catch (error: any) {
        return next(new BadRequestError('Error sending message', error));
    }
};

export const ContractorConversationController = {
    getConversations,
    getSingleConversation,
    getConversationMessages,
    sendMessage
};
