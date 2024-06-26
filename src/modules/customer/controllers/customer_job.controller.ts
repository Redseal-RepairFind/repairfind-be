import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { htmlJobRequestTemplate } from "../../../templates/contractorEmail/jobRequestTemplate";
import CustomerModel from "../../../database/customer/models/customer.model";
import { EmailService, NotificationService } from "../../../services";
import { addHours, isFuture, isValid, startOfDay } from "date-fns";
import { IJob, JobModel, JOB_STATUS, JobType } from "../../../database/common/job.model";
import { BadRequestError } from "../../../utils/custom.errors";
import { applyAPIFeature } from "../../../utils/api.feature";
import { ConversationModel } from "../../../database/common/conversations.schema";
import { IMessage, MessageModel, MessageType } from "../../../database/common/messages.schema";
import { JOB_QUOTATION_STATUS, JobQuotationModel } from "../../../database/common/job_quotation.model";
import { JobEvent } from "../../../events";
import { htmlJobQuotationAcceptedContractorEmailTemplate } from "../../../templates/contractorEmail/job_quotation_accepted.template";
import { htmlJobQuotationDeclinedContractorEmailTemplate } from "../../../templates/contractorEmail/job_quotation_declined.template";
import mongoose from "mongoose";





export const createJobRequest = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation error occurred', errors: errors.array() });
        }

        const { contractorId, category, description, location, date, expiresIn = 7, emergency, media, voiceDescription, time } = req.body;
        const customerId = req.customer.id

        if (!mongoose.Types.ObjectId.isValid(contractorId)) {
            return res.status(400).json({ success: false, message: 'Invalid contractor format' });
        }
        const customer = await CustomerModel.findById(customerId)

        if (!customer) {
            return res.status(400).json({ success: false, message: "Customer not found" })
        }
        const contractor = await ContractorModel.findById(contractorId).populate('profile')
        if (!contractor) {
            return res.status(400).json({ success: false, message: "Contractor not found" })
        }

        // Check if contractor has a verified connected account
        if (!contractor.onboarding.hasStripeAccount || !(contractor.stripeAccountStatus?.card_payments_enabled && contractor.stripeAccountStatus?.transfers_enabled)) {
            return res.status(400).json({ success: false, message: "You cannot send a job request to this contractor because  stripe account is not set up" });
        }


        // Get the end of the current day (11:59:59 PM)
        const startOfToday = startOfDay(new Date());
        if (!isValid(new Date(date)) || (!isFuture(new Date(date)) && new Date(date) < startOfToday)) {
            return res.status(400).json({ success: false, message: 'Invalid date format or date is in the past' });
        }

        // Check if there is a similar job request sent to the same contractor within the last 72 hours
        const existingJobRequest = await JobModel.findOne({
            customer: customerId,
            contractor: contractorId,
            status: JOB_STATUS.PENDING,
            date: { $eq: new Date(date) }, // consider all past jobs
            createdAt: { $gte: addHours(new Date(), -24) }, // Check for job requests within the last 72 hours
        });

        if (existingJobRequest) {
            return res.status(400).json({ success: false, message: 'A similar job request has already been sent to this contractor within the last 24 hours' });
        }

        const dateTimeString = `${new Date(date).toISOString().split('T')[0]}T${time}`; // Combine date and time
        const jobTime = new Date(dateTimeString);

          // Calculate the expiry date
          const currentDate = new Date();
          const expiryDate = new Date(currentDate);
          expiryDate.setDate(currentDate.getDate() + expiresIn);

        // Create a new job document
        const newJob: IJob = new JobModel({
            customer: customer.id,
            contractor: contractorId,
            description,
            location,
            date,
            type: JobType.REQUEST,
            time: jobTime,
            expiresIn,
            expiryDate,
            emergency: emergency || false,
            voiceDescription,
            media: media || [],
            //@ts-ignore
            title: `${contractor.profile.skill} Service`,
            //@ts-ignore
            category: `${contractor.profile.skill}`

        });

        // Save the job document to the database
        await newJob.save();

        // Create a new conversation between the customer and the contractor
        const conversationMembers = [
            { memberType: 'customers', member: customerId },
            { memberType: 'contractors', member: contractorId }
        ];

        const conversation = await ConversationModel.findOneAndUpdate(
            {
                $and: [
                    { members: { $elemMatch: { member: customer.id } } }, // memberType: 'customers'
                    { members: { $elemMatch: { member: contractorId } } } // memberType: 'contractors'
                ]
            },

            {
                members: conversationMembers,
                lastMessage: `New job request: ${description}`, // Set the last message to the job description
                lastMessageAt: new Date() // Set the last message timestamp to now
            },
            { new: true, upsert: true }
        );

        // Create a message in the conversation
        const newMessage: IMessage = await MessageModel.create({
            conversation: conversation._id,
            sender: customerId, // Assuming the customer sends the initial message
            message: `New job request: ${description}`, // You can customize the message content as needed
            messageType: MessageType.TEXT, // You can customize the message content as needed
            createdAt: new Date()
        });



        JobEvent.emit('NEW_JOB_REQUEST', { jobId: newJob.id, contractorId, customerId, conversationId: conversation.id })
        const html = htmlJobRequestTemplate(customer.firstName, customer.firstName, `${date} ${time}`, description)
        EmailService.send(contractor.email, 'Job request from customer', html)


        res.status(201).json({ success: true, message: 'Job request submitted successfully', data: newJob });
    } catch (error: any) {
        return next(new BadRequestError('Bad Request', error));
    }

}


