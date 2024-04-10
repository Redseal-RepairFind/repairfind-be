import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import CustomerRegModel from "../../../database/customer/models/customer.model";
import { sendEmail } from "../../../utils/send_email_utility";
import { htmlJobQoutationTemplate } from "../../../templates/customerEmail/jobQoutationTemplate";
import AdminNoficationModel from "../../../database/admin/models/admin_notification.model";
import CustomerJobRequestModel from "../../../database/customer/models/customer_jobrequest.model";
import { JobModel, JOB_STATUS, JobType } from "../../../database/common/job.model";
import { applyAPIFeature } from "../../../utils/api.feature";
import { BadRequestError, InternalServerError, NotFoundError } from "../../../utils/custom.errors";
import { JobQoutationModel, JOB_QUOTATION_STATUS } from "../../../database/common/job_quotation.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { Document, PipelineStage as MongoosePipelineStage } from 'mongoose'; // Import Document type from mongoose
import { ConversationEntityType, ConversationModel } from "../../../database/common/conversations.schema";
import { MessageModel, MessageType } from "../../../database/common/messages.schema";
import { error } from "console";
import { EmailService } from "../../../services";


export const getJobRequests = async (req: any, res: Response) => {
  try {
    // Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract query parameters
    const { customerId, status, startDate, endDate, date } = req.query;
    const contractorId = req.contractor.id;

    // Construct filter object based on query parameters
    const filter: any = {
      type: JobType.REQUEST
    };

    if (customerId) {
      filter.customer = customerId;
    }
    if (contractorId) {
      filter.contractor = contractorId;
    }
    if (status) {
      filter.status = status.toUpperCase();
    }
    if (startDate && endDate) {
      // Parse startDate and endDate into Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Ensure that end date is adjusted to include the entire day
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }

    if (date) {
      const selectedDate = new Date(date);
      const startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getUTCDate() + 1);
      filter.date = { $gte: startOfDay, $lt: endOfDay };
    }

    // Execute query
    const jobRequests = JobModel.find(filter);

    const { data, error } = await applyAPIFeature(jobRequests, req.query)
    res.status(200).json({
      success: true, message: "Job requests retrieved",
      data: data
    });


    // res.json({ success: true, message: 'Job requests retrieved', data: jobRequests });
  } catch (error) {
    console.error('Error retrieving job requests:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


export const acceptJobRequest = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract job request ID from request parameters
    const { jobId } = req.params;
    const contractorId = req.contractor.id;

    // Find the job request by ID
    const jobRequest = await JobModel.findOne({ _id: jobId, contractor: contractorId, type: JobType.REQUEST });

    // Check if the job request exists
    if (!jobRequest) {
      return res.status(404).json({ success: false, message: 'Job request not found' });
    }


    // Find the job request by ID
    const customer = await CustomerModel.findById(jobRequest.customer);

    // Check if the customer request exists
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }


    // Check if the job request belongs to the contractor
    if (jobRequest.contractor.toString() !== contractorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to accept this job request' });
    }

    // Check if the job request is pending
    if (jobRequest.status !== JOB_STATUS.PENDING) {
      return res.status(403).json({ success: false, message: 'Job request is not pending' });
    }

    // Update the status of the job request to "Accepted"
    jobRequest.status = JOB_STATUS.ACCEPTED;

    // Define the rejection event to be stored in the job history
    const jobEvent = {
      eventType: JOB_STATUS.ACCEPTED,
      timestamp: new Date(),
      details: {
        message: 'Contactor accepted this job'
      },
    };

    // Push the rejection event to the job history array
    jobRequest.jobHistory.push(jobEvent);



    // Create the initial job application
    const quotation = new JobQoutationModel({
      contractor: contractorId,
      job: jobId,
      status: JOB_QUOTATION_STATUS.PENDING, // Assuming initial status is pending
      estimate: [], // You may need to adjust this based on your application schema
      startDate: jobRequest.startDate,
      endDate: jobRequest.endDate,
      siteVerification: false, // Example value, adjust as needed
      processingFee: 0 // Example value, adjust as needed
    });

    // Save the initial job application
    await quotation.save();

    // Associate the job application with the job request
    if (!jobRequest.quotations.includes(quotation.id)) {
      jobRequest.quotations.push(quotation.id);
    }


    await jobRequest.save();


    // Create or update conversation
    const conversationMembers = [
      { memberType: 'customers', member: customer.id },
      { memberType: 'contractors', member: contractorId }
    ];

    const conversation = await ConversationModel.findOneAndUpdate(
      {
        entity: jobId,
        entityType: ConversationEntityType.JOB,
        members: {
          $elemMatch: { $or: [{ member: customer.id }, { member: contractorId }] }
        }
      },

      {
        entity: jobId,
        entityType: ConversationEntityType.JOB,
        members: conversationMembers
      },
      { new: true, upsert: true });

    // Send a message to the customer
    const message = new MessageModel({
      conversation: conversation?._id,
      sender: contractorId,
      receiver: jobRequest.customer,
      message: "Contractor has accepted this jos request",
      messageType: MessageType.ALERT,
    });
    await message.save();


    // Return success response
    res.json({ success: true, message: 'Job request accepted successfully' });
  } catch (error: any) {
    return next(new BadRequestError('Something went wrong', error));
  }
};


