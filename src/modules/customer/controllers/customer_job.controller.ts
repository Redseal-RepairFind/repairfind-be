import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { htmlJobRequestTemplate } from "../../../templates/contractor/jobRequestTemplate";
import CustomerModel from "../../../database/customer/models/customer.model";
import { EmailService, NotificationService } from "../../../services";
import { addHours, isFuture, isValid, startOfDay } from "date-fns";
import { IJob, JobModel, JOB_STATUS, JobType } from "../../../database/common/job.model";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import { applyAPIFeature } from "../../../utils/api.feature";
import { ConversationEntityType, ConversationModel } from "../../../database/common/conversations.schema";
import { IMessage, MessageModel, MessageType } from "../../../database/common/messages.schema";
import { JOB_QUOTATION_STATUS, JOB_QUOTATION_TYPE, JobQuotationModel } from "../../../database/common/job_quotation.model";
import { ConversationEvent, JobEvent } from "../../../events";
import mongoose from "mongoose";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { JobEnquiryModel } from "../../../database/common/job_enquiry.model";
import { ConversationUtil } from "../../../utils/conversation.util";
import { PAYMENT_TYPE } from "../../../database/common/payment.schema";
import { JobUtil } from "../../../utils/job.util";
import { COUPON_STATUS, CouponModel } from "../../../database/common/coupon.schema";





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

        const { contractorId, category, language, description, location, date, expiresIn = 7, emergency, media, voiceDescription, time } = req.body;
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
        const contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId })


        // Check if contractor has a verified connected account
        // if (!contractor.onboarding.hasStripeAccount || !(contractor.stripeAccountStatus?.card_payments_enabled && contractor.stripeAccountStatus?.transfers_enabled)) {
        //     return res.status(400).json({ success: false, message: "You cannot send a job request to this contractor because  stripe account is not set up" });
        // }





        // Calculate the expiry date
        const currentDate = new Date();
        const expiryDate = new Date(currentDate);
        expiryDate.setDate(currentDate.getDate() + Number(expiresIn));


        // Create a new job document
        const newJob: IJob = new JobModel({
            customer: customer.id,
            contractor: contractorId,
            description,
            location,
            // date: jobDate,
            // time: jobDate,
            type: JobType.REQUEST,
            expiresIn: Number(expiresIn),
            expiryDate,
            emergency: emergency || false,
            voiceDescription,
            media: media || [],
            title: `${contractorProfile?.skill} Service`,
            category: `${contractorProfile?.skill}`,
            language: language || customer.language

        });

        // Save the job document to the database
        await newJob.save();

        // Create a new conversation between the customer and the contractor
        const conversationMembers = [
            { memberType: 'customers', member: customerId },
            { memberType: 'contractors', member: contractorId }
        ];


        // Create a message in the conversation
        const conversation = await ConversationUtil.updateOrCreateConversation(customerId, 'customers', contractorId, 'contractors')
        const newMessage: IMessage = await MessageModel.create({
            conversation: conversation._id,
            sender: customerId, // Assuming the customer sends the initial message
            senderType: 'customers',
            message: `New job request`, // You can customize the message content as needed
            messageType: MessageType.ALERT, // You can customize the message content as needed
            createdAt: new Date(),
            entity: newJob.id,
            entityType: 'jobs'
        });
        conversation.lastMessage = 'New job request'
        conversation.entityType = ConversationEntityType.JOB
        conversation.entity = newJob.id
        await conversation.save()
        ConversationEvent.emit('NEW_MESSAGE', { message: newMessage })
        JobEvent.emit('NEW_JOB_REQUEST', { jobId: newJob.id, contractorId, customerId, conversationId: conversation.id })

        // const html = htmlJobRequestTemplate(customer.firstName, customer.firstName, `${newJob.date}`, description)
        // EmailService.send(contractor.email, 'Job request from customer', html)

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
            return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
        }

        const { category, description, location, date, expiresIn = 7, emergency, media, voiceDescription, time, contractorType = "Both", language } = req.body;
        const customerId = req.customer.id

        const customer = await CustomerModel.findById(customerId)

        if (!customer) {
            return res.status(400).json({ success: false, message: "Customer not found" })
        }

        // remove 0 padding
        // const dateParts = date.split('-').map( (part: any) => part.replace(/^0+/, ''));
        // const formattedDate = dateParts.join('-');

        // add 0  padding
        const dateParts = date.split('-').map((part: any) => part.padStart(2, '0'));
        const formattedDate = dateParts.join('-');

        // let dateTimeString = `${new Date(formattedDate).toISOString().split('T')[0]}T${'23:59:59.000Z'}`; // Combine date and time
        let dateTimeString = `${new Date(formattedDate).toISOString()}`; // Combine date and time
        let jobDate = new Date(dateTimeString);



        // Get the end of the current day (11:59:59 PM)
        const startOfToday = startOfDay(new Date());
        if (!isValid(new Date(jobDate))) {
            return res.status(400).json({ success: false, message: 'Invalid date format' });
        }

        if ((!isFuture(new Date(jobDate)) && new Date(jobDate) < startOfToday)) {
            return res.status(400).json({ success: false, message: 'Selected Job Date is in the past' });
        }

        // Check if there is a similar job request sent to the same contractor within the last 72 hours
        const existingJobRequest = await JobModel.findOne({
            customer: customerId,
            status: JOB_STATUS.PENDING,
            category: category,
            date: { $eq: new Date(jobDate) }, // consider all past jobs
            createdAt: { $gte: addHours(new Date(), -24) }, // Check for job requests within the last 72 hours
        });

        if (existingJobRequest) {
            // return res.status(400).json({ success: false, message: 'A similar job has already been created within the last 24 hours' });
        }




        // Calculate the expiry date
        const currentDate = new Date();
        const expiryDate = new Date(currentDate);
        expiryDate.setDate(currentDate.getDate() + Number(expiresIn));


        // Create a new job document
        const newJob: IJob = new JobModel({
            customer: customer.id,
            // contractorType,
            description,
            category,
            location,
            date: jobDate,
            time: jobDate,
            expiresIn: Number(expiresIn),
            expiryDate: expiryDate,
            emergency: emergency || false,
            voiceDescription,
            media: media || [],
            type: JobType.LISTING,
            title: `${category} Service`,
            language: language || customer.language

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
        const { limit = 10, page = 1, sort = '-createdAt', contractorId, status, startDate, endDate, date, type } = req.query;

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

            const quotations = await JobQuotationModel.find({ contractor: contractorId })
            const quotationIds = quotations.map(quotation => quotation._id);

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
                // const { contract, totalEnquires, hasUnrepliedEnquiry, myQuotation } = await JobUtil.populate(job, contractorId)
                // job.myQuotation = myQuotation
                // job.contract = contract
                // job.totalEnquires = totalEnquires
                // job.hasUnrepliedEnquiry = hasUnrepliedEnquiry

                const { contract, totalEnquires, hasUnrepliedEnquiry, myQuotation } = await JobUtil.populate(job, {
                    contract: true,
                    myQuotation: contractorId,
                    totalEnquires: true,
                    hasUnrepliedEnquiry: true,
                });

                job.myQuotation = myQuotation
                job.contract = contract
                job.totalEnquires = totalEnquires
                job.hasUnrepliedEnquiry = hasUnrepliedEnquiry


            }));
        }


        res.json({ success: true, message: 'Jobs retrieved', data: data });

    } catch (error: any) {
        console.log(error)
        return next(new InternalServerError('An error occurred ', error))
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
                status: { $in: statusArray },
                $or: [
                    { _id: { $in: jobIds } }, // Match jobs specified in jobIds
                    { contractor: contractorId } // Match jobs with contractorId
                ]
            }).distinct('_id'),
            req.query);
        if (data) {
            // Map through each job and attach myQuotation if contractor has applied 
            await Promise.all(data.data.map(async (job: any) => {
                // job.myQuotation = await job.getMyQuotation(contractorId)
                // const contract = await JobQuotationModel.findOne({ _id: job.contract, job: job.id });
                // if(contract){
                //     if(contract.changeOrderEstimate)contract.changeOrderEstimate.charges  = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
                //     if(contract.siteVisitEstimate)contract.siteVisitEstimate.charges  = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)
                //     contract.charges  = await contract.calculateCharges()
                //     job.contract = contract
                // }

                const { contract, totalEnquires, hasUnrepliedEnquiry, myQuotation } = await JobUtil.populate(job, {
                    contract: true,
                    myQuotation: contractorId,
                    totalEnquires: true,
                    hasUnrepliedEnquiry: true,
                });

                job.myQuotation = myQuotation
                job.contract = contract
                job.totalEnquires = totalEnquires
                job.hasUnrepliedEnquiry = hasUnrepliedEnquiry

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

        // const { totalEnquires, hasUnrepliedEnquiry } = await JobUtil.populate(job, {
        //     totalEnquires: true,
        //     hasUnrepliedEnquiry: true,
        // });

        // job.totalEnquires = totalEnquires
        // job.hasUnrepliedEnquiry = hasUnrepliedEnquiry

        const { contract, totalEnquires, hasUnrepliedEnquiry } = await JobUtil.populate(job, {
            contract: true,
            totalEnquires: true,
            hasUnrepliedEnquiry: true,
        });

        job.contract = contract
        job.totalEnquires = totalEnquires
        job.hasUnrepliedEnquiry = hasUnrepliedEnquiry


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
        await Promise.all(quotations.map(async (quotation: any) => {

            if (quotation) {
                if (quotation.changeOrderEstimate) quotation.changeOrderEstimate.charges = await quotation.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
                if (quotation.siteVisitEstimate) quotation.siteVisitEstimate.charges = await quotation.calculateCharges(PAYMENT_TYPE.SITE_VISIT_PAYMENT)
                quotation.charges = await quotation.calculateCharges()
            }
        }));

        // If the job exists, return its quo as a response
        res.json({ success: true, message: 'Job quotations retrieved', data: quotations });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
    }
};


export const getAllQuotations = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const jobId = req.params.jobId;
        const jobs = await JobModel.find({ customer: customerId })
        const jobIds = jobs.map((job: { _id: any; }) => job._id);
        const { data, error } = await applyAPIFeature(JobQuotationModel.find({ job: { $in: jobIds }, status: { $ne: JOB_QUOTATION_STATUS.DECLINED } }).populate([{ path: 'contractor' }, { path: 'job' }]), req.query)

        if (data) {
            await Promise.all(data.data.map(async (contract: any) => {
                if (contract) {
                    if (contract.changeOrderEstimate) contract.changeOrderEstimate.charges = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
                    if (contract.siteVisitEstimate) contract.siteVisitEstimate.charges = await contract.calculateCharges(PAYMENT_TYPE.SITE_VISIT_PAYMENT)
                    contract.charges = await contract.calculateCharges()
                }
            }));
        }


        // If the job exists, return its quo as a response
        res.json({ success: true, message: 'Job quotations retrieved', data });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
    }
};


