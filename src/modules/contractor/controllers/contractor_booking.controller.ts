import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { htmlJobRequestTemplate } from "../../../templates/contractorEmail/jobRequestTemplate";
import { EmailService, NotificationService } from "../../../services";
import { addHours, isFuture, isValid, startOfDay } from "date-fns";
import { IJob, JobModel, JOB_STATUS, JobType, IJobSchedule, JOB_SCHEDULE_TYPE, IJobAssignment, IJobReSchedule } from "../../../database/common/job.model";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import { applyAPIFeature } from "../../../utils/api.feature";
import { ConversationModel } from "../../../database/common/conversations.schema";
import { IMessage, MessageModel, MessageType } from "../../../database/common/messages.schema";
import { JOB_QUOTATION_STATUS, JobQuotationModel } from "../../../database/common/job_quotation.model";
import { JobEvent } from "../../../events";
import mongoose from "mongoose";
import { CONTRACTOR_REVIEW_TYPE, CONTRACTOR_TYPES, IContractorReview } from "../../../database/contractor/interface/contractor.interface";
import ContractorTeamModel, { IContractorTeam } from "../../../database/contractor/models/contractor_team.model";
import { NewJobAssignedEmailTemplate } from "../../../templates/contractorEmail/job_assigned.template";



export const getMyBookings = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Validate incoming request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract query parameters
        const {
            limit = 10,
            page = 1,
            sort = '-createdAt',
            customerId,
            status = 'BOOKED',
            startDate,
            endDate,
            date,
            type
        } = req.query;

        req.query.page = page
        req.query.limit = limit
        req.query.sort = sort

        const contractorId = req.contractor.id;

        // Construct filter object based on query parameters
        let filter: any = {
            $or: [
                { contractor: contractorId },
                { 'assignment.contractor': contractorId }
            ]
        };

        // TODO: when contractor is specified, ensure the contractor quotation is attached
        if (customerId) {
            if (!mongoose.Types.ObjectId.isValid(customerId)) {
                return res.status(400).json({ success: false, message: 'Invalid customer id' });
            }
            req.query.customer = customerId;
            delete req.query.customerId
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
        const { data, error } = await applyAPIFeature(JobModel.find(filter).populate(['customer', 'contract']), req.query);

        if (data) {

            await Promise.all(data.data.map(async (job: any) => {
                if (contractorId) {

                    if (job.isAssigned) {
                        job.myQuotation = await job.getMyQoutation(job.contractor)
                    } else {
                        job.myQuotation = await job.getMyQoutation(contractorId)
                    }
                }
            }));
        }


        res.json({ success: true, message: 'Bookings retrieved', data: data });

    } catch (error: any) {
        return next(new BadRequestError('An error occured ', error))
    }
};


