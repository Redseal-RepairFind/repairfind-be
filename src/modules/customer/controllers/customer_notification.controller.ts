import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ContractorNotificationModel, { IContractorNotificationDocument } from "../../../database/contractor/models/contractor_notification.model";
import CustomerNotificationModel from "../../../database/customer/models/customer_notification.model";
import { APIFeatures, applyAPIFeature } from "../../../utils/api.feature";


export const getNotifications = async (req: any, res: Response): Promise<void> => {
    try {
        const { startDate, endDate, read, unread } = req.query;
        const customerId = req.customer.id
        const filter: any = { customer: customerId};

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


        const {data, error} = await applyAPIFeature(CustomerNotificationModel.find(filter), req.query)
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
        const query: any = { customer: customerId, _id: notificationId };
        const notification = await CustomerNotificationModel.findOne(query).populate('entity');
        res.status(200).json({ success: true, message: "Notification retrieved", data: notification });
    } catch (error) {
        console.error("Error fetching notification:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const markNotificationAsRead = async (req: any, res: Response): Promise<any> => {
    try {
        const notificationId = req.params.id; // Assuming the notification ID is provided in the request parameters
        const customerId = req.customer.id;

        // Find the notification by ID and customer ID
        const notification = await CustomerNotificationModel.findOne({ _id: notificationId, customer: customerId });

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



export const CustomerNotificationController = {
    getNotifications,
    getSingleNotification,
    markNotificationAsRead
}