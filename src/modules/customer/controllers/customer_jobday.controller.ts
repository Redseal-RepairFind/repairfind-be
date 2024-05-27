import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { NotificationService } from "../../../services/notifications/index";
import { JOB_DAY_STATUS, JobDayModel } from "../../../database/common/job_day.model";
import { JobEmergencyModel } from "../../../database/common/job_emergency.model";
import { InternalServerError } from "../../../utils/custom.errors";
import { JobEvent } from "../../../events";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { JOB_STATUS, JobModel } from "../../../database/common/job.model";
import { CONVERSATION_TYPE, ConversationModel } from "../../../database/common/conversations.schema";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { JOB_DISPUTE_STATUS, JobDisputeModel } from "../../../database/common/job_dispute.model";


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
        const job = await JobModel.findOne({ _id: jobId, customer: customerId, status: {$in: [JOB_STATUS.BOOKED, JOB_STATUS.ONGOING ]} }).populate('customer', 'contractor');
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job  not found' });
        }
 

        const activeTrip = await JobDayModel.findOne({ job: jobId, status: { $in: ['STARTED', 'ARRIVED', 'CONFIRMED', 'PENDING'] } });
        // if (activeTrip) {
        //     return res.status(400).json({ success: false, message: 'An active trip already exists for this job' });
        // }

        const contractorId = job.contractor

        const contractor = await ContractorModel.findById(job.contractor);
        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Job Contractor not found' });
        }

        const customer = await CustomerModel.findOne({ _id: job.customer });
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Job Customer not found' });
        }

        const contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId });
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




        const data = {
            jobLocation: job.location,
            contractorLocation: contractorProfile.location,
            conversation: conversation,
            customer: customer,
            contractor: contractor,
            booking: job,
            trip: activeTrip
        }

        res.json({
            success: true,
            message: "job day successfully initiated",
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
            return res.status(403).json({ success: false, message: 'jobDay not found' });
        }

        if (jobDay.status != JOB_DAY_STATUS.ARRIVED) {
            return res.status(403).json({ success: false, message: 'contractor has not arrived yet' });
        }

        if (jobDay.verified) {
            return res.status(403).json({ success: false, message: 'site already visited' });
        }

        if (jobDay.verificationCode !== verificationCode) {
            return res.status(403).json({ success: false, message: 'incorrect verification code' });
        }

        const job = await JobModel.findById(jobDay.job)
        if (!job) {
            return res.status(403).json({ success: false, message: 'Job not found' });
        }

        job.status = JOB_STATUS.ONGOING

        jobDay.status = JOB_DAY_STATUS.CONFIRMED
        jobDay.verified = true


        // await Promise.all([
        //     jobDay.save(),
        //     job.save()
        // ]);
        await jobDay.save(),
            await job.save()

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: jobDay.contractor.toString(),
                userType: 'contractors',
                title: 'jobDay',
                heading: {},
                type: 'JOB_DAY_CONFIRMED',
                message: 'Customer confirmed your arrival.',
                payload: {event: 'JOB_DAY_CONFIRMED', jobDay }
            },
            {
                push: true,
                socket: true,
                // database: true
            }
        )


        // send notification to  customer
        NotificationService.sendNotification(
            {
                user: jobDay.customer,
                userType: 'customers',
                title: 'jobDay',
                heading: {},
                type: 'JOB_DAY_CONFIRMED',
                message: "You successfully confirmed the contractor's arrival.",
                payload: {event: 'JOB_DAY_CONFIRMED', jobDay }
            },
            {
                push: true,
                socket: true,
                // database: true
            }
        )

        res.json({
            success: true,
            message: "contractor arrival successfully comfirmed",
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

        const filedBy = 'customer';

        const dispute = await JobDisputeModel.findOneAndUpdate({
            job: job.id
        }, {
            description,
            job: job._id,
            customer: job.customer,
            contractor: job.contractor,
            filedBy,
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



export const CustomerJobDayController = {
    confirmContractorArrival,
    savePostJobQualityAssurance,
    savePreJobJobQualityAssurance,
    createJobEmergency,
    initiateJobDay,
    createJobDispute
};
