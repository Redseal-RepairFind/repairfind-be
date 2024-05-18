import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { htmlJobRequestTemplate } from "../../../templates/contractorEmail/jobRequestTemplate";
import CustomerModel from "../../../database/customer/models/customer.model";
import { EmailService, NotificationService } from "../../../services";
import { addHours, isFuture, isValid, startOfDay } from "date-fns";
import { IJob, JobModel, JOB_STATUS, JobType, IJobSchedule, JOB_SCHEDULE_TYPE, IJobReSchedule } from "../../../database/common/job.model";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import { applyAPIFeature } from "../../../utils/api.feature";
import { ConversationModel } from "../../../database/common/conversations.schema";
import { IMessage, MessageModel, MessageType } from "../../../database/common/messages.schema";
import { JOB_QUOTATION_STATUS, JobQuotationModel } from "../../../database/common/job_quotation.model";
import { JobEvent } from "../../../events";
import { htmlJobQuotationAcceptedContractorEmailTemplate } from "../../../templates/contractorEmail/job_quotation_accepted.template";
import { htmlJobQuotationDeclinedContractorEmailTemplate } from "../../../templates/contractorEmail/job_quotation_declined.template";
import mongoose from "mongoose";



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
            contractorId,
            status = 'BOOKED',
            startDate,
            endDate,
            date,
            type
        } = req.query;

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
            req.query.contractor = contractorId;
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
        const { data, error } = await applyAPIFeature(JobModel.find(filter).populate(['contractor', 'contract']), req.query);

        if (data) {

            await Promise.all(data.data.map(async (job: any) => {
                if (contractorId) {
                    job.myQuotation = await job.getMyQoutation(contractorId)
                }
            }));
        }


        res.json({ success: true, message: 'Bookings retrieved', data: data });

    } catch (error: any) {
        return next(new BadRequestError('An error occured ', error))
    }
};


export const getBookingHistory = async (req: any, res: Response, next: NextFunction) => {
    const customerId = req.customer.id;

    try {
        let {
            page = 1, // Default to page 1
            limit = 10, // Default to 10 items per page
            sort = '-createdAt', // Sort field and order (-fieldName or fieldName)
            contractorId,
            status = 'COMPLETED, CANCELLED, DECLINED, ACCEPTED, EXPIRED, COMPLETED, DISPUTED',
        } = req.query;

        // Validate and format the status query parameter
        const statusArray = status.split(',').map((s: string) => s.trim()); // Convert the comma-separated string to an array of statuses

        // Validate status values
        const validStatusValues = ['COMPLETED', 'CANCELLED', 'DECLINED', 'ACCEPTED', 'EXPIRED', 'DISPUTED'];
        const isValidStatus = statusArray.every((s: string) => validStatusValues.includes(s));
        if (!isValidStatus) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        // Construct the filter based on the validated status array and customer ID
        const filter: any = { status: { $in: statusArray }, customer: customerId };

        // Check if contractorId is provided and handle accordingly
        if (contractorId) {
            if (!mongoose.Types.ObjectId.isValid(contractorId)) {
                return res.status(400).json({ success: false, message: 'Invalid contractor ID' });
            }
            filter.contractor = contractorId;
        }

        // Query JobModel to find jobs based on the constructed filter
        const { data, error } = await applyAPIFeature(
            JobModel.find(filter).distinct('_id').populate('contractor'),
            req.query
        );

        // Handle errors if any
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error });
        }

        // Attach myQuotation to each job if contractorId is provided
        if (data) {
            await Promise.all(data.data.map(async (job: any) => {
                job.myQuotation = contractorId ? await job.getMyQoutation(contractorId) : null;
            }));
        }

        // Send response with job listings data
        res.status(200).json({ success: true, data: data });
    } catch (error: any) {
        // Handle any caught errors
        return next(new BadRequestError('An error occurred', error));
    }
};


