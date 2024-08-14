import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { NotificationService } from "../../../services/notifications/index";
import { JOB_DAY_STATUS, JOB_DAY_TYPE, JobDayModel } from "../../../database/common/job_day.model";
import { JobEmergencyModel } from "../../../database/common/job_emergency.model";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import { JobEvent } from "../../../events";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { JOB_SCHEDULE_TYPE, JOB_STATUS, JobModel } from "../../../database/common/job.model";
import { CONVERSATION_TYPE, ConversationModel } from "../../../database/common/conversations.schema";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { JOB_DISPUTE_STATUS, JobDisputeModel } from "../../../database/common/job_dispute.model";
import { JOB_QUOTATION_TYPE, JobQuotationModel } from "../../../database/common/job_quotation.model";


export const initiateJobDay = async (
    req: any,
    res: Response,
) => {

    try {
        const { jobId } = req.body;

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const customerId = req.customer.id


        // Find the job request by ID
        const job = await JobModel.findOne({ _id: jobId, customer: customerId }).populate('customer', 'contractor');
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job  not found' });
        }


        const jobDay = await JobDayModel.findOne({ job: jobId, type: job.schedule.type, status: {$ne: [JOB_DAY_STATUS.DISPUTED, JOB_DAY_STATUS.COMPLETED ]} });
        if (!jobDay) {
            // return res.status(400).json({ success: false, message: 'No job for the current schedule type' });
        }

        const contractorId = job.contractor

        const findContractor = await ContractorModel.findById(job.contractor);
       
        if (!findContractor) {
            return res.status(404).json({ success: false, message: 'Job Contractor not found' });
        }
        
        const contractor = findContractor?.toJSON()

        const customer = await CustomerModel.findOne({ _id: job.customer });
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Job Customer not found' });
        }

        let contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId });
        if (!contractorProfile) {
            return res.status(404).json({ success: false, message: 'Contractor profile not found' });
        }

        // Create or update conversation
        const conversationMembers = [
            { memberType: 'customers', member: job.customer },
            { memberType: 'contractors', member: contractorId }
        ];
        const conversation = await ConversationModel.findOneAndUpdate(
            {
                $and: [
                    { members: { $elemMatch: { member: job.customer } } }, // memberType: 'customers'
                    { members: { $elemMatch: { member: contractorId } } } // memberType: 'contractors'
                ]
            },

            {
                members: conversationMembers,
                lastMessage: 'I have accepted your Job request', // Set the last message to the job description
                lastMessageAt: new Date() // Set the last message timestamp to now
            },
            { new: true, upsert: true });



        let contractorLocation = contractorProfile.location
        // if job is assigned show assigned contractor location
        if(job.isAssigned){
            contractorProfile = await ContractorProfileModel.findOne({ contractor: job.assignment.contractor });
            if(contractorProfile)  contractorLocation = contractorProfile?.location
        }


        const data = {
            conversation: conversation.id,
            customer: {id: customer.id, phoneNumber: customer.phoneNumber, name: customer.name, email: customer.email, profilePhoto: customer.profilePhoto},
            contractor: {id: contractor.id, phoneNumber: contractor.phoneNumber, name: contractor.name, email: contractor.email, profilePhoto: contractor.profilePhoto},
            job: {id: job.id, description: job.description, title: job.title, schedule: job.schedule, type:job.type, date:job.date, location: job.location},
            contractorLocation,
            jobDay
        }

        res.json({
            success: true,
            message: "JobDay successfully initiated",
            data: data
        });

    } catch (err: any) {
        console.log("error", err)
        res.status(500).json({ message: err.message });
    }

}

export const confirmContractorArrival = async (
    req: any,
    res: Response,
) => {

    try {
        const { jobDayId } = req.params;
        const { verificationCode } = req.body;

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const customerId = req.customer.id

        const jobDay = await JobDayModel.findOne({ _id: jobDayId })
        if (!jobDay) {
            return res.status(403).json({ success: false, message: 'JobDay not found' });
        }

        if (jobDay.status != JOB_DAY_STATUS.ARRIVED) {
            return res.status(403).json({ success: false, message: 'Contractor has not arrived yet' });
        }

        if (jobDay.verified) {
            return res.status(403).json({ success: false, message: 'JobDay has already been verified' });
        }

        if (jobDay.verificationCode !== verificationCode) {
            return res.status(403).json({ success: false, message: 'Incorrect verification code' });
        }

        const job = await JobModel.findById(jobDay.job)
        if (!job) {
            return res.status(403).json({ success: false, message: 'Job not found' });
        }

        job.status = (job.schedule.type == JOB_SCHEDULE_TYPE.SITE_VISIT) ? JOB_STATUS.ONGOING_SITE_VISIT : JOB_STATUS.ONGOING

        jobDay.status = JOB_DAY_STATUS.CONFIRMED
        jobDay.verified = true


        await jobDay.save(),
        await job.save()

        JobEvent.emit('JOB_DAY_CONFIRMED', {jobDay})

        return res.json({
            success: true,
            message: "Contractor arrival successfully confirmed",
            data: jobDay
        });

    } catch (err: any) {
        console.log("error", err)
        res.status(500).json({ message: err.message });
    }

}



