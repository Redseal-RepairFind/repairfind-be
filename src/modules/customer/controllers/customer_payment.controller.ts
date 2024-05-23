import { validationResult } from "express-validator";
import { NextFunction, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { JobModel, JOB_STATUS } from "../../../database/common/job.model";
import { BadRequestError } from "../../../utils/custom.errors";
import TransactionModel, { ITransaction, TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { StripeService } from "../../../services/stripe";
import Stripe from 'stripe';
import { QueueService } from "../../../services/bullmq";
import { JobQuotationModel } from "../../../database/common/job_quotation.model";
import { castPayloadToDTO } from "../../../utils/interface_dto.util";
import { IStripeAccount } from "../../../database/common/stripe_account.schema";





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


        const quotation = await JobQuotationModel.findOne({ _id: quotationId })
        if (!quotation) {
            return res
                .status(404)
                .json({ success: false, message: "Job quotation not found" });
        }

        const contractor = await ContractorModel.findOne({ _id: quotation.contractor });
        if (!contractor) {
            return res
                .status(404)
                .json({ success: false, message: "Contractor not found" });
        }

        // Check if contractor has a verified connected account
        if (!contractor.onboarding.hasStripeAccount || !(contractor.stripeAccountStatus?.card_payments_enabled && contractor.stripeAccountStatus?.transfers_enabled)) {
            return res.status(400).json({ success: false, message: "You cannot make payment to this contractor because his/her Stripe connect account is not set up" });
        }

        let paymentMethod = customer.stripePaymentMethods.find((method) => method.id == paymentMethodId)
        if (!paymentMethod) {
            paymentMethod = customer.stripePaymentMethods[0]
        };
        if (!paymentMethod) throw new Error("No such payment method")


        if (job.status == JOB_STATUS.BOOKED) {
            return res
                .status(400)
                .json({ success: false, message: "This job is not pending, so new payment is not possible" });
        }


        const generateInvoce = new Date().getTime().toString()

        const invoiceId = generateInvoce.substring(generateInvoce.length - 5)
        const charges = await quotation.calculateCharges()

        const transaction = await TransactionModel.create({
            type: TRANSACTION_TYPE.JOB_PAYMENT,
            amount: charges.totalAmount,

            initiatorUser: customerId,
            initiatorUserType: 'customers',

            fromUser: customerId,
            fromUserType: 'customers',

            toUser: contractor.id,
            toUserType: 'contractors',

            description: `qoutation from ${contractor?.firstName} payment`,
            status: TRANSACTION_STATUS.PENDING,
            remark: 'qoutation',
            invoice: {
                items: quotation.estimates,
                charges: quotation.charges
            },
            job: jobId
        })


        // const transactionId = JSON.stringify(saveTransaction._id)


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
                type: "job_payment",
                jobId,
                email: customer.email,
                transactionId: transaction.id,
                remark: 'initial_job_payment' // we can have extra_job_payment
            },

            customer: customer.stripeCustomer.id,
            off_session: true,
            confirm: true,
        }

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
                .json({ success: false, message: "incorrect Customer ID" });
        }

        //const job = await JobModel.findOne({_id: jobId, customerId, status: 'sent qoutation'})
        const job = await JobModel.findOne({ _id: jobId })
        if (!job) {
            return res
                .status(401)
                .json({ success: false, message: "job do not exist" });
        }


        const quotation = await JobQuotationModel.findOne({ _id: quotationId })
        if (!quotation) {
            return res
                .status(401)
                .json({ success: false, message: "Job quotation not found" });
        }

        // const paymentMethod = customer.stripePaymentMethods.filter(pm =>  pm.id == paymentMethodId)

        let paymentMethod = customer.stripePaymentMethods.find((method) => method.id == paymentMethodId)
        if (!paymentMethod) {
            paymentMethod = customer.stripePaymentMethods[0]
        };

        if (!paymentMethod) throw new Error("No such payment method")


        const contractor = await ContractorModel.findOne({ _id: quotation.contractor });
        if (!contractor) {
            return res
                .status(404)
                .json({ success: false, message: "Contractor not found" });
        }

        // Check if contractor has a verified connected account
        if (!contractor.onboarding.hasStripeAccount || !(contractor.stripeAccountStatus?.card_payments_enabled && contractor.stripeAccountStatus?.transfers_enabled)) {
            return res.status(400).json({ success: false, message: "You cannot make payment to this contractor because his/her Stripe connect account is not set up" });
        }

        //check if job is already booked
        if (job.status == JOB_STATUS.BOOKED) {
            return res
                .status(400)
                .json({ success: false, message: "This job is not pending, so new payment is not possible" });
        }

        const charges = await quotation.calculateCharges()
        const transaction = await TransactionModel.create({
            type: TRANSACTION_TYPE.JOB_PAYMENT,
            amount: charges.totalAmount,
            currency: 'USD',

            initiatorUser: customerId,
            initiatorUserType: 'customers',

            fromUser: customerId,
            fromUserType: 'customers',

            toUser: contractor.id,
            toUserType: 'contractors',

            description: `qoutation from ${contractor?.firstName} payment`,
            remark: 'qoutation',
            invoice: {
                items: quotation.estimates,
                charges: quotation.charges
            },
            paymentMethod: paymentMethod,
            job: jobId,
            status: TRANSACTION_STATUS.REQUIRES_CAPTURE
        })



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





        let payload: Stripe.PaymentIntentCreateParams = {
            payment_method_types: ['card'],
            payment_method_options: {
                card: {
                    capture_method: 'manual', // request_extended_authorization: 'if_available', // 30 days
                },
            },
            expand: ['latest_charge'],
            payment_method: paymentMethod.id,
            currency: 'usd',
            // amount: (charges.totalAmount) * 100,
            // application_fee_amount: (charges.processingFee) * 100, 
            amount: Math.ceil(charges.totalAmount * 100),
            application_fee_amount: Math.ceil(charges.processingFee * 100),
            transfer_data: {
                // amount: (charges.contractorAmount) * 100, // transfer to connected account
                destination: contractor?.stripeAccount.id ?? '' // mostimes only work with same region example us, user // https://docs.stripe.com/connect/destination-charges
            },
            on_behalf_of: contractor?.stripeAccount.id,
            metadata: {
                customerId,
                constractorId: contractor?.id,
                quotationId,
                type: "job_payment",
                jobId,
                email: customer.email,
                transactionId: transaction.id,
                remark: 'initial_job_payment' // we can have extra_job_payment
            },

            customer: customer.stripeCustomer.id,
            off_session: true,
            confirm: true,
            capture_method: 'manual'
        }

        const stripePayment = await StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload)

        job.status = JOB_STATUS.BOOKED;
        await job.save()

        res.json({ success: true, message: 'Payment intent created', data: stripePayment });

    } catch (err: any) {
        return next(new BadRequestError(err.message, err))
    }

}

export const getTransactions = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

    try {

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


export const CustomerPaymentController = {
    makeJobPayment,
    captureJobPayment,

}


