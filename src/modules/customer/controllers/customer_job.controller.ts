import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { uploadToS3 } from "../../../utils/upload.utility";
import { v4 as uuidv4 } from "uuid";
import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";
import ContractorAvailabilityModel from "../../../database/contractor/models/contractorAvaliability.model";
import { sendEmail } from "../../../utils/send_email_utility";
import CustomerRegModel from "../../../database/customer/models/customer.model";
import stripe from 'stripe';
import { customerAcceptQouteAndPaySendEmailHtmlMailTemplate } from "../../../templates/email/customerAcceptQuoteTem";
import { customerToAdminAfterPaymentSendEmailHtmlMailTemplate } from "../../../templates/email/customerPaymoneyForQuateTem";
import AdminRegModel from "../../../database/admin/models/admin.model";
import { htmlJobRequestTemplate } from "../../../templates/contractorEmail/jobRequestTemplate";
import { htmlAdminPaymentTemplate } from "../../../templates/adminEmail/adminPaymentTemplate";
import AdminNoficationModel from "../../../database/admin/models/admin_notification.model";
import PayoutModel from "../../../database/admin/models/payout.model";
import ContractorBankModel from "../../../database/contractor/models/contractorBankDetail.model";
import CustomerJobRequestModel, { ICustomerJobRequest, JobRequestStatus } from "../../../database/customer/models/customer_jobrequest.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { EmailService, NotificationService } from "../../../services";
import { addHours, endOfDay, isAfter, isBefore, isFuture, isPast, isValid, startOfDay } from "date-fns";
import { IJob, JobModel, JOB_STATUS, JobType } from "../../../database/common/job.model";
import { BadRequestError } from "../../../utils/custom.errors";
import { applyAPIFeature } from "../../../utils/api.feature";
import { ConversationEntityType, ConversationModel, IConversation } from "../../../database/common/conversations.schema";
import { IMessage, MessageModel, MessageType } from "../../../database/common/messages.schema";
import { Date } from "mongoose";
import { JobQoutationModel } from "../../../database/common/job_quotation.model";
import TransactionModel from "../../../database/common/transaction.model";
import { StripeService } from "../../../services/stripe";
import Stripe from 'stripe';
import { QueueService } from "../../../services/bullmq";





export const createJobRequest = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'validatior error occured', errors: errors.array() });
        }

        const { contractorId, category, description, location, date, expiresIn, emergency, media, voiceDescription, time } = req.body;
        const customerId = req.customer.id

        const customer = await CustomerModel.findById(customerId)

        if (!customer) {
            return res.status(400).json({ success: false, message: "Customer not found" })
        }
        const contractor = await ContractorModel.findById(contractorId).populate('profile')
        if (!contractor) {
            return res.status(400).json({ success: false, message: "Contractor not found" })
        }

        // Get the end of the current day (11:59:59 PM)
        const startOfToday = startOfDay(new Date());
        if (!isValid(new Date(date)) || (!isFuture(new Date(date)) && new Date(date) < startOfToday)) {
            return res.status(400).json({ success: false, message: 'Invalid date format or date is in the past' });
        }

        // Check if there is a similar job request sent to the same contractor within the last 72 hours
        const existingJobRequest = await JobModel.findOne({
            customer: customerId,
            contractor: contractorId,
            status: JobRequestStatus.PENDING,
            date: { $eq: new Date(date) }, // consider all past jobs
            createdAt: { $gte: addHours(new Date(), -72) }, // Check for job requests within the last 72 hours
        });

        if (existingJobRequest) {
            return res.status(400).json({ success: false, message: 'A similar job request has already been sent to this contractor within the last 72 hours' });
        }

        const dateTimeString = `${new Date(date).toISOString().split('T')[0]}T${time}`; // Combine date and time
        const jobTime = new Date(dateTimeString);

        // Create a new job document
        const newJob: IJob = new JobModel({
            customer: customer.id,
            contractor: contractorId,
            description,
            location,
            date,
            type: JobType.REQUEST,
            time: jobTime,
            expiresIn,
            emergency: emergency || false,
            voiceDescription,
            media: media || [],
            //@ts-ignore
            title: `${contractor.profile.skill} Service`,
            //@ts-ignore
            category: `${contractor.profile.skill}`

        });

        // Save the job document to the database
        await newJob.save();

        // Create a new conversation between the customer and the contractor
        const conversationMembers = [
            { memberType: 'customers', member: customerId },
            { memberType: 'contractors', member: contractorId }
        ];

        const newConversation: IConversation = await ConversationModel.create({
            members: conversationMembers,
            entity: newJob._id,
            entityType: ConversationEntityType.JOB,
            lastMessage: description, // Set the last message to the job description
            lastMessageAt: new Date() // Set the last message timestamp to now
        });


        // Create a message in the conversation
        const newMessage: IMessage = await MessageModel.create({
            conversation: newConversation._id,
            sender: customerId, // Assuming the customer sends the initial message
            message: `New job request: ${description}`, // You can customize the message content as needed
            messageType: MessageType.TEXT, // You can customize the message content as needed
            createdAt: new Date()
        });



        //  IT WILL BE WISE TO MOVE ALL THIS TO EVENT LISTENER TO KEEP THE CONTROLLER LEAN
        //   contractor notification
        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: 'New Job Request',
            type: 'NEW_JOB_REQUEST',
            message: `You've received a job request from ${customer.firstName}`,
            heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
            payload: {
                entity: newJob.id,
                entityType: 'jobs',
                message: `You've received a job request from ${customer.firstName}`,
                contractor: contractor.id,
            }
        }, { database: true, push: true })


        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: 'New Job Request',
            type: 'NEW_JOB_REQUEST',
            //@ts-ignore
            message: `You've  sent a job request to ${contractor.name}`,
            //@ts-ignore
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: newJob.id,
                entityType: 'jobs',
                //@ts-ignore
                message: `You've sent a job request to ${contractor.name}`,
                customer: customer.id,
            }
        }, { database: true, push: true })


        const html = htmlJobRequestTemplate(customer.firstName, customer.firstName, `${date} ${time}`, description)
        EmailService.send(contractor.email, 'Job request from customer', html)




        res.status(201).json({ success: true, message: 'Job request submitted successfully', data: newJob });
    } catch (error: any) {
        return next(new BadRequestError('Bad Request', error));
    }

}


