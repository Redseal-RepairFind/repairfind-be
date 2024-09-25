import { validationResult } from "express-validator";
import { NextFunction, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { JobModel, JOB_STATUS } from "../../../database/common/job.model";
import { BadRequestError } from "../../../utils/custom.errors";
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { StripeService } from "../../../services/stripe";
import Stripe from 'stripe';
import { JOB_QUOTATION_TYPE, JobQuotationModel } from "../../../database/common/job_quotation.model";
import { ObjectId } from "mongoose";
import { ConversationEvent, JobEvent } from "../../../events";
import { PAYMENT_TYPE } from "../../../database/common/payment.schema";
import { ConversationModel } from "../../../database/common/conversations.schema";
import { IMessage, MessageModel, MessageType } from "../../../database/common/messages.schema";
import { PayPalService } from "../../../services/paypal";
import { ConversationUtil } from "../../../utils/conversation.util";
import { PaypalPaymentLog } from "../../../database/common/paypal_payment_log.model";

const findCustomer = async (customerId: string) => {
    const customer = await CustomerModel.findOne({ _id: customerId });
    if (!customer) {
        throw new BadRequestError('Incorrect Customer ID');
    }
    return customer;
};

const findJob = async (jobId: ObjectId) => {
    const job = await JobModel.findOne({ _id: jobId });
    if (!job) {
        throw new BadRequestError('Job does not exist');
    }
    return job;
};

const findQuotation = async (quotationId: ObjectId) => {
    const quotation = await JobQuotationModel.findOne({ _id: quotationId });
    if (!quotation) {
        throw new BadRequestError('Job quotation not found');
    }
    return quotation;
};

const findContractor = async (contractorId: ObjectId) => {
    const contractor = await ContractorModel.findOne({ _id: contractorId });
    if (!contractor) {
        throw new BadRequestError('Contractor not found');
    }
    contractor.onboarding = await contractor.getOnboarding()
    if (!contractor.onboarding.hasStripeAccount || !(contractor.stripeAccountStatus?.card_payments_enabled && contractor.stripeAccountStatus?.transfers_enabled)) {
        throw new BadRequestError('You cannot make payment to this contractor because his/her Stripe connect account is not set up');
    }
    return contractor;
};



export const createCheckoutOrder = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { quotationId } = req.body;
        const jobId = req.params.jobId;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const customerId = req.customer.id;
        const customer = await findCustomer(customerId);
        const job = await findJob(jobId);
        const quotation = await findQuotation(quotationId);
        const contractor = await findContractor(quotation.contractor);
        const contractorId = contractor.id

       
        if (job.status === JOB_STATUS.BOOKED) {
            return res.status(400).json({ success: false, message: 'This job is not pending, so new payment is not possible' });
        }

        let paymentType = PAYMENT_TYPE.JOB_DAY_PAYMENT
        const transactionType = quotation.type
        if(transactionType == JOB_QUOTATION_TYPE.SITE_VISIT) paymentType = PAYMENT_TYPE.SITE_VISIT_PAYMENT
        if(transactionType == JOB_QUOTATION_TYPE.JOB_DAY) paymentType = PAYMENT_TYPE.JOB_DAY_PAYMENT
        const charges = await quotation.calculateCharges(paymentType);



        const metadata = {
            customerId: customer.id,
            contractorId: contractor?.id,
            quotationId: quotation.id,
            paymentType,
            jobId,
            email: customer.email,
            remark: 'initial_job_payment',
        } as any

        const payload = {
            amount: charges.customerPayable,
            intent: "CAPTURE",
            description: `Job Payment - ${jobId}`,
            metaId: jobId
        }
        const capture = await PayPalService.payment.createOrder(payload)

        //  job.status = JOB_STATUS.BOOKED;
        // job.bookingViewedByContractor = false;
        // await job.save();

        const conversation = await  ConversationUtil.updateOrCreateConversation(customerId, 'customers', contractorId, 'contractors')

        // Create a message in the conversation
        const newMessage: IMessage = await MessageModel.create({
            conversation: conversation._id,
            sender: customerId, 
            senderType: 'customers',
            message: `New Job Payment`, 
            messageType: MessageType.ALERT, 
            createdAt: new Date(),
            entity: jobId,
            entityType: 'jobs'
        });

        ConversationEvent.emit('NEW_MESSAGE', { message: newMessage })

        res.json({ success: true, message: 'Payment intent created', data: capture });
    } catch (err: any) {
        return next(new BadRequestError(err.message, err));
    }
};