export const rejectJobRequest = async (req: any, res: Response) => {
  try {
    // Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract job request ID and rejection reason from request parameters
    const { jobId } = req.params;
    const { rejectionReason } = req.body;
    const contractorId = req.contractor.id;

    // Find the job request by ID
    const jobRequest = await JobModel.findOne({ _id: jobId, contractor: contractorId, type: JobType.REQUEST });

    // Check if the job request exists
    if (!jobRequest) {
      return res.status(404).json({ success: false, message: 'Job request not found' });
    }

    // Check if the job request belongs to the contractor
    if (jobRequest.contractor.toString() !== contractorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to reject this job request' });
    }

    // Check if the job request is pending
    if (jobRequest.status !== JOB_STATUS.PENDING) {
      return res.status(403).json({ success: false, message: 'Job request is not pending' });
    }

    // Update the status of the job request to "Rejected" and set the rejection reason
    jobRequest.status = JOB_STATUS.DECLINED;

    // Define the rejection event to be stored in the job history
    const jobEvent = {
      eventType: JOB_STATUS.DECLINED,
      timestamp: new Date(),
      details: { reason: rejectionReason }, // Store the rejection reason
    };

    // Push the rejection event to the job history array
    jobRequest.jobHistory.push(jobEvent);

    await jobRequest.save();


    // Create or update conversation
    const conversationMembers = [
      { memberType: 'customers', member: jobRequest.customer },
      { memberType: 'contractors', member: contractorId }
    ];

    const conversation = await ConversationModel.findOneAndUpdate(
      {
        entity: jobId,
        entityType: ConversationEntityType.JOB,
        members: {
          $elemMatch: { $or: [{ member: jobRequest.customer }, { member: contractorId }] }
        }
      },

      {
        entity: jobId,
        entityType: ConversationEntityType.JOB,
        members: conversationMembers
      },
      { new: true, upsert: true });

    // Send a message to the customer
    const message = new MessageModel({
      conversation: conversation?._id,
      sender: contractorId,
      receiver: jobRequest.customer,
      message: "Contractor has rejected this jos request",
      messageType: MessageType.ALERT,
    });

    // Return success response
    res.json({ success: true, message: 'Job request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting job request:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



export const getJobRequestById = async (req: any, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { jobId } = req.params;
    const contractorId = req.contractor.id;


    const options = {
      contractorId: contractorId, // Define other options here if needed
      //@ts-ignore
      match: function () {
        //@ts-ignore
        return { _id: { $in: this.quotations }, contractor: options.contractorId };
      }
    };

    const job = await JobModel.findOne({ _id: jobId, contractor: contractorId, type: JobType.REQUEST })
      .populate(['contractor', 'customer', { path: 'myQuotation', options: options }])
      .exec();


    if (!job) {
      return next(new NotFoundError('Job request not found'));
    }

    job.myQuotation = await job.getMyQoutation(jobId, contractorId);

    // Return the job request details
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Error retrieving job request:', error);
    return next(new BadRequestError('Bad Request'));
  }
};



export const getJobListingById = async (req: any, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { jobId } = req.params;
    const contractorId = req.contractor.id;


    const options = {
      contractorId: contractorId, // Define other options here if needed
      //@ts-ignore
      match: function () {
        //@ts-ignore
        return { _id: { $in: this.quotations }, contractor: options.contractorId };
      }
    };

    const job = await JobModel.findOne({ _id: jobId, type: JobType.LISTING })
      .populate(['contractor', 'customer', { path: 'myQuotation', options: options }])
      .exec();




    if (!job) {
      return next(new NotFoundError('Job listing not found'));
    }

    job.myQuotation = await job.getMyQoutation(jobId, contractorId);


    // Return the job request details
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Error retrieving job listing:', error);
    return next(new BadRequestError('Bad Request'));
  }
};



//contractor send job quatation /////////////
export const sendJobQuotation = async (
  req: any,
  res: Response,
  next: NextFunction
) => {

  try {
    const {
      startDate,
      endDate,
      siteVisit,
      estimates,
    } = req.body;

    const { jobId } = req.params
    const contractorId = req.contractor.id


    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const contractor = await ContractorModel.findOne({ _id: contractorId });
    if (!contractor) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const job = await JobModel.findOne({ _id: jobId }).sort({ createdAt: -1 })
    if (!job) {
      return res
        .status(401)
        .json({ message: "job does not exist" });
    }

    if (estimates && estimates.length < 1) {
      return res
        .status(401)
        .json({ message: "invalid estimate format" });
    }

    const customer = await CustomerModel.findOne({ _id: job.customer })
    if (!customer) {
      return res
        .status(401)
        .json({ message: "invalid customer Id" });
    }

    
    let jobQuotation = await JobQoutationModel.findOneAndUpdate({ job: jobId, contractor: contractorId }, {
      startDate,
      endDate,
      siteVisit,
      estimates,
      jobId,
      contractorId
    }, { new: true, upsert: true })


    jobQuotation.charges = await jobQuotation.calculateCharges();

    if (!job.quotations.includes(jobQuotation.id)) {
      job.quotations.push(jobQuotation.id);
    }


    if (job.type == JobType.REQUEST) {
      // Update the status of the job request to "Accepted"
      job.status = JOB_STATUS.ACCEPTED;

      // Define the acceptance event to be stored in the job history
      const jobEvent = {
        eventType: JOB_STATUS.ACCEPTED,
        timestamp: new Date(),
        details: {
          message: 'Contactor accepted this job'
        },
      };
      // Push the acceptance event to the job history array
      if (!job.jobHistory.some( jobEvent =>  jobEvent.eventType == JOB_STATUS.ACCEPTED  )) {
        job.jobHistory.push(jobEvent);
      }

    }


    await job.save()

    

    // Create or update conversation and send message to customer
    const conversationMembers = [
      { memberType: 'customers', member: customer.id },
      { memberType: 'contractors', member: contractorId }
    ];

    const conversation = await ConversationModel.findOneAndUpdate(
      {
        entity: jobId,
        entityType: ConversationEntityType.JOB,
        members: {
          $elemMatch: { $or: [{ member: customer.id }, { member: contractorId }] }
        }
      },

      {
        entity: jobId,
        entityType: ConversationEntityType.JOB,
        members: conversationMembers
      },
      { new: true, upsert: true });

    await MessageModel.create({
      conversation: conversation.id,
      sender: contractorId,
      receiver: customer.id,
      message: "I am available for this Job",
      messageType: MessageType.TEXT,
    });
   


    // DO OTHER THINGS HERE

    if(estimates){
      // @ts-ignore
      const html = htmlJobQoutationTemplate(customer.firstName, contractor.name)
      EmailService.send(customer.email, 'Job quotation from contractor', html)

      await MessageModel.create({
        conversation: conversation.id,
        sender: contractorId,
        receiver: customer.id,
        message: "Please see attached estimate",
        messageType: MessageType.ALERT,
      });


    }

    if(siteVisit){
      //send message alert indicating that contractor has requested for site visit
      await MessageModel.create({
        conversation: conversation.id,
        sender: contractorId,
        receiver: customer.id,
        message: "Contractor requested for site visit",
        messageType: MessageType.ALERT,
      });

    }



    res.json({
      success: true,
      message: "job quotation sucessfully sent",
      data: jobQuotation
    });

  } catch (err: any) {
    return next(new BadRequestError('An error occured ', err))
  }

}


export const getQuotationForJob = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const contractorId = req.contractor.id

    // Check if the jobId and contractorId are provided
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID  are required' });
    }

    // Find the job application for the specified job and contractor
    const jobQuotation = await JobQoutationModel.findOne({ job:jobId, contractor:contractorId });

    // Check if the job application exists
    if (!jobQuotation) {
      return res.status(404).json({ success: false, message: 'Job quotation not found' });
    }

    jobQuotation.charges = await jobQuotation.calculateCharges()

    res.status(200).json({ success: true, message: 'Job quotation retrieved successfully', data: jobQuotation });
  } catch (error: any) {
    return next(new BadRequestError('An error occured ', error))
  }
};


