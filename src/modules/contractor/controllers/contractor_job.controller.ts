import { validationResult } from "express-validator";
import { NextFunction, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { JobModel, JOB_STATUS, JobType } from "../../../database/common/job.model";
import { applyAPIFeature } from "../../../utils/api.feature";
import { BadRequestError, InternalServerError, NotFoundError } from "../../../utils/custom.errors";
import { JobQuotationModel, JOB_QUOTATION_STATUS, IExtraEstimate, JOB_QUOTATION_TYPE } from "../../../database/common/job_quotation.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import mongoose, { PipelineStage as MongoosePipelineStage } from 'mongoose'; // Import Document type from mongoose
import { ConversationModel } from "../../../database/common/conversations.schema";
import { MessageModel, MessageType } from "../../../database/common/messages.schema";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { ConversationEvent, JobEvent } from "../../../events";
import { JobEnquiryModel } from "../../../database/common/job_enquiry.model";
import ContractorSavedJobModel from "../../../database/contractor/models/contractor_saved_job.model";
import { ConversationUtil } from "../../../utils/conversation.util";
import { JobUtil } from "../../../utils/job.util";
import { PAYMENT_TYPE } from "../../../database/common/payment.schema";


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
    const contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId })


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
    if (data) {

      await Promise.all(data.data.map(async (job: any) => {
        if (contractorProfile) {
          const lat = Number(contractorProfile.location.latitude ?? 0)
          const lng = Number(contractorProfile.location.longitude ?? 0)
          job.distance = await job.getDistance(lat, lng);
        }

      }));
    }


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
    const contractor = await ContractorModel.findById(contractorId);
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor not found' });
    }

    // Find the job request by ID
    const job = await JobModel.findOne({ _id: jobId, contractor: contractorId, type: JobType.REQUEST });

    // Check if the job request exists
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job request not found' });
    }


    // Find the job request by ID
    const customer = await CustomerModel.findById(job.customer);

    // Check if the customer request exists
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }


    // Check if the job request belongs to the contractor
    if (job.contractor.toString() !== contractorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to accept this job request' });
    }

    // Check if the job request is pending
    if (job.status !== JOB_STATUS.PENDING) {
      return res.status(403).json({ success: false, message: 'Job request is not pending' });
    }



    // Update the status of the job request to "Accepted"
    job.status = JOB_STATUS.ACCEPTED;

    // Define the rejection event to be stored in the job history
    const jobEvent = {
      eventType: JOB_STATUS.ACCEPTED,
      timestamp: new Date(),
      payload: {
        message: 'Contactor accepted this job'
      },
    };

    // Push the rejection event to the job history array
    job.jobHistory.push(jobEvent);


    await job.save();


    // Send a message to the customer
    const conversation = await ConversationUtil.updateOrCreateConversation(job.customer, 'customers', contractorId, 'contractors')
    const message = new MessageModel({
      conversation: conversation?._id,
      sender: contractorId,
      senderType: 'contractors',
      receiver: job.customer,
      message: "Job request accepted",
      messageType: MessageType.ALERT,
      entity: job.id,
      entityType: 'jobs'
    });
    await message.save();

    ConversationEvent.emit('NEW_MESSAGE', { message })
    JobEvent.emit('JOB_REQUEST_ACCEPTED', { job });


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
    const job = await JobModel.findOne({ _id: jobId, contractor: contractorId, type: JobType.REQUEST });

    // Check if the job request exists
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job request not found' });
    }

    // Check if the job request belongs to the contractor
    if (job.contractor.toString() !== contractorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to reject this job request' });
    }

    // Check if the job request is pending
    if (job.status !== JOB_STATUS.PENDING) {
      return res.status(403).json({ success: false, message: 'Job request is not pending' });
    }

    // Update the status of the job request to "Rejected" and set the rejection reason
    job.status = JOB_STATUS.DECLINED;

    // Define the rejection event to be stored in the job history
    const jobEvent = {
      eventType: JOB_STATUS.DECLINED,
      timestamp: new Date(),
      payload: { reason: rejectionReason }, // Store the rejection reason
    };

    // Push the rejection event to the job history array
    job.jobHistory.push(jobEvent);

    await job.save();


    // Create a message in the conversation
    const conversation = await ConversationUtil.updateOrCreateConversation(job.customer, 'customers', contractorId, 'contractors')

    // Send a message to the customer
    const message = new MessageModel({
      conversation: conversation?._id,
      sender: contractorId,
      senderType: 'contractors',
      receiver: job.customer,
      message: "Job request rejected",
      messageType: MessageType.ALERT,
      entity: job.id,
      entityType: 'jobs'
    });

    ConversationEvent.emit('NEW_MESSAGE', { message })
    JobEvent.emit('JOB_REQUEST_REJECTED', { job });

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
    const contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId })

    const options = {
      contractorId: contractorId, // Define other options here if needed
      //@ts-ignore
      match: function () {
        //@ts-ignore
        return { _id: { $in: this.quotations }, contractor: options.contractorId };
      }
    };

    const job = await JobModel.findOne({
      _id: jobId, $or: [
        { contractor: contractorId },
        { 'assignment.contractor': contractorId }
      ], type: JobType.REQUEST
    })
      .populate(['contractor', 'customer', 'assignment.contractor'])
      .exec();


    if (!job) {
      return next(new NotFoundError('Job request not found'));
    }

    job.myQuotation = await job.getMyQuotation(contractorId);
    if (contractorProfile) {
      const lat = Number(contractorProfile.location.latitude ?? 0)
      const lng = Number(contractorProfile.location.longitude ?? 0)
      job.distance = await job.getDistance(lat, lng);
    }

    job.totalEnquires = await job.getTotalEnquires() as number
    job.hasUnrepliedEnquiry = await job.getHasUnrepliedEnquiry() as boolean
    job.isSaved = await job.getIsSaved(contractorId) as boolean

    // Return the job request payload
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
    const contractorId = req?.contractor?.id;
    const contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId })


    const options = {
      contractorId: contractorId, // Define other options here if needed
      //@ts-ignore
      match: function () {
        //@ts-ignore
        return { _id: { $in: this.quotations }, contractor: options.contractorId };
      }
    };

    const job = await JobModel.findOne({ _id: jobId, type: JobType.LISTING })
      .populate(['contractor', 'assignment.contractor', 'customer', { path: 'myQuotation', options: options }])
      .exec();


    if (!job) {
      return next(new NotFoundError('Job listing not found'));
    }

    job.myQuotation = await job.getMyQuotation(contractorId);

    if (contractorProfile) {
      const lat = Number(contractorProfile.location.latitude ?? 0)
      const lng = Number(contractorProfile.location.longitude ?? 0)
      job.distance = await job.getDistance(lat, lng);
    }


    job.totalEnquires = await job.getTotalEnquires() as number
    job.hasUnrepliedEnquiry = await job.getHasUnrepliedEnquiry() as boolean
    job.isSaved = await job.getIsSaved(contractorId) as boolean


    // Return the job request payload
    res.json({ success: true, data: job });
  } catch (error: any) {
    return next(new InternalServerError('Internal Server Error', error));
  }
};