export const getQuotation = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const quotationId = req.params.quotationId;

        const quotation = await JobQuotationModel.findById(quotationId).populate([{ path: 'contractor' }])
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Job quotation found' });
        }

        if (quotation.changeOrderEstimate) quotation.changeOrderEstimate.charges = await quotation.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
        if (quotation.siteVisitEstimate) quotation.siteVisitEstimate.charges = await quotation.calculateCharges(PAYMENT_TYPE.SITE_VISIT_PAYMENT)
        quotation.charges = await quotation.calculateCharges()


        // If the job exists, return its quo as a response
        res.json({ success: true, message: 'Job quotation retrieved', data: quotation });
    } catch (error: any) {
        // console.log(error)
        return next(new InternalServerError('An error occurred ', error))
    }
};

export const getSingleQuotation = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { jobId, quotationId } = req.params;

        const quotation = await JobQuotationModel.findOne({ _id: quotationId, job: jobId }).populate('contractor');

        // Check if the job exists
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }

        if (quotation.changeOrderEstimate) quotation.changeOrderEstimate.charges = await quotation.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
        if (quotation.siteVisitEstimate) quotation.siteVisitEstimate.charges = await quotation.calculateCharges(PAYMENT_TYPE.SITE_VISIT_PAYMENT)
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
                // lastMessage: 'I have accepted your quotation for the Job', // Set the last message to the job description
                // lastMessageAt: new Date() // Set the last message timestamp to now
            },
            { new: true, upsert: true });


        // Create a message in the conversation
        const newMessage: IMessage = await MessageModel.create({
            conversation: conversation._id,
            sender: customerId,
            senderType: 'customers',
            message: `Job estimate accepted`,
            messageType: MessageType.ALERT,
            createdAt: new Date(),
            entity: quotation.id,
            entityType: 'quotations'
        });


        conversation.lastMessage = 'Job estimate accepted'
        conversation.entityType = ConversationEntityType.QUOTATION
        conversation.entity = quotation.id
        await conversation.save()
        ConversationEvent.emit('NEW_MESSAGE', { message: newMessage })

        await quotation.save()

        const foundQuotationIndex = job.quotations.findIndex(quotation => quotation.id == quotationId);
        if (foundQuotationIndex !== -1) {
            job.quotations[foundQuotationIndex].status = JOB_QUOTATION_STATUS.ACCEPTED;
        }
        await job.save()



        const contractor = await ContractorModel.findById(quotation.contractor)
        const customer = await CustomerModel.findById(customerId)
        if (contractor && customer) {
            JobEvent.emit('JOB_QUOTATION_ACCEPTED', { jobId, contractorId: quotation.contractor, customerId })
        }


        quotation.charges = await quotation.calculateCharges()
        res.json({ success: true, message: 'Job quotation accepted' });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
    }
};



