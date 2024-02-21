import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import JobModel from "../../../database/contractor/models/job.model";
import CustomerRegModel from "../../../database/customer/models/customerReg.model";



//get jobs detail /////////////
export const AdminGetJobsrDetailController = async (
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

        const jobsDetails = await JobModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const totalJob = await JobModel.countDocuments()

        let jobs = [];

        for (let i = 0; i < jobsDetails.length; i++) {
            const jobsDetail = jobsDetails[i];

            const customer = await CustomerRegModel.findOne({_id: jobsDetail.customerId});
            const contractor = await ContractorModel.findOne({_id: jobsDetail.contractorId})

            if (!customer || !contractor) continue;

            const obj = {
                job: jobsDetail,
                contractor,
                customer
            }

            jobs.push(obj)
        }

      res.json({
        totalJob,  
        jobs
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}



//get single jobs detail /////////////
export const AdminGetSingleJobsrDetailController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        jobId
      } = req.query;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id

        const jobsDetail = await JobModel.findOne({_id: jobId})
      
        if (!jobsDetail) {
            return res
            .status(401)
            .json({ message: "invalid job ID" });
        }

        const customer = await CustomerRegModel.findOne({_id: jobsDetail.customerId});
        const contractor = await ContractorModel.findOne({_id: jobsDetail.contractorId})

        if (!customer || !contractor) {
            return res
            .status(401)
            .json({ message: "no customer or contractor" });
        }

        const obj = {
            job: jobsDetail,
            contractor,
            customer
        }  

        res.json({  
            job: obj
        });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}



//get total jobs /////////////
export const AdminGetTotalJobsrController = async (
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

        const totalJob = await JobModel.countDocuments()

        res.json({  
            totalJob
        });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}



