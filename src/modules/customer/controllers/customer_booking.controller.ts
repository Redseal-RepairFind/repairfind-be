import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { IJob, JobModel, JOB_STATUS, JOB_SCHEDULE_TYPE, IJobReSchedule } from "../../../database/common/job.model";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import { applyAPIFeature } from "../../../utils/api.feature";
import { IMessage, MessageModel, MessageType } from "../../../database/common/messages.schema";
import { JOB_QUOTATION_STATUS, JobQuotationModel } from "../../../database/common/job_quotation.model";
import { ConversationEvent, JobEvent } from "../../../events";
import mongoose from "mongoose";
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { IPayment, PAYMENT_TYPE } from "../../../database/common/payment.schema";
import { JOB_DISPUTE_STATUS, JobDisputeModel } from "../../../database/common/job_dispute.model";
import { IReview, REVIEW_TYPE, ReviewModel } from "../../../database/common/review.model";
import CustomerFavoriteContractorModel from "../../../database/customer/models/customer_favorite_contractors.model";
import { JobEmergencyModel } from "../../../database/common/job_emergency.model";
import { ConversationUtil } from "../../../utils/conversation.util";
import { JobUtil } from "../../../utils/job.util";



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
            status,
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
        let filter: any = { customer: customerId, status: { $in: ['BOOKED', 'ONGOING', 'ONGOING_SITE_VISIT', 'COMPLETED_SITE_VISIT'] } };


        // TODO: when contractor is specified, ensure the contractor quotation is attached
        if (contractorId) {
            if (!mongoose.Types.ObjectId.isValid(contractorId)) {
                return res.status(400).json({ success: false, message: 'Invalid contractor id' });
            }
            req.query.contractor = contractorId;
            delete req.query.contractorId
        }

        if (status) {
            const statuses = status.split(',')
            filter.status = { $in: statuses }
            delete req.query.status
        }

        if (startDate) {
            const start = new Date(startDate);
            let end = new Date(startDate);
            if (endDate) end = new Date(endDate);
            start.setHours(0, 0, 0, 0); // Set to midnight
            end.setHours(23, 59, 59, 999); // Set to end of the day
            filter['schedule.startDate'] = { $gte: start, $lte: end };
            delete req.query.startDate;
            delete req.query.endDate;

            console.log(req.query);
        }


        if (date) {
            const selectedDate = new Date(date);
            const startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
            const endOfDay = new Date(startOfDay);
            endOfDay.setDate(startOfDay.getUTCDate() + 1);
            req.query.date = { $gte: startOfDay, $lt: endOfDay };
        }

        // Execute query
        const { data, error } = await applyAPIFeature(JobModel.find(filter).populate(['contractor']), req.query);

        if (data) {

            await Promise.all(data.data.map(async (job: any) => {


                const { contract, totalEnquires, hasUnrepliedEnquiry, jobDay, dispute, myQuotation } = await JobUtil.populate(job, {
                    contract: true,
                    dispute: true,
                    jobDay: true,
                    totalEnquires: true,
                    hasUnrepliedEnquiry: true,
                    myQuotation: contractorId
                });

                job.myQuotation = myQuotation
                job.contract = contract
                job.jobDay = jobDay
                job.dispute = dispute
                job.totalEnquires = totalEnquires
                job.hasUnrepliedEnquiry = hasUnrepliedEnquiry


            }));
        }


        res.json({ success: true, message: 'Bookings retrieved', data: data });

    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
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
            status = 'COMPLETED, CANCELED, DECLINED, EXPIRED, COMPLETED, DISPUTED, NOT_STARTED',
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
                // job.myQuotation = await job.getMyQuotation(contractorId)
                // job.jobDay = await job.getJobDay()

                // const contract = await JobQuotationModel.findOne({ _id: job.contract, job: job.id });
                // if(contract){
                //     if(contract.changeOrderEstimate)contract.changeOrderEstimate.charges  = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
                //     if(contract.siteVisitEstimate)contract.siteVisitEstimate.charges  = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)
                //     contract.charges  = await contract.calculateCharges()
                //     job.contract = contract
                // }

                const { contract, totalEnquires, hasUnrepliedEnquiry, jobDay, dispute, myQuotation } = await JobUtil.populate(job, {
                    contract: true,
                    dispute: true,
                    jobDay: true,
                    totalEnquires: true,
                    hasUnrepliedEnquiry: true,
                    myQuotation: contractorId
                });

                job.myQuotation = myQuotation
                job.contract = contract
                job.jobDay = jobDay
                job.dispute = dispute
                job.totalEnquires = totalEnquires
                job.hasUnrepliedEnquiry = hasUnrepliedEnquiry


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
                // job.jobDay = await job.getJobDay()
                // job.dispute = await job.getJobDispute()
                // const contract = await JobQuotationModel.findOne({ _id: job.contract, job: job.id });
                // if(contract){
                //     if(contract.changeOrderEstimate)contract.changeOrderEstimate.charges  = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
                //     if(contract.siteVisitEstimate)contract.siteVisitEstimate.charges  = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)
                //     contract.charges  = await contract.calculateCharges()
                //     job.contract = contract
                // }

                const { contract, totalEnquires, hasUnrepliedEnquiry, jobDay, dispute } = await JobUtil.populate(job, {
                    contract: true,
                    dispute: true,
                    jobDay: true,
                    totalEnquires: true,
                    hasUnrepliedEnquiry: true,
                });

                job.contract = contract
                job.jobDay = jobDay
                job.dispute = dispute
                job.totalEnquires = totalEnquires
                job.hasUnrepliedEnquiry = hasUnrepliedEnquiry


            }));
        }

        if (error) {
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

        const job = await JobModel.findOne({ customer: customerId, _id: bookingId }).populate(['contractor', 'review']);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // let responseData: any = { ...job.toJSON() };

        // const contract = await JobQuotationModel.findOne({ _id: job.contract, job: job.id });
        // if(contract){
        //     if(contract.changeOrderEstimate)contract.changeOrderEstimate.charges  = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
        //     if(contract.siteVisitEstimate)contract.siteVisitEstimate.charges  = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)
        //     contract.charges  = await contract.calculateCharges()
        //     responseData.contract = contract
        // }

        // responseData.dispute = await job.getJobDispute()
        // responseData.jobDay = await job.getJobDay()

        const { contract, totalEnquires, hasUnrepliedEnquiry, jobDay, dispute } = await JobUtil.populate(job, {
            contract: true,
            dispute: true,
            jobDay: true,
            totalEnquires: true,
            hasUnrepliedEnquiry: true,
        });

        job.contract = contract
        job.jobDay = jobDay
        job.dispute = dispute
        job.totalEnquires = totalEnquires
        job.hasUnrepliedEnquiry = hasUnrepliedEnquiry





        res.json({ success: true, message: 'Booking retrieved', data: job });

    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
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

        JobEvent.emit('NEW_JOB_RESCHEDULE_REQUEST', { job })

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

            // Change status to booked, just in case it was
            if (job.revisitEnabled) {
                job.status = JOB_STATUS.BOOKED
            }

            // Save rescheduling history in job history
            job.jobHistory.push({
                eventType: 'JOB_RESCHEDULED', // Custom event type identifier
                timestamp: new Date(), // Timestamp of the event
                payload: job.reschedule // Additional payload specific to the event
            });

            JobEvent.emit('JOB_RESCHEDULE_DECLINED_ACCEPTED', { job, action: 'accepted' })
        } else {
            JobEvent.emit('JOB_RESCHEDULE_DECLINED_ACCEPTED', { job, action: 'declined' })
            // job.reschedule = null

        }




        await job.save();

        res.json({ success: true, message: `Rescheduling request has been ${action}ed` });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};