export const hideJobListing = async (req: any, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { jobId } = req.params;
    const contractorId = req.contractor.id;


    const job = await JobModel.findById(jobId)

    if (!job) {
      return next(new NotFoundError('Job listing not found'));
    }

    if (!job.hideFrom.includes(contractorId)) {
      job.hideFrom.push(contractorId);
    }

    await job.save();


    // Return the job request payload
    res.json({ success: true, message: 'Job removed from listing successfully', data: job });
  } catch (error) {
    console.error('Error retrieving job listing:', error);
    return next(new BadRequestError('Bad Request'));
  }
};


export const sendJobQuotation = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = req.params;
    const contractorId = req.contractor.id;
    let { startDate, endDate, siteVisit, estimatedDuration, estimates = [] } = req.body;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Retrieve contractor and job payload
    const [contractor, job] = await Promise.all([
      ContractorModel.findById(contractorId),
      JobModel.findById(jobId).sort({ createdAt: -1 })
    ]);

    if (!contractor || !job) {
      return res.status(401).json({ message: "Invalid credential or job does not exist" });
    }

    const customer = await CustomerModel.findOne({ _id: job.customer })
    if (!customer) {
      return res
        .status(401)
        .json({ message: "invalid customer Id" });
    }


    // Check if previous quotation was declined
    const previousQuotation = await JobQuotationModel.findOne({ job: jobId, contractor: contractorId });
    if (previousQuotation && previousQuotation.status === JOB_QUOTATION_STATUS.DECLINED) {
      return res.status(400).json({ success: false, message: "You cannot apply again since your previous quotation was declined" });
    }



    // Check maximum number of applied quotations
    const appliedQuotationsCount = await JobQuotationModel.countDocuments({
      job: jobId,
      status: { $ne: JOB_QUOTATION_STATUS.DECLINED }
    });
    if (appliedQuotationsCount >= 3) {
      return res.status(400).json({ success: false, message: "Maximum number of contractors already applied for this job" });
    }

    // Check if contractor already submitted a quotation for this job
    const quotation = await JobQuotationModel.findOne({ job: jobId, contractor: contractorId });
    if (quotation) {
      return res.status(400).json({ success: false, message: "You have already submitted a quotation for this job" });
    }



    const scheduleStartDate = startDate ? new Date(startDate) : new Date()
    const scheduleEndDate = endDate ? new Date(startDate) : null
    const scheduleSiteVisitDate = siteVisit ? new Date(siteVisit) : null

    // Create or update job quotation
    let jobQuotation = await JobQuotationModel.findOneAndUpdate(
      { job: jobId, contractor: contractorId },
      { startDate: scheduleStartDate, endDate: scheduleEndDate, siteVisit: scheduleSiteVisitDate, estimates, jobId, contractorId, estimatedDuration },
      { new: true, upsert: true }
    );

    // Prepare estimates
    if (siteVisit) {
      const siteVisitEstimate = {
        isPaid: false,
        date: new Date(),
        estimates: [{ description: 'Site Visit', amount: 100, rate: 100, quantity: 1 }]
      };
      jobQuotation.siteVisitEstimate = siteVisitEstimate as IExtraEstimate;
      jobQuotation.type = JOB_QUOTATION_TYPE.SITE_VISIT
    }


    // Add job quotation to job's list of quotations
    if (!job.quotations.some(quotation => quotation.id === jobQuotation.id)) {
      job.quotations.push({ id: jobQuotation.id, status: jobQuotation.status, contractor: contractorId });
    }

    // Update job status and history if needed
    if (job.type === JobType.REQUEST) {
      job.status = JOB_STATUS.SUBMITTED;
      if (!job.jobHistory.some(jobEvent => jobEvent.eventType === JOB_STATUS.SUBMITTED)) {
        job.jobHistory.push({ eventType: JOB_STATUS.ACCEPTED, timestamp: new Date(), payload: { message: 'Contractor accepted this job' } });
      }
    }


    // Calculate response time
    const jobCreationTime = new Date(job.createdAt);
    const quotationTime = new Date();
    const responseTimeJob = (quotationTime.getTime() - jobCreationTime.getTime()) / 1000; // time difference in seconds

    jobQuotation.responseTime = responseTimeJob


    // Save changes to the job
    await job.save();
    await jobQuotation.save()
    // Do other actions such as sending emails or notifications...


    // Create or update conversation
    const conversationMembers = [
      { memberType: 'customers', member: job.customer },
      { memberType: 'contractors', member: contractorId }
    ];
    const conversation = await ConversationModel.findOneAndUpdate(
      {
        $and: [
          { members: { $elemMatch: { member: job.customer } } },
          { members: { $elemMatch: { member: contractorId } } }
        ]
      },

      {
        members: conversationMembers,
      },
      { new: true, upsert: true });


    // Send a message to the customer
    const message = new MessageModel({
      conversation: conversation?._id,
      sender: contractorId,
      senderType: 'contractors',
      receiver: job.customer,
      message: "Job estimate submitted",
      messageType: MessageType.FILE,
      entity: jobQuotation.id,
      entityType: 'quotations',
      payload: {
        job: job.id,
        quotation: jobQuotation.id,
        quotationType: jobQuotation.type,
        JobType: job.type
      }
    });
    await message.save();


    JobEvent.emit('NEW_JOB_QUOTATION', { job, quotation: jobQuotation });
    ConversationEvent.emit('NEW_MESSAGE', { message })


    res.json({
      success: true,
      message: "Job quotation successfully sent",
      data: jobQuotation
    });

  } catch (err: any) {
    return next(new InternalServerError('Error sending job quotation', err));
  }
};



