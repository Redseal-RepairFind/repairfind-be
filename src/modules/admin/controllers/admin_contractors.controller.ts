import { validationResult } from "express-validator";
import AdminRegModel from "../../../database/admin/models/admin.model";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { JobModel } from "../../../database/common/job.model";
import { CONTRACTOR_STATUS, CONTRACTOR_TYPES, GST_STATUS } from "../../../database/contractor/interface/contractor.interface";
import { applyAPIFeature } from "../../../utils/api.feature";
import { NextFunction, Request, Response } from "express";
import { StripeService } from "../../../services/stripe";
import { IStripeAccount } from "../../../database/common/stripe_account.schema";
import { castPayloadToDTO } from "../../../utils/interface_dto.util";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import mongoose, { PipelineStage as MongoosePipelineStage } from 'mongoose'; // Import Document type from mongoose
import { JobQuotationModel } from "../../../database/common/job_quotation.model";
import { JobDisputeModel } from "../../../database/common/job_dispute.model";
import { ContractorQuizPipeline } from "../../../database/contractor/pipelines/contractor_quize.pipeline";
import { ContractorStripeAccountPipeline } from "../../../database/contractor/pipelines/contractor_stripe_account.pipeline";
import { GenericEmailTemplate } from "../../../templates/common/generic_email";
import { EmailService, NotificationService } from "../../../services";
import { PROMOTION_STATUS, PromotionModel } from "../../../database/common/promotion.schema";
import { CouponModel } from "../../../database/common/coupon.schema";
import { generateCouponCode } from "../../../utils/couponCodeGenerator";



export const exploreContractors = async (req: Request, res: Response) => {
  try {

    const queryFilter: any = {};

    // Date filter logic
    if (req.query.startDate) {
      const dateFilter: any = {};
      
      // Set start date at the beginning of the day
      const start = new Date(req.query.startDate as string);
      start.setUTCHours(0, 0, 0, 0);
      dateFilter.$gte = start;
    
      // Set end date at the end of the day, or use start date if no endDate is provided
      const end = new Date(req.query.endDate ? req.query.endDate as string : req.query.startDate as string);
      end.setUTCHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    
      // Apply the date filter to createdAt
      queryFilter.createdAt = dateFilter;
    }

    const { data, filter } = await applyAPIFeature(ContractorModel.find(queryFilter).populate('profile'), req.query, ['getOnboarding']);


    let contractorsData = [];
    if (req.query.startDate || req.query.endDate) {
      contractorsData = data?.data; 
    } else {
      contractorsData = await ContractorModel.find();  // Fetch all contractors if no filter
    }
    const reviewing = contractorsData.filter((contractor: any) => contractor.accountStatus === CONTRACTOR_STATUS.REVIEWING).length;
    const suspended = contractorsData.filter((contractor: any) => contractor.accountStatus === CONTRACTOR_STATUS.SUSPENDED).length;
    const approved = contractorsData.filter((contractor: any) => contractor.accountStatus === CONTRACTOR_STATUS.APPROVED).length;
    const blacklisted = contractorsData.filter((contractor: any) => contractor.accountStatus === CONTRACTOR_STATUS.BLACKLISTED).length;
    const total = contractorsData.length;
    
      

    // Send response
    res.status(200).json({
      success: true,
      data: {
        ...data,
        stats: {
          total,
          reviewing,
          suspended,
          approved,
          blacklisted
        }
      }
    });

  } catch (err: any) {
    console.error("Error fetching contractors:", err);
    res.status(400).json({ message: 'Something went wrong' });
  }
};





//get  single contractor detail /////////////
export const getSingleContractor = async (
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

    const admin = req.admin;
    const adminId = admin.id

    const contractor = await ContractorModel.findOne({ _id: contractorId })
      .select('-password').populate('profile');

    if (!contractor) {
      return res
        .status(401)
        .json({ message: "Contractor not found" });
    }

    const job = await JobModel.find({ contractor: contractor._id }).sort({ createdAt: -1 }).populate("customer", "profile")

    contractor.onboarding = await contractor.getOnboarding()
    const quiz = await contractor.quiz;
    contractor.stats = await contractor.getStats();


    return res.json({ status: false, message: "Contractor retrieved", contractor });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}