export const getBookingHistory = async (req: any, res: Response, next: NextFunction) => {
    const contractorId = req.contractor.id

    try {
        let {
            page = 1, // Default to page 1
            limit = 10, // Default to 10 items per page
            sort = '-createdAt', // Sort field and order (-fieldName or fieldName)
            customerId,
            status = 'COMPLETED, CANCELED, DECLINED, EXPIRED, COMPLETED, DISPUTED',
        } = req.query;


        req.query.page = page
        req.query.limit = limit
        req.query.sort = sort
        delete req.query.status

        const statusArray = status.split(',').map((s: any) => s.trim()); // Convert the comma-separated string to an array of statuses
        let filter: any = {
            status: { $in: statusArray },
            $or: [
                { contractor: contractorId },
                { 'assignment.contractor': contractorId }
            ]
        };

        if (customerId) {
            if (!mongoose.Types.ObjectId.isValid(customerId)) {
                return res.status(400).json({ success: false, message: 'Invalid customer id' });
            }
            req.query.customer = customerId
            delete req.query.customerId
        }

        // Query JobModel to find jobs that have IDs present in the extracted jobIds

        const { data, error } = await applyAPIFeature(
            JobModel.find(filter).distinct('_id').populate('customer'),
            req.query);
        if (data) {
            // Map through each job and attach myQuotation if contractor has applied 
            await Promise.all(data.data.map(async (job: any) => {
                if (job.isAssigned) {
                    job.myQuotation = await job.getMyQoutation(job.contractor)
                } else {
                    job.myQuotation = await job.getMyQoutation(contractorId)
                }
            }));
        }

        if (error) {
            return next(new BadRequestError('Unkowon error occured', error as Error));
        }

        // Send response with job listings data
        res.status(200).json({ success: true, data: data });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};



export const getSingleBooking = async (req: any, res: Response, next: NextFunction) => {
    try {

        const contractorId = req.contractor.id
        const bookingId = req.params.bookingId;

        const job = await JobModel.findOne({
            $or: [
                { contractor: contractorId },
                { 'assignment.contractor': contractorId }
            ], _id: bookingId
        }).populate(['contractor', 'contract', 'customer', 'assignment.contractor']);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // If the job exists, return it as a response
        res.json({ success: true, message: 'Booking retrieved', data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occured ', error))
    }
};



export const requestBookingReschedule = async (req: any, res: Response, next: NextFunction) => {
    try {
        const contractorId = req.contractor.id;
        const { bookingId } = req.params;
        const job = await JobModel.findById(bookingId);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if the customer is the owner of the job
        if (job.contractor.toString() !== contractorId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to perform this action' });
        }


        const { date, remark } = req.body; // Assuming you're sending new start and end dates along with a remark in the request body

        // Update job schedule with new dates and set flags
        const updatedSchedule: IJobReSchedule = {
            date, // Assuming the rescheduled date replaces the previous one
            awaitingConfirmation: true, // Flag for indicating rescheduling request
            isCustomerAccept: false, // Assume the customer has has already confirmed the rescheduling
            isContractorAccept: true, // The contractor has to confirm the rescheduling
            createdBy: 'contractor', // Assuming customer initiates the reschedule
            type: JOB_SCHEDULE_TYPE.JOB_DAY, // You might need to adjust this based on your business logic
            remark: remark // Adding a remark for the rescheduling
        };


        // Save rescheduling history in job history
        job.jobHistory.push({
            eventType: 'RESCHEDULE_REQUEST', // Custom event type identifier
            timestamp: new Date(), // Timestamp of the event
            payload: updatedSchedule // Additional payload specific to the event
        });

        job.reschedule = updatedSchedule;
        await job.save();

        //emit event here
        JobEvent.emit('NEW_JOB_RESHEDULE_REQUEST', { job })


        res.json({ success: true, message: 'Job reschedule request sent' });
    } catch (error: any) {
        return next(new InternalServerError('An error occurred', error));
    }
};


export const acceptOrDeclineReschedule = async (req: any, res: Response, next: NextFunction) => {
    try {
        const contractorId = req.contractor.id;
        const { bookingId, action } = req.params;
        const job = await JobModel.findById(bookingId);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if the customer is the owner of the job
        if (job.contractor.toString() !== contractorId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to perform this action' });
        }



        // Check if the job has a rescheduling request
        if (!job.reschedule) {
            return res.status(400).json({ success: false, message: 'No rescheduling request found for this job' });
        }

        // Ensure that the rescheduling was initiated by the contractor
        if (job.reschedule.createdBy == 'contractor') {
            return res.status(403).json({ success: false, message: 'You are not authorized to confirm this rescheduling request' });
        }

        // Update rescheduling flags based on customer's choice
        if (action == 'accept') {
            job.reschedule.isContractorAccept = true;

            if (job.reschedule.isContractorAccept && job.reschedule.isCustomerAccept) {
                job.reschedule.awaitingConfirmation = false;
            }

            job.schedule = {
                ...job.schedule, // Keep the existing properties from job.schedule
                startDate: job.reschedule.date, // Add or overwrite the startDate property
            };

            // Save rescheduling history in job history
            job.jobHistory.push({
                eventType: 'JOB_RESCHEDULED', // Custom event type identifier
                timestamp: new Date(), // Timestamp of the event
                payload: job.reschedule // Additional payload specific to the event
            });
            JobEvent.emit('JOB_RESHEDULE_DECLINED_ACCEPTED', { job, action: 'accepted' })
        } else {
            JobEvent.emit('JOB_RESHEDULE_DECLINED_ACCEPTED', { job, action: 'declined' })
            job.reschedule = null;
        }


        await job.save();

        res.json({ success: true, message: `Rescheduling request has been ${action}d` });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};


export const assignJob = async (req: any, res: Response, next: NextFunction) => {
    try {
        const contractorId = req.contractor.id;
        const { bookingId } = req.params;
        const { employeeId } = req.body;
        const job = await JobModel.findById(bookingId);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job.status !== JOB_STATUS.BOOKED) {
            return res.status(400).json({ success: false, message: 'Only booked jobs can be assigned' });
        }

        const contractor = await ContractorModel.findById(contractorId);
        const employee = await ContractorModel.findById(employeeId);


        // Check if the contractor exists
        if (!contractor || !employee) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }

        // Check if the customer is the owner of the job
        if (job.contractor.toString() !== contractorId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to perform this action' });
        }

        // Check if the contractor is a company
        if (contractor.accountType !== CONTRACTOR_TYPES.Company) {
            return res.status(403).json({ success: false, message: 'Only companies can assign jobs' });
        }

        console.log('employeeId', employeeId)

        // Check if the contractor is a member of the companies team
        const team = await ContractorTeamModel.findOne({ 'members.contractor': employeeId, contractor: contractorId });

        if (!team) {
            return res.status(403).json({ success: false, message: 'Contractor is not a member of your team, kindly invite' });
        }



        //TODO: Implement job assignment logic
        const assignData: IJobAssignment = {
            contractor: employeeId,
            date: new Date,
            confirmed: true// true by default
        }
        job.assignment = assignData
        job.isAssigned = true

        job.jobHistory.push({
            eventType: 'JOB_ASSIGNMENT',
            timestamp: new Date(),
            payload: { new: assignData, previous: job.assignment }
        });

        await job.save();

        //send email to employee 
        const html = NewJobAssignedEmailTemplate(contractor, employee, job)
        EmailService.send(employee.email, "New Job Assigned", html)


        res.json({ success: true, message: `Job assigned successfully`, data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};


export const cancelBooking = async (req: any, res: Response, next: NextFunction) => {
    try {
        const contractorId = req.contractor.id;
        const { bookingId } = req.params;
        const { reason } = req.body;

        // Find the job
        const job = await JobModel.findById(bookingId);

        const contractor = await ContractorModel.findById(contractorId);

        // Check if the contractor exists
        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }


        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if the contractor is the owner of the job
        if (job.contractor.toString() !== contractorId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking' });
        }

        // Check if the job is already canceled
        if (job.status === JOB_STATUS.CANCELED) {
            return res.status(400).json({ success: false, message: 'The booking is already canceled' });
        }


         // Check if the job is already completed
         if (job.status === JOB_STATUS.COMPLETED) {
            return res.status(400).json({ success: false, message: 'The booking is already marked as complete' });
        }

        // Update the job status to canceled
        job.status = JOB_STATUS.CANCELED;

        job.jobHistory.push({
            eventType: 'JOB_CANCELED',
            timestamp: new Date(),
            payload: { reason, canceledBy: 'customer' }
        });


        // emit job cancelled event 
        // inside the event take actions such as refund etc
        JobEvent.emit('JOB_CANCELED', { job, canceledBy: 'contractor' })


                // reduce contractor rating

        const contractorReview = {
            averageRating: 0,
            job: job.id,
            type: CONTRACTOR_REVIEW_TYPE.JOB_CANCELETION
         } as IContractorReview

        const foundIndex = contractor.reviews.findIndex((review) => review.job && review.job == job.id);
        if (foundIndex !== -1) {
            contractor.reviews[foundIndex] = contractorReview;
        }else{
            contractor.reviews.push(contractorReview);
        }

        
        await job.save();
        await contractor.save()


        res.json({ success: true, message: 'Booking canceled successfully', data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};

export const markBookingComplete = async (req: any, res: Response, next: NextFunction) => {
    try {
        const contractorId = req.contractor.id;
        const { bookingId } = req.params;
        const { reason } = req.body;

        // Find the job
        const job = await JobModel.findById(bookingId);

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
            return res.status(403).json({ success: false, message: 'You are not authorized to mark  this booking as complete' });
        }

        // Check if the job is already canceled
        if (job.status === JOB_STATUS.COMPLETED) {
            return res.status(400).json({ success: false, message: 'The booking is already marked as complete' });
        }



        job.statusUpdate = {
            ...job.statusUpdate,
            status: JOB_STATUS.COMPLETED,
            isCustomerAccept: false,
            isContractorAccept: true,
            awaitingConfirmation: true
        }

        job.status = JOB_STATUS.COMPLETED  // since its customer accepting job completion
        job.jobHistory.push({
            eventType: 'JOB_MARKED_COMPLETE_BY_CONTRACTOR',
            timestamp: new Date(),
            payload: {}
        });

        JobEvent.emit('JOB_MARKED_COMPLETE_BY_CONTRACTOR', { job })
        await job.save();

        res.json({ success: true, message: 'Booking marked as completed successfully', data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};




export const ContractorBookingController = {
    getMyBookings,
    getBookingHistory,
    getSingleBooking,
    requestBookingReschedule,
    acceptOrDeclineReschedule,
    assignJob,
    cancelBooking,
    markBookingComplete
}