export const createJobListing = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'validatior error occured', errors: errors.array() });
        }

        const { category, description, location, date, expiresIn, emergency, media, voiceDescription, time, contractorType } = req.body;
        const customerId = req.customer.id

        const customer = await CustomerModel.findById(customerId)

        if (!customer) {
            return res.status(400).json({ success: false, message: "Customer not found" })
        }


        // Check if the specified date is valid
        if (!isFuture(new Date(date))) {
            return res.status(400).json({ success: false, message: 'Invalid date formate or date is not in the future' });
        }

        // Check if there is a similar job request sent to the same contractor within the last 72 hours
        const existingJobRequest = await JobModel.findOne({
            customer: customerId,
            status: JobRequestStatus.PENDING,
            category: category,
            date: { $eq: new Date(date) }, // consider all past jobs
            createdAt: { $gte: addHours(new Date(), -24) }, // Check for job requests within the last 72 hours
        });

        if (existingJobRequest) {
            return res.status(400).json({ success: false, message: 'A similar job has already been created within the last 24 hours' });
        }

        const dateTimeString = `${new Date(date).toISOString().split('T')[0]}T${time}`; // Combine date and time
        const jobTime = new Date(dateTimeString);

        console.log('HWat happened here', jobTime)
        // Create a new job document
        const newJob: IJob = new JobModel({
            customer: customer.id,
            contractorType,
            description,
            category,
            location,
            date,
            time: jobTime,
            expiresIn,
            emergency: emergency || false,
            voiceDescription,
            media: media || [],
            type: JobType.LISTING,
            title: `${category} Service`,

        });

        // Save the job document to the database
        await newJob.save();

        res.status(201).json({ success: true, message: 'Job listing submitted successfully', data: newJob });
    } catch (error: any) {
        return next(new BadRequestError('An error occured ', error))
    }

}


