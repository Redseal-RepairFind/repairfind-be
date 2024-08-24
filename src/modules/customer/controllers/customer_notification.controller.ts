import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { applyAPIFeature } from "../../../utils/api.feature";
import NotificationModel from "../../../database/common/notification.model";
import { NotificationUtil } from "../../../utils/notification.util";
import { InternalServerError } from "../../../utils/custom.errors";


export const getNotifications = async (req: any, res: Response): Promise<void> => {
    try {
        const { startDate, endDate, read, ...query } = req.query;
        const customerId = req.customer.id
        const filter: any = { user: customerId, userType: 'customers'};

        // Filtering by startDate and endDate
        if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
        }

        // Filtering by read or unread status
        if (read === 'true') {
            filter.readAt = { $ne: null }; // Filter for read notifications
        } else if( read === 'false') {
            filter.readAt = null; // Filter for unread notifications
        }


        const {data, error} = await applyAPIFeature(NotificationModel.find(filter), query)
        res.status(200).json({
            success: true, message: "Notifications retrieved", 
            data: data
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getSingleNotification = async (req: any, res: Response): Promise<void> => {
    try {
        const { notificationId } = req.params;
        const customerId = req.customer.id
        const query: any = { user: customerId, userType: 'customers',  _id: notificationId };
        
        const notification = await NotificationModel.findOne(query).populate('entity');

        if(!notification){
            res.status(404).json({ success: true, message: "Notification not found" });
            return
        }

        notification.readAt = new Date();
        await notification.save();
        
        res.status(200).json({ success: true, message: "Notification retrieved", data: notification });
    } catch (error) {
        console.error("Error fetching notification:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const markNotificationAsRead = async (req: any, res: Response): Promise<any> => {
    try {
        const notificationId = req.params.notificationId; // Assuming the notification ID is provided in the request parameters
        const customerId = req.customer.id;

        // Find the notification by ID and customer ID
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
        const customerId = req.customer.id;

        // Find the notification by ID and customer ID
        const filter = { user: customerId, userType: 'customers' }
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
        const customerId = req.customer.id;

       const {disputeAlerts, unseenBookings} = await NotificationUtil.redAlerts(customerId)

        res.json({ success: true, message: 'Alerts retreived', data: {disputeAlerts, unseenBookings} });
    } catch (err: any) {
        next(new InternalServerError("An error occurred", err));
    }


};


export const CustomerNotificationController = {
    getNotifications,
    getSingleNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    redAlerts
}