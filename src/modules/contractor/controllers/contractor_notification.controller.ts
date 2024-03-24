import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ContractorNotificationModel, { IContractorNotificationDocument } from "../../../database/contractor/models/contractor_notification.model";
import { APIFeatures } from "../../../utils/api.feature";


export const getNotifications = async (req: any, res: Response): Promise<void> => {
    try {
        const { startDate, endDate, read, unread } = req.query;
        const contractorId  = req.contractor.id
        const filter: any = {contractor: contractorId};

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

        // Fetch notifications based on the query
        const features = new APIFeatures(ContractorNotificationModel.find(filter), req.query);
        features.filter().sort().limitFields().paginate();
        const notifications = await features.query;
        const limit = features.queryString.limit;
        const page = features.queryString.page;
        const count = await  ContractorNotificationModel.find(filter).countDocuments();

        res.status(200).json({
            success: true, message: "Notifications retrieved", 
            data: {
                totalCount: count,
                limit,
                page,
                lastPage: Math.ceil(count / limit),
                notifications: notifications,
            }
        });
        
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const getSingleNotification = async (req: any, res: Response): Promise<void> => {
    try {
        const { notificationId} = req.params;
        const contractorId  = req.contractor.id
        const query: any = {contractor: contractorId, _id: notificationId};
        const notification = await ContractorNotificationModel.findOne(query).populate('entity');
        res.status(200).json({ success: true,  message: "Notification retrieved", data: notification });
    } catch (error) {
        console.error("Error fetching notification:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const ContractorNotificationController = {
    getNotifications,
    getSingleNotification
}