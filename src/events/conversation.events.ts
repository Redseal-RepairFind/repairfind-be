import { EventEmitter } from 'events';
import { ConversationModel } from '../database/common/conversations.schema';
import { param } from 'express-validator';
import { NotificationService } from '../services/notifications';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import CustomerModel from '../database/customer/models/customer.model';

export const ConversationEvent: EventEmitter = new EventEmitter();

ConversationEvent.on('NEW_MESSAGE', async function (params) {
    try {
        console.log(`Notifications sent to participants of challenge`);
        const message = params.message
        const conversation = await ConversationModel.findById(message.conversation)
        const members = conversation?.members;
        if (!conversation || !members) return

        members.forEach(async member => {
            const user = member.memberType === 'contractors' ? await ContractorModel.findById(member.member) : await CustomerModel.findById(member.member)
            if (!user) return
            message.isOwn = await message.getIsOwn(user.id)
           
            NotificationService.sendNotification({
                user: user.id.toString(),
                userType: member.memberType,
                title: 'New Job Request',
                type: 'Conversation', 
                message: `You have a new message`,
                //@ts-ignore
                heading: { name: `${user.name}`, image: user.profilePhoto?.url },
                payload: {
                    entity: conversation.id,
                    entityType: 'conversations',
                    message: message,
                    event: 'NEW_MESSAGE',
                }
            }, { socket: true })

            message.isOwn = false
        })


    } catch (error) {
        console.error(`Error handling TestEvent event: ${error}`);
    }
});