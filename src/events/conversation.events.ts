import { EventEmitter } from 'events';
import { CONVERSATION_TYPE, ConversationModel } from '../database/common/conversations.schema';
import { param } from 'express-validator';
import { NotificationService } from '../services/notifications';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import CustomerModel from '../database/customer/models/customer.model';
import AdminModel from '../database/admin/models/admin.model';
import { Logger } from '../services/logger';
import { send } from 'process';
import { i18n } from '../i18n';

export const ConversationEvent: EventEmitter = new EventEmitter();

ConversationEvent.on('NEW_MESSAGE', async function (params) {
    Logger.info(`Handling NEW_MESSAGE event: ${params.message}`);
    try {
        const message = params.message
        const senderId = message.sender
        const senderType = message.senderType
        const conversation = await ConversationModel.findById(message.conversation)
        const members = conversation?.members;

        let sender: any = null
        if (senderType === 'contractors') {
            sender = await ContractorModel.findById(senderId)
        }
        if (senderType === 'admins') {
            sender = await AdminModel.findById(senderId)
        }
        if (senderType === 'customers') {
            sender = await CustomerModel.findById(senderId)
        }

        console.log('sender', sender)
        if (!conversation || !members || !sender) return

        members.forEach(async member => {
            let user = await ContractorModel.findById(member.member)
            if (member.memberType === 'contractors') {
                user = await ContractorModel.findById(member.member)
            }
            if (member.memberType === 'admins') {
                user = await AdminModel.findById(member.member)
            }
            if (member.memberType === 'customers') {
                user = await CustomerModel.findById(member.member)
            }

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
                heading: { name: `${user.name}`, image: sender.profilePhoto?.url },
                payload: {
                    entity: conversation.id,
                    entityType: 'conversations',
                    message: message,
                    event: 'NEW_MESSAGE',
                }
            }, { socket: true })

            // send push notification and unread message alert to the other user
            if (!message.isOwn) {

                //TODO: still separate this and only send push for aggregated unread message notification user

                if (conversation.type == CONVERSATION_TYPE.DIRECT_MESSAGE) {

                    const userLang = user.language;
                    let nTitle = await i18n.getTranslation({
                        phraseOrSlug: 'New unread message',
                        targetLang: userLang
                    });
                    let nMessage = await i18n.getTranslation({
                        phraseOrSlug: `You have a new unread message from`,
                        targetLang: userLang
                    });
                    
                    NotificationService.sendNotification({
                        user: toUserId,
                        userType: toUserType,
                        title: nTitle,
                        type: 'NEW_UNREAD_MESSAGE',
                        message: `${nMessage}  ${sender.name}`,
                        heading: { name: `${sender.name}`, image: sender.profilePhoto?.url },
                        payload: {
                            entity: conversation.id,
                            entityType: 'conversations',
                            message: message,
                            event: 'NEW_UNREAD_MESSAGE',
                        }
                    }, { socket: true, push: true, database: true });



                }


                if (conversation.type == CONVERSATION_TYPE.TICKET) {
                    const userLang = user.language;
                    
                    let nTitle = await i18n.getTranslation({
                        phraseOrSlug: 'New unread dispute message',
                        targetLang: userLang
                    });
                    let nMessage = await i18n.getTranslation({
                        phraseOrSlug: `You have a new unread job dispute message from`,
                        targetLang: userLang
                    });

                    NotificationService.sendNotification({
                        user: toUserId,
                        userType: toUserType,
                        title: nTitle,
                        type: 'NEW_DISPUTE_MESSAGE',
                        message: `${nMessage}  ${sender.name}`,
                        heading: { name: `${user.name}`, image: user.profilePhoto?.url },
                        payload: {
                            entity: conversation.id,
                            entityType: 'conversations',
                            message: message,
                            event: 'NEW_DISPUTE_MESSAGE',
                            disputeId: conversation.entity,
                        }
                    }, { socket: true, push: true, database: true });
                }


            }
            message.isOwn = false

        })


    } catch (error) {
        Logger.error(`Error handling NEW_MESSAGE event: ${error}`);
    }
});