export const sendChangeOrderEstimate = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = req.params;
    const contractorId = req.contractor.id;
    let { estimates = [] } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const [contractor, job] = await Promise.all([
      ContractorModel.findById(contractorId),
      JobModel.findById(jobId).sort({ createdAt: -1 })
    ]);

    if (!contractor || !job) {
      return res.status(401).json({ message: "Invalid credential or job does not exist" });
    }

    const customer = await CustomerModel.findOne({ _id: job.customer });
    if (!customer) {
      return res.status(401).json({ message: "Invalid customer ID" });
    }

    const quotation = await JobQuotationModel.findOne({ _id: job.contract, job: jobId });
    if (!quotation) {
      return res.status(400).json({ success: false, message: "You don't have access to send extra job quotation" });
    }

    if (!job.isChangeOrder) {
      return res.status(400).json({ success: false, message: "Customer has not enabled change order" });
    }

    const changeOrderEstimate = {
      estimates,
      isPaid: false,
      date: new Date()
    };

    quotation.changeOrderEstimate = changeOrderEstimate as IExtraEstimate;

    quotation.charges = await quotation.calculateCharges();

    job.jobHistory.push({ eventType: 'CHANGE_ORDER_ESTIMATE_SUBMITTED', timestamp: new Date(), payload: { ...changeOrderEstimate } });

    job.isChangeOrder = false;
    await job.save();
    await quotation.save();

    JobEvent.emit('CHANGE_ORDER_ESTIMATE_SUBMITTED', { job, quotation });

    res.json({
      success: true,
      message: "Job change order quotation successfully sent",
      data: quotation
    });

  } catch (err: any) {
    return next(new BadRequestError('An error occurred', err));
  }
};


