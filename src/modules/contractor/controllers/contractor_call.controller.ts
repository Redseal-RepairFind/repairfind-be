import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import twilio from "twilio";
import AgoraTokenService from "../../../services/agora";
import { InternalServerError } from "../../../utils/custom.errors";
import { RtcRole } from "agora-access-token";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { NotificationService } from "../../../services";


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
        const rtcToken = await AgoraTokenService.generateRtcToken(channelName, uid, role);
        res.status(200).json({message:'Token generated', token: rtcToken });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}


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
        const channelName =  `${fromUserId}:${toUser}`
       
        if (!toUserType || !toUser) return res.status(400).json({ success:false, message:'To user not provided' }) 
        const user = toUserType === 'contractors' ? await ContractorModel.findById(toUser) : await CustomerModel.findById(toUser)
        if (!user)  return res.status(404).json({ success:false, message:'User not found' }); // Ensure user exists
        const token = await AgoraTokenService.generateRtcToken(channelName, fromUserId, 'publisher');

        NotificationService.sendNotification({
            user: user.id,
            userType: toUserType,
            title: 'New Incoming Call',
            type: 'NEW_INCOMMING_CALL', //
            message: `You've an incomming call from ${fromUser.name}`,
            heading: { name: `${fromUser.name}`, image: fromUser.profilePhoto?.url },
            payload: {
                channel: channelName,
                token: token,
                message: `You've an incomming call from ${fromUser.name}`,
                name: `${fromUser.name}`,
                image: fromUser.profilePhoto?.url,
                event: 'NEW_INCOMMING_CALL',
            }
        }, { database: true, push: true, socket: true })
        
        res.status(200).json({message:'Token generated', data: {token, channelName} });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}


export const ContractorCallController = {
    createRtmToken,
    createRtcToken,
    startCall
};