export const createJobListing = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success:false, message: 'Validation error occurred', errors: errors.array() });
        }

        const { category, description, location, date, expiresIn = 7, emergency, media, voiceDescription, time, contractorType } = req.body;
        const customerId = req.customer.id

        const customer = await CustomerModel.findById(customerId)

        if (!customer) {
            return res.status(400).json({ success: false, message: "Customer not found" })
        }


        // Get the end of the current day (11:59:59 PM)
        const startOfToday = startOfDay(new Date());
        if (!isValid(new Date(date)) || (!isFuture(new Date(date)) && new Date(date) < startOfToday)) {
            return res.status(400).json({ success: false, message: 'Invalid date format or date is in the past' });
        }

        // Check if there is a similar job request sent to the same contractor within the last 72 hours
        const existingJobRequest = await JobModel.findOne({
            customer: customerId,
            status: JOB_STATUS.PENDING,
            category: category,
            date: { $eq: new Date(date) }, // consider all past jobs
            createdAt: { $gte: addHours(new Date(), -24) }, // Check for job requests within the last 72 hours
        });

        if (existingJobRequest) {
            return res.status(400).json({ success: false, message: 'A similar job has already been created within the last 24 hours' });
        }

        let dateTimeString = `${new Date(date).toISOString().split('T')[0]}T${'00:00:00.000Z'}`; // Combine date and time
        let jobTime = new Date(dateTimeString);

        if (time) {
            let dateTimeString = `${new Date(date).toISOString().split('T')[0]}T${time}`; // Combine date and time
            let jobTime = new Date(dateTimeString);
        }


        // Calculate the expiry date
        const currentDate = new Date();
        const expiryDate = new Date(currentDate);
        expiryDate.setDate(currentDate.getDate() + expiresIn);

        // Create a new job document
        const newJob: IJob = new JobModel({
            customer: customer.id,
            contractorType,
            description,
            category,
            location,
            date,
            time: jobTime,
            expiresIn,
            expiryDate: expiryDate,
            emergency: emergency || false,
            voiceDescription,
            media: media || [],
            type: JobType.LISTING,
            title: `${category} Service`,

        });

        // Save the job document to the database
        await newJob.save();

        JobEvent.emit('NEW_JOB_LISTING', { jobId: newJob.id })
        

        res.status(201).json({ success: true, message: 'Job listing submitted successfully', data: newJob });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
    }

}