export const getQuotationForJob = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const contractorId = req.contractor.id

    // Check if the jobId and contractorId are provided
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID  are required' });
    }

    // Find the job application for the specified job and contractor
    const quotation = await JobQuotationModel.findOne({ job: jobId, contractor: contractorId });

    // Check if the job application exists
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'You have not submitted quotation for this job' });
    }

    if (quotation.changeOrderEstimate) quotation.changeOrderEstimate.charges = await quotation.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
    if (quotation.siteVisitEstimate) quotation.siteVisitEstimate.charges = await quotation.calculateCharges(PAYMENT_TYPE.SITE_VISIT_PAYMENT)
    quotation.charges = await quotation.calculateCharges()

    res.status(200).json({ success: true, message: 'Job quotation retrieved successfully', data: quotation });
  } catch (error: any) {
    return next(new BadRequestError('An error occurred ', error))
  }
};


export const getQuotation = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { quotationId } = req.params;
    const contractorId = req.contractor.id

    // Check if the jobId and contractorId are provided
    if (!quotationId) {
      return res.status(400).json({ success: false, message: 'Quotation ID is required' });
    }

    // Find the job application for the specified job and contractor
    const quotation = await JobQuotationModel.findById(quotationId);

    // Check if the job application exists
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    if (quotation.changeOrderEstimate) quotation.changeOrderEstimate.charges = await quotation.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
    if (quotation.siteVisitEstimate) quotation.siteVisitEstimate.charges = await quotation.calculateCharges(PAYMENT_TYPE.SITE_VISIT_PAYMENT)
    quotation.charges = await quotation.calculateCharges()


    res.status(200).json({ success: true, message: 'Job quotation retrieved successfully', data: quotation });
  } catch (error: any) {
    return next(new BadRequestError('An error occurred ', error))
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

    const { startDate, endDate, siteVisit, estimatedDuration, estimates } = req.body;

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
    let quotation = await JobQuotationModel.findOne({ job: jobId, contractor: contractorId });


    // If the job application does not exist, create a new one
    if (!quotation) {
      return res.status(400).json({ status: false, message: 'Job quotation not found' });
    }

    // Update the job application fields
    quotation.startDate = startDate;
    quotation.endDate = endDate;
    quotation.siteVisit = siteVisit;
    quotation.estimates = estimates;
    quotation.estimatedDuration = estimatedDuration;

    // Save the updated job application
    await quotation.save();
    quotation.charges = await quotation.calculateCharges()
    if (quotation.changeOrderEstimate) quotation.changeOrderEstimate.charges = await quotation.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
    if (quotation.siteVisitEstimate) quotation.siteVisitEstimate.charges = await quotation.calculateCharges(PAYMENT_TYPE.SITE_VISIT_PAYMENT)
    quotation.charges = await quotation.calculateCharges()


    // Create or update conversation
    const conversationMembers = [
      { memberType: 'customers', member: job.customer },
      { memberType: 'contractors', member: contractorId }
    ];
    const conversation = await ConversationModel.findOneAndUpdate(
      {
        $and: [
          { members: { $elemMatch: { member: job.customer } } },
          { members: { $elemMatch: { member: contractorId } } }
        ]
      },

      {
        members: conversationMembers,
      },
      { new: true, upsert: true });


    // Send a message to the customer
    const message = new MessageModel({
      conversation: conversation?._id,
      sender: contractorId,
      senderType: 'contractors',
      receiver: job.customer,
      message: "Job estimate edited",
      messageType: MessageType.FILE,
      entity: quotation.id,
      entityType: 'quotations',
      payload: {
        job: job.id,
        quotation: quotation.id,
        quotationType: quotation.type,
        JobType: job.type
      }
    });
    await message.save();
    ConversationEvent.emit('NEW_MESSAGE', { message })
    JobEvent.emit('JOB_QUOTATION_EDITED', { job, quotation: quotation });

    res.status(200).json({ success: true, message: 'Job application updated successfully', data: quotation });
  } catch (error: any) {
    return next(new BadRequestError('An error occurred ', error))
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
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const contractorId = req?.contractor?.id

  // Assume isGuest
  if(!contractorId){
    const {data, error} = await applyAPIFeature(JobModel.find({status: JOB_STATUS.PENDING, type: JobType.LISTING}), req.query)
    return res.status(200).json({ success: true, message: 'Jobs retrieved successfully', data: data });
  }
  const profile = await ContractorProfileModel.findOne({ contractor: contractorId });

  if (!profile) {
    return res.status(404).json({ success: false, message: 'Contractor profile not found' });
  }

  try {
    // Extract query parameters
    let {
      radius,
      latitude = Number(profile.location.latitude),
      longitude = Number(profile.location.longitude),
      emergency,
      category = profile?.skill,
      city,
      country,
      address,
      startDate,
      endDate,
      page = 1, // Default to page 1
      limit = 10, // Default to 10 items per page
      sort, // Sort field and order (-fieldName or fieldName)
      showHidden = false,
      onlySavedJobs = false,
    } = req.query;

    limit = limit > 0 ? parseInt(limit) : 10; // Handle null limit

    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    // Construct aggregation pipeline
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "job_quotations",
          localField: "_id",
          foreignField: "job",
          as: "totalQuotations"
        }
      },
      {
        $lookup: {
          from: "contractor_saved_jobs",
          localField: "_id",
          foreignField: "job",
          as: "savedJobs"
        }
      },
      {
        $lookup: {
          from: "job_enquires",
          localField: "_id",
          foreignField: "job",
          as: "enquires"
        }
      },


      {
        $addFields: {
          totalQuotations: { $size: "$totalQuotations" },
          totalEnquiries: { $size: "$enquires" },
          hasUnrepliedEnquiry: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$enquires",
                    as: "enquiry",
                    cond: { $eq: [{ $size: "$$enquiry.replies" }, 0] }
                  }
                }
              },
              0
            ]
          },
          isSaved: { $gt: [{ $size: "$savedJobs" }, 0] },
          expiresIn: {
            $dateDiff: {
              unit: "day", // Change to "hour", "minute", etc. if needed
              startDate: "$createdAt",
              endDate: "$expiryDate",
            },
          },
          distance: {
            $round: [
              {
                $multiply: [
                  6371, // Earth's radius in km
                  {
                    $acos: {
                      $add: [
                        {
                          $multiply: [
                            { $sin: toRadians(latitude) },
                            { $sin: { $toDouble: { $multiply: [{ $toDouble: "$location.latitude" }, (Math.PI / 180)] } } }
                          ]
                        },
                        {
                          $multiply: [
                            { $cos: toRadians(latitude) },
                            { $cos: { $toDouble: { $multiply: [{ $toDouble: "$location.latitude" }, (Math.PI / 180)] } } },
                            { $cos: { $subtract: [{ $toDouble: { $multiply: [{ $toDouble: "$location.longitude" }, (Math.PI / 180)] } }, toRadians(longitude)] } }
                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              4
            ]
          },

        }
      },
    ];





    // THis logic is to remove jobs that the contractor has already submitted quotation for 
    const contractor = await ContractorModel.findById(contractorId);
    const quotations = await JobQuotationModel.find({ contractor: contractorId }, { job: 1 });
    const jobIdsWithQuotations = quotations.map(quotation => quotation.job);
    pipeline.push({ $match: { _id: { $nin: jobIdsWithQuotations } } });

    pipeline.push({ $match: { type: JobType.LISTING } });
    pipeline.push({ $match: { category: category } });
    pipeline.push({ $match: { status: JOB_STATUS.PENDING } });
    pipeline.push({ $match: { "expiresIn": {$gt: 0} } });


    if (!showHidden) {
      // Add a new $match stage to filter out jobs with contractorId in hideFrom array
      pipeline.push({ $match: { hideFrom: { $nin: [contractorId] } } });
    }

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


    if (radius) {
      pipeline.push({ $match: { "distance": { $lte: parseInt(radius) } } });
    }

    if (onlySavedJobs) {
      pipeline.push({ $match: { "savedJobs": { $ne: [] } } });
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
    return next(new BadRequestError('An error occurred ', error))
  }
};


export const getMyJobs = async (req: any, res: Response, next: NextFunction) => {
  const contractorId = req.contractor.id;

  try {
    let {
      type,
      page = 1, // Default to page 1
      limit = 10, // Default to 10 items per page
      sort, // Sort field and order (-fieldName or fieldName)
      customerId
    } = req.query;

    req.query.page = page
    req.query.limit = limit
    req.query.sort = sort

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
        // if (job.isAssigned) {
        //   job.myQuotation = await job.getMyQuotation(job.contractor)
        // } else {
        //   job.myQuotation = await job.getMyQuotation(contractorId)
        // }

        const { contract, totalEnquires, hasUnrepliedEnquiry, jobDay, dispute, myQuotation } = await JobUtil.populate(job, {
          contract: true,
          dispute: true,
          jobDay: true,
          totalEnquires: true,
          hasUnrepliedEnquiry: true,
          myQuotation: contractorId
        });

        job.myQuotation = myQuotation
        job.contract = contract
        job.jobDay = jobDay
        job.dispute = dispute
        job.totalEnquires = totalEnquires
        job.hasUnrepliedEnquiry = hasUnrepliedEnquiry


      }));
    }

    if (error) {
      return next(new BadRequestError('Unknown error occurred'));
    }

    // Send response with job listings data
    res.status(200).json({ success: true, data: data });
  } catch (error: any) {
    return next(new BadRequestError('An error occurred', error));
  }
};