export const getJobs = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Validate incoming request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract query parameters
        const { contractorId, status, startDate, endDate, date, type } = req.query;
        const customerId = req.customer.id;

        // Construct filter object based on query parameters
        const filter: any = {};

        if (customerId) {
            filter.customer = customerId;
        }
        if (contractorId) {
            filter.contractor = contractorId;
        }
        if (type) {
            filter.type = type.toUpperCase();
        }
        if (status) {
            filter.status = status.toUpperCase();
        }
        if (startDate && endDate) {
            // Parse startDate and endDate into Date objects
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Ensure that end date is adjusted to include the entire day
            end.setDate(end.getDate() + 1);
            filter.createdAt = { $gte: start, $lt: end };
        }

        if (date) {
            const selectedDate = new Date(date);
            const startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
            const endOfDay = new Date(startOfDay);
            endOfDay.setDate(startOfDay.getUTCDate() + 1);
            filter.date = { $gte: startOfDay, $lt: endOfDay };
        }

        // Execute query
        const { data, error } = await applyAPIFeature(JobModel.find(filter), req.query)

        res.json({ success: true, message: 'Jobs retrieved', data: data });
    } catch (error: any) {
        return next(new BadRequestError('An error occured ', error))
    }
};

export const getSingleJob = async (req: any, res: Response, next: NextFunction) => {
    try {

        const customerId = req.customer.id
        const jobId = req.params.jobId;

        const job = await JobModel.findOne({ customer: customerId, _id: jobId }).exec();

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // If the job exists, return it as a response
        res.json({ success: true, message: 'Job retrieved', data: job });
    } catch (error: any) {
        return next(new BadRequestError('An error occured ', error))
    }
};

export const getJobQuotations = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const jobId = req.params.jobId;

        const job = await JobModel.findOne({ customer: customerId, _id: jobId }).populate('quotations');

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // If the job exists, return its quo as a response
        res.json({ success: true, message: 'Job quotations retrieved', data: job.quotations });
    } catch (error: any) {
        return next(new BadRequestError('An error occured ', error))
    }
};

export const getSingleQuotation = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id;
        const { jobId, quotationId } = req.params;

        const quotation = await JobQoutationModel.findOne({ _id: quotationId, job: jobId });

        // Check if the job exists
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Qoutation not found' });
        }

        quotation.charges = await quotation.calculateCharges()
        res.json({ success: true, message: 'Job quotation retrieved', data: quotation });
    } catch (error: any) {
        return next(new BadRequestError('An error occured ', error))
    }
};