export const updateJobQuotation = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const contractorId = req.contractor.id

    // Check if the jobId and contractorId are provided
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is missing from params' });
    }

    const { startDate, endDate, siteVisit, estimates } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the job application for the specified job and contractor
    let job = await JobModel.findById(jobId);

    // If the job application does not exist, create a new one
    if (!job) {
      return res.status(400).json({ status: false, message: 'Job not found' });
    }


    // Find the job application for the specified job and contractor
    let jobQuotation = await JobQoutationModel.findOne({ job: jobId, contractor: contractorId });

    // If the job application does not exist, create a new one
    if (!jobQuotation) {
      jobQuotation = new JobQoutationModel({ jobId, contractorId });
    }

    // Update the job application fields
    jobQuotation.startDate = startDate;
    jobQuotation.endDate = endDate;
    jobQuotation.siteVisit = siteVisit;
    jobQuotation.estimates = estimates;

    // Save the updated job application

    await jobQuotation.save();

    jobQuotation.charges = await jobQuotation.calculateCharges()


    // Create or update conversation
    const conversationMembers = [
      { memberType: 'customers', member: job.customer },
      { memberType: 'contractors', member: contractorId }
    ];

    const conversation = await ConversationModel.findOneAndUpdate(
      {
        entity: jobId,
        entityType: ConversationEntityType.JOB,
        members: {
          $elemMatch: { $or: [{ member: job.customer }, { member: contractorId }] }
        }
      },

      {
        entity: jobId,
        entityType: ConversationEntityType.JOB,
        members: conversationMembers
      },
      { new: true, upsert: true });


    // Send a message to the customer
    const message = new MessageModel({
      conversation: conversation?._id,
      sender: contractorId,
      receiver: job.customer,
      message: "Contractor has edited job estimate",
      messageType: MessageType.ALERT,
    });


    res.status(200).json({ success: true, message: 'Job application updated successfully', data: jobQuotation });
  } catch (error: any) {
    return next(new BadRequestError('An error occured ', error))
  }
};


