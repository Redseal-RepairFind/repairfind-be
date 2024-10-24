import { NextFunction, Response } from "express";
import { applyAPIFeature } from "../../../utils/api.feature";
import  { InternalServerError, NotFoundError } from "../../../utils/custom.errors";
import NotificationModel from "../../../database/common/notification.model";
import { NotificationUtil } from "../../../utils/notification.util";


export const getNotifications = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { startDate, endDate, read, ...query } = req.query;
        const adminId = req.admin.id
        // const filter: any = { $or: [ { user: null }, { user: adminId } ], userType: 'admins' };
        const filter: any = { $or: [ { user: null }, { user: adminId } ], userType: 'admins' };

        if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
        }

        // Filtering by read or unread status
        if (read === 'true') {
            filter.readAt = { $ne: null }; // Filter for read notifications
        } else if (read === 'false') {
            filter.readAt = null; // Filter for unread notifications
        }

        const { data, error }: any = await applyAPIFeature(NotificationModel.find(filter), query)

        res.status(200).json({
            success: true, message: "Notifications retrieved",
            data: data
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const getSingleNotification = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { notificationId } = req.params;

        const notification = await NotificationModel.findById(notificationId).populate('entity');

        // If notification does not exist, throw a NotFoundError
        if (!notification) {
            return next(new NotFoundError('Notification not found'));
        }


        notification.readAt = new Date();
        await notification.save();

        res.status(200).json({ success: true, message: "Notification retrieved", data: notification });
    } catch (error: any) {
        // use this to show error file and line
        const stackLines = error?.stack?.split('\n') ?? [];
        const originatingLine = stackLines[1].trim(); // Assuming the originating line is the second line in the stack trace
        let message = (`${error.message} - ${originatingLine}`);
        return next(new InternalServerError(message));
    }
};


export const markNotificationAsRead = async (req: any, res: Response): Promise<any> => {
    try {
        const notificationId = req.params.notificationId; // Assuming the notification ID is provided in the request parameters

        const notification = await NotificationModel.findById(notificationId);

        // Check if the notification exists
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        // Update the readAt field to mark the notification as read
        notification.readAt = new Date();
        await notification.save();

        res.status(200).json({ success: true, message: "Notification marked as read", data: notification });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};




export const markAllNotificationsAsRead = async (req: any, res: Response): Promise<any> => {
    try {
        const adminId = req.admin.id;

        const filter = { user: adminId, userType: 'admins' }
        await NotificationModel.updateMany(filter, {
            readAt: new Date()
        });

        const query = { page: 1, limit: 50 }
        const { data, error } = await applyAPIFeature(NotificationModel.find(filter), query)
        res.status(200).json({ success: true, message: "Notifications marked as read", data: data });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const redAlerts = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const contractorId = req.contractor.id;

        //TODO: fix this
       const {disputeAlerts} = await NotificationUtil.contractorRedAlerts(contractorId)

        // const recentPayment = TransactionModel.find({type: {$in: [TRANSACTION_TYPE.JOB_PAYMENT, TRANSACTION_TYPE.SITE_VISIT]} })

        res.json({ success: true, message: 'Alerts retreived', data: {disputeAlerts} });
    } catch (err: any) {
        next(new InternalServerError("An error occurred", err));
    }


};





export const AdminNotificationController = {
    getNotifications,
    getSingleNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    redAlerts
}