export const applyCouponToJobQuotation = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { quotationId } = req.params;
        const { couponCode } = req.body;

        const quotation = await JobQuotationModel.findOne({ _id: quotationId });

        // check if contractor exists
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Qoutation not found' });
        }

        const coupon = await CouponModel.findOne({ code: couponCode })
        if (!coupon) return res.json({ success: false, message: 'Coupon is invalid' });
        if (['pending', 'redeemed', 'expired'].includes(coupon.status)) {
            return res.status(400).json({ message: `Coupon is ${coupon.status}` });
        }

        if (quotation.type == JOB_QUOTATION_TYPE.SITE_VISIT) {
            if (quotation.siteVisitEstimate.hasOwnProperty('customerDiscount')) return res.status(400).json({ success: false, message: 'Quotation already has a coupon applied' });
            if (quotation.siteVisitEstimate.isPaid) return res.status(400).json({ success: false, message: 'Site Estimate visit is already paid' });
            quotation.siteVisitEstimate.customerDiscount = {
                coupon: coupon.id,
                value: coupon.value,
                valueType: coupon.valueType,
            }
        }

        if (quotation.type == JOB_QUOTATION_TYPE.JOB_DAY) {
            if (quotation.hasOwnProperty('customerDiscount')) return res.status(400).json({ success: false, message: 'Quotation already has a coupon applied' });
            if (quotation.isPaid) return res.status(400).json({ success: false, message: 'Job Estimate visit is already paid' });
            quotation.siteVisitEstimate.customerDiscount = {
                coupon: coupon.id,
                value: coupon.value,
                valueType: coupon.valueType,
            }
        }

        coupon.status = COUPON_STATUS.PENDING
        await Promise.all([
            coupon.save(),
            quotation.save()
        ])

        quotation.charges = await quotation.calculateCharges()
        res.json({ success: true, message: 'Coupon applied to quotation', data: quotation });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
    }
};