type PipelineStage =
  | MongoosePipelineStage
  | { $lookup: { from: string; localField: string; foreignField: string; as: string, pipeline?: any } }
  | { $unwind: string | { path: string; includeArrayIndex?: string; preserveNullAndEmptyArrays?: boolean } }
  | { $match: any }
  | { $addFields: any }
  | { $project: any }
  | { $sort: { [key: string]: 1 | -1 } }
  | { $group: any };


export const getJobListings = async (req: any, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extract query parameters
    let {
      distance,
      latitude,
      longitude,
      emergency,
      category,
      city,
      country,
      address,
      startDate,
      endDate,
      page = 1, // Default to page 1
      limit = 10, // Default to 10 items per page
      sort // Sort field and order (-fieldName or fieldName)
    } = req.query;

    limit = limit > 0 ? parseInt(limit) : 10; // Handle null limit

    // Construct aggregation pipeline
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "job_applications",
          localField: "_id",
          foreignField: "job",
          as: "totalQuotations"
        }
      },
      {
        $addFields: {
          totalQuotations: { $size: "$totalQuotations" }
        }
      }
    ];

    // Match job listings based on query parameters

    pipeline.push({ $match: { type: JobType.LISTING } });
    pipeline.push({ $match: { status: JOB_STATUS.PENDING } });

    if (category) {
      pipeline.push({ $match: { category: { $regex: new RegExp(category, 'i') } } });
    }
    if (country) {
      pipeline.push({ $match: { 'location.country': { $regex: new RegExp(country, 'i') } } });
    }
    if (city) {
      pipeline.push({ $match: { 'location.city': { $regex: new RegExp(city, 'i') } } });
    }
    if (address) {
      pipeline.push({ $match: { 'location.address': { $regex: new RegExp(address, 'i') } } });
    }
    if (emergency !== undefined) {
      pipeline.push({ $match: { emergency: emergency === "true" } });

    }

    if (startDate && endDate) {
      pipeline.push({
        $match: {
          date: {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string)
          }
        }
      });
    }


    if (distance && latitude && longitude) {
      pipeline.push({
        $addFields: {
          distance: {
            $sqrt: {
              $sum: [
                { $pow: [{ $subtract: [{ $toDouble: "$location.latitude" }, parseFloat(latitude)] }, 2] },
                { $pow: [{ $subtract: [{ $toDouble: "$location.longitude" }, parseFloat(longitude)] }, 2] }
              ]
            }
          }
        }
      });
      pipeline.push({ $match: { "distance": { $lte: parseInt(distance) } } });
    }

    // Add sorting stage if specified
    if (sort) {
      const [sortField, sortOrder] = sort.startsWith('-') ? [sort.slice(1), -1] : [sort, 1];
      const sortStage: PipelineStage = {
        //@ts-ignore
        $sort: { [sortField]: sortOrder }
      };
      pipeline.push(sortStage);
    }



    // Pagination stages
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Add $facet stage for pagination
    pipeline.push({
      $facet: {
        metadata: [
          { $count: "totalItems" },
          { $addFields: { page, limit, currentPage: parseInt(page), lastPage: { $ceil: { $divide: ["$totalItems", parseInt(limit)] } } } }
        ],
        data: [{ $skip: skip }, { $limit: parseInt(limit) }]
      }
    });


    // Execute aggregation pipeline

    const result = await JobModel.aggregate(pipeline); // Assuming Contractor is your Mongoose model
    const jobs = result[0].data;
    const metadata = result[0].metadata[0];

    // Send response with job listings data
    res.status(200).json({ success: true, data: { ...metadata, data: jobs } });
  } catch (error: any) {
    return next(new BadRequestError('An error occured ', error))
  }
};


