import { validationResult } from "express-validator";
import { Request, Response } from "express";
import AdminRegModel from "../../../database/admin/models/adminReg.model";
import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";
import ContractorAvailabilityModel from "../../../database/contractor/models/contractorAvaliability.model";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import JobModel from "../../../database/contractor/models/job.model";
import CustomerRegModel from "../../../database/customer/models/customerReg.model";
import ContractorRatingModel from "../../../database/contractor/models/contractorRating.model";


//get contractor detail /////////////
export const AdminGetContractorDetailController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
       page,
       limit
      } = req.body;
  
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

      const contractors = await ContractorModel.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

      const totalContractor = await ContractorModel.countDocuments()
  
      const artisans = [];
      
      for (let i = 0; i < contractors.length; i++) {
        const contractor = contractors[i];

        const document = await ContractorDocumentValidateModel.findOne({contractorId: contractor._id});

        const availability = await ContractorAvailabilityModel.find({contractorId: contractor._id});

        const jobRequests = await JobModel.find({contractorId: contractor._id}).sort({ createdAt: -1 })

        let rating = null;
        
        const contractorRating = await ContractorRatingModel.findOne({contractorId: contractor._id})
        if (contractorRating) {
          rating = contractorRating
        }

        let jobRequested = []

        for (let i = 0; i < jobRequests.length; i++) {
          const jobRequest = jobRequests[i];
          
          const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

          const obj = {
            job: jobRequest,
            customer
          }

          jobRequested.push(obj)
          
        }

        const objTwo = {
            contractorProfile: contractor,
            rating,
            document,
            availability,
            jobHistory: jobRequested
        };

        artisans.push(objTwo)
      }
  
      res.json({ 
        totalContractor, 
        artisans
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
}





//get  single contractor detail /////////////
export const AdminGetSingleContractorDetailController = async (
  req: any,
  res: Response,
) => {

  try {
    let {  
     contractorId
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const admin =  req.admin;
    const adminId = admin.id

    const contractor = await ContractorModel.findOne({_id: contractorId})
    .select('-password')

    if (!contractor) {
      return res
        .status(401)
        .json({ message: "invalid artisan ID" });
    }

    const document = await ContractorDocumentValidateModel.findOne({contractorId: contractor._id});

    const availability = await ContractorAvailabilityModel.find({contractorId: contractor._id});

    const jobRequests = await JobModel.find({contractorId: contractor._id}).sort({ createdAt: -1 })

    let rating = null;
        
    const contractorRating = await ContractorRatingModel.findOne({contractorId: contractor._id})
    if (contractorRating) {
      rating = contractorRating
    }

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

      const obj = {
        job: jobRequest,
        customer
      }

      jobRequested.push(obj)
      
    }

    const objTwo = {
        contractorProfile: contractor,
        rating,
        document,
        availability,
        jobHistory: jobRequested
    };

    res.json({  
      artisan: objTwo
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//change contractor status /////////////
export const AdminChangeContractorContractorDetailController = async (
  req: any,
  res: Response,
) => {

  try {
    let {  
     status,
     contractorId
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const admin =  req.admin;
    const adminId = admin.id

    const contractor = await ContractorModel.findOne({_id: contractorId})

    if (!contractor) {
      return res
        .status(401)
        .json({ message: "invalid artisan ID" });
    }

    contractor.status = status;
    await contractor.save()

    res.json({  
      message: `artisan status successfully change to ${status}.`
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}