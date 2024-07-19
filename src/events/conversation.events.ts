import { EventEmitter } from 'events';
import { ConversationModel } from '../database/common/conversations.schema';
import { param } from 'express-validator';
import { NotificationService } from '../services/notifications';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import CustomerModel from '../database/customer/models/customer.model';
import AdminModel from '../database/admin/models/admin.model';

export const ConversationEvent: EventEmitter = new EventEmitter();

ConversationEvent.on('NEW_MESSAGE', async function (params) {
    try {
        const message = params.message
        const senderId = message.sender
        const senderType = message.senderType
        const conversation = await ConversationModel.findById(message.conversation)
        const members = conversation?.members;
        
        let sender: any = null
        if(senderType === 'contractors'){
            sender = await ContractorModel.findById(senderId)
        }
        if(senderType === 'admins'){
            sender = await AdminModel.findById(senderId)
        }
        if(senderType === 'customers'){
            sender = await CustomerModel.findById(senderId)
        }

        if (!conversation || !members || !sender) return

        members.forEach(async member => {
            const user = member.memberType === 'contractors' ? await ContractorModel.findById(member.member) : await CustomerModel.findById(member.member)
            if (!user) return
            message.isOwn = await message.getIsOwn(user.id)

            const toUserId = member.member
             const toUserType = member.memberType
           
            NotificationService.sendNotification({
                user: toUserId,
                userType: toUserType,
                title: 'New Conversation Message',
                type: 'Conversation', 
                message: `You have a new message`,
                heading: { name: `${user.name}`, image: user.profilePhoto?.url },
                payload: {
                    entity: conversation.id,
                    entityType: 'conversations',
                    message: message,
                    event: 'NEW_MESSAGE',
                }
            }, { socket: true })

            // send push notification and unread message alert to the other user
            if(!message.isOwn){
               
                //TODO: still separate this and only send push for aggregated unread message notification user
                NotificationService.sendNotification({
                    user: toUserId,
                    userType: toUserType,
                    title: 'New unread message',
                    type: 'NEW_UNREAD_MESSAGE', 
                    message: `You have a new unread message from ${sender.name}`,
                    heading: { name: `${user.name}`, image: user.profilePhoto?.url },
                    payload: {
                        entity: conversation.id,
                        entityType: 'conversations',
                        message: message,
                        event: 'NEW_UNREAD_MESSAGE',
                    }
                }, { socket: true, push: true })


            }

            message.isOwn = false

        })


    } catch (error) {
        console.error(`Error handling NEW_MESSAGE event: ${error}`);
    }
});