// //contractor send job quatation two /////////////
// export const contractorSendJobQuatationControllerTwo = async (
//   req: any,
//   res: Response,
// ) => {

//   try {
//     const {  
//       jobId,
//       materialDetail,
//       totalcostMaterial,
//       workmanShip
//     } = req.body;

//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }


//     const contractor =  req.contractor;
//     const contractorId = contractor.id

//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});

//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }

//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })

//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }

//     const customer = await CustomerRegModel.findOne({_id: job.customerId})

//     if (!customer) {

//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }

//     let totalQuatation = totalcostMaterial + workmanShip

//     let companyCharge = 0

//     if (totalQuatation <= 1000) {
//       companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
//     }else if (totalQuatation <=  5000){
//       companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
//     }else{
//       companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
//     }

//     const gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));

//     const totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
//     const totalAmountContractorWithdraw = totalQuatation + gst;

//     const qoute = {
//       materialDetail,
//       totalcostMaterial,
//       workmanShip
//     };

//     job.qoute = qoute,
//     job.gst = gst
//     job.totalQuatation = totalQuatation
//     job.companyCharge = companyCharge
//     job.totalAmountCustomerToPaid =  parseFloat(totalAmountCustomerToPaid.toFixed(2));

//     job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2))

//     job.status = "sent qoutation";

//     await job.save()

//     const html = htmlJobQoutationTemplate(customer.firstName, contractorExist.firstName)

//     let emailData = {
//       emailTo: customer.email,
//       subject: "Job qoutetation from artisan",
//       html
//     };

//     await sendEmail(emailData);

//     res.json({  
//       message: "job qoutation sucessfully sent"
//    });

//   } catch (err: any) {
//     // signup error

//     console.log("error", err)
//     res.status(500).json({ message: err.message });

//   }

// }


// //contractor send job quatation three [one by one] /////////////
// export const contractorSendJobQuatationControllerThree = async (
//   req: any,
//   res: Response,
// ) => {