//customer accept and pay for the work /////////////
export const makeJobPayment = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

    try {
        const {
            quotationId,
            paymentMethodId
        } = req.body;

        const jobId = req.params.jobId

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const customerId = req.customer.id;
        const customer = await CustomerModel.findOne({ _id: customerId })

        if (!customer) {
            return res
                .status(401)
                .json({ message: "incorrect Customer ID" });
        }

        //const job = await JobModel.findOne({_id: jobId, customerId, status: 'sent qoutation'})
        const job = await JobModel.findOne({ _id: jobId })
        if (!job) {
            return res
                .status(401)
                .json({ message: "job do not exist" });
        }


        const quotation = await JobQoutationModel.findOne({ _id: quotationId })
        if (!quotation) {
            return res
                .status(401)
                .json({ message: "Job quotation not found" });
        }

        const contractor = await ContractorModel.findOne({ _id: quotation.contractor });

        // make checks here 
        // ensure contractor has a verified connected account
        //ensure customer has a valid payment method or create a setup that will require payment on the fly 

        const generateInvoce = new Date().getTime().toString()

        const invoiceId = generateInvoce.substring(generateInvoce.length - 5)
        const charges = await quotation.calculateCharges()

        const newTransaction = new TransactionModel({
            type: 'credit',
            amount: charges.totalAmount,
            initiator: customerId,
            from: 'customer',
            to: 'admin',
            fromId: customerId,
            toId: 'admin',
            description: `qoutation from ${contractor?.firstName} payment`,
            status: 'pending',
            form: 'qoutation',
            invoiceId: invoiceId,
            jobId: jobId
        })

        const saveTransaction = await newTransaction.save();

        const transactionId = JSON.stringify(saveTransaction._id)


        //  Direct CHARGES
        // With Connect, you can make charges directly to the connected account and take fees in the process.
        // To create a direct charge on the connected account, create a PaymentIntent object and add the Stripe-Account header with a value of the connected account ID:

        //  https://docs.stripe.com/connect/charges
        // When using Standard accounts, Stripe recommends that you create direct charges. Though uncommon, there are times when it’s appropriate to use direct charges on Express or Custom accounts.
        // With this charge type:
        // You create a charge on your user’s account so the payment appears as a charge on the connected account, not in your account balance.
        // The connected account’s balance increases with every charge.
        // Funds always settle in the country of the connected account.
        // Your account balance increases with application fees from every charge.
        // The connected account’s balance is debited for refunds and chargebacks.
        //direct charge requires the customer has to exists on the connected account platform -- consider cloning https://docs.stripe.com/connect/cloning-customers-across-accounts
        // we can still take fees back to the platform by specifying application_fee_amount: 123,

        // DESTINATION CHARGES
        // Customers transact with your platform for products or services provided by your connected account.
        // The transaction involves a single user.
        // Stripe fees are debited from your platform account.

        //flow 1
        // here everything is transfered to connected account and then application_fee_amount is wired back to platform
        // application_fee_amount: 123,
        // transfer_data: {
        //     destination: '{{CONNECTED_ACCOUNT_ID}}',
        // },

        //flow 2
        // here only amount specified in transfer_data is transfered to connected account
        // transfer_data: {
        //     amount: 877,
        //     destination: '{{CONNECTED_ACCOUNT_ID}}',
        //   },

        // When you use on_behalf_of:
        // Charges are settled in the connected account’s country and settlement currency.
        // The connected account’s statement descriptor is displayed on the customer’s credit card statement.
        // If the connected account is in a different country than the platform, the connected account’s address and phone number are displayed on the customer’s credit card statement.
        // The number of days that a pending balance is held before being paid out depends on the delay_days setting on the connected account.


        let paymentMethod = customer.stripePaymentMethods.find((method) => method.id == paymentMethodId)
        if (!paymentMethod) {
            paymentMethod = customer.stripePaymentMethods[0]
        };

        if (!paymentMethod) throw new Error("No such payment method")



        let payload: Stripe.PaymentIntentCreateParams = {
            payment_method_types: ['card'],
            payment_method: paymentMethod.id,
            currency: 'usd',
            amount: (charges.totalAmount) * 100,
            application_fee_amount: (charges.processingFee) * 100, // send everthing to connected account and  application_fee_amount will be transfered back
            transfer_data: {
                // amount: (charges.contractorAmount) * 100, // transfer to connected account
                destination: contractor?.stripeAccount.id ?? '' // mostimes only work with same region example us, user
                // https://docs.stripe.com/connect/destination-charges
            },
            on_behalf_of: contractor?.stripeAccount.id,
            metadata: {
                customerId,
                constractorId: contractor?.id,
                quotationId,
                type: "job_booking",
                jobId,
                email: customer.email,
                transactionId,
                remark: 'initial_job_payment' // we can have extra_job_payment
            },
           
            customer: customer.stripeCustomer.id,
            off_session: true,
            confirm: true,
        }



        console.log('payload',payload)
        const stripePayment = await StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload)

        job.status = JOB_STATUS.BOOKED;
        await job.save()

        res.json({ success: true, message: 'Payment intent created', data: stripePayment });

    } catch (err: any) {
        return next(new BadRequestError(err.message, err))
    }

}

