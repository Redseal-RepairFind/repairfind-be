import { validationResult } from "express-validator";
import { Request, Response } from "express";
import AdminRegModel from "../../../database/admin/models/admin.model";
import CustomerRegModel from "../../../database/customer/models/customer.model";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import { JobModel } from "../../../database/common/job.model";
import CustomerRatingModel from "../../../database/customer/models/customerRating.model";
import { InvoiceModel } from "../../../database/common/invoices.shema";

//get customer detail /////////////
export const AdminGetCustomerDetailController = async (
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

      const customersDetail = await CustomerRegModel.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

      const totalCustomer = await CustomerRegModel.countDocuments()

      // let customers = [];

      // for (let i = 0; i < customersDetail.length; i++) {
      //   const customer = customersDetail[i];
        
      //   const jobRequests = await JobModel.find({customerId: customer._id}).sort({ createdAt: -1 })

      //   let jobRequested = []

      //   let rating = null

      //   const customerRating = await CustomerRatingModel.findOne({customerId: customer._id})
      //   if (customerRating) {
      //     rating = customerRating
      //   }

      //   for (let i = 0; i < jobRequests.length; i++) {
      //     const jobRequest = jobRequests[i];
          
      //     const contractor = await ContractorModel.findOne({_id: jobRequest.contractorId}).select('-password');

      //     const obj = {
      //       job: jobRequest,
      //       contractor
      //     }

      //     jobRequested.push(obj)
          
      //   }

      //   const objTwo = {
      //     customer,
      //     rating,
      //     jobHistory: jobRequested
      //   }

      //   customers.push(objTwo)
      // }

      res.json({  
        currentPage: page,
        totalCustomer,
        totalPages: Math.ceil(totalCustomer / limit),
        customers: customersDetail
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//get single customer detail /////////////
export const AdminGetSingleCustomerDetailController = async (
  req: any,
  res: Response,
) => {

  try {
    let {  
      customerId
    } = req.params;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const admin =  req.admin;
    const adminId = admin.id

    const customer = await CustomerRegModel.findOne({_id: customerId})
    .select('-password')

    if (!customer) {
      return res
        .status(401)
        .json({ message: "invalid customer ID" });
    }

    // let rating = null

    // const customerRating = await CustomerRatingModel.findOne({customerId: customer._id})
    // if (customerRating) {
    //   rating = customerRating
    // }

    // const jobRequests = await JobModel.find({customerId: customer._id}).sort({ createdAt: -1 })

    // let jobRequested = []

    // for (let i = 0; i < jobRequests.length; i++) {
    //   const jobRequest = jobRequests[i];
      
    //   const contractor = await ContractorModel.findOne({_id: jobRequest.contractorId}).select('-password');

    //   const obj = {
    //     job: jobRequest,
    //     contractor
    //   }

    //   jobRequested.push(obj)
      
    // }

    // const objTwo = {
    //   customer,
    //   rating,
    //   jobHistory: jobRequested
    // }


    res.json({  
      customer: customer
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//get single customer job detail /////////////
export const AdminGetSingleCustomerJobDetailController = async (
  req: any,
  res: Response,
) => {

  try {
    let {  
      customerId
    } = req.params;

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

    const customer = await CustomerRegModel.findOne({_id: customerId})
    .select('-password')

    if (!customer) {
      return res
        .status(401)
        .json({ message: "invalid customer ID" });
    }

    const skip = (page - 1) * limit;

    const jobsDetails = await JobModel.find({customer: customerId})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate(['customer', 'contractor', 'quotation']);

    const totalJob = await JobModel.countDocuments({customer: customerId})

    let jobs = []
    for (let i = 0; i < jobsDetails.length; i++) {
      const jobsDetail = jobsDetails[i];

      const invoice = await InvoiceModel.findOne({jobId: jobsDetail._id})
      if (!invoice) continue

      const obj = {
        jobsDetail,
        invoice
      }

      jobs.push(obj)
      
    }

    res.json({  
      currentPage: page,
      totalJob,
      totalPages: Math.ceil(totalJob / limit),
      jobs
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}

export const AdminCustomerController = {
  AdminGetCustomerDetailController,
  AdminGetSingleCustomerDetailController,
  AdminGetSingleCustomerJobDetailController,
}