//   try {
//     const {  
//       jobId,
//       material,
//       qty,
//       rate,
//       //tax,
//       amount,
//     } = req.body;

//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const contractor =  req.contractor;
//     const contractorId = contractor.id

//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});

//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }

//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })

//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }

//     const customer = await CustomerRegModel.findOne({_id: job.customerId})

//     if (!customer) {

//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }

//     const qouteObj = {
//       material,
//       qty,
//       rate,
//       //tax,
//       amount,
//     }

//     const dbQoute = job.quate;

//     const newQoute = [...dbQoute, qouteObj]

//     job.quate = newQoute;

//     await job.save()

//     // const html = htmlJobQoutationTemplate(customer.fullName, contractorExist.firstName)

//     // let emailData = {
//     //   emailTo: customer.email,
//     //   subject: "Job qoutetation from artisan",
//     //   html
//     // };

//     // await sendEmail(emailData);

//     res.json({  
//       message: "job qoutation sucessfully enter"
//    });

//   } catch (err: any) {
//     // signup error

//     console.log("error", err)
//     res.status(500).json({ message: err.message });

//   }

// }



// //contractor remove job quatation one by one five [romove one by one] /////////////
// export const contractorRemoveobQuatationOneByOneControllerfive = async (
//   req: any,
//   res: Response,
// ) => {

//   try {
//     const {  
//       jobId,
//       material,
//       qty,
//       rate,
//       //tax,
//       amount,
//     } = req.body;

//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const contractor =  req.contractor;
//     const contractorId = contractor.id

//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});

//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }

//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })

//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }

//     const customer = await CustomerRegModel.findOne({_id: job.customerId})

//     if (!customer) {

//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }

//     if (job.quate.length < 1) {
//       return res
//         .status(401)
//         .json({ message: "please add atleast one qoutation" });
//     }

//     const qouteObj = {
//       material,
//       qty,
//       rate,
//       //tax,
//       amount,
//     }

//     let newQoute = []
//     for (let i = 0; i < job.quate.length; i++) {
//       const qoute = job.quate[i];

//       const dbQoute = {
//         material: qoute.material,
//         qty: qoute.qty,
//         rate: qoute.rate,
//         //tax: qoute.tax,
//         amount: qoute.amount,
//       }

//       const compareQoute = await areObjectsEqual(dbQoute, qouteObj)

//       if (compareQoute) continue

//       newQoute.push(qoute)

//     }

//     job.quate = newQoute;

//     await job.save()

//     res.json({  
//       message: "job qoutation sucessfully remove"
//    });

//   } catch (err: any) {
//     // signup error

//     console.log("error", err)
//     res.status(500).json({ message: err.message });

//   }

// }



// //contractor send job quatation four [complete] /////////////
// export const contractorSendJobQuatationControllerFour = async (
//   req: any,
//   res: Response,
// ) => {

//   try {
//     const {  
//       jobId,
//       workmanShip
//     } = req.body;

//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     console.log(1);

//     const contractor =  req.contractor;
//     const contractorId = contractor.id

//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});

//     console.log(2);

//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }

//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })

//     console.log(3);

//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }

//     console.log(4);

//     const customer = await CustomerRegModel.findOne({_id: job.customerId})

//     if (!customer) {

//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }


//     if (job.quate.length < 1) {
//       return res
//         .status(401)
//         .json({ message: "please add atleast one qoutation" });
//     }

//     console.log(5);

//     let totalQuatation = 0
//     for (let i = 0; i < job.quate.length; i++) {
//       const quatation = job.quate[i];

//       totalQuatation = totalQuatation + quatation.amount
//     }

//     totalQuatation = totalQuatation + workmanShip;

//     let companyCharge = 0

//     if (totalQuatation <= 1000) {
//       companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
//     }else if (totalQuatation <=  5000){
//       companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
//     }else{
//       companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
//     }

//     const gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));

//     const totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
//     const totalAmountContractorWithdraw = totalQuatation + gst;

//     console.log(6);

//     job.workmanShip = workmanShip

//     job.gst = gst
//     job.totalQuatation = totalQuatation
//     job.companyCharge = companyCharge
//     job.totalAmountCustomerToPaid =  parseFloat(totalAmountCustomerToPaid.toFixed(2));