export const toggleChangeOrder = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { bookingId } = req.params;

        // Find the job
        const job = await JobModel.findById(bookingId);
        const customer = await CustomerModel.findById(customerId);
        const contract = await JobQuotationModel.findById(job?.contract);


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

        if (job.status !== JOB_STATUS.ONGOING) {
            return res.status(400).json({ success: false, message: 'Only ongoing job can accept extra estimate ' });
        }

        job.isChangeOrder = !job.isChangeOrder;
        await job.save();

        const state = job.isChangeOrder ? 'enabled' : 'disabled'

        
        //send notification
        JobEvent.emit('JOB_CHANGE_ORDER', { job })

        res.json({ success: true, message: `Job change order ${state} successfully`, data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};

export const getRefundable = async (req: any, res: Response, next: NextFunction) => {
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


        if (job.status === JOB_STATUS.ONGOING) {
            return res.status(400).json({ success: false, message: 'Job is ongoing and cannot be canceled, create a dispute instead' });
        } else if (job.status !== JOB_STATUS.BOOKED) {
            return res.status(400).json({ success: false, message: 'Job is not yet booked, only booked jobs can be canceled' });
        }



        const startDate = job.schedule.startDate;
        if (!startDate) {
            return res.status(400).json({ success: false, message: 'Job does not have a schedule' });
        }

        const jobDate = job.schedule.startDate.getTime();
        const charges = await contract.calculateCharges()

        // choose which payment to refund ? SITE_VISIT_PAYMENT, JOB_DAY_PAYMENT, CHANGE_ORDER_PAYMENT
        const paymentType = (job.schedule.type == 'JOB_DAY') ? [PAYMENT_TYPE.JOB_DAY_PAYMENT, PAYMENT_TYPE.CHANGE_ORDER_PAYMENT] : [PAYMENT_TYPE.SITE_VISIT_PAYMENT]
        const payments = await job.getPayments(paymentType)

        const currentTime = new Date().getTime();
        const timeDifferenceInHours = Math.abs(jobDate - currentTime) / (1000 * 60 * 60);

        let refund = {
            refundAmount: payments.totalAmount,
            cancelationFee: 0,
            contractorShare: 0,
            companyShare: 0,
            initiatedBy: 'customer',
            policyApplied: 'free_cancelation',
            contractTerms: charges,
            payments
        };

        // For cancellations made within 24 hours, apply cancellation fees.
        if (timeDifferenceInHours < 24) {
            const cancelationFee = 1//50;
            const contractorShare = 0.8 * cancelationFee;
            const companyShare = 0.2 * cancelationFee;

            const refundAmount = payments.totalAmount - cancelationFee
            refund = {
                refundAmount,
                cancelationFee,
                contractorShare,
                companyShare,
                initiatedBy: 'customer',
                policyApplied: '50_dollar_policy',
                contractTerms: charges,
                payments
            };
        }else{
            // Free cancellation up to 48 hours before the scheduled job time.
            // timeDifferenceInHours >= 48
        }
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



        if (job.status === JOB_STATUS.ONGOING) {
            return res.status(400).json({ success: false, message: 'Job is ongoing and cannot be canceled, create a dispute instead' });
        } else if (job.status !== JOB_STATUS.BOOKED) {
            return res.status(400).json({ success: false, message: 'Job is not yet booked, only booked jobs can be canceled' });
        }


        if (!job?.schedule?.startDate) {
            return res.status(400).json({ success: false, message: 'Booking has no associated schedule' });
        }

        const jobDate = job.schedule.startDate.getTime()
        const charges = await contract.calculateCharges()

        // choose which payment to refund ? SITE_VISIT_PAYMENT, JOB_DAY_PAYMENT, CHANGE_ORDER_PAYMENT
        const paymentType = (job.schedule.type == 'JOB_DAY') ? [PAYMENT_TYPE.JOB_DAY_PAYMENT, PAYMENT_TYPE.CHANGE_ORDER_PAYMENT] : [PAYMENT_TYPE.SITE_VISIT_PAYMENT]
        const payments = await job.getPayments(paymentType)


        const currentTime = new Date().getTime();
        const timeDifferenceInHours = Math.abs(jobDate - currentTime) / (1000 * 60 * 60);

        let refundPolicy = { name: 'free_refund', fee: 0 }

        // For cancellations made within 24 hours, apply cancellation fees.
       if (timeDifferenceInHours < 24) {
            refundPolicy = { name: '50_dollar_policy', fee: 50}
        }else{
             // Free cancellation up to 48 hours before the scheduled job time.
            //  timeDifferenceInHours >= 48
        }

        // map through all payments associated with job and create refund transaction
        for (const payment of payments.payments) {
            if (payment.refunded) continue
            let refund = {
                refundAmount: payment.amount - refundPolicy.fee,
                totalAmount: payment.amount,
                fee: refundPolicy.fee,
                contractorAmount: refundPolicy.fee * 0.8, // contractor takes 80% of the cautionary fee
                companyAmount: refundPolicy.fee * 0.2, // company takes 20% of the cautionary fee
                initiatedBy: 'customer',
                policyApplied: refundPolicy.name,
            };

            //create refund transaction for each payment
            await TransactionModel.create({
                type: TRANSACTION_TYPE.REFUND,
                amount: refund.refundAmount,

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
                    payment: payment.id.toString(),
                    charge: payment.charge
                },
                job: job.id,
                payment: payment.id,
            })

            // emit event here
            JobEvent.emit('JOB_REFUND_REQUESTED', { job, payment, refund })
        }


        // Update the job status to canceled
        job.status = JOB_STATUS.CANCELED;
        job.jobHistory.push({
            eventType: 'JOB_CANCELED',
            timestamp: new Date(),
            payload: { reason, canceledBy: 'customer' }
        });


        await job.save();
        JobEvent.emit('JOB_CANCELED', { job, canceledBy: 'customer' })

        // Create a message in the conversation
        const conversation = await ConversationUtil.updateOrCreateConversation(customerId, 'customers', contractor.id, 'contractors')
        const newMessage: IMessage = await MessageModel.create({
            conversation: conversation.id,
            sender: customerId,
            senderType: 'customers',
            message: `Job canceled by ${customer.name}`,
            messageType: MessageType.ALERT,
            createdAt: new Date(),
            entity: job.id,
            entityType: 'jobs'
        });
        ConversationEvent.emit('NEW_MESSAGE', { message: newMessage })

        res.json({ success: true, message: 'Booking canceled successfully', data: { job, payments } });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};