export const captureJobPayment = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

    try {
        const {
            quotationId,
            paymentMethodId
        } = req.body;

        const jobId = req.params.jobId

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const customerId = req.customer.id;
        const customer = await CustomerModel.findOne({ _id: customerId })

        if (!customer) {
            return res
                .status(401)
                .json({ message: "incorrect Customer ID" });
        }

        //const job = await JobModel.findOne({_id: jobId, customerId, status: 'sent qoutation'})
        const job = await JobModel.findOne({ _id: jobId })
        if (!job) {
            return res
                .status(401)
                .json({ message: "job do not exist" });
        }


        const quotation = await JobQoutationModel.findOne({ _id: quotationId })
        if (!quotation) {
            return res
                .status(401)
                .json({ message: "Job quotation not found" });
        }

        const contractor = await ContractorModel.findOne({ _id: quotation.contractor });

        // make checks here 
        // ensure contractor has a verified connected account
        //ensure customer has a valid payment method or create a setup that will require payment on the fly 

        const generateInvoce = new Date().getTime().toString()

        const invoiceId = generateInvoce.substring(generateInvoce.length - 5)
        const charges = await quotation.calculateCharges()

        const newTransaction = new TransactionModel({
            type: 'credit',
            amount: charges.totalAmount,
            initiator: customerId,
            from: 'customer',
            to: 'admin',
            fromId: customerId,
            toId: 'admin',
            description: `qoutation from ${contractor?.firstName} payment`,
            status: 'pending',
            form: 'qoutation',
            invoiceId: invoiceId,
            jobId: jobId
        })

        const saveTransaction = await newTransaction.save();

        const transactionId = JSON.stringify(saveTransaction._id)


        //  Direct CHARGES
        // With Connect, you can make charges directly to the connected account and take fees in the process.
        // To create a direct charge on the connected account, create a PaymentIntent object and add the Stripe-Account header with a value of the connected account ID:

        //  https://docs.stripe.com/connect/charges
        // When using Standard accounts, Stripe recommends that you create direct charges. Though uncommon, there are times when it’s appropriate to use direct charges on Express or Custom accounts.
        // With this charge type:
        // You create a charge on your user’s account so the payment appears as a charge on the connected account, not in your account balance.
        // The connected account’s balance increases with every charge.
        // Funds always settle in the country of the connected account.
        // Your account balance increases with application fees from every charge.
        // The connected account’s balance is debited for refunds and chargebacks.
        //direct charge requires the customer has to exists on the connected account platform -- consider cloning https://docs.stripe.com/connect/cloning-customers-across-accounts
        // we can still take fees back to the platform by specifying application_fee_amount: 123,

        // DESTINATION CHARGES
        // Customers transact with your platform for products or services provided by your connected account.
        // The transaction involves a single user.
        // Stripe fees are debited from your platform account.

        //flow 1
        // here everything is transfered to connected account and then application_fee_amount is wired back to platform
        // application_fee_amount: 123,
        // transfer_data: {
        //     destination: '{{CONNECTED_ACCOUNT_ID}}',
        // },

        //flow 2
        // here only amount specified in transfer_data is transfered to connected account
        // transfer_data: {
        //     amount: 877,
        //     destination: '{{CONNECTED_ACCOUNT_ID}}',
        //   },

        // When you use on_behalf_of:
        // Charges are settled in the connected account’s country and settlement currency.
        // The connected account’s statement descriptor is displayed on the customer’s credit card statement.
        // If the connected account is in a different country than the platform, the connected account’s address and phone number are displayed on the customer’s credit card statement.
        // The number of days that a pending balance is held before being paid out depends on the delay_days setting on the connected account.


        let paymentMethod = customer.stripePaymentMethods.find((method) => method.id == paymentMethodId)
        if (!paymentMethod) {
            paymentMethod = customer.stripePaymentMethods[0]
        };

        if (!paymentMethod) throw new Error("No such payment method")



        let payload: Stripe.PaymentIntentCreateParams = {
            payment_method_types: ['card'],
            payment_method_options: {
                card: {
                    capture_method: 'manual',
                    // request_extended_authorization: 'if_available', // 30 days
                },
            },
            expand: ['latest_charge'],
            payment_method: paymentMethod.id,
            currency: 'usd',
            amount: (charges.totalAmount) * 100,
            application_fee_amount: (charges.processingFee) * 100, // send everthing to connected account and  application_fee_amount will be transfered back
            transfer_data: {
                // amount: (charges.contractorAmount) * 100, // transfer to connected account
                destination: contractor?.stripeAccount.id ?? '' // mostimes only work with same region example us, user
                // https://docs.stripe.com/connect/destination-charges
            },
            on_behalf_of: contractor?.stripeAccount.id,
            metadata: {
                customerId,
                constractorId: contractor?.id,
                quotationId,
                type: "job_payment",
                jobId,
                email: customer.email,
                transactionId,
                remark: 'initial_job_payment' // we can have extra_job_payment
            },

            customer: customer.stripeCustomer.id,
            off_session: true,
            confirm: true,
            capture_method: 'manual'
        }



        // console.log('payload',payload)
        const stripePayment = await StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload)

        job.status = JOB_STATUS.BOOKED;
        await job.save()

        QueueService.addJob('dod', {}, {})

        res.json({ success: true, message: 'Payment intent created', data: stripePayment });

    } catch (err: any) {
        return next(new BadRequestError(err.message, err))
    }

}


// //customer get job qoutation payment and open /////////////
// export const customerGetJobQoutationPaymentOpenController = async (
//     req: any,
//     res: Response,
// ) => {

//     try {
//         const {

//         } = req.body;