export const getJobHistory = async (req: any, res: Response, next: NextFunction) => {
  const contractorId = req.params.contractorId;

  try {
    let {
      type,
      page = 1, // Default to page 1
      limit = 10, // Default to 10 items per page
      sort = '-createdAt', // Sort field and order (-fieldName or fieldName)
      customerId
    } = req.query;




    // Retrieve the quotations for the current contractor and extract job IDs
    const quotations = await JobQuotationModel.find({ contractor: contractorId }).select('job').lean();

    // Extract job IDs from the quotations
    const jobIds = quotations.map((quotation: any) => quotation.job);

    if (customerId) {
      if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return res.status(400).json({ success: false, message: 'Invalid customer id' });
      }
      req.query.customer = customerId
      delete req.query.customerId
    }

    // Query JobModel to find jobs that have IDs present in the extracted jobIds
    const { data, error } = await applyAPIFeature(
      JobModel.find({
        $or: [
          { _id: { $in: jobIds } }, // Match jobs specified in jobIds
          { contractor: contractorId }, // Match jobs with contractorId
          { 'assignment.contractor': contractorId }
        ]
      }).distinct('_id'),
      req.query);
    if (data) {
      // Map through each job and attach myQuotation if contractor has applied 
      await Promise.all(data.data.map(async (job: any) => {
        if (job.isAssigned) {
          job.myQuotation = await job.getMyQuotation(job.contractor)
        } else {
          job.myQuotation = await job.getMyQuotation(contractorId)
        }
      }));
    }

    if (error) {
      return next(new BadRequestError('Unknown error occurred', error as any));
    }

    // Send response with job listings data
    res.status(200).json({ success: true, data: data });
  } catch (error: any) {
    return next(new BadRequestError('An error occurred', error));
  }
};



export const getSingleJob = async (req: any, res: Response, next: NextFunction) => {
  try {

    const contractorId = req.params.id
    const jobId = req.params.jobId;

    const job = await JobModel.findOne({
      $or: [
        { contractor: contractorId },
        { 'assignment.contractor': contractorId }
      ], _id: jobId
    }).populate(['contractor', 'contract', 'customer', 'assignment.contractor']);

    // Check if the job exists
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }


    let responseData: any = { ...job.toJSON() };
    responseData.dispute = await JobDisputeModel.findOne({ job: job.id });
    responseData.jobDay = await job.getJobDay()


    // If the job exists, return it as a response
    res.json({ success: true, message: 'Job retrieved', data: responseData });
  } catch (error: any) {
    return next(new BadRequestError('An error occurred ', error))
  }
};



export const updateGstDetails = async (
  req: any,
  res: Response,
) => {



  try {
    const {
      gstStatus,
      gstName,
      gstNumber,
      gstType,
      backgroundCheckConsent,
      status,
      gstCertificate,
      reason = "Not Specified"
    } = req.body;

    const contractorId = req.params.contractorId
    const adminId = req.admin.id

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() });
    }

    if (!mongoose.isValidObjectId(contractorId)) {
      return res.status(400).json({ success: false, message: "Invalid contractor Id supplied" });
    }

    const contractor = await ContractorModel.findById(contractorId)

    if (!contractor) {
      return res
        .status(404)
        .json({ message: "Contractor not found" });
    }


    if (reason === '' && gstStatus === GST_STATUS.DECLINED) {
      return res
        .status(401)
        .json({ message: "please provide reason for declining contractor" });
    }

    const createdTime = new Date()

    contractor.gstDetails.status = gstStatus;
    contractor.gstDetails.approvedBy = adminId;
    contractor.gstDetails.approvedAt = createdTime;
    contractor.gstDetails.statusReason = reason;

    contractor.gstDetails.gstName = gstName ?? contractor.gstDetails.gstName;
    contractor.gstDetails.gstType = gstType ?? contractor.gstDetails.gstType;
    contractor.gstDetails.gstCertificate = gstCertificate ?? contractor.gstDetails.gstCertificate;
    contractor.gstDetails.backgroundCheckConsent = backgroundCheckConsent ?? contractor.gstDetails.backgroundCheckConsent;
    await contractor.save()



    // TODO: Send email to contractor

    return res.json({
      success: true,
      message: `Contractor gst status successfully changed to ${gstStatus}`
    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


export const sendCustomEmail = async (
  req: any,
  res: Response,
) => {



  try {
    const {
      subject,
      htmlContent
    } = req.body;

    const contractorId = req.params.contractorId
    const adminId = req.admin.id

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() });
    }

    if (!mongoose.isValidObjectId(contractorId)) {
      return res.status(400).json({ success: false, message: "Invalid contractor Id supplied" });
    }

    const contractor = await ContractorModel.findById(contractorId)

    if (!contractor) {
      return res
        .status(401)
        .json({ message: "Contractor not found" });
    }


    let emailSubject = subject
    let emailContent = htmlContent
    let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
    EmailService.send(contractor.email, emailSubject, html)




    return res.json({
      success: true,
      message: `Email sent successfully changed to ${contractor.email}`
    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


export const updateAccountStatus = async (
  req: any,
  res: Response,
) => {



  try {
    const {
      status,
    } = req.body;

    const contractorId = req.params.contractorId
    const adminId = req.admin.id

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() });
    }

    if (!mongoose.isValidObjectId(contractorId)) {
      return res.status(400).json({ success: false, message: "Invalid contractor Id supplied" });
    }

    const contractor = await ContractorModel.findById(contractorId)

    if (!contractor) {
      return res
        .status(401)
        .json({ message: "Contractor not found" });
    }


    contractor.gstDetails.status = status;
    await contractor.save()



    // TODO: Send email to contractor

    return res.json({
      success: true,
      message: `Contractor status successfully changed to ${status}`
    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


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

    const admin = await AdminRegModel.findOne({ _id: adminId })

    if (!admin) {
      return res
        .status(401)
        .json({ message: "Invalid admin ID" });
    }

    const contractor = await ContractorModel.findOne({ _id: contractorId })

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


export const removeStripeAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { contractorId } = req.params;
    const contractor = await ContractorModel.findById(contractorId);
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor not found' });
    }
    //@ts-ignore
    contractor.stripeAccount = null
    await contractor.save()

    return res.json({ success: true, message: 'Stripe account  removed', data: contractor });
  } catch (error: any) {
    return next(new InternalServerError('Error removing stripe account', error))
  }

}


export const attachStripeAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { stripeAccountId } = req.body;
    const { contractorId } = req.params;
    const contractor = await ContractorModel.findById(contractorId);
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor not found' });
    }

    const account: unknown = await StripeService.account.getAccount(stripeAccountId); //acct_1P4N6NRdmDaBvbML ,acct_1P7XvFRZlKifQSOs
    const stripeAccount = castPayloadToDTO(account, account as IStripeAccount)
    contractor.stripeAccount = stripeAccount
    await contractor.save()
    return res.json({ success: true, message: 'Stripe account  attached', data: contractor });
  } catch (error: any) {
    return next(new InternalServerError(`Error attaching stripe account: ${error.message}`, error))
  }

}


