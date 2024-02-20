import { validationResult } from "express-validator";
import { Request, Response } from "express";
import CustomerRegModel from "../../../database/customer/models/customerReg.model";
import CustomerNotificationModel from "../../../database/customer/models/customerNotification.model";


//customer get all notification/////////////
export const customerGetNotificationrController = async (
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
  
      const customer =  req.customer;
      const customerId = customer.id

      const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

      if (!checkCustomer) {
        return res
          .status(401)
          .json({ message: "incorrect Customer ID" });
      }


      page = page || 1;
      limit = limit || 50;

      const skip = (page - 1) * limit;

      const notifications = await CustomerNotificationModel.find({customerId})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  
      res.json({  
        notifications
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//customer view unseen  notification/////////////
export const customerViewNotificationrController = async (
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
  
      const customer =  req.customer;
      const customerId = customer.id

      const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

      if (!checkCustomer) {
        return res
          .status(401)
          .json({ message: "incorrect Customer ID" });
      }
  
      const notifications = await CustomerNotificationModel.updateMany({customerId, status: "unseen"},
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


//customer get total number of unseen notification/////////////
export const customerUnseenNotificationrController = async (
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
  
      const customer =  req.customer;
      const customerId = customer.id

      const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

      if (!checkCustomer) {
        return res
          .status(401)
          .json({ message: "incorrect Customer ID" });
      }
  
      const totalUnseenNotification = await CustomerNotificationModel.countDocuments({customerId, status: "unseen"})

      res.json({  
        totalUnseenNotification
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}