//         // Check for validation errors
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const customer = req.customer;
//         const customerId = customer.id

//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })

//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }

//         const jobRequests = await JobModel.find({ customerId, status: 'qoutation payment open' }).sort({ createdAt: -1 })

//         let jobRequested = []

//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];

//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');

//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }

//             jobRequested.push(obj)

//         }

//         res.json({
//             jobRequested
//         });

//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }

// }


// //customer confirm or verified payment /////////////
// export const customerVerififyPaymentForJobController = async (
//     req: any,
//     res: Response,
// ) => {

//     try {
//         const {
//             jobId,
//             paymentId,
//         } = req.body;

//         // Check for validation errors
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const customer = req.customer;
//         const customerId = customer.id

//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })

//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }

//         const job = await JobModel.findOne({ _id: jobId, customerId, status: 'qoutation payment open' })

//         if (!job) {
//             return res
//                 .status(401)
//                 .json({ message: "job do not exist or payment has not be initialize" });
//         }

//         const contractor = await ContractorModel.findOne({ _id: job.contractorId }).select('-password');

//         if (!contractor) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect contractor Id" });
//         }

//         let secret = process.env.STRIPE_KEY || "sk_test_51OTMkGIj2KYudFaR1rNIBOPTaBESYoJco6lTCBZw5a0inyttRJOotcds1rXpXCJDSJrpNmIt2FBAaSxdmuma3ZTF00h48RxVny";

//         let stripeInstance;

//         console.log(secret)

//         if (!secret) {
//             return res
//                 .status(401)
//                 .json({ message: "Sripe API Key is missing" });
//         }

//         stripeInstance = new stripe(secret);

//         const paymentConfirmation = await stripeInstance.checkout.sessions.retrieve(paymentId)

//         if (paymentConfirmation.status !== "complete") {
//             return res
//                 .status(401)
//                 .json({ message: "no payment or payment url expired" });
//         }

//         if (paymentConfirmation.metadata?.customerId != customerId) {
//             return res
//                 .status(401)
//                 .json({ message: "payment ID in not for this customer" });
//         }

//         job.status = "qoutation payment confirm and job in progress";

//         await job.save()

//         const html = customerAcceptQouteAndPaySendEmailHtmlMailTemplate(contractor?.firstName, checkCustomer.firstName);

//         let emailData = {
//             emailTo: contractor.email,
//             subject: "Artisan payment for the job",
//             html
//         };

//         await sendEmail(emailData);

//         const admins = await AdminRegModel.find();

//         for (let i = 0; i < admins.length; i++) {
//             const admin = admins[i];

//             const html = customerToAdminAfterPaymentSendEmailHtmlMailTemplate(contractor.firstName, checkCustomer.firstName);

//             let emailData = {
//                 emailTo: admin.email,
//                 subject: "Artisan payment for the job",
//                 html
//             };

//             await sendEmail(emailData);

//         }

//         res.json({
//             message: "payment successfully comfirm",
//         });

//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }

// }


// //customer get job qoutation payment confirm and job in progres /////////////
// export const customerGetJobQoutationPaymentConfirmAndJobInProgressController = async (
//     req: any,
//     res: Response,
// ) => {

//     try {
//         const {

//         } = req.body;

//         // Check for validation errors
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const customer = req.customer;
//         const customerId = customer.id

//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })

//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }

//         const jobRequests = await JobModel.find({ customerId, status: 'qoutation payment confirm and job in progress' }).sort({ createdAt: -1 })

//         let jobRequested = []

//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];

//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');

//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }

//             jobRequested.push(obj)

//         }

//         res.json({
//             jobRequested
//         });

//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }

// }



// //customer get job request rejected /////////////
// export const customerGetJobRejectedontroller = async (
//     req: any,
//     res: Response,
// ) => {

//     try {
//         const {

//         } = req.body;

//         // Check for validation errors
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const customer = req.customer;
//         const customerId = customer.id

//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })

//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }

//         const jobRequests = await JobModel.find({ customerId, status: 'job reject' }).sort({ createdAt: -1 })

//         let jobRequested = []

//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];

//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');

//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }

//             jobRequested.push(obj)

//         }

//         res.json({
//             jobRequested
//         });

//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }

// }



// //get all job history/////////////
// export const customerGetAllSetJobController = async (
//     req: any,
//     res: Response,
// ) => {