export const scheduleJob = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { jobId, quotationId } = req.params;
        const { date, time, jobDateTime } = req.body;

        const quotation = await JobQuotationModel.findOne({ _id: quotationId, job: jobId });
        const job = await JobModel.findById(jobId);


        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        // check if contractor exists
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }


        // pad the date 
        const dateParts = date.split('-').map((part: any) => part.padStart(2, '0'));
        const formattedDate = dateParts.join('-');

        // Combine date and time into a single DateTime object
        // const jobDateTime = new Date(`${formattedDate}T${time}`);

        quotation.startDate = jobDateTime;
        await quotation.save()

        const foundQuotationIndex = job.quotations.findIndex(quotation => quotation.id == quotationId);
        if (foundQuotationIndex !== -1) {
            job.quotations[foundQuotationIndex].status = JOB_QUOTATION_STATUS.ACCEPTED;
        }

        job.date = jobDateTime;
        await job.save()


        const contractor = await ContractorModel.findById(quotation.contractor)
        const customer = await CustomerModel.findById(customerId)
        if (contractor && customer) {
            // JobEvent.emit('JOB_QUOTATION_ACCEPTED', { jobId, contractorId: quotation.contractor, customerId })
        }

        quotation.charges = await quotation.calculateCharges()
        res.json({ success: true, message: 'Job scheduled' });
    } catch (error: any) {
        return next(new InternalServerError('An error occurred ', error))
    }
};

