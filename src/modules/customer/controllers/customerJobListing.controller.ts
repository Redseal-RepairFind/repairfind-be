import { validationResult } from "express-validator";
import { Request, Response } from "express";
import CustomerModel from "../../../database/customer/models/customer.model";
import CustomerJobListingModel from "../../../database/customer/models/customerJobListing.interface";

//search for contractor /////////////
export const customerSearchForContractorController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        jobCategory,
        jobDescription,
        voiceDescription,
        jobLocation,
        date,
        jobExpiry,
        contractorType,
        emergency,
        jobImg,
      } = req.body;
  
      const { skill } = req.query;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const customer =  req.customer;
      const customerId = customer.id

      
  
      res.json({  
        
      });
      
    } catch (err: any) {
      // signup error
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}