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
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { StripeService } from "../../../services/stripe";
import Stripe from "stripe";
import { IPayment } from "../../../database/common/payment.schema";
import { JobDisputeModel } from "../../../database/common/job_dispute.model";
import { IReview, REVIEW_TYPE, ReviewModel } from "../../../database/common/review.model";



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
            status = 'BOOKED,ONGOING',
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
        let filter: any = { customer: customerId, status: {$in: ['BOOKED','ONGOING'] } };


        // TODO: when contractor is specified, ensure the contractor quotation is attached
        if (contractorId) {
            if (!mongoose.Types.ObjectId.isValid(contractorId)) {
                return res.status(400).json({ success: false, message: 'Invalid contractor id' });
            }
            req.query.contractor = contractorId;
            delete req.query.contractorId
        }

        if (status) {
            // req.query.status = status.toUpperCase();
            delete req.query.status
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
            status = 'COMPLETED, CANCELED, DECLINED, EXPIRED, COMPLETED, DISPUTED',
        } = req.query;


        req.query.page = page
        req.query.limit = limit
        req.query.sort = sort
        delete req.query.status

        let jobIds = [];
        const statusArray = status.split(',').map((s: any) => s.trim()); // Convert the comma-separated string to an array of statuses
        const filter: any = { status: { $in: statusArray }, customer: customerId }

        if (contractorId) {
            // Retrieve the quotations for the current contractor and extract job IDs
            const quotations = await JobQuotationModel.find({ contractor: contractorId }).select('job').lean();
            // Extract job IDs from the quotations
            jobIds = quotations.map((quotation: any) => quotation.job);
            filter._id = { $in: jobIds }

            if (!mongoose.Types.ObjectId.isValid(contractorId)) {
                return res.status(400).json({ success: false, message: 'Invalid customer id' });
            }
            req.query.contractor = contractorId
            delete req.query.contractorId
        }

        // Query JobModel to find jobs that have IDs present in the extracted jobIds

        const { data, error } = await applyAPIFeature(
            JobModel.find(filter).distinct('_id').populate('contractor'),
            req.query);
        if (data) {
            // Map through each job and attach myQuotation if contractor has applied 
            await Promise.all(data.data.map(async (job: any) => {
                job.myQuotation = await job.getMyQoutation(contractorId)
            }));
        }

        if (error) {
            console.log(error)
            res.status(500).json({ success: false, message: error });
        }

        // Send response with job listings data
        res.status(200).json({ success: true, data: data });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};



