import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import twilio from "twilio";
import AgoraTokenService from "../../../services/agora";
import { InternalServerError } from "../../../utils/custom.errors";
import { RtcRole } from "agora-access-token";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { NotificationService } from "../../../services";
import { CallModel } from "../../../database/common/call.schema";
import { v4 as uuid } from 'uuid';
import { ConversationUtil } from "../../../utils/conversation.util";
import { ObjectId } from "mongoose";


export const createRtmToken = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {

    try {
        const { uid} = req.body;
        const rtmToken = await AgoraTokenService.generateRtmToken(uid);
        res.status(200).json({ message: 'Token generated', token: rtmToken });
    } catch (err: any) {
        return next(new InternalServerError)
    }

}


export const createRtcToken = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { channelName, role } = req.body;
        const uid = req.contractor.id
        const rtcToken = await AgoraTokenService.generateRtcToken(channelName, role, 1);
        res.status(200).json({message:'Token generated', token: rtcToken });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}



export const getSingleCall = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { callId } = req.params;
        const call = await CallModel.findById(callId)
        const userId = req.contractor.id; // Assuming `req.user` contains the logged-in user's info

        if(!call){
            return res.status(404).json({success: false, message:'Call not found' });
        }
        call.heading = await call.getHeading(userId)
        res.status(200).json({message:'Token generated', data: call });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getLastCall = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.contractor.id; // Assuming `req.user` contains the logged-in user's info
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const call = await CallModel.findOne({ $or: [{toUser: userId}, {fromUser: userId}] }).sort({ createdAt: -1 }).exec(); // Retrieves the last call by the user

        if (!call) {
            return res.status(404).json({ success: false, message: 'No calls found for this user' });
        }
        call.heading = await call.getHeading(userId)

        return res.status(200).json({ success: true, message: 'Last call retrieved', data: call });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};



export const startCall = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    try { 
        const { toUser, toUserType } = req.body;
        const fromUserId = req.contractor.id
        const fromUser =  await ContractorModel.findById(fromUserId)
        if(!fromUser)return res.status(404).json({ success:false, message:'From user not provided' }) 
        const channelName =  `${fromUserId}`
       
        if (!toUserType || !toUser) return res.status(400).json({ success:false, message:'To user not provided' }) 
        const user = toUserType === 'contractors' ? await ContractorModel.findById(toUser) : await CustomerModel.findById(toUser)
        if (!user)  return res.status(404).json({ success:false, message:'User not found' }); // Ensure user exists
       

        const toUserUid = Math.floor(Math. random() * (9999999 -1000000 + 1)) + 1000000;
        const fromUserUid = Math.floor(Math. random() * (9999999 -1000000 + 1)) + 1000000;

        const toUserToken = await AgoraTokenService.generateRtcToken(channelName, 'publisher',  toUserUid);
        const fromUserToken = await AgoraTokenService.generateRtcToken(channelName, 'publisher',  fromUserUid);

        
        // Create a new call document
        const callData = {
            fromUser: fromUserId,
            fromUserType: 'contractors', // Assuming fromUser is always a contractor
            toUser,
            toUserType,
            startTime: new Date(),
            toUserToken: toUserToken,
            fromUserToken: fromUserToken,
            uid: toUserUid,
            fromUserUid,
            channel: channelName
        };
        const call = await CallModel.create(callData);
        call.heading = await call.getHeading(fromUserId)

        NotificationService.sendNotification({
            user: user.id,
            userType: toUserType,
            title: 'New Incoming Call',
            type: 'NEW_INCOMING_CALL', //
            message: `You've an incoming call from ${fromUser.name}`,
            heading: { name: `${fromUser.name}`, image: fromUser.profilePhoto?.url },
            payload: {
                entity: call.id,
                entityType: 'calls',
                channel: channelName,
                callId: call.id,
                uid: toUserUid,
                token: toUserToken,
                message: `You've an incoming call from ${fromUser.name}`,
                name: `${fromUser.name}`,
                image: fromUser.profilePhoto?.url,
                event: 'NEW_INCOMING_CALL',
            }
        }, { database: true, push: true, socket: true })
        
        res.status(200).json({message:'Token generated', data: {token: fromUserToken, uid: fromUserUid, channelName, call } });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}


export const endCall = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { callId } = req.params;
        const { event } = req.body;
        const call = await CallModel.findById(callId);
        if (!call) return res.status(404).json({ success: false, message: 'Call not found' });

        // Update the call status to ended
        call.endTime = new Date();
        call.callStatus = event;
        await call.save();

        // Send notifications to call parties
    
        const fromUser = call.fromUserType === 'contractors' ? await ContractorModel.findById(call.fromUser) : await CustomerModel.findById(call.fromUser);
        const toUser = call.toUserType === 'contractors' ? await ContractorModel.findById(call.toUser) : await CustomerModel.findById(call.toUser);
        if (!fromUser || !toUser) return res.status(404).json({ success: false, message: 'Call parties not found' });
        const conversation = await ConversationUtil.updateOrCreateConversation(fromUser.id, call.fromUserType, toUser.id, call.toUserType )
        
        let message = ``
        let title = 'Call Ended'
        let type = 'CALL_ENDED'
        if(fromUser){
            message = `Your call with ${toUser.name} has ended`
            if(event == 'missed') title = 'Call Missed', type = 'CALL_MISSED',   message = `Your call to  ${toUser.name} was not answered`
            if(event == 'declined')  title = 'Call Declined', type = 'CALL_DECLINED',  message = `Your call to  ${toUser.name} was declined`

            NotificationService.sendNotification({
                user: call.fromUser,
                userType: call.fromUserType, 
                title: title,
                type: type,
                message,
                heading: { name: `${toUser.name}`, image: toUser.profilePhoto?.url },
                payload: {
                    entity: call.id,
                    entityType: 'calls',
                    conversationId: conversation.id,
                    message,
                    name: `${toUser.name}`,
                    image: toUser.profilePhoto?.url,
                    event: type,
                },
            }, { database: true, push: true, socket: true });
        }
       
        if(toUser){
            message = `Your call with ${toUser.name} has ended`
            if(event == 'missed')  title = 'Call Missed', type = 'CALL_MISSED',    message = `You have a missed call from  ${fromUser.name}`
            if(event == 'declined') title = 'Call Declined', type = 'CALL_DECLINED',   message = `You declined a call from  ${fromUser.name}`

            NotificationService.sendNotification({
                user: call.toUser,
                userType: call.toUserType,
                title: title,
                type: type,
                message,
                heading: { name: `${fromUser.name}`, image: fromUser.profilePhoto?.url },
                payload: {
                    entity: call.id,
                    entityType: 'calls',
                    conversationId: conversation.id,
                    message,
                    name: `${fromUser.name}`,
                    image: fromUser.profilePhoto?.url,
                    event: type,
                },
            }, { database: true, push: true, socket: true });
        }


        res.status(200).json({ success: true, message: 'Call ended successfully' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};



export const ContractorCallController = {
    createRtmToken,
    createRtcToken,
    startCall,
    endCall,
    getSingleCall,
    getLastCall
};