export const requestBookingRefund = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { bookingId } = req.params;
        const { reason = "Job not started by contractor" } = req.body;

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

        if (job.status !== JOB_STATUS.NOT_STARTED) {
            return res.status(400).json({ success: false, message: 'You can only get a refund for a job that was not started' });
        }


        const charges = await contract.calculateCharges()
        const payments = await job.getPayments()

        const refundPolicy = {name: 'free_refund', fee: 0 }

        for (const payment of payments.payments) {

            if (payment.refunded) continue
            let refund = {
                refundAmount: payment.amount - refundPolicy.fee,
                totalAmount: payment.amount,
                fee: refundPolicy.fee,
                contractorAmount: 0,
                companyAmount: 0,
                initiatedBy: 'customer',
                policyApplied: refundPolicy.name,
            };

            //create refund transaction - 
            await TransactionModel.create({
                type: TRANSACTION_TYPE.REFUND,
                amount: refund.refundAmount,

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
                    payment: payment.id.toString(),
                    charge: payment.charge
                },
                job: job.id,
                payment: payment.id
            })

        }


        // Update the job status to canceled
        job.status = JOB_STATUS.CANCELED;

        job.jobHistory.push({
            eventType: 'JOB_PAYMENT_REFUNDED',
            timestamp: new Date(),
            payload: { reason, initiatedBy: 'customer' }
        });



        // emit job cancelled event 
        // inside the event take actions such as refund etc
        JobEvent.emit('JOB_PAYMENT_REFUNDED', { job })
        await job.save();

        res.json({ success: true, message: 'Booking refunded successfully', data: { job, payments } });
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
        // if (job.status === JOB_STATUS.COMPLETED) {
        //     return res.status(400).json({ success: false, message: 'The booking is already marked as complete' });
        // }

        if (!job.statusUpdate || !job.statusUpdate.awaitingConfirmation) {
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

        job.status = jobStatus  // since its customer accepting job completion

        // add job end date here
        job.schedule.endDate = new Date()
        job.jobHistory.push({
            eventType: 'JOB_MARKED_COMPLETE_BY_CUSTOMER',
            timestamp: new Date(),
            payload: {}
        });

        JobEvent.emit('JOB_COMPLETED', { job })
        await job.save();

        //release payout here  ?

        res.json({ success: true, message: 'Booking marked as completed successfully', data: job });
    } catch (error: any) {
        console.log(error)
        return next(new InternalServerError('An error occurred', error));
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
        const existingReview = await ReviewModel.findOne({ job: job.id, type: REVIEW_TYPE.JOB_COMPLETION })
        if (existingReview) {
            // return res.status(400).json({ success: false, message: 'You can only add one review per job' });
        }

        const totalRatings = ratings?.length;
        const totalReviewScore = totalRatings ? ratings.reduce((a: any, b: any) => a + b.rating, 0) : 0;
        const averageRating = (totalRatings && totalReviewScore) > 0 ? totalReviewScore / totalRatings : 0;

        // Create a new review object
        const newReview = await ReviewModel.findOneAndUpdate({ job: job.id, type: REVIEW_TYPE.JOB_COMPLETION }, {
            averageRating,
            ratings,
            job: job.id,
            customer: job.customer,
            contractor: job.contractor,
            comment: review,
            type: REVIEW_TYPE.JOB_COMPLETION,
            createdAt: new Date(),
        }, { new: true, upsert: true });


        const foundIndex = contractor.reviews.findIndex((review) => review.review == newReview.id);
        if (foundIndex !== -1) {
            contractor.reviews[foundIndex] = { review: newReview.id, averageRating };
        } else {
            contractor.reviews.push({ review: newReview.id, averageRating });
        }

        if (favoriteContractor) {
            await CustomerFavoriteContractorModel.findOneAndUpdate({ contractor: contractor.id, customer: customerId }, {
                customer: customerId,
                contractor: contractor.id
            }, { new: true, upsert: true })
        }

        job.review = newReview.id
        await job.save()
        await contractor.save()

        res.json({ success: true, message: 'Review added successfully', data: newReview });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
}