export const captureCheckoutOrder = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { quotationId, paymentMethodId, orderId } = req.body;
        const jobId = req.params.jobId;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const customerId = req.customer.id;
        const customer = await findCustomer(customerId);
        const job = await findJob(jobId);
        const quotation = await findQuotation(quotationId);
        const contractor = await findContractor(quotation.contractor);
        const contractorId = contractor.id

        let paymentMethod = customer.stripePaymentMethods.find((method) => method.id === paymentMethodId);
        if (!paymentMethod) {
            paymentMethod = customer.stripePaymentMethods[0];
        }
        if (!paymentMethod) throw new Error('No such payment method');

        if (job.status === JOB_STATUS.BOOKED) {
            return res.status(400).json({ success: false, message: 'This job is not pending, so new payment is not possible' });
        }

        let paymentType = PAYMENT_TYPE.JOB_DAY_PAYMENT
        const transactionType = quotation.type
        if(transactionType == JOB_QUOTATION_TYPE.SITE_VISIT) paymentType = PAYMENT_TYPE.SITE_VISIT_PAYMENT
        if(transactionType == JOB_QUOTATION_TYPE.JOB_DAY) paymentType = PAYMENT_TYPE.JOB_DAY_PAYMENT
        const charges = await quotation.calculateCharges(paymentType);



        const metadata = {
            customerId: customer.id,
            contractorId: contractor?.id,
            quotationId: quotation.id,
            paymentType,
            paymentMethod: paymentMethod.id,
            jobId,
            email: customer.email,
            remark: 'initial_job_payment',
        } as any

     

        // const transaction = await createTransaction(customerId, contractor.id, jobId, quotation, charges, paymentMethod, transactionType, metadata  );
        // metadata.transactionId = transaction.id
        // const payload = prepareStripePayload({paymentMethodId: paymentMethod.id, customer, contractor, charges, jobId, metadata, manualCapture:false});

        // const stripePayment = await StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload);
        
        
        const capture = await PayPalService.payment.captureOrder(orderId)
        
       
         job.status = JOB_STATUS.BOOKED;
        job.bookingViewedByContractor = false;
        await job.save();

        const conversationMembers = [
            { memberType: 'customers', member: customerId },
            { memberType: 'contractors', member: contractorId }
        ];
        const conversation = await ConversationModel.findOneAndUpdate(
            {
                $and: [
                    { members: { $elemMatch: { member: customerId } } }, 
                    { members: { $elemMatch: { member: contractorId } } }
                ]
            },
            {
                members: conversationMembers,
            },
            { new: true, upsert: true });


        // Create a message in the conversation
        const newMessage: IMessage = await MessageModel.create({
            conversation: conversation._id,
            sender: customerId, 
            senderType: 'customers',
            message: `New Job Payment`, 
            messageType: MessageType.ALERT, 
            createdAt: new Date(),
            entity: jobId,
            entityType: 'jobs'
        });

        ConversationEvent.emit('NEW_MESSAGE', { message: newMessage })
        // JobEvent.emit('JOB_BOOKED', { jobId, contractorId, customerId, quotationId, paymentType })

        res.json({ success: true, message: 'Payment intent created', data: capture });
    } catch (err: any) {
        return next(new BadRequestError(err.message, err));
    }
};


export const chargeSavedPaymentMethod = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { quotationId, paymentMethodId, paymentToken } = req.body;
        const jobId = req.params.jobId;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const customerId = req.customer.id;
        const customer = await findCustomer(customerId);
        const job = await findJob(jobId);
        const quotation = await findQuotation(quotationId);
        const contractor = await findContractor(quotation.contractor);
        const contractorId = contractor.id

        let paymentMethod = customer.stripePaymentMethods.find((method) => method.id === paymentMethodId);
        if (!paymentMethod) {
            paymentMethod = customer.stripePaymentMethods[0];
        }
        if (!paymentMethod) throw new Error('No such payment method');

        if (job.status === JOB_STATUS.BOOKED) {
            return res.status(400).json({ success: false, message: 'This job is not pending, so new payment is not possible' });
        }

        let paymentType = PAYMENT_TYPE.JOB_DAY_PAYMENT
        const transactionType = quotation.type
        if(transactionType == JOB_QUOTATION_TYPE.SITE_VISIT) paymentType = PAYMENT_TYPE.SITE_VISIT_PAYMENT
        if(transactionType == JOB_QUOTATION_TYPE.JOB_DAY) paymentType = PAYMENT_TYPE.JOB_DAY_PAYMENT
        const charges = await quotation.calculateCharges(paymentType);



        const metadata = {
            customerId: customer.id,
            contractorId: contractor?.id,
            quotationId: quotation.id,
            paymentType,
            paymentMethod: paymentMethod.id,
            jobId,
            email: customer.email,
            remark: 'initial_job_payment',
        } as any

        const paypalPaymentLog = await PaypalPaymentLog.create({
            user: customerId,
            'userType': 'customers',
            metadata: metadata
        })
      
        
        const capture = await PayPalService.payment.chargeSavedCard({paymentMethod: paymentToken, amount: charges.customerPayable, metaId: paypalPaymentLog?.id  })
        
       
        //  job.status = JOB_STATUS.BOOKED;
        // job.bookingViewedByContractor = false;
        // await job.save();

       
        const conversation = await ConversationUtil.updateOrCreateConversation(customerId, 'customers', contractorId, 'contractors')

        // Create a message in the conversation
        const newMessage: IMessage = await MessageModel.create({
            conversation: conversation._id,
            sender: customerId, 
            senderType: 'customers',
            message: `New Job Payment`, 
            messageType: MessageType.ALERT, 
            createdAt: new Date(),
            entity: jobId,
            entityType: 'jobs'
        });

        ConversationEvent.emit('NEW_MESSAGE', { message: newMessage })
        // JobEvent.emit('JOB_BOOKED', { jobId, contractorId, customerId, quotationId, paymentType })

        res.json({ success: true, message: 'Payment created', data: capture });
    } catch (err: any) {
        return next(new BadRequestError(err.message, err));
    }
};