export const getJobHistory = async (req: any, res: Response, next: NextFunction) => {
  const contractorId = req.contractor.id;

  try {
    let {
      type,
      page = 1, // Default to page 1
      limit = 10, // Default to 10 items per page
      sort = '-createdAt', // Sort field and order (-fieldName or fieldName)
      customerId
    } = req.query;


    req.query.page = page
    req.query.limit = limit
    req.query.sort = sort

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
        // // job.myQuotation = await job.getMyQuotation(contractorId)
        // if (job.isAssigned) {
        //   job.myQuotation = await job.getMyQuotation(job.contractor)
        // } else {
        //   job.myQuotation = await job.getMyQuotation(contractorId)
        // }
        const { contract, totalEnquires, hasUnrepliedEnquiry, jobDay, dispute, myQuotation } = await JobUtil.populate(job, {
          contract: true,
          dispute: true,
          jobDay: true,
          totalEnquires: true,
          hasUnrepliedEnquiry: true,
          myQuotation: contractorId
        });

        job.myQuotation = myQuotation
        job.contract = contract
        job.jobDay = jobDay
        job.dispute = dispute
        job.totalEnquires = totalEnquires
        job.hasUnrepliedEnquiry = hasUnrepliedEnquiry


      }));
    }

    if (error) {
      return next(new BadRequestError('Unknown error occurred'));
    }

    // Send response with job listings data
    res.status(200).json({ success: true, data: data });
  } catch (error: any) {
    return next(new BadRequestError('An error occurred', error));
  }
};


