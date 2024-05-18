import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import { JobModel } from "../../../database/common/job.model";
import CustomerRegModel from "../../../database/customer/models/customer.model";
import { InvoiceModel } from "../../../database/common/invoices.shema";



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
        .limit(limit)
        .populate(['customer', 'contractor', 'quotation']);

        const totalJob = await JobModel.countDocuments()

        let jobs = [];

        // for (let i = 0; i < jobsDetails.length; i++) {
        //     const jobsDetail = jobsDetails[i];

        //     const customer = await CustomerRegModel.findOne({_id: jobsDetail.customerId});
        //     const contractor = await ContractorModel.findOne({_id: jobsDetail.contractorId})

        //     if (!customer || !contractor) continue;

        //     const obj = {
        //         job: jobsDetail,
        //         contractor,
        //         customer
        //     }

        //     jobs.push(obj)
        // }

      res.json({
        currentPage: page,
        totalPages: Math.ceil(totalJob / limit),
        totalJob,  
        jobsDetails
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
      const { jobId } = req.params;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id

      const jobsDetail = await JobModel.findOne({_id: jobId}).populate(['customer', 'contractor', 'quotation'])
    
      if (!jobsDetail) {
          return res
          .status(401)
          .json({ message: "invalid job ID" });
      }

      // const customer = await CustomerRegModel.findOne({_id: jobsDetail.customerId});
      // const contractor = await ContractorModel.findOne({_id: jobsDetail.contractorId})

      // if (!customer || !contractor) {
      //     return res
      //     .status(401)
      //     .json({ message: "no customer or contractor" });
      // }

      const obj = {
          job: jobsDetail,
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


//get invoce for  single jobs detail /////////////
export const AdminGetInvoiceSingleJobsrDetailController = async (
  req: any,
  res: Response,
) => {

  try {
    const { jobId } = req.params;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const admin =  req.admin;
    const adminId = admin.id

    // const invoice = await InvoiceModel.findOne({jobId: jobId}).populate(['jobId', 'customerId'])
    const invoice = await InvoiceModel.findOne({jobId: jobId}).populate({
      path: 'jobId', // Field in JobModel referencing another model
      populate: [
          { path: 'customer' }, // Field in CustomerModel referencing another model
          { path: 'contractor' },
          { path: 'quotation' }
      ]
  })
  .populate('customerId')

  
  
  
    if (!invoice) {
        return res
        .status(401)
        .json({ message: "invalid job ID" });
    }

    // const customer = await CustomerRegModel.findOne({_id: jobsDetail.customerId});
    // const contractor = await ContractorModel.findOne({_id: jobsDetail.contractorId})

    // if (!customer || !contractor) {
    //     return res
    //     .status(401)
    //     .json({ message: "no customer or contractor" });
    // }

    const obj = {
      invoice
    }  

    res.json({  
        job: obj
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}

export const AdminJobController = {
  AdminGetJobsrDetailController,
  AdminGetSingleJobsrDetailController,
  AdminGetTotalJobsrController,
  AdminGetInvoiceSingleJobsrDetailController
  
}