export const declineJobQuotation = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { jobId, quotationId } = req.params;
        const { reason } = req.body;

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
                // lastMessage: 'I have accepted your quotation for the Job', // Set the last message to the job description
                // lastMessageAt: new Date() // Set the last message timestamp to now
            },
            { new: true, upsert: true });


        // Create a message in the conversation
        const newMessage: IMessage = await MessageModel.create({
            conversation: conversation._id,
            sender: customerId, // Assuming the customer sends the initial message
            senderType: 'customers',
            message: `Job estimate declined: (${reason})`, // You can customize the message content as needed
            messageType: MessageType.ALERT, // You can customize the message content as needed
            createdAt: new Date(),
            entity: quotation.id,
            entityType: 'quotations'
        });


        conversation.lastMessage = 'Job estimate declined'
        conversation.entityType = ConversationEntityType.QUOTATION
        conversation.entity = quotation.id
        await conversation.save()
        ConversationEvent.emit('NEW_MESSAGE', { message: newMessage })

        const contractor = await ContractorModel.findById(quotation.contractor)
        const customer = await CustomerModel.findById(customerId)


        if (contractor && customer) {
            //emit event - mail should be sent from event handler shaa
            JobEvent.emit('JOB_QUOTATION_DECLINED', { jobId, contractorId: quotation.contractor, customerId, reason })
        }


        res.json({ success: true, message: 'Job quotation declined' });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
    }
};


export const replyJobEnquiry = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { jobId } = req.params;
        const { replyText, enquiryId } = req.body;

        // Find the job
        const job = await JobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Find the question from the JobQuestion collection
        const question = await JobEnquiryModel.findById(enquiryId);
        if (!question) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }


        //check if it contains bad inputs
        const { isRestricted, errorMessage } = await ConversationUtil.containsRestrictedMessageContent(replyText)
        if (isRestricted) {
            return res.status(400).json({ success: false, message: "You are not allowed to send restricted contents such as email, phone number or other personal information" });
        }


        // Add the reply to the question
        question.replies.push({ userId: customerId, userType: 'customers', replyText });
        await question.save();
        JobEvent.emit('NEW_JOB_ENQUIRY_REPLY', { jobId, enquiryId });
        res.json({ success: true, message: 'Reply added', question });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};


export const getJobSingleEnquiry = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { jobId, enquiryId } = req.params;

        // Find the job
        const job = await JobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
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
        console.log(error)
        return next(new InternalServerError('An error occurred', error));
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
            { path: 'customer', select: "firstName lastName name profilePhoto language _id" },
            { path: 'contractor', select: "firstName lastName name profilePhoto language _id" },
        ]), req.query)

        return res.status(200).json({ success: true, message: "Enquiries retrieved", data: enquiries });
    } catch (error) {
        next(error);
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
    declineJobQuotation,
    scheduleJob,
    getQuotation,
    replyJobEnquiry,
    getAllQuotations,
    getJobEnquiries,
    getJobSingleEnquiry,
    applyCouponToJobQuotation
}


