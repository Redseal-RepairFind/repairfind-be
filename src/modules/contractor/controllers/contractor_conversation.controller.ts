import { NextFunction, Request, Response } from "express";
import { applyAPIFeature } from "../../../utils/api.feature";
import { ConversationModel } from "../../../database/common/conversations.schema";
import { IMessage, MessageModel, MessageType } from "../../../database/common/messages.schema";
import { ConversationEvent } from "../../../events";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import { validationResult } from "express-validator";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import mongoose, { Schema } from "mongoose";

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
        return next(new InternalServerError('An error occurred ', error))
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
        return next(new InternalServerError('An error occurred ', error))
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
        return next(new InternalServerError('An error occurred ', error))
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

             // push sender to readBy array
            newMessage.readBy.push(contractorId)
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
        const contractorId = req.contractor.id
        
        const result = await MessageModel.updateMany(
            { conversation: conversationId, readBy: { $ne: contractorId } }, // Assuming req.contractor.id contains the ID of the logged-in user
            { $addToSet: { readBy: contractorId } } // Add the logged-in user to the readBy array if not already present
        );
        res.status(200).json({ success: true, message: 'All messages marked as read.' });
    } catch (error: any) {
        return next(new InternalServerError('An error occurred while marking messages as read.', error) )
    }
};


export const startConversation = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    try { 
        const { userId, userType, message} = req.body;
        const fromUserId = req.contractor.id
        const fromUser =  await ContractorModel.findById(fromUserId)
        if(!fromUser)return res.status(404).json({ success:false, message:'From user not found' }) 
       
       if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ success:false, message:'Invalid user id provided' }) 

        if (!userId || !userType) return res.status(400).json({ success:false, message:'To user not provided' }) 
        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user)  return res.status(404).json({ success:false, message:'User not found' }); // Ensure user exists
       

        // Create a new conversation between the customer and the contractor
        const conversationMembers = [
            { memberType: userType, member: userId },
            { memberType: 'contractors', member: fromUserId }
        ];

        const conversation = await ConversationModel.findOneAndUpdate(
            {
                $and: [
                    { members: { $elemMatch: { member: fromUserId } } }, // memberType: 'customers'
                    { members: { $elemMatch: { member: userId } } } // memberType: 'contractors'
                ]
            },

            {
                members: conversationMembers,
                lastMessage: message, // Set the last message to the job description
                lastMessageAt: new Date() // Set the last message timestamp to now
            },
            { new: true, upsert: true }
        );

        // // Create a message in the conversation
        // const newMessage: IMessage = await MessageModel.create({
        //     conversation: conversation._id,
        //     sender: fromUserId, // Assuming the customer sends the initial message
        //     message: message, // You can customize the message content as needed
        //     messageType: MessageType.TEXT, // You can customize the message content as needed
        //     createdAt: new Date()
        // });

      
        // ConversationEvent.emit('NEW_MESSAGE', { message: newMessage })

        res.status(200).json({message:'Conversation created', data:conversation });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const ContractorConversationController = {
    getConversations,
    getSingleConversation,
    getConversationMessages,
    sendMessage,
    markAllMessagesAsRead,
    startConversation
    
};