export const getSingleBooking = async (req: any, res: Response, next: NextFunction) => {
    try {

        const customerId = req.customer.id
        const bookingId = req.params.bookingId;

        const job = await JobModel.findOne({ customer: customerId, _id: bookingId, status: JOB_STATUS.BOOKED }).populate(['contractor', 'contract']);

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
        const customerId = req.customer.id;
        const { bookingId } = req.params;
        const job = await JobModel.findById(bookingId);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if the customer is the owner of the job
        if (job.customer.toString() !== customerId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to perform this action' });
        }

        const { date, remark } = req.body; // Assuming you're sending new start and end dates along with a remark in the request body

        // Update job schedule with new dates and set flags
        const updatedSchedule: IJobReSchedule = {
            date, // Assuming the rescheduled date replaces the previous one
            awaitingConfirmation: true, // Flag for indicating rescheduling request
            isCustomerAccept: true, // Assume the customer has has already confirmed the rescheduling
            isContractorAccept: false, // The contractor has to confirm the rescheduling
            createdBy: 'customer', // Assuming customer initiates the reschedule
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

        JobEvent.emit('NEW_JOB_RESHEDULE_REQUEST', {job})

        res.json({ success: true, message: 'Job reschedule request sent' });
    } catch (error: any) {
        return next(new InternalServerError('An error occurred', error));
    }
};


export const acceptOrDeclineReschedule = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { bookingId, action } = req.params;
        const job = await JobModel.findById(bookingId);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if the customer is the owner of the job
        if (job.customer.toString() !== customerId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to perform this action' });
        }

         // Check if the job has a rescheduling request
         if (!job.reschedule) {
            return res.status(400).json({ success: false, message: 'No rescheduling request found for this job' });
        }



        // Ensure that the rescheduling was initiated by the contractor
        if (job.reschedule.createdBy !== 'contractor') {
            return res.status(403).json({ success: false, message: 'You are not authorized to confirm this rescheduling request' });
        }

        // Update rescheduling flags based on customer's choice
        if (action == 'accept') {
            job.reschedule.isCustomerAccept = true;
            
            if(job.reschedule.isContractorAccept && job.reschedule.isCustomerAccept){
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

            JobEvent.emit('JOB_RESHEDULE_DECLINED_ACCEPTED', {job, action: 'accepted'})
        } else  {
            JobEvent.emit('JOB_RESHEDULE_DECLINED_ACCEPTED', {job, action: 'declined'})
            job.reschedule = null

        }




        await job.save();

        res.json({ success: true, message: `Rescheduling request has been ${action}ed` });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};

export const cancelBooking = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { bookingId } = req.params;
        const { reason } = req.body;

        // Find the job
        const job = await JobModel.findById(bookingId);

        const customer = await CustomerModel.findById(customerId);        
    
        // Check if the contractor exists
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }


        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if the contractor is the owner of the job
        if (job.customer.toString() !== customerId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking' });
        }

        // Check if the job is already canceled
        if (job.status === JOB_STATUS.CANCELED) {
            return res.status(400).json({ success: false, message: 'The booking is already canceled' });
        }

        // Update the job status to canceled
        job.status = JOB_STATUS.CANCELED;

        job.jobHistory.push({
            eventType: 'JOB_CANCELED',
            timestamp: new Date(),
            payload: {reason, canceledBy: 'customer' }
        });


        // emit job cancelled event 
        // inside the event take actions such as refund etc
        JobEvent.emit('JOB_CANCELED', {job, canceledBy: 'customer'})
        await job.save();

        res.json({ success: true, message: 'Booking canceled successfully', data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};


export const acceptBookingComplete = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { bookingId } = req.params;
        const { reason } = req.body;

        // Find the job
        const job = await JobModel.findById(bookingId);

        const customer = await CustomerModel.findById(customerId);        
    
        // Check if the contractor exists
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }


        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if the contractor is the owner of the job
        if (job.customer.toString() !== customerId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to mark  this booking as complete' });
        }

        // Check if the job is already canceled
        if (job.status === JOB_STATUS.COMPLETED) {
            return res.status(400).json({ success: false, message: 'The booking is already marked as complete' });
        }

        // Check if the job is already canceled
        if (!job.statusUpdate.awaitingConfirmation ) {
            return res.status(400).json({ success: false, message: 'Contractor has not requested for a status update' });
        }

        if (job.statusUpdate.status !== JOB_STATUS.COMPLETED ) {
            return res.status(400).json({ success: false, message: 'Contractor has not yet marked job as completed' });
        }

        job.statusUpdate = {
            ...job.statusUpdate,
            status: JOB_STATUS.COMPLETED,
            isCustomerAccept: true,
            awaitingConfirmation: false
        }
        
        job.status  = JOB_STATUS.COMPLETED  // since its customer accepting job completion
        job.jobHistory.push({
            eventType: 'JOB_MARKED_COMPLETE_BY_CUSTOMER',
            timestamp: new Date(),
            payload: {}
        });

        JobEvent.emit('JOB_MARKED_COMPLETE_BY_CUSTOMER', {job})
        await job.save();

        res.json({ success: true, message: 'Booking marked as completed successfully', data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};


export const CustomerBookingController = {
    getMyBookings,
    getBookingHistory,
    getSingleBooking,
    requestBookingReschedule,
    acceptOrDeclineReschedule,
    cancelBooking,
    acceptBookingComplete
}


