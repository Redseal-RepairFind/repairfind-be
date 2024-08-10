import mongoose, { ObjectId } from "mongoose";
import { CONVERSATION_TYPE, ConversationModel, IConversation } from "../database/common/conversations.schema";
import { IJobDispute } from "../database/common/job_dispute.model";
import { MessageModel, MessageType } from "../database/common/messages.schema";
import { ConversationEvent } from "../events";

// Function to check if the message contains phone numbers, email addresses, contact addresses, or specific keywords
const containsRestrictedMessageContent = (message: string): { isRestricted: boolean, errorMessage?: string } => {
    // Enhanced regex for matching various phone number formats
    const phoneRegex = /\b(?:\+?(\d{1,3}))?[-.\s]?((\d{3})|(\(\d{3}\)))[-.\s]?(\d{3})[-.\s]?(\d{4})\b/g;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/; // Regex for email addresses
    const addressRegex = /\b\d{1,5}\s\w+(\s\w+){1,5}\b/; // Simple regex for street addresses (may need to be adjusted)

    // Keywords to check for
    const restrictedKeywords = ["phone", "email", "phone number"];

    // Check if message contains any restricted keywords (case-insensitive)
    const containsKeywords = restrictedKeywords.some(keyword => 
        message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (phoneRegex.test(message)) {
        return { isRestricted: true, errorMessage: 'Message contains a phone number' };
    } else if (emailRegex.test(message)) {
        return { isRestricted: true, errorMessage: 'Message contains an email address' };
    } else if (addressRegex.test(message)) {
        return { isRestricted: true, errorMessage: 'Message contains a contact address' };
    } else if (containsKeywords) {
        return { isRestricted: true, errorMessage: 'Message contains restricted keywords (phone, email, phone number)' };
    }

    return { isRestricted: false };
};



const updateOrCreateConversation = async (userOne: ObjectId, userOneType: string, userTwo: ObjectId, userTwoType: string) => {
    const conversationMembers = [
        { memberType: userOneType, member: userOne },
        { memberType: userTwoType, member: userTwo }
    ];

    const conversation = await ConversationModel.findOneAndUpdate(
        {
            $and: [
                { members: { $elemMatch: { member: userOne } } },
                { members: { $elemMatch: { member: userTwo } } }
            ]
        },
        {
            members: conversationMembers,
        },
        { new: true, upsert: true }
    )

    return conversation as IConversation;
};



const updateOrCreateDisputeConversations = async (dispute: IJobDispute) => {
         // create conversations here
         let arbitratorCustomerConversation = null
         let arbitratorContractorConversation = null
     
         if (dispute.arbitrator) {
     
           arbitratorCustomerConversation = await ConversationModel.findOneAndUpdate(
             {
               entity: dispute.id,
               entityType: 'job_disputes',
               $and: [
                 { members: { $elemMatch: { member: dispute.customer } } },
                 { members: { $elemMatch: { member: dispute.arbitrator } } }
               ]
             },
      
             {
               type: CONVERSATION_TYPE.TICKET,
               entity: dispute.id,
               entityType: 'job_disputes',
               members: [{ memberType: 'customers', member: dispute.customer }, { memberType: 'admins', member: dispute.arbitrator }],
             },
             { new: true, upsert: true }
           );
           arbitratorCustomerConversation.heading = await arbitratorCustomerConversation.getHeading(dispute.arbitrator)
           
           // Send a message
           let message = new MessageModel({
             conversation: arbitratorCustomerConversation?._id,
             sender: dispute.arbitrator,
             senderType: 'admins',
             receiver: dispute.arbitrator,
             message: dispute.reason,
             messageType: MessageType.ALERT,
             entity: dispute.id,
             entityType: 'job_disputes'
           });
           ConversationEvent.emit('NEW_MESSAGE', { message })
           
     
           arbitratorContractorConversation = await ConversationModel.findOneAndUpdate(
             {
               entity: dispute.id,
               entityType: 'job_disputes',
               $and: [
                 { members: { $elemMatch: { member: dispute.contractor } } },
                 { members: { $elemMatch: { member: dispute.arbitrator } } }
               ]
             },
     
             {
               type: CONVERSATION_TYPE.TICKET,
               entity: dispute.id,
               entityType: 'job_disputes',
               members: [{ memberType: 'contractors', member: dispute.contractor }, { memberType: 'admins', member: dispute.arbitrator }],
             },
             { new: true, upsert: true }
           );
           arbitratorContractorConversation.heading = await arbitratorContractorConversation.getHeading(dispute.arbitrator)
            // Send a message
             message = new MessageModel({
             conversation: arbitratorContractorConversation?._id,
             sender: dispute.arbitrator,
             senderType: 'admins',
             receiver: dispute.contractor,
             message: dispute.reason,
             messageType: MessageType.ALERT,
             entity: dispute.id,
             entityType: 'job_disputes'
           });
           ConversationEvent.emit('NEW_MESSAGE', { message })
     
         }
     
     
        const customerContractorConversation = await ConversationModel.findOneAndUpdate(
           {
             $and: [
               { members: { $elemMatch: { member: dispute.contractor } } },
               { members: { $elemMatch: { member: dispute.customer } } }
             ]
           },
     
           {
             members: [{ memberType: 'customers', member: dispute.customer }, { memberType: 'contractors', member: dispute.contractor }],
           },
           { new: true, upsert: true }
        );
     
     
        return { customerContractor: customerContractorConversation, arbitratorContractor:arbitratorContractorConversation, arbitratorCustomer: arbitratorCustomerConversation } ;
};


export const ConversationUtil = {
    containsRestrictedMessageContent,
    updateOrCreateConversation,
    updateOrCreateDisputeConversations
}