export const getMyJobs = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Validate incoming request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract query parameters
        const {limit = 10, page=1, sort='-createdAt',  contractorId, status, startDate, endDate, date, type } = req.query;
        
        req.query.page = page
        req.query.limit = limit
        req.query.sort = sort
    
        const customerId = req.customer.id;

        // Construct filter object based on query parameters
        let filter: any = { customer: customerId };


        // TODO: when contractor is specified, ensure the contractor quotation is attached
        if (contractorId) {
            if (!mongoose.Types.ObjectId.isValid(contractorId)) {
                return res.status(400).json({ success: false, message: 'Invalid contractor id' });
            }

            const quotations = await JobQuotationModel.find({contractor: contractorId})
            const quotationIds = quotations.map(quotation => quotation._id);
            
            console.log(quotationIds)
            filter['quotations.id'] = { $in: quotationIds };
            // filter['quotations.contractor'] = {$in: contractorId};
            delete req.query.contractorId
        }



        if (status) {
            req.query.status = status.toUpperCase();
        }
        if (startDate && endDate) {
            // Parse startDate and endDate into Date objects
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Ensure that end date is adjusted to include the entire day
            end.setDate(end.getDate() + 1);
            req.query.createdAt = { $gte: start, $lt: end };

            delete req.query.startDate
            delete req.query.endDate
        }

        if (date) {
            const selectedDate = new Date(date);
            const startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
            const endOfDay = new Date(startOfDay);
            endOfDay.setDate(startOfDay.getUTCDate() + 1);
            req.query.date = { $gte: startOfDay, $lt: endOfDay };
        }

        // Execute query
        const { data, error } = await applyAPIFeature(JobModel.find(filter).populate(['contractor', 'quotation']), req.query);

        if (data) {

            await Promise.all(data.data.map(async (job: any) => {
                if (contractorId) {
                    job.myQuotation = await job.getMyQoutation(contractorId)
                }
            }));
        }


        res.json({ success: true, message: 'Jobs retrieved', data: data });

    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
    }
};

export const getJobHistory = async (req: any, res: Response, next: NextFunction) => {
    const customerId = req.contractor.id;
  
    try {
      let {
        page = 1, // Default to page 1
        limit = 10, // Default to 10 items per page
        sort = '-createdAt', // Sort field and order (-fieldName or fieldName)
        contractorId,
        status = 'COMPLETED, CANCELLED',
      } = req.query;
  
  
      req.query.page = page
      req.query.limit = limit
      req.query.sort = sort
      delete req.query.status
      // Retrieve the quotations for the current contractor and extract job IDs
      const quotations = await JobQuotationModel.find({ contractor: contractorId }).select('job').lean();
  
      // Extract job IDs from the quotations
      const jobIds = quotations.map((quotation: any) => quotation.job);
  
      if (contractorId) {
        if (!mongoose.Types.ObjectId.isValid(contractorId)) {
          return res.status(400).json({ success: false, message: 'Invalid customer id' });
        }
        req.query.contractor = contractorId
        delete req.query.contractorId
      }
  
      // Query JobModel to find jobs that have IDs present in the extracted jobIds
      const statusArray = status.split(',').map((s: any) => s.trim()); // Convert the comma-separated string to an array of statuses
      const { data, error } = await applyAPIFeature(
        JobModel.find({
            status: {$in: statusArray},
            $or: [
                { _id: { $in: jobIds } }, // Match jobs specified in jobIds
                { contractor: contractorId } // Match jobs with contractorId
            ]
        }).distinct('_id'),
        req.query);
      if (data) {
        // Map through each job and attach myQuotation if contractor has applied 
        await Promise.all(data.data.map(async (job: any) => {
          job.myQuotation = await job.getMyQoutation(contractorId)
        }));
      }
  
      if (error) {
        return next(new BadRequestError('Unkowon error occurred'));
      }
  
      // Send response with job listings data
      res.status(200).json({ success: true, data: data });
    } catch (error: any) {
      return next(new BadRequestError('An error occurred', error));
    }
  };

export const getSingleJob = async (req: any, res: Response, next: NextFunction) => {
    try {

        const customerId = req.customer.id
        const jobId = req.params.jobId;

        const job = await JobModel.findOne({ customer: customerId, _id: jobId }).populate('contract');

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // If the job exists, return it as a response
        res.json({ success: true, message: 'Job retrieved', data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
    }
};

export const getJobQuotations = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const jobId = req.params.jobId;

        const job = await JobModel.findOne({ customer: customerId, _id: jobId }).populate('quotations');

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found or does not belong to customer' });
        }
        const quotations = await JobQuotationModel.find({ job: jobId, status: { $ne: JOB_QUOTATION_STATUS.DECLINED } }).populate([{ path: 'contractor' }])


        // If the job exists, return its quo as a response
        res.json({ success: true, message: 'Job quotations retrieved', data: quotations });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
    }
};

export const getSingleQuotation = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { jobId, quotationId } = req.params;

        const quotation = await JobQuotationModel.findOne({ _id: quotationId, job: jobId }).populate('contractor');

        // Check if the job exists
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Qoutation not found' });
        }

        quotation.charges = await quotation.calculateCharges()
        res.json({ success: true, message: 'Job quotation retrieved', data: quotation });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
    }
};