//     job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2))

//     job.status = "sent qoutation";

//     await job.save()

//     console.log(7);

//     const html = htmlJobQoutationTemplate(customer.firstName, contractorExist.firstName)

//     let emailData = {
//       emailTo: customer.email,
//       subject: "Job qoutetation from artisan",
//       html
//     };

//     console.log(8);

//     //await sendEmail(emailData);

//     console.log(9);

//     res.json({  
//       message: "job qoutation sucessfully sent"
//    });

//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }

// }




// //contractor get job qoutation sent to artisan  /////////////
// export const contractorGetQuatationContractorController = async (
//     req: any,
//     res: Response,
//   ) => {

//     try {
//       const {  

//       } = req.body;

//       // Check for validation errors
//       const errors = validationResult(req);

//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }


//       const contractor =  req.contractor;
//       const contractorId = contractor.id

//       //get user info from databas
//       const contractorExist = await ContractorModel.findOne({_id: contractorId});

//       if (!contractorExist) {
//         return res
//           .status(401)
//           .json({ message: "invalid credential" });
//       }

//       const jobRequests = await JobModel.find({contractorId, status: 'sent qoutation'}).sort({ createdAt: -1 })

//       let jobRequested = []

//       for (let i = 0; i < jobRequests.length; i++) {
//         const jobRequest = jobRequests[i];

//         const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

//         const obj = {
//           job: jobRequest,
//           customer
//         }

//         jobRequested.push(obj)

//       }

//       res.json({  
//         jobRequested
//      });

//     } catch (err: any) {
//       // signup error
//       res.status(500).json({ message: err.message });
//     }

// }



// //contractor get job qoutation payment comfirm and job in progress /////////////
// export const contractorGetQuatationPaymentComfirmAndJobInProgressController = async (
//   req: any,
//   res: Response,
// ) => {

//   try {
//     const {  

//     } = req.body;

//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }


//     const contractor =  req.contractor;
//     const contractorId = contractor.id

//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});

//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }

//     const jobRequests = await JobModel.find({contractorId, status: 'qoutation payment confirm and job in progress'}).sort({ createdAt: -1 })

//     let jobRequested = []

//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];

//       const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

//       const obj = {
//         job: jobRequest,
//         customer
//       }

//       jobRequested.push(obj)

//     }

//     res.json({  
//       jobRequested
//    });

//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }

// }



// //contractor reject job Request /////////////
// export const contractorRejectJobRequestController = async (
//   req: any,
//   res: Response,
// ) => {

//   try {
//     const {  
//       jobId,
//       rejectedReason,
//     } = req.body;

//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }


//     const contractor =  req.contractor;
//     const contractorId = contractor.id

//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});

//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }

//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })

//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }

//     const customer = await CustomerRegModel.findOne({_id: job.customerId})

//     if (!customer) {

//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }

//     job.rejected = true;
//     job.rejectedReason = rejectedReason;
//     job.status = "job reject";

//     await job.save()

//     // const html = contractorSendJobQuatationSendEmailHtmlMailTemplate(contractorExist.firstName, customer.fullName)

//     // let emailData = {
//     //   emailTo: customer.email,
//     //   subject: "Job qoutetation from artisan",
//     //   html
//     // };

//     // await sendEmail(emailData);

//     res.json({  
//       message: "you sucessfully rejected job request"
//    });

//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }

// }



// //contractor get job he rejected /////////////
// export const contractorGeJobRejectedController = async (
//   req: any,
//   res: Response,
// ) => {

//   try {
//     const {  

//     } = req.body;

//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }


//     const contractor =  req.contractor;
//     const contractorId = contractor.id

//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});

//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }

//     const jobRequests = await JobModel.find({contractorId, status: 'job reject'}).sort({ createdAt: -1 })

//     let jobRequested = []

//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];

//       const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

//       const obj = {
//         job: jobRequest,
//         customer
//       }

//       jobRequested.push(obj)

//     }

//     res.json({  
//       jobRequested
//    });

//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }

// }


// //contractor get job history /////////////
// export const contractorGeJobHistoryController = async (
//   req: any,
//   res: Response,
// ) => {

//   try {
//     const {  

//     } = req.body;

//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }


//     const contractor =  req.contractor;
//     const contractorId = contractor.id

