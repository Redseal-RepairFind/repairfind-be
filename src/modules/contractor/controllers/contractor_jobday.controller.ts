import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { JobModel, JOB_STATUS, JOB_SCHEDULE_TYPE } from "../../../database/common/job.model";
import { generateOTP } from "../../../utils/otpGenerator";
import { JOB_DAY_STATUS, JOB_DAY_TYPE, JobDayModel } from "../../../database/common/job_day.model";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import { JobEvent } from "../../../events";
import { JobEmergencyModel } from "../../../database/common/job_emergency.model";
import { ConversationModel } from "../../../database/common/conversations.schema";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { JOB_DISPUTE_STATUS, JobDisputeModel } from "../../../database/common/job_dispute.model";
import { JOB_QUOTATION_TYPE, JobQuotationModel } from "../../../database/common/job_quotation.model";
import { ConversationUtil } from "../../../utils/conversation.util";


export const startTrip = async (
    req: any,
    res: Response,
) => {

    try {
        const { jobId, contractorLocation } = req.body;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const contractorId = req.contractor.id

        const job = await JobModel.findOne({ _id: jobId, status: JOB_STATUS.BOOKED });

        // Check if the job request exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job booking not found' });
        }

        const jobDay = await JobDayModel.findOneAndUpdate(
            { job: jobId, type: job.schedule.type, status: { $nin: [JOB_DAY_STATUS.DISPUTED, JOB_DAY_STATUS.COMPLETED] } },
            {
                customer: job.customer,
                contractor: contractorId,
                status: JOB_DAY_STATUS.STARTED,
                jobLocation: job.location,
                contractorLocation,
                type: job.schedule.type
            },
            { new: true, upsert: true }
        );

        JobEvent.emit('JOB_DAY_STARTED', { job, jobDay })


        res.json({
            success: true,
            message: "Jobday jobDay successfully started",
            data: { jobLocation: job.location, jobDay }
        });

    } catch (err: any) {
        console.log("error", err)
        res.status(500).json({ message: err.message });
    }

}

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


        // Find the job request by ID
        const job = await JobModel.findOne({ _id: jobId }).populate('assignment.contractor');
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job booking not found' });
        }

        let contractorId = req.contractor.id
        if (job.isAssigned && job.assignment) contractorId = job.assignment.contractor
        let contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId });

        if (!contractorProfile) {
            return res.status(404).json({ success: false, message: 'Contractor profile not found' });
        }

        const contractor = await ContractorModel.findById(contractorId);
        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Job Contractor not found' });
        }


        // Find the job request by ID
        const customer = await CustomerModel.findOne({ _id: job.customer });
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Job Customer not found' });
        }


        const jobDay = await JobDayModel.findOne({ job: jobId, type: job.schedule.type, status: { $nin: [JOB_DAY_STATUS.DISPUTED, JOB_DAY_STATUS.COMPLETED] } });
        // if(jobDay){
        //     return res.status(400).json({ success: false, message: 'Jobday does not exists for the current schedule, kindly start a job' });
        // }

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

        // let contractorLocation = contractorProfile.location
        let contractorLocation = jobDay?.contractorLocation
        // if job is assigned show assigned contractor location
        if (job.isAssigned) {
            contractorProfile = await ContractorProfileModel.findOne({ contractor: job.assignment.contractor });
            if (contractorProfile) contractorLocation = contractorProfile?.location
        }
        const data = {
            conversation: conversation.id,
            customer: { id: customer.id, phoneNumber: customer.phoneNumber, name: customer.name, email: customer.email, profilePhoto: customer.profilePhoto },
            contractor: { id: contractor.id, phoneNumber: contractor.phoneNumber, name: contractor.name, email: contractor.email, profilePhoto: contractor.profilePhoto },
            job: { id: job.id, description: job.description, title: job.title, schedule: job.schedule, type: job.type, date: job.date, location: job.location, assignment: job.assignment },
            contractorLocation: contractorLocation,
            jobDay
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


export const confirmArrival = async (
    req: any,
    res: Response,
) => {

    try {
        const { jobDayId } = req.params;

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const contractorId = req.contractor.id
        const contractor = await ContractorModel.findById(contractorId)
        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }

        const jobDay = await JobDayModel.findOne({ _id: jobDayId })
        if (!jobDay) {
            return res.status(403).json({ success: false, message: 'JobDay not found' });
        }

        if (!(jobDay.status === JOB_DAY_STATUS.STARTED || jobDay.status === JOB_DAY_STATUS.ARRIVED)) {
            return res.status(403).json({ success: false, message: 'JobDay trip not started yet' });
        }

        if (jobDay.verified) {
            return res.status(403).json({ success: false, message: 'JobDay trip already verified' });
        }

        const verificationCode = generateOTP()

        jobDay.verificationCode = parseInt(verificationCode)
        jobDay.status = JOB_DAY_STATUS.ARRIVED
        await jobDay.save()


        JobEvent.emit('JOB_DAY_ARRIVAL', { jobDay, verificationCode })

        res.json({
            success: true,
            message: "You have arrived at site, awaiting customer confirmation",
            data: { verificationCode }
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
        const contractorId = req.contractor.id; // Assuming the contractor triggered the emergency
        const triggeredBy = 'contractor'; // Assuming the contractor triggered the emergency
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
        const { description, reason, evidence } = req.body;
        const jobDayId = req.params.jobDayId; // Assuming jo
        const contractorId = req.contractor.id; // Assuming user ID from request object

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
        if (!(job.contractor == contractorId)) {
            return res.status(403).json({ success: false, message: 'Unauthorized to create dispute for this job' });
        }

        const dispute = await JobDisputeModel.findOneAndUpdate({
            job: job.id
        }, {
            description,
            job: job._id,
            customer: job.customer,
            contractor: job.contractor,
            disputer: job.contractor,
            disputerType: 'contractors',
            status: JOB_DISPUTE_STATUS.OPEN,
        }, { new: true, upsert: true });


        const customerId = job.customer


        if (evidence) {
            const disputeEvidence = evidence.map((url: string) => ({
                url,
                addedBy: 'contractor',
                addedAt: new Date(),
            }));
            dispute.evidence.push(...disputeEvidence);
        }

        //if job was previously disputed, assign dispute to previous arbitrator
        const previousDispute = await JobDisputeModel.findOne({ job: job.id, status: JOB_DISPUTE_STATUS.REVISIT })
        if (job.revisitEnabled && previousDispute) {
            dispute.status = JOB_DISPUTE_STATUS.ONGOING
            dispute.arbitrator = previousDispute.arbitrator
            dispute.status = JOB_DISPUTE_STATUS.ONGOING
            const { customerContractor, arbitratorContractor, arbitratorCustomer } = await ConversationUtil.updateOrCreateDisputeConversations(dispute)
            dispute.conversations = { customerContractor, arbitratorContractor, arbitratorCustomer }
        }

        await dispute.save()

        job.status = JOB_STATUS.DISPUTED
        await job.save()

        JobEvent.emit('JOB_DISPUTE_CREATED', { dispute: dispute });


        return res.status(201).json({ success: true, message: 'Job dispute created successfully', data: dispute });

    } catch (error: any) {
        next(new InternalServerError('Error creating job dispute:', error));
    }
};


export const markJobDayComplete = async (req: any, res: Response, next: NextFunction) => {
    try {
        const contractorId = req.contractor.id;
        const { jobDayId } = req.params;

        // Find the job
        const jobDay = await JobDayModel.findById(jobDayId);
        if (!jobDay) {
            return res.status(404).json({ success: false, message: 'Job day not found' });
        }

        const job = await JobModel.findById(jobDay.job);

        const contractor = await ContractorModel.findById(contractorId);

        // Check if the contractor exists
        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Contractor for job not found' });
        }


        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if the contractor is the owner of the job
        if (!(job.contractor.toString() == contractorId || job?.assignment?.contractor.toString() == contractorId)) {
            return res.status(403).json({ success: false, message: 'You are not authorized to mark this job day as complete' });
        }

        // Check if the job is already canceled
        if (job.status === JOB_STATUS.COMPLETED) {
            // return res.status(400).json({ success: false, message: 'The booking is already marked as complete' });
        }


        const jobStatus = (job.schedule.type == JOB_SCHEDULE_TYPE.SITE_VISIT) ? JOB_STATUS.COMPLETED_SITE_VISIT : JOB_STATUS.COMPLETED


        job.statusUpdate = {
            ...job.statusUpdate,
            status: jobStatus,
            isCustomerAccept: false,
            isContractorAccept: true,
            awaitingConfirmation: true
        }

        job.jobHistory.push({
            eventType: 'JOB_MARKED_COMPLETE_BY_CONTRACTOR',
            timestamp: new Date(),
            payload: {}
        });

        JobEvent.emit('JOB_MARKED_COMPLETE_BY_CONTRACTOR', { job })
        await job.save();

        res.json({ success: true, message: 'Jobday marked as complete successfully', data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};


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

        const jobDay = await JobDayModel.findOne({ _id: jobDayId })
        if (!jobDay) {
            return res.status(403).json({ success: false, message: 'jobDay not found' });
        }

        if (jobDay.status != JOB_DAY_STATUS.CONFIRMED) {
            return res.status(403).json({ success: false, message: 'contractor has not  yet been confirmed yet' });
        }

        jobDay.contractorPreJobMedia = media
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

        const jobDay = await JobDayModel.findOne({ _id: jobDayId })
        if (!jobDay) {
            return res.status(403).json({ success: false, message: 'jobDay not found' });
        }

        if (jobDay.status != JOB_DAY_STATUS.CONFIRMED) {
            return res.status(403).json({ success: false, message: 'contractor has not  yet been confirmed yet' });
        }

        jobDay.contractorPostJobMedia = media
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


// export const submitEstimate = async (req: any, res: Response, next: NextFunction) => {
//     try {
//         const contractorId = req.contractor.id;
//         const { jobDayId } = req.params;
//         const { estimates } = req.body;


//         const jobDay = await JobDayModel.findById(jobDayId);
//         if (!jobDay) {
//             return res.status(404).json({ success: false, message: 'Job Day not found' });
//         }

//         const contractor = await ContractorModel.findById(contractorId);
//         if (!contractor) {
//             return res.status(404).json({ success: false, message: 'Customer not found' });
//         }

//         // Find the job
//         const job = await JobModel.findById(jobDay.job);


//         // Check if the job exists
//         if (!job) {
//             return res.status(404).json({ success: false, message: 'Job not found' });
//         }

//         // Check if the contractor is the owner of the job


//         if ( jobDay.type !== JOB_DAY_TYPE.SITE_VISIT ) {
//             return res.status(400).json({ success: false, message: 'Estimate can only be submitted for site visit' });
//         }

//         // if (job.statusUpdate && job.statusUpdate.status == JOB_STATUS.COMPLETED_SITE_VISIT &&  job.statusUpdate.awaitingConfirmation) {
//         //     // return res.status(400).json({ success: false, message: 'Customer has not confirmed completion of site visit' });
//         // }

//         const quotation = await JobQuotationModel.findById(job.contract)
//         if(!quotation) return res.status(400).json({ success: false, message: 'Job quotation not found' });

//         quotation.startDate = job.date ?? new Date()
//         quotation.estimates = estimates



//         job.statusUpdate = {
//             ...job.statusUpdate,
//             status: 'SITE_VISIT_ESTIMATE_SUBMITTED',
//             isCustomerAccept: false,
//             awaitingConfirmation: true
//         }

//         job.jobHistory.push({
//             eventType: 'SITE_VISIT_ESTIMATE_SUBMITTED',
//             timestamp: new Date(),
//             payload: {}
//         });


//         // change quotation type to 'JOB_DAY'? or create a new job with quotation sent as contract, or allow jobs to hav multiple 
//         // also change job status to pending

//         job.status = JOB_STATUS.PENDING
//         quotation.type = JOB_QUOTATION_TYPE.JOB_DAY


//         await Promise.all([
//             quotation.save(),
//             job.save()
//         ])
//         // await quotation.save();
//         // await job.save();

//         JobEvent.emit('SITE_VISIT_ESTIMATE_SUBMITTED', { job })

//         res.json({ success: true, message: 'Site visit estimate submitted successfully', data: job });
//     } catch (error: any) {
//         return next(new BadRequestError('An error occurred', error));
//     }
// };



export const submitEstimate = async (req: any, res: Response, next: NextFunction) => {
    try {
        const contractorId = req.contractor.id;
        const { jobDayId } = req.params;
        const { estimates } = req.body;

        const jobDay = await JobDayModel.findById(jobDayId);
        if (!jobDay) {
            return res.status(404).json({ success: false, message: 'Job Day not found' });
        }

        const contractor = await ContractorModel.findById(contractorId);
        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }

        // Find the original job
        const job = await JobModel.findById(jobDay.job);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (jobDay.type !== JOB_DAY_TYPE.SITE_VISIT) {
            return res.status(400).json({ success: false, message: 'Estimate can only be submitted for a site visit' });
        }

        const quotation = await JobQuotationModel.findById(job.contract);
        if (!quotation) {
            return res.status(400).json({ success: false, message: 'Job quotation not found' });
        }

        // Convert the existing job to a plain object
        const jobObject = job.toObject() as any; // Explicitly cast to a plain object

        var date = new Date();
        date.setDate(date.getDate() + 7);

        // Create a new job based on the existing job
        const newJob = new JobModel({
            ...jobObject, // Spread the plain object
            date: date, // can be rescheduled
            _id: undefined, // Ensure MongoDB generates a new _id
            status: JOB_STATUS.SUBMITTED, // Set the new status for the new job
            jobHistory: [], // Reset job history for the new job
            statusUpdate: {
                status: 'SITE_VISIT_ESTIMATE_SUBMITTED',
                isCustomerAccept: false,
                awaitingConfirmation: true
            }
        });

        // Create a new quotation and attach it to the new job
        const newQuotation = new JobQuotationModel({
            startDate: job.date ?? new Date(),
            estimates,
            type: JOB_QUOTATION_TYPE.JOB_DAY // Set the new quotation type
        });

        // Attach the new quotation as a contract to the new job
        newJob.contract = newQuotation._id;
        newJob.contractor = contractor._id;
        newJob.siteVisitJob = job._id;

        // Update job history for the new job
        newJob.jobHistory.push({
            eventType: 'SITE_VISIT_ESTIMATE_SUBMITTED',
            timestamp: new Date(),
            payload: {}
        });

        // Save both the new job and new quotation
        await Promise.all([newJob.save(), newQuotation.save(), job.save()]);

        // Emit the event
        JobEvent.emit('SITE_VISIT_ESTIMATE_SUBMITTED', { job: newJob });

        res.json({
            success: true,
            message: 'Site visit estimate submitted successfully',
            data: newJob
        });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};


export const ContractorJobDayController = {
    startTrip,
    confirmArrival,
    createJobEmergency,
    initiateJobDay,
    savePostJobQualityAssurance,
    savePreJobJobQualityAssurance,
    createJobDispute,
    markJobDayComplete,
    submitEstimate
};