export const getBookingDisputes = async (req: any, res: Response, next: NextFunction) => {
    const customerId = req.customer.id;

    try {
        let {
            page = 1, // Default to page 1
            limit = 10, // Default to 10 items per page
            sort = '-createdAt', // Sort field and order (-fieldName or fieldName)
            contractorId,
            status = 'DISPUTED',
        } = req.query;


        req.query.page = page
        req.query.limit = limit
        req.query.sort = sort
        delete req.query.status

        let jobIds = [];
        const statusArray = status.split(',').map((s: any) => s.trim()); // Convert the comma-separated string to an array of statuses
        const filter: any = { status: { $in: statusArray }, customer: customerId }

        if (contractorId) {
            // Retrieve the quotations for the current contractor and extract job IDs
            const quotations = await JobQuotationModel.find({ contractor: contractorId }).select('job').lean();
            // Extract job IDs from the quotations
            jobIds = quotations.map((quotation: any) => quotation.job);
            filter._id = { $in: jobIds }

            if (!mongoose.Types.ObjectId.isValid(contractorId)) {
                return res.status(400).json({ success: false, message: 'Invalid customer id' });
            }
            req.query.contractor = contractorId
            delete req.query.contractorId
        }

        // Query JobModel to find jobs that have IDs present in the extracted jobIds

        const { data, error } = await applyAPIFeature(
            JobModel.find(filter).distinct('_id').populate('contractor'),
            req.query);
        if (data) {
            // Map through each job and attach myQuotation if contractor has applied 
            await Promise.all(data.data.map(async (job: any) => {
                job.myQuotation = await job.getMyQoutation(contractorId)
            }));
        }

        if (error) {
            console.log(error)
            res.status(500).json({ success: false, message: error });
        }

        // Send response with job listings data
        res.status(200).json({ success: true, data: data });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};


export const getSingleBooking = async (req: any, res: Response, next: NextFunction) => {
    try {

        const customerId = req.customer.id
        const bookingId = req.params.bookingId;

        const job = await JobModel.findOne({ customer: customerId, _id: bookingId }).populate(['contractor', 'contract']);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        let responseData: any = { ...job.toJSON() };
        if (job.status === JOB_STATUS.DISPUTED) {
            responseData.dispute = await JobDisputeModel.findOne({ job: job.id });
        }
        res.json({ success: true, message: 'Booking retrieved', data: responseData });

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

        JobEvent.emit('NEW_JOB_RESHEDULE_REQUEST', { job })

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
            job.reschedule = null

        }




        await job.save();

        res.json({ success: true, message: `Rescheduling request has been ${action}ed` });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};

export const intiateBookingCancelation = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { bookingId } = req.params;
        const { reason } = req.body;

        // Find the job
        const job = await JobModel.findById(bookingId);
        const customer = await CustomerModel.findById(customerId);
        const contract = await JobQuotationModel.findById(job?.contract);

        // Check if the customer exists
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        if (!contract) {
            return res.status(404).json({ success: false, message: 'Contract not found' });
        }

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if the contractor is the owner of the job
        if (job.customer.toString() !== customerId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking' });
        }

        if (job.status == JOB_STATUS.CANCELED) {
            return res.status(400).json({ success: false, message: 'Job is already canceled' });
        }

        if (job.status !== JOB_STATUS.BOOKED) {
            return res.status(400).json({ success: false, message: 'Job is not yet booked, only booked jobs can be canceled' });
        }





        // TODO: apply the guidline below and create refund
        // Cancel jobs: Customers have the option to cancel jobs based on the following guidelines:
        // Free cancellation up to 48 hours before the scheduled job time..
        // For cancellations made within 24 hours, regardless of the job's cost, a $50 cancellation fee is applied. 80% of this fee is directed to the contractor, while the remaining 20% is retained by us.

        const startDate = job.schedule.startDate;
        if (!startDate) {
            return res.status(400).json({ success: false, message: 'Job does not have a schedule' });
        }

        const jobDate = job.schedule.startDate.getTime();
        const charges = await contract.calculateCharges()
        const payments = await job.getPayments()
        const currentTime = new Date().getTime();
        const timeDifferenceInHours = Math.abs(jobDate - currentTime) / (1000 * 60 * 60);

        let refund = {
            refundAmount: payments.totalAmount,
            canceletionFee: 0,
            contractorShare: 0,
            companyShare: 0,
            intiatedBy: 'customer',
            policyApplied: 'free_cancelation',
            contractTerms: charges,
            payments
        };

        if (timeDifferenceInHours >= 48) {
            // Free cancellation up to 48 hours before the scheduled job time.

        } else if (timeDifferenceInHours < 24) {
            // For cancellations made within 24 hours, apply cancellation fees.
            const canceletionFee = 50;
            const contractorShare = 0.8 * canceletionFee;
            const companyShare = 0.2 * canceletionFee;

            
            const refundAmount = payments.totalAmount - canceletionFee
            refund = {
                refundAmount,
                canceletionFee,
                contractorShare,
                companyShare,
                intiatedBy: 'customer',
                policyApplied: '50_dollar_policy',
                contractTerms: charges,
                payments
            };
        }

        // Update job status and store cancellation data
        //job.cancelation = refund // dont need to save this
        await job.save();

        res.json({ success: true, message: 'Booking cancelation initiated successfully', data: refund });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};

