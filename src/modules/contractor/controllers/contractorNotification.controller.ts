import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import ContractorNotificationModel from "../../../database/contractor/models/contractorNotification.model";


//contractor get all notification/////////////
export const contractorGetNotificationrController = async (
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
  
      
      const contractor =  req.contractor;
      const contractorId = contractor.id

      page = page || 1;
      limit = limit || 50;

      const skip = (page - 1) * limit;
  
      //get user info from databas
      const contractorExist = await ContractorModel.findOne({_id: contractorId});
  
      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }
  
      const notifications = await ContractorNotificationModel.find({contractorId})
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


//contractor view unseen  notification/////////////
export const contractorViewNotificationrController = async (
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
  
      const contractor =  req.contractor;
      const contractorId = contractor.id

      //get user info from databas
      const contractorExist = await ContractorModel.findOne({_id: contractorId});
  
      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }
  
      const notifications = await ContractorNotificationModel.updateMany({contractorId, status: "unseen"},
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


//contractor get total number of unseen notification/////////////
export const contractorUnseenNotificationrController = async (
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
  
      const contractor =  req.contractor;
      const contractorId = contractor.id

      
      const contractorExist = await ContractorModel.findOne({_id: contractorId});
  
      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }
  
      const totalUnseenNotification = await ContractorNotificationModel.countDocuments({contractorId, status: "unseen"})

      res.json({  
        totalUnseenNotification
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}