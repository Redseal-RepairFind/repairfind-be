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



type PipelineStage =
  | MongoosePipelineStage
  | { $lookup: { from: string; localField: string; foreignField: string; as: string, pipeline?: any } }
  | { $unwind: string | { path: string; includeArrayIndex?: string; preserveNullAndEmptyArrays?: boolean } }
  | { $match: any }
  | { $addFields: any }
  | { $project: any }
  | { $sort: { [key: string]: 1 | -1 } }
  | { $group: any };

export const exploreContractors = async (
  req: any,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  try {
    let {
      searchName,
      listing,
      minDistance,
      maxDistance,
      radius,
      latitude, //if latitude is not provided, use the stored location of the customer
      longitude,
      emergencyJobs,
      category,
      location,
      city,
      country,
      address,
      accountType,
      date,
      isOffDuty,
      availability,
      experienceYear,
      gstNumber,
      page = 1, // Default to page 1
      limit = 10, // Default to 10 items per page
      sort, // Sort field and order (-fieldName or fieldName)
      minResponseTime,
      maxResponseTime,
      sortByResponseTime,
      hasPassedQuiz,
      gstStatus,
      stripeAccountStatus,
      startDate,
      endDate
    } = req.query;



    const availableDaysArray = availability ? availability.split(',') : [];
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    let mergedPipelines = [...ContractorStripeAccountPipeline, ...ContractorQuizPipeline]
    const pipeline: PipelineStage[] = [
      ...mergedPipelines,
      {
        $lookup: {
          from: "contractor_profiles",
          localField: "profile",
          foreignField: "_id",
          as: "profile"
        }
      },
      { $unwind: "$profile" },
      {
        $addFields: {
          name: {
            $cond: {
              if: {
                $or: [
                  { $eq: ['$accountType', CONTRACTOR_TYPES.Individual] },
                  { $eq: ['$accountType', CONTRACTOR_TYPES.Employee] }
                ]
              },
              then: { $concat: ['$firstName', ' ', '$lastName'] },
              else: '$companyName'
            }
          },
          rating: { $avg: '$reviews.averageRating' }, // Calculate average rating using $avg
          reviewCount: { $size: '$reviews' }, // Calculate average rating using $avg

        }
      },
      {
        $lookup: {
          from: "job_quotations",
          localField: "_id",
          foreignField: "contractor",
          as: "quotations"
        }
      },
      {
        $addFields: {
          avgResponseTime: {
            $avg: "$quotations.responseTime"
          }
        }
      },
      {
        $project: {
          stripeIdentity: 0,
          stripeCustomer: 0,
          stripeAccount: 0,
          stripePaymentMethods: 0,
          stripePaymentMethod: 0,
          passwordOtp: 0,
          password: 0,
          emailOtp: 0,
          dateOfBirth: 0,
          reviews: 0,
          onboarding: 0,
          "quotations": 0,
          "stats": 0,
          quizzes: 0,
          questions: 0,
          latestQuiz: 0

        }
      },

    ];


    // Date filter
    if (startDate) {
      const dateFilter: any = {};

      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);
      dateFilter.$gte = start;


      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }

      if (!endDate) {
        const end = new Date(startDate);
        end.setUTCHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
      console.log("Date filter", dateFilter)
      pipeline.push({
        $match: {
          createdAt: dateFilter
        }
      })
    }


    //example filter out who do not have stripe account
    // pipeline.push({ $match: { "stripeAccountStatus.status": 'active' } })


    //example filter out employees and contractors 
    pipeline.push({ $match: { accountType: { $ne: CONTRACTOR_TYPES.Employee } } })

    // Add stages conditionally based on query parameters
    if (searchName) {
      pipeline.push({ $match: { "name": { $regex: new RegExp(searchName, 'i') } } });
    }


    if (category) {
      pipeline.push({ $match: { "profile.skill": { $regex: new RegExp(category, 'i') } } });
    }
    if (country) {
      pipeline.push({ $match: { "profile.location.country": { $regex: new RegExp(country, 'i') } } });
    }
    if (city) {
      pipeline.push({ $match: { "profile.location.city": { $regex: new RegExp(city, 'i') } } });
    }
    if (address) {
      pipeline.push({ $match: { "profile.location.address": { $regex: new RegExp(address, 'i') } } });
    }
    if (gstStatus) {
      pipeline.push({ $match: { "gstDetails.status": gstStatus } });
    }
    if (accountType) {
      pipeline.push({ $match: { "accountType": accountType } });
    }
    if (hasPassedQuiz) {
      pipeline.push({ $match: { "quiz.passed": hasPassedQuiz === "true" || null } });
    }
    if (stripeAccountStatus) {
      pipeline.push({ $match: { "stripeAccountStatus.status": stripeAccountStatus } })
    }
    if (experienceYear) {
      pipeline.push({ $match: { "profile.experienceYear": parseInt(experienceYear) } });
    }
    if (emergencyJobs !== undefined) {
      pipeline.push({ $match: { "profile.emergencyJobs": emergencyJobs === "true" } });
    }
    if (isOffDuty !== undefined) {
      pipeline.push({ $match: { "profile.isOffDuty": isOffDuty === "true" || null } });
    }
    if (gstNumber) {
      pipeline.push({ $match: { "profile.gstNumber": gstNumber } });
    }

    if (availability) {
      pipeline.push({ $match: { "profile.availability": { $in: availableDaysArray } } });
    }
    if (radius) {
      pipeline.push({ $match: { "distance": { $lte: parseInt(radius) } } });
    }

    if (minDistance !== undefined) {
      pipeline.push({ $match: { "distance": { $gte: parseInt(minDistance) } } });
    }

    if (maxDistance !== undefined) {
      pipeline.push({ $match: { "distance": { $lte: parseInt(maxDistance) } } });
    }


    if (minResponseTime !== undefined) {
      minResponseTime = minResponseTime * 1000
      pipeline.push({ $match: { "avgResponseTime": { $gte: parseInt(minResponseTime) } } });
    }

    if (maxResponseTime !== undefined) {
      maxResponseTime = maxResponseTime * 1000
      pipeline.push({ $match: { "avgResponseTime": { $lte: parseInt(maxResponseTime) } } });
    }

    // if (sortByResponseTime !== undefined) {
    //     const sortOrder = sortByResponseTime === "asc" ? 1 : -1;
    //     pipeline.push({ $sort: { avgResponseTime: sortOrder } });
    // }


    if (sort) {
      const [sortField, sortOrder] = sort.startsWith('-') ? [sort.slice(1), -1] : [sort, 1];
      const sortStage: PipelineStage = {
        //@ts-ignore
        $sort: { [sortField]: sortOrder }
      };
      pipeline.push(sortStage);
    }


    switch (listing) {
      case 'recommended':
        // Logic to fetch recommended contractors
        // pipeline.push(
        //     { $match: { rating: { $gte: 4.5 } } }, // Fetch contractors with rating >= 4.5
        //     { $sort: { rating: -1 } } // Sort by rating in descending order
        // );
        pipeline.push(
          { $sample: { size: 10 } } // Randomly sample 10 contractors
        );
        break;
      case 'top-rated':
        // Logic to fetch top-rated contractors
        // pipeline.push(
        //     { $match: { rating: { $exists: true } } }, // Filter out contractors with no ratings
        //     { $sort: { rating: -1 } } // Sort by rating in descending order
        // );

        pipeline.push({ $match: { averageRating: { $exists: true } } });

        break;
      case 'featured':
        // Logic to fetch featured contractors
        pipeline.push(
          { $match: { isFeatured: true } } // Filter contractors marked as featured
        );
        break;
      default:
        // Default logic if type is not specified or invalid
        // You can handle this case based on your requirements
        break;
    }


    // Add $facet stage for pagination
    pipeline.push({
      $facet: {
        metadata: [
          { $count: "totalItems" },
          { $addFields: { page, limit, currentPage: parseInt(page), lastPage: { $ceil: { $divide: ["$totalItems", parseInt(limit)] } }, listing } }
        ],
        data: [{ $skip: skip }, { $limit: parseInt(limit) }],
        verifiedContractors: [
          { $match: { accountStatus: CONTRACTOR_STATUS.APPROVED } },
          { $count: "count" }
        ],
        unverifiedContractors: [
          { $match: { accountStatus: { $ne: CONTRACTOR_STATUS.APPROVED } } },
          { $count: "count" }
        ]
      }
    });

    // Execute pipeline
    const result = await ContractorModel.aggregate(pipeline);
    const contractors = result[0].data;
    const metadata = result[0].metadata[0];
    const verifiedCount = result[0].verifiedContractors[0]?.count || 0;
    const unverifiedCount = result[0].unverifiedContractors[0]?.count || 0;

    // Send response
    res.status(200).json({
      success: true,
      data: {
        ...metadata,
        data: contractors,
        stats: {
          verifiedContractors: verifiedCount,
          unVerifiedContractors: unverifiedCount
        }
      }
    });

  } catch (err: any) {
    console.error("Error fetching contractors:", err);
    res.status(400).json({ message: 'Something went wrong' });
  }
}



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