//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});

//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }

//     const jobRequests = await JobModel.find({contractorId,}).sort({ createdAt: -1 })

//     let jobHistory = []

//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];

//       const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

//       const obj = {
//         job: jobRequest,
//         customer
//       }

//       jobHistory.push(obj)

//     }

//     res.json({  
//       jobHistory
//    });

//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }

// }





// //contractor complete job /////////////
// export const contractorCompleteJobController = async (
//   req: any,
//   res: Response,
// ) => {

//   try {
//     const {  
//       jobId,
//     } = req.body;

//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }


//     const contractor =  req.contractor;
//     const contractorId = contractor.id

//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});

//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }

//     const job = await JobModel.findOne({_id: jobId,contractorId, status: 'qoutation payment confirm and job in progress'}).sort({ createdAt: -1 })

//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }

//     const customer = await CustomerRegModel.findOne({_id: job.customerId})

//     if (!customer) {

//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }

//     // check the time of job is reach
//     const currentTime = new Date().getTime()

//     const jobTime = job.time.getTime()

//    if (currentTime > jobTime) {
//        return res.status(400).json({ message: "Not yet job day" });
//    }

//     job.status = "completed";
//     await job.save()

//     //admin notification
//     const adminNotic = new AdminNoficationModel({
//       title: "Contractor Job Completed",
//       message: `${job._id} - ${contractorExist.firstName} has updated this job to completed.`,
//       status: "unseen"
//     })

//       await adminNotic.save();

//     res.json({  
//       message: "you sucessfully complete this job, wait for comfirmation from customer"
//    });

//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }

// }




// //contractor get job completed /////////////
// export const contractorGeJobCompletedController = async (
//   req: any,
//   res: Response,
// ) => {

//   try {
//     const {  

//     } = req.body;

//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }


//     const contractor =  req.contractor;
//     const contractorId = contractor.id

//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});

//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }

//     const jobRequests = await JobModel.find({contractorId, status: 'completed'}).sort({ createdAt: -1 })

//     let jobRequested = []

//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];

//       const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

//       const obj = {
//         job: jobRequest,
//         customer
//       }

//       jobRequested.push(obj)

//     }

//     res.json({  
//       jobRequested
//    });

//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }

// }



// //contractor get job completed and comfirm by customer /////////////
// export const contractorGeJobComfirmController = async (
//   req: any,
//   res: Response,
// ) => {

//   try {
//     const {  

//     } = req.body;

//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }


//     const contractor =  req.contractor;
//     const contractorId = contractor.id

//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});

//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }

//     const jobRequests = await JobModel.find({contractorId, status: 'comfirmed'}).sort({ createdAt: -1 })

//     let jobRequested = []

//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];

//       const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

//       const obj = {
//         job: jobRequest,
//         customer
//       }

//       jobRequested.push(obj)

//     }

//     res.json({  
//       jobRequested
//    });

//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }

// }




// //contractor get job completed and complain by customer /////////////
// export const contractorGeJobComplainController = async (
//   req: any,
//   res: Response,
// ) => {

//   try {
//     const {  

//     } = req.body;

//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }


//     const contractor =  req.contractor;
//     const contractorId = contractor.id

//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});

//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }

//     const jobRequests = await JobModel.find({contractorId, status: 'complain'}).sort({ createdAt: -1 })

//     let jobRequested = []

//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];

//       const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

//       const obj = {
//         job: jobRequest,
//         customer
//       }

//       jobRequested.push(obj)

//     }

//     res.json({  
//       jobRequested
//    });

//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }

// }


// const areObjectsEqual = async (obj1: any, obj2: any): Promise<boolean> => {
//   const keys1 = Object.keys(obj1).sort();
//   const keys2 = Object.keys(obj2).sort();

//   if (keys1.length !== keys2.length) {
//     return false;
//   }

//   for (const key of keys1) {
//     if (obj1[key] !== obj2[key]) {
//       return false;
//     }
//   }

//   return true;
// }


export const ContractorJobController = {
  getJobRequests,
  getJobListings,
  getJobRequestById,
  rejectJobRequest,
  acceptJobRequest,
  sendJobQuotation,
  getQuotationForJob,
  updateJobQuotation,
  getJobListingById
}




