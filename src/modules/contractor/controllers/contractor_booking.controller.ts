import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { htmlJobRequestTemplate } from "../../../templates/contractor/jobRequestTemplate";
import { EmailService, NotificationService } from "../../../services";
import { addHours, isFuture, isValid, startOfDay } from "date-fns";
import { IJob, JobModel, JOB_STATUS, JobType, IJobSchedule, JOB_SCHEDULE_TYPE, IJobAssignment, IJobReSchedule } from "../../../database/common/job.model";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import { applyAPIFeature } from "../../../utils/api.feature";
import { ConversationModel } from "../../../database/common/conversations.schema";
import { JOB_QUOTATION_STATUS, JobQuotationModel } from "../../../database/common/job_quotation.model";
import { JobEvent } from "../../../events";
import mongoose from "mongoose";
import { CONTRACTOR_TYPES } from "../../../database/contractor/interface/contractor.interface";
import ContractorTeamModel, { IContractorTeam } from "../../../database/contractor/models/contractor_team.model";
import { NewJobAssignedEmailTemplate } from "../../../templates/contractor/job_assigned.template";
import { JobDisputeModel } from "../../../database/common/job_dispute.model";
import { REVIEW_TYPE, ReviewModel } from "../../../database/common/review.model";
import { JobDayModel } from "../../../database/common/job_day.model";
import { PAYMENT_TYPE } from "../../../database/common/payment.schema";
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { JobUtil } from "../../../utils/job.util";
import { NotificationUtil } from "../../../utils/notification.util";
import { SocketService } from "../../../services/socket";



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
            status,
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
            ],
            status: { $in: ['BOOKED', 'ONGOING', 'ONGOING_SITE_VISIT', 'COMPLETED_SITE_VISIT'] }
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
            const statuses = status.split(',')
            filter.status = {$in: statuses}
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
        const { data, error } = await applyAPIFeature(JobModel.find(filter).populate(['customer']), req.query);

        if (data) {

            await Promise.all(data.data.map(async (job: any) => {
                if (contractorId) {
  
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

                    

                }
            }));
        }


        res.json({ success: true, message: 'Bookings retrieved', data: data });

    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
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
                // if (job.isAssigned) {
                //     job.myQuotation = await job.getMyQuotation(job.contractor)
                // } else {
                //     job.myQuotation = await job.getMyQuotation(contractorId)
                // }
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
            return next(new BadRequestError('Unknown error occurred', error as Error));
        }

        // Send response with job listings data
        res.status(200).json({ success: true, data: data });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred', error));
    }
};


