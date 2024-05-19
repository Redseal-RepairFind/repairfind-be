import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { JobModel, JOB_STATUS, JobType } from "../../../database/common/job.model";
import { generateOTP } from "../../../utils/otpGenerator";
import { NotificationService } from "../../../services/notifications/index";
import { JOB_DAY_STATUS, JobDayModel } from "../../../database/common/job_day.model";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { InternalServerError } from "../../../utils/custom.errors";
import { JobEvent } from "../../../events";
import { JobEmergencyModel } from "../../../database/common/job_emergency.model";
import { ConversationModel } from "../../../database/common/conversations.schema";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";


export const startTrip = async (
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

        const contractorId = req.contractor.id

        // Find the job request by ID
        const job = await JobModel.findOne({ _id: jobId, contractor: contractorId, status: JOB_STATUS.BOOKED });

        // Check if the job request exists
        if (!job) {
            return res.status(403).json({ success: false, message: 'Job request not found' });
        }

        // Check if an active trip already exists for the specified job
        const activeTrip = await JobDayModel.findOne({ job: jobId, status: JOB_DAY_STATUS.STARTED });

        if (activeTrip) {
            return res.status(400).json({ success: false, message: 'An active trip already exists for this job' });
        }

        const trip = await JobDayModel.create({
            customer: job.customer,
            contractor: contractorId,
            job: jobId,
            status: JOB_DAY_STATUS.STARTED,
            type: job.schedule.type
        })

        // send notification to contractor
        NotificationService.sendNotification(
            {
                user: contractorId,
                userType: 'contractors',
                title: 'trip',
                heading: {},
                type: 'tripDayStart',
                message: 'trip successfully started',
                payload: { jobDayId: trip._id }
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )

        // send notification to customer
        NotificationService.sendNotification(
            {
                user: job.customer.toString(),
                userType: 'customers',
                title: 'trip',
                heading: {},
                type: 'tripDayStart',
                message: 'Contractor starts trip to your site.',
                payload: { jobDayId: trip._id }
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )

        res.json({
            success: true,
            message: "trip successfully started",
            data: { jobLocation: job.location, trip: trip }
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

        const contractorId = req.contractor.id

        const contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId });
        if (!contractorProfile) {
            return res.status(403).json({ success: false, message: 'Contractor profile not found' });
        }

        // Find the job request by ID
        const job = await JobModel.findOne({ _id: jobId, contractor: contractorId, status: JOB_STATUS.BOOKED }).populate('customer', 'contractor');
        if (!job) {
            return res.status(403).json({ success: false, message: 'Job request not found' });
        }


        // Check if an active trip already exists for the specified job
        const activeTrip = await JobDayModel.findOne({ job: jobId, status: JOB_DAY_STATUS.STARTED });
        // if (activeTrip) {
        //     return res.status(400).json({ success: false, message: 'An active trip already exists for this job' });
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




        const data = {
            jobLocation: job.location,
            contractorLocation: contractorProfile.location,
            conversation: conversation,
            customer: job.customer,
            contractor: job.contractor,
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

        const trip = await JobDayModel.findOne({ _id: jobDayId })
        if (!trip) {
            return res.status(403).json({ success: false, message: 'trip not found' });
        }

        if (!(trip.status === JOB_DAY_STATUS.STARTED || trip.status === JOB_DAY_STATUS.ARRIVED)) {
            return res.status(403).json({ success: false, message: 'Trip not started yet' });
        }

        if (trip.verified) {
            return res.status(403).json({ success: false, message: 'Trio already visited' });
        }

        const verificationCode = generateOTP()

        trip.verificationCode = parseInt(verificationCode)
        trip.status = JOB_DAY_STATUS.ARRIVED
        await trip.save()

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: contractorId,
                userType: 'contractors',
                title: 'trip',
                heading: {},
                type: 'JOB_DAY_ARRIVAL',
                message: 'you successfully arrrived at site, wait for comfirmation from customer.',
                payload: { jobDayId: jobDayId, verificationCode }
            },
            {
                push: true,
                socket: true,
            }
        )


        // send notification to  customer
        NotificationService.sendNotification(
            {
                user: trip.customer.toString(),
                userType: 'customers',
                title: 'trip',
                heading: { name: contractorId, image: contractorId },
                type: 'JOB_DAY_ARRIVAL',
                message: 'Contractor is at your site.',
                payload: { jobDayId: jobDayId, verificationCode }
            },
            {
                push: true,
                socket: true,
            }
        )

        res.json({
            success: true,
            message: "you successfully arrrived at site, wait for comfirmation from customer",
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



export const ContractorJobDayController = {
    startTrip,
    confirmArrival,
    createJobEmergency,
    initiateJobDay
};