export const acceptJobQuotation = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { jobId, quotationId } = req.params;

        const quotation = await JobQuotationModel.findOne({ _id: quotationId, job: jobId });
        const job = await JobModel.findById(jobId);


        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        // check if contractor exists
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Qoutation not found' });
        }

        quotation.status = JOB_QUOTATION_STATUS.ACCEPTED;
        // create conversation here

        // Create a new conversation between the customer and the contractor


        const conversationMembers = [
            { memberType: 'customers', member: customerId },
            { memberType: 'contractors', member: quotation.contractor }
        ];
        const conversation = await ConversationModel.findOneAndUpdate(
            {
                $and: [
                    { members: { $elemMatch: { member: customerId } } }, // memberType: 'customers'
                    { members: { $elemMatch: { member: quotation.contractor } } } // memberType: 'contractors'
                ]
            },
            {
                members: conversationMembers,
                lastMessage: 'I have accepted your quotation for the Job', // Set the last message to the job description
                lastMessageAt: new Date() // Set the last message timestamp to now
            },
            { new: true, upsert: true });


        // Create a message in the conversation
        const newMessage: IMessage = await MessageModel.create({
            conversation: conversation._id,
            sender: customerId, // Assuming the customer sends the initial message
            message: `I have accepted your qoutation for the Job`, // You can customize the message content as needed
            messageType: MessageType.TEXT, // You can customize the message content as needed
            createdAt: new Date()
        });

        // Accepting does not mean
        // job.quotation = quotation.id
        // job.contractor = quotation.contractor
        // job.status = JOB_STATUS.ACCEPTED // no need of moving status to Accepted again - 

        await quotation.save()

        const foundQuotationIndex = job.quotations.findIndex(quotation => quotation.id == quotationId);
        if (foundQuotationIndex !== -1) {
            job.quotations[foundQuotationIndex].status = JOB_QUOTATION_STATUS.ACCEPTED;
        }
        await job.save()


        const contractor = await ContractorModel.findById(quotation.contractor)
        const customer = await CustomerModel.findById(customerId)
        //emit event - mail should be sent from event handler shaa
        JobEvent.emit('JOB_QOUTATION_ACCEPTED', { jobId, contractorId: quotation.contractor, customerId, conversationId: conversation.id })

        // send mail to contractor
        if (contractor && customer) {
            const html = htmlJobQuotationAcceptedContractorEmailTemplate(contractor.name, customer.name, job)
            EmailService.send(contractor.email, 'Job Quotation Accepted', html)
        }



        quotation.charges = await quotation.calculateCharges()
        res.json({ success: true, message: 'Job quotation accepted' });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
    }
};

export const declineJobQuotation = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { jobId, quotationId } = req.params;

        const quotation = await JobQuotationModel.findOne({ _id: quotationId, job: jobId });
        const job = await JobModel.findById(jobId);


        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        // check if contractor exists
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Qoutation not found' });
        }

        quotation.status = JOB_QUOTATION_STATUS.DECLINED;

        // maybe send mail out ?
        await quotation.save()

        const foundQuotationIndex = job.quotations.findIndex((quotation: { id: any; }) => quotation.id == quotationId);
        if (foundQuotationIndex !== -1) {
            job.quotations[foundQuotationIndex].status = JOB_QUOTATION_STATUS.DECLINED;
        }
        await job.save();


        const contractor = await ContractorModel.findById(quotation.contractor)
        const customer = await CustomerModel.findById(customerId)
        //emit event - mail should be sent from event handler shaa
        JobEvent.emit('JOB_QOUTATION_DECLINED', { jobId, contractorId: quotation.contractor, customerId })

        // send mail to contractor
        if (contractor && customer) {
            const html = htmlJobQuotationDeclinedContractorEmailTemplate(contractor.name, customer.name, job)
            EmailService.send(contractor.email, 'Job Quotation Declined', html)
        }


        res.json({ success: true, message: 'Job quotation declined' });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
    }
};



export const CustomerJobController = {
    createJobRequest,
    getMyJobs,
    getJobHistory,
    createJobListing,
    getSingleJob,
    getJobQuotations,
    getSingleQuotation,
    acceptJobQuotation,
    declineJobQuotation
}