export const getBookingDisputes = async (req: any, res: Response, next: NextFunction) => {
    const contractorId = req.contractor.id

    try {
        let {
            page = 1, // Default to page 1
            limit = 10, // Default to 10 items per page
            sort = '-createdAt', // Sort field and order (-fieldName or fieldName)
            customerId,
            status = 'DISPUTED',
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


        const { data, error } = await applyAPIFeature(
            JobModel.find(filter).distinct('_id').populate('customer contract'),
            req.query);
        if (data) {

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
            return next(new BadRequestError('Unknown error occurred', error as Error));
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
        const contractor = await ContractorModel.findById(contractorId)
        const job = await JobModel.findOne({
            $or: [
                { contractor: contractorId },
                { 'assignment.contractor': contractorId }
            ], _id: bookingId
        }).populate(['contractor', 'customer', 'assignment.contractor']);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // const contract = await JobQuotationModel.findOne(job.contract)
        // if(contract){
        //     if(contract.changeOrderEstimate)contract.changeOrderEstimate.charges  = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
        //     if(contract.siteVisitEstimate)contract.siteVisitEstimate.charges  = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)
        //     contract.charges  = await contract.calculateCharges()
        // }

        // let responseData: any = { ...job.toJSON() };
        // responseData.dispute = await job.getJobDispute()
        // responseData.contract = contract
        // responseData.jobDay = await job.getJobDay()

        if(job.bookingViewedByContractor == false && contractor){
            job.bookingViewedByContractor = true,
            await job.save()

            const alerts = await NotificationUtil.redAlerts(contractorId)
            SocketService.sendNotification(contractor.email, 'RED_DOT_ALERT', {
                type: 'RED_DOT_ALERT', 
                message: 'New alert update', 
                data: alerts
            });

        }

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




        // If the job exists, return it as a response
        res.json({ success: true, message: 'Booking retrieved', data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occurred ', error))
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
        JobEvent.emit('NEW_JOB_RESCHEDULE_REQUEST', { job })


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

            // Change status to booked, just in case it was
            if(job.revisitEnabled){
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


        const [contractor, contract] = await Promise.all([
            ContractorModel.findById(job?.contractor),
            JobQuotationModel.findById(job?.contract)
        ]);


        // Check if the contractor exists
        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }

        if (!contract) {
            return res.status(404).json({ success: false, message: 'Contract not found' });
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
        // Create a new review object
        const newReview = new ReviewModel({
            averageRating: 0,
            // ratings,
            job: job.id,
            customer: job.customer,
            contractor: job.contractor,
            // comment: review,
            type: REVIEW_TYPE.JOB_CANCELATION,
            createdAt: new Date(),
        });

        await newReview.save()

        // intitiate a refund


        const foundIndex = contractor.reviews.findIndex((review) => review.review == job.id);
        if (foundIndex !== -1) {
            contractor.reviews[foundIndex] = { averageRating: newReview.averageRating, review: newReview.id };
        } else {
            contractor.reviews.push({ averageRating: newReview.averageRating, review: newReview.id });
        }


        await job.save();
        await contractor.save()


        if (!job?.schedule?.startDate) {
            return res.status(400).json({ success: false, message: 'Booking has no associated schedule' });
        }

        const jobDate = job.schedule.startDate.getTime();
        const charges = await contract.calculateCharges()

        // choose which payment to refund ? SITE_VISIT_PAYMENT, JOB_DAY_PAYMENT, CHANGE_ORDER_PAYMENT
        const paymentType = (job.schedule.type == 'JOB_DAY') ? [PAYMENT_TYPE.JOB_DAY_PAYMENT, PAYMENT_TYPE.CHANGE_ORDER_PAYMENT] : [PAYMENT_TYPE.SITE_VISIT_PAYMENT]
        const payments = await job.getPayments(paymentType)

        const currentTime = new Date().getTime();
        const timeDifferenceInHours = Math.abs(jobDate - currentTime) / (1000 * 60 * 60);

        let refundPolicy = {
            name: 'free_refund',
            fee: 0, //
        }

        for (const payment of payments.payments) {
            if (payment.refunded) continue
            let refund = {
                refundAmount: payment.amount - refundPolicy.fee,
                totalAmount: payment.amount,
                fee: refundPolicy.fee,
                contractorAmount: refundPolicy.fee * 0.8,
                companyAmount: refundPolicy.fee * 0.2,
                intiatedBy: 'contractor',
                policyApplied: refundPolicy.name,
            };

            //create refund transaction - 
            await TransactionModel.create({
                type: TRANSACTION_TYPE.REFUND,
                amount: payments.totalAmount,

                initiatorUser: contractorId,
                initiatorUserType: 'contractors',

                fromUser: job.contractor,
                fromUserType: 'contractors',

                toUser: job.customer,
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

            //emit event here
            JobEvent.emit('JOB_REFUND_REQUESTED', { job, payment, refund })

        }



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

        // job.status = JOB_STATUS.COMPLETED  // since its customer accepting job completion
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
    getBookingDisputes,
    getSingleBooking,
    requestBookingReschedule,
    acceptOrDeclineReschedule,
    assignJob,
    cancelBooking,
    markBookingComplete
}