export const createOrderEstimatePaymentCheckout = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { quotationId, paymentMethodId } = req.body;
        const jobId = req.params.jobId;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const customerId = req.customer.id;
        const customer = await findCustomer(customerId);
        const job = await findJob(jobId);
        const quotation = await findQuotation(quotationId);
        const contractor = await findContractor(quotation.contractor);

        // const changeOrderEstimate: any = quotation.changeOrderEstimates.find((estimate: any) => estimate.id === changeOrderEstimateId)
        const changeOrderEstimate: any = quotation.changeOrderEstimate
        if (!changeOrderEstimate) throw new Error('No  changeOrder estimate for this job');

        if (changeOrderEstimate.isPaid) throw new Error('Extra estimate already paid');

        let paymentMethod = customer.stripePaymentMethods.find((method) => method.id === paymentMethodId);
        if (!paymentMethod) {
            paymentMethod = customer.stripePaymentMethods[0];
        }
        if (!paymentMethod) throw new Error('No such payment method');


        let paymentType = PAYMENT_TYPE.CHANGE_ORDER_PAYMENT
        let transactionType = TRANSACTION_TYPE.CHANGE_ORDER
        const charges = await quotation.calculateCharges(paymentType);

        
        const metadata = {
            customerId: customer.id,
            contractorId: contractor?.id,
            quotationId: quotation.id,
            jobId,
            paymentType,
            paymentMethod: paymentMethod.id,
            email: customer.email,
            remark: 'change_order_estimate_payment',
        } as any
        // const transaction = await createTransaction(customerId, contractor.id, jobId, charges, paymentMethod, transactionType, metadata);
        // metadata.transactionId = transaction.id
        // const payload = prepareStripePayload({paymentMethodId: paymentMethod.id, customer, contractor, charges, jobId, metadata, manualCapture:false});

        job.isChangeOrder = false;
        await job.save();

        JobEvent.emit('CHANGE_ORDER_ESTIMATE_PAID', { job, quotation, changeOrderEstimate })
        
        res.json({ success: true, message: 'Payment intent created', data: "" });
    } catch (err: any) {
        return next(new BadRequestError(err.message, err));
    }
};


export const captureOrderEstimatePaymentCheckout = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { quotationId, paymentMethodId } = req.body;
        const jobId = req.params.jobId;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const customerId = req.customer.id;
        const customer = await findCustomer(customerId);
        const job = await findJob(jobId);
        const quotation = await findQuotation(quotationId);
        const contractor = await findContractor(quotation.contractor);

        // const changeOrderEstimate: any = quotation.changeOrderEstimates.find((estimate: any) => estimate.id === changeOrderEstimateId)
        const changeOrderEstimate: any = quotation.changeOrderEstimate
        if (!changeOrderEstimate) throw new Error('No  changeOrder estimate for this job');

        if (changeOrderEstimate.isPaid) throw new Error('Extra estimate already paid');

        let paymentMethod = customer.stripePaymentMethods.find((method) => method.id === paymentMethodId);
        if (!paymentMethod) {
            paymentMethod = customer.stripePaymentMethods[0];
        }
        if (!paymentMethod) throw new Error('No such payment method');


        let paymentType = PAYMENT_TYPE.CHANGE_ORDER_PAYMENT
        let transactionType = TRANSACTION_TYPE.CHANGE_ORDER
        const charges = await quotation.calculateCharges(paymentType);

        
        const metadata = {
            customerId: customer.id,
            contractorId: contractor?.id,
            quotationId: quotation.id,
            jobId,
            paymentType,
            paymentMethod: paymentMethod.id,
            email: customer.email,
            remark: 'change_order_estimate_payment',
        } as any
        // const transaction = await createTransaction(customerId, contractor.id, jobId, charges, paymentMethod, transactionType, metadata);
        // metadata.transactionId = transaction.id

        job.isChangeOrder = false;
        await job.save();

        JobEvent.emit('CHANGE_ORDER_ESTIMATE_PAID', { job, quotation, changeOrderEstimate })
        
        res.json({ success: true, message: 'Payment intent created', data: "" });
    } catch (err: any) {
        return next(new BadRequestError(err.message, err));
    }
};



export const CustomerPaypalPaymentController = {
    captureCheckoutOrder,
    captureOrderEstimatePaymentCheckout,
    createCheckoutOrder,
    createOrderEstimatePaymentCheckout,
    chargeSavedPaymentMethod
};
