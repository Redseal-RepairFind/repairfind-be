import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { APIFeatures, applyAPIFeature } from "../../../utils/api.feature";
import CustomError, { InternalServerError, NotFoundError } from "../../../utils/custom.errors";
import NotificationModel from "../../../database/common/notification.model";


export const getNotifications = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { startDate, endDate, read, unread } = req.query;
        const contractorId  = req.contractor.id
        const filter: any = {user: contractorId, userType: 'contractors'};

        // Filtering by startDate and endDate
        if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
        }

        // Filtering by read or unread status
        if (read === 'true') {
            filter.readAt = { $ne: null }; // Filter for read notifications
        } else if (unread === 'true') {
            filter.readAt = null; // Filter for unread notifications
        }

        const {data, error} = await applyAPIFeature(NotificationModel.find(filter), req.query)

        res.status(200).json({
            success: true, message: "Notifications retrieved", 
            data: data
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const getSingleNotification = async (req: any, res: Response,  next: NextFunction): Promise<void> => {
    try {
        const { notificationId} = req.params;
        const contractorId  = req.contractor.id
        const query: any = {user: contractorId, userType: 'contractors', _id: notificationId};

        //@ts-ignore
        const notification = await NotificationModel.findOne(query).populate('entity');
        
        // If notification does not exist, throw a NotFoundError
        if (!notification) {
            return next(new NotFoundError('Notification not found'));
        }

        res.status(200).json({ success: true,  message: "Notification retrieved", data: notification });
    } catch (error: any) {
        // use this to show error file and line
        const stackLines = error?.stack?.split('\n') ?? [];
        const originatingLine = stackLines[1].trim(); // Assuming the originating line is the second line in the stack trace
        let message = (`${error.message} - ${originatingLine}`);
        return next(new InternalServerError(message));
    }
};

export const ContractorNotificationController = {
    getNotifications,
    getSingleNotification
}