export const attachCertnDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { certnDetails, contractorEmail } = req.body; // Extract certnId and certnDetails from the request body
    const { contractorId } = req.params; // Extract contractorId from the request parameters

    // Find the contractor by ID
    const contractor = await ContractorModel.findOne({ email: contractorEmail });
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor not found' });
    }

    // Attach certnDetails to the contractor
    await ContractorModel.findByIdAndUpdate(contractor.id, {
      certnId: certnDetails.application.applicant.id,
      certnDetails: certnDetails
    })

    NotificationService.sendNotification({
      user: contractor.id,
      userType: 'contractors',
      title: 'Background Check Complete',
      type: 'BACKGROUND_CHECK', //
      message: `Your background check with CERTN is now complete`,
      heading: { name: `Repairfind`, image: 'https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png' },
      payload: {
      }
    }, { push: true, socket: true, database: true })



    // Respond with success message
    return res.json({ success: true, message: 'Certn details attached', data: contractor });
  } catch (error: any) {
    // Handle any errors that occur
    return next(new InternalServerError(`Error attaching certn details: ${error.message}`, error));
  }
};


// Attach Certn Id and let the cron job retrieve the result and notify
export const attachCertnId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { certnId, contractorEmail } = req.body; // Extract certnId and certnDetails from the request body

    // Find the contractor by ID
    const contractor = await ContractorModel.findOne({ email: contractorEmail });
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor not found' });
    }

    // Attach certnDetails to the contractor
    await ContractorModel.findByIdAndUpdate(contractor.id, {
      certnId: certnId,
    })


    // Respond with success message
    return res.json({ success: true, message: 'Certn details attached', data: contractor });
  } catch (error: any) {
    // Handle any errors that occur
    return next(new InternalServerError(`Error attaching certn details: ${error.message}`, error));
  }
};





export const issueCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { promotionId } = req.body; // Extract promotionId from the request body
    const { contractorId } = req.params; // Extract userId from the request parameters

    // Find the promotion by ID
    const promotion = await PromotionModel.findById(promotionId);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }

    // Check if the promotion is active
    if (promotion.status !== PROMOTION_STATUS.ACTIVE) {
      return res.status(400).json({ success: false, message: 'Promotion is not active' });
    }

    // Create a new user coupon with promotion details
    const newUserCoupon = new CouponModel({
      promotion: promotion._id, // Attach promotion ID
      name: promotion.name,
      code: generateCouponCode(7), // generate coupon code here
      user: contractorId,
      userType: 'contractors',
      valueType: promotion.valueType,
      value: promotion.value,
      applicableAtCheckout: true,
      expiryDate: promotion.endDate,
      status: 'active'
    });

    // Save the new coupon
    await newUserCoupon.save();

    // Respond with success message
    return res.json({ success: true, message: 'Promotion attached to user as coupon', data: newUserCoupon });
  } catch (error: any) {
    // Handle any errors that occur
    return next(new InternalServerError(`Error attaching promotion to user coupon: ${error.message}`, error));
  }
};



export const AdminContractorController = {
  exploreContractors,
  removeStripeAccount,
  attachStripeAccount,
  getSingleContractor,
  getJobHistory,
  getSingleJob,
  updateGstDetails,
  updateAccountStatus,
  sendCustomEmail,
  attachCertnDetails,
  attachCertnId,
  issueCoupon
}