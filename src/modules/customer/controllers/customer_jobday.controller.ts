import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { NotificationService } from "../../../services/notifications/index";
import { JOB_DAY_STATUS, JobDayModel } from "../../../database/common/job_day.model";
import { JobEmergencyModel } from "../../../database/common/job_emergency.model";
import { InternalServerError } from "../../../utils/custom.errors";
import { JobEvent } from "../../../events";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { JOB_STATUS, JobModel } from "../../../database/common/job.model";
import { ConversationModel } from "../../../database/common/conversations.schema";


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
         const job = await JobModel.findOne({ _id: jobId, customer: customerId, status: JOB_STATUS.BOOKED }).populate('customer', 'contractor');
         if (!job) {
             return res.status(403).json({ success: false, message: 'Job  not found' });
         }

        const contractorId = job.contractor
        const contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId });
        if (!contractorProfile) {
            return res.status(403).json({ success: false, message: 'Contractor profile not found' });
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
            customer: job.customer,
            contractor: job.contractor,
            booking: job
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

export const confirmTrip = async (
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

        const jobDay = await JobDayModel.findOne({_id: jobDayId})
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

        jobDay.status = JOB_DAY_STATUS.CONFIRMED
        jobDay.verified = true
        await jobDay.save()

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: jobDay.contractor.toString(),
                userType: 'contractors',
                title: 'jobDay',
                heading: {},
                type: 'tripDayComfirmed',
                message: 'Customer confirmed your arrival.',
                payload: {jobDayId: jobDayId, verificationCode}
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )


        // send notification to  customer
        NotificationService.sendNotification(
            {
                user: jobDay.customer,
                userType: 'customers',
                title: 'jobDay',
                heading: {},
                type: 'tripDayComfirmed',
                message: "You successfully confirmed the contractor's arrival.",
                payload: {jobDayId: jobDayId, verificationCode}
            },
            {
                push: true,
                socket: true,
                database: true
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



export const uploadQualityAssurancePhotos = async (
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

        const jobDay = await JobDayModel.findOne({_id: jobDayId})
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

        jobDay.status = JOB_DAY_STATUS.CONFIRMED
        jobDay.verified = true
        await jobDay.save()

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: jobDay.contractor.toString(),
                userType: 'contractors',
                title: 'jobDay',
                heading: {},
                type: 'tripDayComfirmed',
                message: 'Customer confirmed your arrival.',
                payload: {jobDayId: jobDayId, verificationCode}
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )


        // send notification to  customer
        NotificationService.sendNotification(
            {
                user: jobDay.customer,
                userType: 'customers',
                title: 'jobDay',
                heading: {},
                type: 'tripDayComfirmed',
                message: "You successfully confirmed the contractor's arrival.",
                payload: {jobDayId: jobDayId, verificationCode}
            },
            {
                push: true,
                socket: true,
                database: true
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



export const createJobEmergency = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Extract data from request body
        const { description, priority, date, media } = req.body;
        const customer = req.customer.id; // Assuming the contractor triggered the emergency
        const triggeredBy = 'customer'; // Assuming the contractor triggered the emergency
        const jobDayId = req.params.jobDayId

        const jobDay = await JobDayModel.findOne({_id: jobDayId})
        if (!jobDay) {
            return res.status(403).json({ success: false, message: 'jobDay not found' });
        }

        // Create new job emergency instance
        const jobEmergency = await JobEmergencyModel.create({
            job: jobDay.job,
            customer:jobDay.customer,
            contractor:jobDay.contractor,
            description,
            priority,
            date: new Date,
            triggeredBy,
            media,
        });

        JobEvent.emit('JOB_DAY_EMERGENCY', {jobEmergency})

        return res.status(201).json({ success: true, message: 'Job emergency created successfully', data: jobEmergency });
    } catch (error: any) {
        next(new InternalServerError('Error creating job emergency:', error))
    }
};


export const CustomerJobDayController = {
    confirmTrip,
    uploadQualityAssurancePhotos,
    createJobEmergency,
    initiateJobDay
};