export const createJobEnquiry = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const { question } = req.body;
    const contractorId = req.contractor.id;

    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const contractor = await ContractorModel.findById(contractorId);
    if (!contractor) {
      return res.status(404).json({ success: false, message: "Contractor not found" });
    }


     // Check if contractor has a verified connected account
     contractor.onboarding = await contractor.getOnboarding()
     if (!(contractor.onboarding.hasStripeIdentity) ) {
       return res.status(400).json({ success: false, message: "Kindly complete your identity process" });
     }
 
    //  if (!contractor.onboarding.hasStripeAccount || !(contractor.stripeAccountStatus && contractor.stripeAccountStatus.card_payments_enabled && contractor.stripeAccountStatus.transfers_enabled)) {
    //    return res.status(400).json({ success: false, message: "Kindly connect your bank account to receive payment" });
    //  }



    //check if it contains bad inputs
    const {isRestricted, errorMessage} = await ConversationUtil.containsRestrictedMessageContent(question)
    if(isRestricted){
      return res.status(400).json({ success: false, message: "You are not allowed to send restricted contents such as email, phone number or other personal information" });
    }
    const enquiry = new JobEnquiryModel({
      job: job.id,
      contractor: contractorId,
      customer: job.customer,
      enquiry: question,
      createdAt: new Date()
    });

    await enquiry.save();

    job.enquiries.push(enquiry.id);
    await job.save();

    await ContractorSavedJobModel.findOneAndUpdate(
      { job: job.id, contractor: contractorId },
      { job: job.id, contractor: contractorId },
      { new: true, upsert: true }
    );



    JobEvent.emit('NEW_JOB_ENQUIRY', { jobId, enquiryId: enquiry.id });


    return res.status(200).json({ success: true, message: "Question added", question });
  } catch (error) {
    next(error);
  }
};