export const savePreJobJobQualityAssurance = async (
    req: any,
    res: Response,
) => {

    try {
        const { jobDayId } = req.params;
        const { media = [] } = req.body;

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const customerId = req.customer.id

        const jobDay = await JobDayModel.findOne({ _id: jobDayId })
        if (!jobDay) {
            return res.status(403).json({ success: false, message: 'jobDay not found' });
        }

        if (jobDay.status != JOB_DAY_STATUS.CONFIRMED) {
            return res.status(403).json({ success: false, message: 'contractor has not been confirmed yet' });
        }


        jobDay.customerPreJobMedia = media
        await jobDay.save()


        res.json({
            success: true,
            message: "Pre Job Quality Assurance Media saved",
            data: jobDay
        });

    } catch (err: any) {
        console.log("error", err)
        res.status(500).json({ message: err.message });
    }

}

export const savePostJobQualityAssurance = async (
    req: any,
    res: Response,
) => {

    try {
        const { jobDayId } = req.params;
        const { media = [] } = req.body;

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const customerId = req.customer.id

        const jobDay = await JobDayModel.findOne({ _id: jobDayId })
        if (!jobDay) {
            return res.status(403).json({ success: false, message: 'jobDay not found' });
        }

        if (jobDay.status != JOB_DAY_STATUS.CONFIRMED) {
            return res.status(403).json({ success: false, message: 'contractor has not been confirmed yet' });
        }

        jobDay.customerPostJobMedia = media
        await jobDay.save()

        res.json({
            success: true,
            message: "Post Job Quality Assurance Media saved",
            data: jobDay
        });

    } catch (err: any) {
        console.log("error", err)
        res.status(500).json({ message: err.message });
    }

}

export const createJobEmergency = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Extract data from request body
        const { description, priority, date, media } = req.body;
        const customer = req.customer.id; // Assuming the contractor triggered the emergency
        const triggeredBy = 'customer'; // Assuming the contractor triggered the emergency
        const jobDayId = req.params.jobDayId

        const jobDay = await JobDayModel.findOne({ _id: jobDayId })
        if (!jobDay) {
            return res.status(403).json({ success: false, message: 'jobDay not found' });
        }

        // Create new job emergency instance
        const jobEmergency = await JobEmergencyModel.create({
            job: jobDay.job,
            customer: jobDay.customer,
            contractor: jobDay.contractor,
            description,
            priority,
            date: new Date,
            triggeredBy,
            media,
        });

        JobEvent.emit('JOB_DAY_EMERGENCY', { jobEmergency })

        return res.status(201).json({ success: true, message: 'Job emergency created successfully', data: jobEmergency });
    } catch (error: any) {
        next(new InternalServerError('Error creating job emergency:', error))
    }
};

export const createJobDispute = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Extract data from request body
        const { description, evidence } = req.body;
        const jobDayId = req.params.jobDayId; // Assuming job ID is in the URL params
        const customerId = req.customer.id; // Assuming user ID from request object

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const jobDay = await JobDayModel.findById(jobDayId);
        if (!jobDay) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Find the job using job ID
        const job = await JobModel.findById(jobDay.job);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if user is customer or contractor for the job
        if (!(job.customer == customerId) && !(job.contractor == customerId)) {
            return res.status(403).json({ success: false, message: 'Unauthorized to create dispute for this job' });
        }


        const dispute = await JobDisputeModel.findOneAndUpdate({
            job: job.id
        }, {
            description,
            job: job._id,
            customer: job.customer,
            contractor: job.contractor,
            disputer: job.customer,
            disputerType: 'customers',
            status: JOB_DISPUTE_STATUS.OPEN,
        }, { new: true, upsert: true });


        const contractorId = job.contractor
        const conversationMembers = [
            { memberType: 'customers', member: customerId },
            { memberType: 'contractors', member: contractorId }
        ];

        const conversation = await ConversationModel.findOneAndUpdate(
            {
                type: CONVERSATION_TYPE.GROUP_CHAT,
                entity: dispute.id,
                entityType: 'job_disputes',
                $and: [
                    { members: { $elemMatch: { member: customerId } } }, // memberType: 'customers'
                    { members: { $elemMatch: { member: contractorId } } } // memberType: 'contractors'
                ]
            },
            {
                members: conversationMembers,
                lastMessage: `New Dispute Created: ${description}`, // Set the last message to the job description
                lastMessageAt: new Date() // Set the last message timestamp to now
            },
            { new: true, upsert: true }
        );

        const disputeEvidence = evidence.map((url: string) => ({
            url,
            addedBy: 'customer',
            addedAt: new Date(),
        }));

        dispute.evidence.push(...disputeEvidence);

        dispute.conversation = conversation.id
        await dispute.save()

        job.status = JOB_STATUS.DISPUTED


        job.statusUpdate = {
            isContractorAccept: true,
            isCustomerAccept: false,
            awaitingConfirmation: false,
            status: 'REJECTED',
        }

        await job.save()

        JobEvent.emit('JOB_DISPUTE_CREATED', { dispute: dispute });

        return res.status(201).json({ success: true, message: 'Job dispute created successfully', data: dispute });

    } catch (error: any) {
        next(new InternalServerError('Error creating job dispute:', error));
    }
};

