import { validationResult } from "express-validator";
import { Request, Response } from "express";
import AdminRegModel from "../../../database/admin/models/admin.model";
import AdminNotificationModel from "../../../database/admin/models/admin_notification.model";


//admin get all notification/////////////
export const adminGetNotificationrController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        page,
        limit
      } = req.query;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id

      page = page || 1;
      limit = limit || 50;

      const skip = (page - 1) * limit;

      const notifications = await AdminNotificationModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

      const totalNotification = await AdminNotificationModel.countDocuments()
  
      res.json({  
        totalNotification,
        notifications
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//admin view unseen  notification/////////////
export const adminViewNotificationrController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        
      } = req.query;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id
  
      const notifications = await AdminNotificationModel.updateMany({status: "unseen"},
      {
        status: "seen"
      },
      {new: true});
      
      res.json({  
        message: "notifications seen"
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//admin get total number of unseen notification/////////////
export const adminUnseenNotificationrController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        
      } = req.query;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id

      const totalUnseenNotification = await AdminNotificationModel.countDocuments({ status: "unseen"})

      res.json({  
        totalUnseenNotification
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}