export const cancelBooking = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { bookingId } = req.params;
        const { reason } = req.body;

        const job = await JobModel.findById(bookingId).populate('payments');
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        const [customer, contractor, contract] = await Promise.all([
            CustomerModel.findById(customerId),
            ContractorModel.findById(job.contractor),
            JobQuotationModel.findById(job?.contract)
        ]);

        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }

        if (!contract) {
            return res.status(404).json({ success: false, message: 'Contract not found' });
        }

        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        if (job.customer.toString() !== customerId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking' });
        }

        if (job.status === JOB_STATUS.CANCELED) {
            return res.status(400).json({ success: false, message: 'The booking is already canceled' });
        }






        if (!job?.schedule?.startDate) {
            return res.status(400).json({ success: false, message: 'Booking has no associated schedule' });
        }

        const jobDate = job.schedule.startDate.getTime();
        const charges = await contract.calculateCharges()
        const payments = await job.getPayments()
        const currentTime = new Date().getTime();
        const timeDifferenceInHours = Math.abs(jobDate - currentTime) / (1000 * 60 * 60);

        let refund = {
            refundAmount: payments.totalAmount,
            canceletionFee: 0,
            contractorShare: 0,
            companyShare: 0,
            intiatedBy: 'customer',
            policyApplied: 'free_cancelation',
            contractTerms: charges,
            payments
        };

        if (timeDifferenceInHours >= 48) {
            // Free cancellation up to 48 hours before the scheduled job time.

        } else if (timeDifferenceInHours < 24) {
            // For cancellations made within 24 hours, apply cancellation fees.
            const canceletionFee = 50;
            const contractorShare = 0.8 * canceletionFee;
            const companyShare = 0.2 * canceletionFee;

            const refundAmount = payments.totalAmount - canceletionFee
            refund = {
                refundAmount,
                canceletionFee,
                contractorShare,
                companyShare,
                intiatedBy: 'customer',
                policyApplied: '50_dollar_policy',
                contractTerms: charges,
                payments
            };
        }


        if (refund.refundAmount > 0) {
            const paymentMethod = customer.stripePaymentMethods[0]
            if (!paymentMethod) throw new Error("No such payment method")

            const transaction = await TransactionModel.create({
                type: TRANSACTION_TYPE.REFUND,
                amount: payments.totalAmount,

                initiatorUser: customerId,
                initiatorUserType: 'customers',

                fromUser: job.contractor,
                fromUserType: 'contractors',

                toUser: customerId,
                toUserType: 'customers',

                description: `Refund from job: ${job?.title} payment`,
                status: TRANSACTION_STATUS.PENDING,
                remark: 'job_refund',
                invoice: {
                    items: [],
                    charges: refund
                },
                metadata: {
                    ...refund,
                    ...payments
                },
                job: job.id
            })

            for(const payment of payments.payments){
                //@ts-ignore
                // const stripePayment = await StripeService.payment.refundCharge(payment.reference, (payment.amount))
                // console.log(stripePayment)

                // {
                //     id: 're_3PGb9WDdPEZ0JirQ2RyxBNRy',
                //     object: 'refund',
                //     amount: 32500,
                //     balance_transaction: 'txn_3PGb9WDdPEZ0JirQ2G8UJRtV',
                //     charge: 'ch_3PGb9WDdPEZ0JirQ2C3LgXzN',
                //     created: 1716528493,
                //     currency: 'usd',
                //     destination_details: {
                //       card: {
                //         reference_status: 'pending',
                //         reference_type: 'acquirer_reference_number',
                //         type: 'refund'
                //       },
                //       type: 'card'
                //     },
                //     metadata: {},
                //     payment_intent: 'pi_3PGb9WDdPEZ0JirQ2uVrqdQ6',
                //     reason: null,
                //     receipt_number: null,
                //     source_transfer_reversal: null,
                //     status: 'succeeded',
                //     transfer_reversal: null
                //   }
            }
            
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
        JobEvent.emit('JOB_CANCELED', { job, canceledBy: 'customer' })
        await job.save();

        res.json({ success: true, message: 'Booking canceled successfully', data: { job, refund, payments } });
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
        if (!job.statusUpdate.awaitingConfirmation) {
            return res.status(400).json({ success: false, message: 'Contractor has not requested for a status update' });
        }

        if (job.statusUpdate.status !== JOB_STATUS.COMPLETED) {
            return res.status(400).json({ success: false, message: 'Contractor has not yet marked job as completed' });
        }

        job.statusUpdate = {
            ...job.statusUpdate,
            status: JOB_STATUS.COMPLETED,
            isCustomerAccept: true,
            awaitingConfirmation: false
        }

        job.status = JOB_STATUS.COMPLETED  // since its customer accepting job completion
        job.jobHistory.push({
            eventType: 'JOB_MARKED_COMPLETE_BY_CUSTOMER',
            timestamp: new Date(),
            payload: {}
        });

        JobEvent.emit('JOB_COMPLETED', { job })
        await job.save();

        res.json({ success: true, message: 'Booking marked as completed successfully', data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};



export const reviewBookingOnCompletion = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { review, ratings, favoriteContractor } = req.body;
        const { bookingId } = req.params;

        // Find the job
        const job = await JobModel.findById(bookingId);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        const contractor = await ContractorModel.findById(job.contractor)

        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }
        // Check if the customer is the owner of the job
        if (job.customer.toString() !== customerId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to add a review for this job' });
        }

        // Check if the job is already completed
        if (job.status !== JOB_STATUS.COMPLETED) {
            // return res.status(400).json({ success: false, message: 'Job is not yet completed, reviews can only be added for completed jobs' });
        }

        // Check if the customer has already reviewed this job
        const existingReview = await ReviewModel.findOne({job: job.id, type: REVIEW_TYPE.JOB_COMPLETION})
        if (existingReview) {
            // return res.status(400).json({ success: false, message: 'You can only add one review per job' });
        }


        // Create a new review object
        const newReview = new ReviewModel({
            averageRating: 0,
            ratings,
            job: job.id,
            customer: job.customer,
            contractor: job.contractor,
            comment: review,
            type: REVIEW_TYPE.JOB_COMPLETION,
            createdAt: new Date(),
        });

        // Update the job's reviews array
        // job.review = newReview;

        // Calculate the average rating for the contractor (optional)
        //   const contractorReviews = await JobModel.find({ contractor: job.contractor, status: JOB_STATUS.COMPLETED });
        const totalRatings = ratings.length;
        const totalReviewScore = ratings.reduce((a: any, b: any) => a + b.rating, 0);
        const averageRating = totalReviewScore > 0 ? totalReviewScore / totalRatings : 0;

        newReview.averageRating = averageRating


        await newReview.save()

        const foundIndex = contractor.reviews.findIndex((review) => review.review == newReview.id);
        if (foundIndex !== -1) {
            contractor.reviews[foundIndex] = {review: newReview.id, averageRating};
        }else{
            contractor.reviews.push({review: newReview.id, averageRating});
        }


        // Save the job
        await job.save()
        await contractor.save()


        res.json({ success: true, message: 'Review added successfully', data: newReview });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
}





export const CustomerBookingController = {
    getMyBookings,
    getBookingHistory,
    getBookingDisputes,
    getSingleBooking,
    requestBookingReschedule,
    acceptOrDeclineReschedule,
    cancelBooking,
    intiateBookingCancelation,
    acceptBookingComplete,
    reviewBookingOnCompletion,
}


