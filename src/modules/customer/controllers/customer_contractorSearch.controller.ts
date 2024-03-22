import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorProfileModel} from "../../../database/contractor/models/contractor_profile.model";
import { latitudeLongitudeCal } from "../../../utils/latitudeLogitudeCal";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";

//custome search for contractor by location controller /////////////
export const customerSearchForContractorByLocatinController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        location
      } = req.query;
  
        const files = req.files;
    
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const customer =  req.customer;
        const customerId = customer.id

        const searchContractors = await ContractorProfileModel.find({
            $or: [
                { "location.address" : { $regex: new RegExp(location, 'i') } },
                { "location.city" : { $regex: new RegExp(location, 'i') } },
                { "location.region" : { $regex: new RegExp(location, 'i') } },
                { "location.country" : { $regex: new RegExp(location, 'i') } },
            ]
          });

        
    
        res.json({  
            success: true,
            data: searchContractors
        });
      
    } catch (err: any) {
      // signup error
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}

//custome search for contractor by category and date controller /////////////
export const customerSearchForContractorByCategoryAndDateController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        category,
        date
      } = req.query;
  
        const files = req.files;
    
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const customer =  req.customer;
        const customerId = customer.id

        const searchContractors = await ContractorProfileModel.find({
            $and: [
                { skill: { $regex: new RegExp(category, 'i') } },
                { availableDays: { $regex: new RegExp(date, 'i') } },
            ]
        });

        
    
        res.json({  
            success: true,
            data: searchContractors
        });
      
    } catch (err: any) {
      // signup error
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}


//custome search for category controller /////////////
export const customerSearchForCategoryController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        category,
      } = req.query;
  
        const files = req.files;
    
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const customer =  req.customer;
        const customerId = customer.id

        const pipeline: any[] = [
            {
              $match: {
                skill: {
                  $regex: new RegExp(category, 'i') // Case-insensitive regex matching
                }
              }
            },
            {
              $group: {
                _id: '$skill',
                count: { $sum: 1 },
              },
            },
            {
              $sort: { count: -1 },
            },
            {
              $limit: 10,
            },
          ];

          const searchCategory = await ContractorProfileModel.aggregate(pipeline);
    
        res.json({  
            success: true,
            data: searchCategory
        });
      
    } catch (err: any) {
      // signup error
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}


//custome filter contractor controller /////////////
export const customerFilterContractoController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        distance,
        emergency,
        category,
        location,
        accountType,
        date
      } = req.query;
  
        const files = req.files;
    
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const customer =  req.customer;
        const customerId = customer.id

        const lanLong = latitudeLongitudeCal(parseFloat(distance), 180)

        const searchContractors = await ContractorProfileModel.find({
            $and: [
                { emergencyJobs: emergency },
                { 
                    $or: [
                        { "location.address" : { $regex: new RegExp(location, 'i') } },
                        { "location.city" : { $regex: new RegExp(location, 'i') } },
                        { "location.region" : { $regex: new RegExp(location, 'i') } },
                        { "location.country" : { $regex: new RegExp(location, 'i') } },
                        { "location.latitude" : { $regex: new RegExp(lanLong.latitude.toString(), 'i') } },
                        { "location.longitude" : { $regex: new RegExp(lanLong.longitude.toString(), 'i') } },
                    ]
                },
                { availableDays: { $regex: new RegExp(date, 'i') } },
                { skill: { $regex: new RegExp(category, 'i') } },
            ]
            
        }).limit(50);

        const output = []

        for (let i = 0; i < searchContractors.length; i++) {
            const searchContractor = searchContractors[i];

            const contractorProfile = await ContractorModel.findOne({
                $and: [
                    { _id: searchContractor.contractor },
                    
                    { accountType: { $regex: new RegExp(accountType, 'i') } },
                ]
            }).select('-password')

            const obj = {
                searchContractor,
                contractorProfile
            }

            output.push(obj)
        
        }

        res.json({  
            success: true,
            data: output
        });
      
    } catch (err: any) {
      // signup error
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}




export const ContractorSearch = {
    customerSearchForContractorByLocatinController,
    customerSearchForContractorByCategoryAndDateController,
    customerSearchForCategoryController,
    customerFilterContractoController
}