export const confirmJobDayCompletion = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { jobDayId } = req.params;

        const jobDay = await JobDayModel.findById(jobDayId);
        
        if (!jobDay) {
            return res.status(404).json({ success: false, message: 'Job Day not found' });
        }

        const customer = await CustomerModel.findById(customerId);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        // Find the job
        const job = await JobModel.findById(jobDay.job);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        const quotation = await JobQuotationModel.findById(job.contract)
        if(!quotation) return res.status(400).json({ success: false, message: 'Job quotation not found' });

        // Check if the contractor is the owner of the job
        if (job.customer.toString() !== customerId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to mark  this booking as complete' });
        }

        if (!job.statusUpdate ) {
            return res.status(400).json({ success: false, message: 'Contractor has not yet created a status update' });
        }

     
        if (!job.statusUpdate.awaitingConfirmation) {
            return res.status(400).json({ success: false, message: 'Contractor has not requested for a status update' });
        }

        // if (job.statusUpdate.status !== JOB_STATUS.COMPLETED) {
        //     return res.status(400).json({ success: false, message: 'Contractor has not yet marked job as completed' });
        // }

        const jobStatus = (job.schedule.type == JOB_SCHEDULE_TYPE.SITE_VISIT) ? JOB_STATUS.COMPLETED_SITE_VISIT : JOB_STATUS.COMPLETED
        job.statusUpdate = {
            ...job.statusUpdate,
            status: jobStatus,
            isCustomerAccept: true,
            awaitingConfirmation: false
        }

        // if schedul was a site visit
        //change job to pending and quotation type to jobday
        if(job.schedule.type == JOB_SCHEDULE_TYPE.SITE_VISIT){
            job.status = JOB_STATUS.PENDING
            quotation.type = JOB_QUOTATION_TYPE.JOB_DAY
        } 

        job.status = jobStatus  // since its customer accepting job completion
        jobDay.status = JOB_DAY_STATUS.COMPLETED  
        job.jobHistory.push({
            eventType: 'JOB_MARKED_COMPLETE_BY_CUSTOMER',
            timestamp: new Date(),
            payload: {}
        });

        JobEvent.emit('JOB_COMPLETED', { job })
        await job.save();
        await jobDay.save();

        res.json({ success: true, message: 'Booking marked as completed successfully', data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};



export const rejectJobDayCompletion = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { jobDayId } = req.params;

        const jobDay = await JobDayModel.findById(jobDayId);
        
        if (!jobDay) {
            return res.status(404).json({ success: false, message: 'Job Day not found' });
        }

        const customer = await CustomerModel.findById(customerId);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        // Find the job
        const job = await JobModel.findById(jobDay.job);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        const quotation = await JobQuotationModel.findById(job.contract)
        if(!quotation) return res.status(400).json({ success: false, message: 'Job quotation not found' });

        // Check if the contractor is the owner of the job
        if (job.customer.toString() !== customerId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to mark  this booking as complete' });
        }

     
        if (!job.statusUpdate.awaitingConfirmation) {
            return res.status(400).json({ success: false, message: 'Contractor has not requested for a status update' });
        }


        const jobStatus = (job.schedule.type == JOB_SCHEDULE_TYPE.SITE_VISIT) ? JOB_STATUS.DISPUTED : JOB_STATUS.DISPUTED
        job.statusUpdate = {
            ...job.statusUpdate,
            status: 'REJECTED',
            isCustomerAccept: true,
            awaitingConfirmation: false
        }


        job.status = jobStatus  // since its customer accepting job completion
        jobDay.status = JOB_DAY_STATUS.COMPLETED  
        job.jobHistory.push({
            eventType: 'JOB_MARKED_COMPLETE_BY_CUSTOMER',
            timestamp: new Date(),
            payload: {}
        });

        JobEvent.emit('JOB_COMPLETED', { job })
        await job.save();
        await jobDay.save();

        res.json({ success: true, message: 'Booking marked as completed successfully', data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};





export const CustomerJobDayController = {
    confirmContractorArrival,
    savePostJobQualityAssurance,
    savePreJobJobQualityAssurance,
    createJobEmergency,
    initiateJobDay,
    createJobDispute,
    confirmJobDayCompletion,
};