//     try {
//         let {
//             page,
//             limit
//         } = req.query;


//         // Check for validation errors
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const customer = req.customer;
//         const customerId = customer.id

//         page = page || 1;
//         limit = limit || 50;
//         const skip = (page - 1) * limit;

//         const jobs = await JobModel.find({ customerId })
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);

//         const jobHistory = [];

//         for (let i = 0; i < jobs.length; i++) {
//             const job = jobs[i];

//             const contractorProfile = await ContractorModel.findOne({ _id: job.contractorId }).select('-password')
//             //const contractorDocument = await ContractorDocumentValidateModel.findOne({contractorId: job.contractorId});

//             const obj = {
//                 job,
//                 contractorProfile,
//                 //contractorDocument
//             }

//             jobHistory.push(obj);

//         }

//         res.json({
//             jobHistory
//         });

//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }

// }


// //customer confirm or verified payment web hook/////////////
// export const customerVerififyPaymentWebhook = async (
//     jobId: any,
//     customerId: any,
//     transactionId: any
// ) => {

//     try {

//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })

//         if (!checkCustomer) {
//             return
//         }

//         const job = await JobModel.findOne({ _id: jobId, customerId, status: 'qoutation payment open' })

//         if (!job) {
//             return
//         }

//         const contractor = await ContractorModel.findOne({ _id: job.contractorId }).select('-password');

//         if (!contractor) {
//             return
//         }

//         const transaction = await TransactionModel.findOne({ _id: transactionId.substring(1, transactionId.length - 1) });

//         if (!transaction) {
//             return
//         }

//         job.status = "qoutation payment confirm and job in progress";
//         await job.save()

//         transaction.status = 'successful',
//             await transaction.save();

//         const html = customerAcceptQouteAndPaySendEmailHtmlMailTemplate(contractor?.firstName, checkCustomer.firstName);

//         let emailData = {
//             emailTo: contractor.email,
//             subject: "Artisan payment for the job",
//             html
//         };

//         await sendEmail(emailData);

//         const admins = await AdminRegModel.find();

//         const adminPaymentHtml = htmlAdminPaymentTemplate(jobId, checkCustomer._id, `${job.totalAmountCustomerToPaid} for job qoutation`)

//         for (let i = 0; i < admins.length; i++) {
//             const admin = admins[i];

//             let adminEmailData = {
//                 emailTo: admin.email,
//                 subject: "qoutation payment",
//                 html: adminPaymentHtml
//             };

//             await sendEmail(adminEmailData);

//             //admin notification
//             const adminNotic = new AdminNoficationModel({
//                 title: "Job Booked",
//                 message: `${job._id} - ${checkCustomer.firstName} booked a job for $${job.totalAmountCustomerToPaid}.`,
//                 status: "unseen"
//             })

//             await adminNotic.save();

//         }

//         //contractor notification
//         const contractorNotic = new ContractorNotificationModel({
//             contractorId: contractor._id,
//             message: `You've been booked for a job from ${checkCustomer.firstName} for ${job.time}`,
//             status: "unseen"
//         });

//         await contractorNotic.save();

//         //customer notification
//         const customerNotic = new CustomerNotificationModel({
//             customerId: checkCustomer._id,
//             message: `You've booked a job with ${contractor.firstName} for ${job.jobTitle}`,
//             status: "unseen"
//         })

//         await customerNotic.save();

//         //customer notification two
//         const customerNoticTwo = new CustomerNotificationModel({
//             customerId: checkCustomer._id,
//             message: `You've just sent a payment for this job - ${job.jobTitle}, Thank you.`,
//             status: "unseen"
//         })

//         await customerNoticTwo.save();

//     } catch (err: any) {
//         // signup error
//         console.log("payment Error", "err")
//     }

// }




// //customer get job completed by contractor /////////////
// export const customerGetComletedByContractorController = async (
//     req: any,
//     res: Response,
// ) => {

//     try {
//         const {

//         } = req.body;

//         // Check for validation errors
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const customer = req.customer;
//         const customerId = customer.id

//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })

//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }

//         const jobRequests = await JobModel.find({ customerId, status: 'completed' }).sort({ createdAt: -1 })

//         let jobRequested = []

//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];

//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');

//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }

//             jobRequested.push(obj)

//         }

//         res.json({
//             jobRequested
//         });

//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }

// }



