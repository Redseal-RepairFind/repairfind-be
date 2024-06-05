import { validationResult } from "express-validator";
import { Request, Response } from "express";
import AdminRegModel from "../../../database/admin/models/admin.model";
import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";
import ContractorAvailabilityModel from "../../../database/contractor/models/contractorAvaliability.model";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import { JobModel } from "../../../database/common/job.model";
import CustomerRegModel from "../../../database/customer/models/customer.model";
import ContractorRatingModel from "../../../database/contractor/models/contractorRating.model";
import { sendEmail } from "../../../utils/send_email_utility";
import { htmlAdminRquestGstStatuChangeTemplate } from "../../../templates/adminEmail/adminRequestGstStatusTemplate";
import { OTP_EXPIRY_TIME, generateOTP } from "../../../utils/otpGenerator";
import { GST_STATUS} from "../../../database/contractor/interface/contractor.interface";
import { InvoiceModel } from "../../../database/common/invoices.shema";


//get contractor detail /////////////
export const AdminGetContractorDetailController = async (
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


//admin change contractor gst status  /////////////
export const AdminChangeContractorGstStatusController = async (
  req: any,
  res: Response,
) => {

  try {
    let {  
     gstStatus,
     contractorId,
     reason
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    reason = reason || '';

    // const admin =  req.admin;
    const adminId = req.admin.id

    const admin = await AdminRegModel.findOne({_id: adminId})

    if (!admin) {
      return res
        .status(401)
        .json({ message: "invalid admin ID" });
    }

    const contractor = await ContractorModel.findOne({_id: contractorId})

    if (!contractor) {
      return res
        .status(401)
        .json({ message: "invalid contractor ID" });
    }

    // const superAdmin = await AdminRegModel.findOne({superAdmin: true})

    // if (!superAdmin) {
    //   return res
    //     .status(401)
    //     .json({ message: "no super admin found" });
    // }


    // contractor.gstDetails.gstOtp = otp;
    // contractor.gstDetails.gstOtpStatus = GST_OTP_STATUS.REQUEST;
    // contractor.gstDetails.gstOtpTime = createdTime;
    // contractor.gstDetails.gstOtpRquestBy = admin._id;
    // contractor.gstDetails.gstOtpRquestType = gstStatus;

    if (reason === '' && gstStatus === GST_STATUS.DECLINED) {
      return res
        .status(401)
        .json({ message: "please provide reason for declinig contractor" });
    }

    const createdTime = new Date()

    contractor.gstDetails.status = gstStatus;
    contractor.gstDetails.approvedBy = adminId;
    contractor.gstDetails.approvedAt = createdTime;
    contractor.gstDetails.statusReason = reason;
    await contractor.save()

    // const html = htmlAdminRquestGstStatuChangeTemplate(admin.firstName, contractor.firstName, contractor.email, otp, gstStatus);

    // let emailData = {
    //     emailTo: superAdmin.email,
    //     subject: "GST Status Change Requst",
    //     html
    // };

    // sendEmail(emailData);

    res.json({  
      message: `contractor gst status successfully change to ${gstStatus}`
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
      "gstDetails.status": "PENDING"
    })
  
    res.json({  
      contractor
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}

//get  single contractor job detail /////////////
export const AdminGetSingleContractorJonDetailController = async (
  req: any,
  res: Response,
) => {

  try {
    const { contractorId } = req.params;
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

    const contractor = await ContractorModel.findOne({_id: contractorId})
    .select('-password')

    if (!contractor) {
      return res
        .status(401)
        .json({ message: "invalid artisan ID" });
    }

    const skip = (page - 1) * limit;

    const jobsDetails = await JobModel.find({contractor: contractorId})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate(['customer', 'contractor', 'quotation']);

    const totalJob = await JobModel.countDocuments({contractor: contractorId})

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


export const AdminContractorDetail = {
  AdminGetContractorDetailController,
  AdminGetSingleContractorDetailController,
  AdminChangeContractorGstStatusController,
  AdminGetContractorGstPendingController,
  AdminGetSingleContractorJonDetailController
}