export const createBookingDispute = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Extract data from request body
        const { description, evidence } = req.body;
        const { bookingId } = req.params;
        const customerId = req.customer.id; // Assuming user ID from request object

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the job using job ID
        const job = await JobModel.findById(bookingId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if user is customer or contractor for the job
        if (!(job.customer == customerId) && !(job.contractor == customerId)) {
            return res.status(403).json({ success: false, message: 'Unauthorized to create dispute for this job' });
        }

        const disputerType = 'customers';
        const disputer = customerId;

        const dispute = await JobDisputeModel.findOneAndUpdate({
            job: job.id
        }, {
            description,
            job: job._id,
            customer: job.customer,
            contractor: job.contractor,
            disputerType,
            disputer,
            status: JOB_DISPUTE_STATUS.OPEN,
        }, { new: true, upsert: true });



        if (evidence) {
            const disputeEvidence = evidence.map((url: string) => ({
                url,
                addedBy: 'customer',
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



        job.statusUpdate = {
            isContractorAccept: true,
            isCustomerAccept: true,
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


export const createJobEmergency = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Extract data from request body
        const { description, priority, date, media } = req.body;
        const customer = req.customer.id; // Assuming the contractor triggered the emergency
        const triggeredBy = 'customer'; // Assuming the contractor triggered the emergency
        const bookingId = req.params.bookingId

        const job = await JobModel.findById(bookingId)
        if (!job) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Create new job emergency instance
        const jobEmergency = await JobEmergencyModel.create({
            job: job.id,
            customer: job.customer,
            contractor: job.contractor,
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


export const CustomerBookingController = {
    getMyBookings,
    getBookingHistory,
    getBookingDisputes,
    getSingleBooking,
    requestBookingReschedule,
    acceptOrDeclineReschedule,
    cancelBooking,
    getRefundable,
    acceptBookingComplete,
    reviewBookingOnCompletion,
    toggleChangeOrder,
    createBookingDispute,
    requestBookingRefund,
    createJobEmergency,
}