// //customer comfirm job completed by Contractor /////////////
// export const customerComfirmedJobJobController = async (
//     req: any,
//     res: Response,
// ) => {

//     try {
//         const {
//             jobId
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const customer = req.customer;
//         const customerId = customer.id

//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })

//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }

//         const job = await JobModel.findOne({ _id: jobId, customerId, status: 'completed' })
//         if (!job) {
//             return res
//                 .status(401)
//                 .json({ message: "job do not exist or has not been completed by artisan" });
//         }

//         const contractor = await ContractorModel.findOne({ _id: job.contractorId }).select('-password');
//         if (!contractor) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect contractor id" });
//         }

//         const contractorBank = await ContractorBankModel.findOne({ contractorId: contractor._id })
//         if (!contractorBank) {
//             return res
//                 .status(401)
//                 .json({ message: "contractor has not enter his bank detail" });
//         }

//         const newPayout = new PayoutModel({
//             amount: job.totalAmountContractorWithdraw,
//             accountName: `${contractor.firstName} ${contractor.lastName}`,
//             accountNumber: contractorBank.accountNumber,
//             bankName: contractorBank.financialInstitution,
//             recieverId: contractor._id,
//             jobId,
//             status: "pending"
//         })

//         await newPayout.save()

//         job.status = "comfirmed";
//         await job.save()

//         //admin notification 
//         const adminNotic = new AdminNoficationModel({
//             title: "Customer Confirmed Job Completed",
//             message: `${jobId} - ${checkCustomer.firstName} has updated this job to completed and comfirm`,
//             status: "unseen"
//         })

//         await adminNotic.save();

//         res.json({
//             message: "you successfully comfirm this job completed by artisan"
//         });

//     } catch (err: any) {
//         console.log("error", err)
//         // signup error
//         res.status(500).json({ message: err.message });
//     }

// }


// //customer get you comfirm  job/////////////
// export const customerGetComfirmJobController = async (
//     req: any,
//     res: Response,
// ) => {

//     try {
//         const {

//         } = req.body;

//         // Check for validation errors
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const customer = req.customer;
//         const customerId = customer.id

//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })

//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }

//         const jobRequests = await JobModel.find({ customerId, status: 'comfirmed' }).sort({ createdAt: -1 })

//         let jobRequested = []

//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];

//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');

//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }

//             jobRequested.push(obj)

//         }

//         res.json({
//             jobRequested
//         });

//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }

// }





// //customer complaint job completed by Contractor /////////////
// export const customerComplaintedJobJobController = async (
//     req: any,
//     res: Response,
// ) => {

//     try {
//         const {
//             jobId
//         } = req.body;

//         // Check for validation errors
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const customer = req.customer;
//         const customerId = customer.id

//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })

//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }

//         const job = await JobModel.findOne({ _id: jobId, customerId, status: 'completed' })

//         if (!job) {
//             return res
//                 .status(401)
//                 .json({ message: "job do not exist or has not been completed by artisan" });
//         }

//         const contractor = await ContractorModel.findOne({ _id: job.contractorId }).select('-password');

//         job.status = "complain";

//         await job.save()

//         //admin notification 
//         const adminNotic = new AdminNoficationModel({
//             title: "Customer Disagreed on Job Completion",
//             message: `${job} - ${checkCustomer.firstName} disagreed that this job has been completed by this contractor ${contractor?.firstName}.`,
//             status: "unseen"
//         })

//         await adminNotic.save();

//         res.json({
//             message: "you successfully complained about this job completed by artisan"
//         });

//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }

// }




// //customer get job he  complain about /////////////
// export const customerGetComplainJobController = async (
//     req: any,
//     res: Response,
// ) => {

//     try {
//         const {

//         } = req.body;

//         // Check for validation errors
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const customer = req.customer;
//         const customerId = customer.id

//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })

//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }

//         const jobRequests = await JobModel.find({ customerId, status: 'complain' }).sort({ createdAt: -1 })

//         let jobRequested = []

//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];

//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');

//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }

//             jobRequested.push(obj)

//         }

//         res.json({
//             jobRequested
//         });

//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }

// }


export const CustomerJobController = {
    createJobRequest,
    getJobs,
    createJobListing,
    getSingleJob,
    getJobQuotations,
    getSingleQuotation,
    makeJobPayment,
    captureJobPayment
}


