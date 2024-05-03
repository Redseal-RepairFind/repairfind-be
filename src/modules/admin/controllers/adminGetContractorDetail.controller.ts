import { validationResult } from "express-validator";
import { Request, Response } from "express";
import AdminRegModel from "../../../database/admin/models/admin.model";
import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";
import ContractorAvailabilityModel from "../../../database/contractor/models/contractorAvaliability.model";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import JobModel from "../../../database/contractor/models/job.model";
import CustomerRegModel from "../../../database/customer/models/customer.model";
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
  
      // const artisans = [];
      
      // for (let i = 0; i < contractors.length; i++) {
      //   const contractor = contractors[i];

      //   const document = await ContractorDocumentValidateModel.findOne({contractorId: contractor._id});

      //   const availability = await ContractorAvailabilityModel.find({contractorId: contractor._id});

      //   const jobRequests = await JobModel.find({contractorId: contractor._id}).sort({ createdAt: -1 })

      //   let rating = null;
        
      //   const contractorRating = await ContractorRatingModel.findOne({contractorId: contractor._id})
      //   if (contractorRating) {
      //     rating = contractorRating
      //   }

      //   let jobRequested = []

      //   for (let i = 0; i < jobRequests.length; i++) {
      //     const jobRequest = jobRequests[i];
          
      //     const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

      //     const obj = {
      //       job: jobRequest,
      //       customer
      //     }

      //     jobRequested.push(obj)
          
      //   }

      //   const objTwo = {

      //       contractorProfile: contractor,
      //       rating,
      //       document,
      //       availability,
      //       jobHistory: jobRequested
      //   };

      //   artisans.push(objTwo)
      // }
  
      res.json({ 
        currentPage: page,
        totalContractor,
        totalPages: Math.ceil(totalContractor / limit),
        contractors,
        // totalContractor, 
        // artisans
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
    const { contractorId } = req.params;

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

    // const document = await ContractorDocumentValidateModel.findOne({contractorId: contractor._id});

    // const availability = await ContractorAvailabilityModel.find({contractorId: contractor._id});

    // const jobRequests = await JobModel.find({contractorId: contractor._id}).sort({ createdAt: -1 })

    // let rating = null;
        
    // const contractorRating = await ContractorRatingModel.findOne({contractorId: contractor._id})
    // if (contractorRating) {
    //   rating = contractorRating
    // }

    // let jobRequested = []

    // for (let i = 0; i < jobRequests.length; i++) {
    //   const jobRequest = jobRequests[i];
      
    //   const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

    //   const obj = {
    //     job: jobRequest,
    //     customer
    //   }

    //   jobRequested.push(obj)
      
    // }

    // const objTwo = {
    //     contractorProfile: contractor,
    //     rating,
    //     document,
    //     availability,
    //     jobHistory: jobRequested
    // };

    res.json({ 
      contractor, 
      // artisan: objTwo
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
     gstStatus,
     contractorId
    } = req.body;

    console.log(1)

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(2)

    const admin =  req.admin;
    const adminId = admin.id

    const contractor = await ContractorModel.findOne({_id: contractorId})

    console.log(3)

    if (!contractor) {
      return res
        .status(401)
        .json({ message: "invalid contractor ID" });
    }

    console.log(4)

    contractor.gstDetails.status = gstStatus;
    console.log(5)
    await contractor.save()

    console.log(6)

    res.json({  
      message: `contractor GST status successfully change to ${gstStatus}.`
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//admin get contractor gst that is pending /////////////
export const AdminGetContractorGstPendingController = async (
  req: any,
  res: Response,
) => {

  try {
    let {  
     
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const admin =  req.admin;
    const adminId = admin.id

    const contractor = await ContractorModel.find({
      "gstDetails": {
          "status": "PENDING"
        }
      
    })
  
    res.json({  
      contractor
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}

export const AdminContractorDetail = {
  AdminGetContractorDetailController,
  AdminGetSingleContractorDetailController,
  AdminChangeContractorContractorDetailController,
  AdminGetContractorGstPendingController
}