export const getJobEnquiries = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;

    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const enquiries = await applyAPIFeature(JobEnquiryModel.find({ job: jobId }).populate([
      { path: 'customer', select: "firstName lastName name profilePhoto _id language" },
      { path: 'contractor', select: "firstName lastName name profilePhoto _id language" },
    ]), req.query)

    return res.status(200).json({ success: true, message: "Enquiries retrieved", data: enquiries });
  } catch (error) {
    next(error);
  }
};

export const getJobSingleEnquiry = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { jobId, enquiryId } = req.params;

    // Find the job
    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Find the question from the JobQuestion collection
    const enquiry = await JobEnquiryModel.findById(enquiryId).populate([
      { path: 'customer', select: "firstName lastName name profilePhoto language _id" },
      { path: 'contractor', select: "firstName lastName name profilePhoto language _id" },
    ]);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    await Promise.all(
      enquiry.replies.map(async (reply: any) => {
        const user = await CustomerModel.findById(reply.userId).select('id firstName lastName profilePhoto');
        reply.user = user;
      })
    );

    res.json({ success: true, message: 'Reply added', enquiry });
  } catch (error: any) {
    return next(new BadRequestError('An error occurred', error));
  }
};


export const addJobToSaved = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const contractorId = req.contractor.id;

    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await ContractorSavedJobModel.findOneAndUpdate(
      { job: job.id, contractor: contractorId },
      { job: job.id, contractor: contractorId },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, message: "Job added to saved list" });
  } catch (error) {
    next(error);
  }
};



export const removeJobFromSaved = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const contractorId = req.contractor.id;

    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await ContractorSavedJobModel.findOneAndDelete({ job: job.id, contractor: contractorId });

    return res.status(200).json({ success: true, message: "Job removed from saved list" });
  } catch (error) {
    next(error);
  }
};




export const ContractorJobController = {
  getJobRequests,
  getJobListings,
  getJobRequestById,
  rejectJobRequest,
  acceptJobRequest,
  sendJobQuotation,
  getQuotationForJob,
  getQuotation,
  updateJobQuotation,
  getJobListingById,
  getMyJobs,
  getJobHistory,
  sendChangeOrderEstimate,
  hideJobListing,
  createJobEnquiry,
  getJobEnquiries,
  getJobSingleEnquiry,
  addJobToSaved,
  removeJobFromSaved
}




