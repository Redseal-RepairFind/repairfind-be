import { validationResult } from "express-validator";
import { Request, Response } from "express";
import AdminRegModel from "../../../database/admin/models/admin.model";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import { JobModel } from "../../../database/common/job.model";
import CustomerRegModel from "../../../database/customer/models/customer.model";
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
  
      const artisans = [];
      
      for (let i = 0; i < contractors.length; i++) {
        const contractor = contractors[i];
        const job = await JobModel.find({contractor: contractor._id}).sort({ createdAt: -1 }).populate("customer")

        // let rating = null;
        
        // const contractorRating = await ContractorRatingModel.findOne({contractorId: contractor._id})
        // if (contractorRating) {
        //   rating = contractorRating
        // }

        // let jobRequested = []

        const objTwo = {
            contractor: contractor,
            job: job
        };

        artisans.push(objTwo)
      }
  
      res.json({ 
        currentPage: page,
        totalContractor,
        totalPages: Math.ceil(totalContractor / limit),
        contractors: artisans
        
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

    const job = await JobModel.find({contractor: contractor._id}).sort({ createdAt: -1 }).populate("customer")

    res.json({ 
      contractor, 
      job
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
      page,
      limit
    } = req.query

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

    const contractor = await ContractorModel.find({
      "gstDetails.status": GST_STATUS.PENDING
    }).skip(skip)
    .limit(limit);

    const totalContractor = await ContractorModel.countDocuments({
      "gstDetails.status": GST_STATUS.PENDING
    })
  
    res.json({  
      currentPage: page,
      totalContractor,
      totalPages: Math.ceil(totalContractor / limit),
      contractor
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//admin get contractor gst that is approve /////////////
export const AdminGetContractorGstApproveController = async (
  req: any,
  res: Response,
) => {
  try {
    let {  
      page,
      limit
    } = req.query

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

    const contractor = await ContractorModel.find({
      "gstDetails.status": GST_STATUS.APPROVED
    }).skip(skip)
    .limit(limit);

    const totalContractor = await ContractorModel.countDocuments({
      "gstDetails.status": GST_STATUS.APPROVED
    })
  
  
    res.json({  
      currentPage: page,
      totalContractor,
      totalPages: Math.ceil(totalContractor / limit),
      contractor
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}

//admin get contractor gst that is Reviewing /////////////
export const AdminGetContractorGstReviewingController = async (
  req: any,
  res: Response,
) => {

  try {
    let {  
      page,
      limit
    } = req.query

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

    const contractor = await ContractorModel.find({
      "gstDetails.status": GST_STATUS.REVIEWING
    }).skip(skip)
    .limit(limit);

    const totalContractor = await ContractorModel.countDocuments({
      "gstDetails.status": GST_STATUS.REVIEWING
    })
  
  
    res.json({  
      currentPage: page,
      totalContractor,
      totalPages: Math.ceil(totalContractor / limit),
      contractor
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}

//admin get contractor gst that is Decline /////////////
export const AdminGetContractorGstDecliningController = async (
  req: any,
  res: Response,
) => {

  try {
    let {  
      page,
      limit
    } = req.query

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

    const contractor = await ContractorModel.find({
      "gstDetails.status": GST_STATUS.DECLINED
    }).skip(skip)
    .limit(limit);

    const totalContractor = await ContractorModel.countDocuments({
      "gstDetails.status": GST_STATUS.DECLINED
    })
    res.json({  
      currentPage: page,
      totalContractor,
      totalPages: Math.ceil(totalContractor / limit),
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
      jobs: jobsDetails,
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//admin change contractor account status  /////////////
export const AdminChangeContractorAccountStatusController = async (
  req: any,
  res: Response,
) => {

  try {
    let {  
     status,
     contractorId,
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const admin =  req.admin;
    const adminId = req.admin.id

    const admin = await AdminRegModel.findOne({_id: adminId})

    if (!admin) {
      return res
        .status(401)
        .json({ message: "Invalid admin ID" });
    }

    const contractor = await ContractorModel.findOne({_id: contractorId})

    if (!contractor) {
      return res
        .status(401)
        .json({ message: "Invalid contractor ID" });
    }

    contractor.status = status;
    await contractor.save()

    res.json({  
      message: `Contractor account status successfully change to ${status}`
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
  AdminGetContractorGstReviewingController,
  AdminGetContractorGstApproveController,
  AdminGetContractorGstDecliningController,
  AdminGetSingleContractorJonDetailController,
  AdminChangeContractorAccountStatusController
}