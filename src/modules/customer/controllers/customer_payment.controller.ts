import { validationResult } from "express-validator";
import { NextFunction, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { JobModel, JOB_STATUS } from "../../../database/common/job.model";
import { BadRequestError } from "../../../utils/custom.errors";
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { StripeService } from "../../../services/stripe";
import Stripe from 'stripe';
import { JobQuotationModel } from "../../../database/common/job_quotation.model";
import { ObjectId } from "mongoose";
import { JobEvent } from "../../../events";

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
    if (!contractor.onboarding.hasStripeAccount || !(contractor.stripeAccountStatus?.card_payments_enabled && contractor.stripeAccountStatus?.transfers_enabled)) {
        throw new BadRequestError('You cannot make payment to this contractor because his/her Stripe connect account is not set up');
    }
    return contractor;
};

const createTransaction = async (customerId: string, contractorId: string, jobId: string, charges: any, paymentMethod: any, metadata: any = null) => {
    return await TransactionModel.create({
        type: TRANSACTION_TYPE.JOB_PAYMENT,
        amount: charges.totalAmount,
        currency: 'USD',
        initiatorUser: customerId,
        initiatorUserType: 'customers',
        fromUser: customerId,
        fromUserType: 'customers',
        toUser: contractorId,
        toUserType: 'contractors',
        description: `Quotation from ${contractorId} payment`,
        remark: 'quotation',
        metadata,
        invoice: {
            items: charges.estimates,
            charges: charges.charges
        },
        paymentMethod: paymentMethod,
        job: jobId,
        status: TRANSACTION_STATUS.REQUIRES_CAPTURE
    });
};

const prepareStripePayload = (data:{paymentMethodId: string, customer: any, contractor: any, charges: any, transactionId: string, jobId: string, metadata: any, manualCapture: boolean}) => {


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




    const {paymentMethodId, customer, contractor, charges, transactionId, jobId, metadata, manualCapture} = data


    // metadata: {
    //     customerId: customer.id,
    //     constractorId: contractor?.id,
    //     quotationId: charges.id,
    //     type: 'job_payment',
    //     jobId,
    //     email: customer.email,
    //     transactionId,
    //     remark: 'initial_job_payment'
    // },

    const payload: Stripe.PaymentIntentCreateParams = {
        payment_method_types: ['card'],
        payment_method: paymentMethodId,
        currency: 'usd',
        amount: Math.ceil(charges.totalAmount * 100),
        application_fee_amount: Math.ceil(charges.processingFee * 100),
        transfer_data: {
            destination: contractor?.stripeAccount.id ?? ''
        },
        on_behalf_of: contractor?.stripeAccount.id,
        metadata,
        customer: customer.stripeCustomer.id,
        off_session: true,
        confirm: true,
    };

    if (manualCapture) {
        payload.payment_method_options = { card: { capture_method: 'manual' } };
        payload.capture_method = 'manual';
    }

    return payload;
};

export const makeJobPayment = async (req: any, res: Response, next: NextFunction) => {
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

        let paymentMethod = customer.stripePaymentMethods.find((method) => method.id === paymentMethodId);
        if (!paymentMethod) {
            paymentMethod = customer.stripePaymentMethods[0];
        }
        if (!paymentMethod) throw new Error('No such payment method');

        if (job.status === JOB_STATUS.BOOKED) {
            return res.status(400).json({ success: false, message: 'This job is not pending, so new payment is not possible' });
        }

        const metadata = {
            customerId: customer.id,
            constractorId: contractor?.id,
            quotationId: quotation.id,
            type: 'job_payment',
            jobId,
            email: customer.email,
            remark: 'initial_job_payment',
        } as any
        const charges = await quotation.calculateCharges();
        const transaction = await createTransaction(customerId, contractor.id, jobId, charges, paymentMethod);
        metadata.transactionId = transaction.id
        const payload = prepareStripePayload({paymentMethodId: paymentMethod.id, customer, contractor, charges, transactionId:transaction.id, jobId, metadata, manualCapture:false});


        const stripePayment = await StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload);

        job.status = JOB_STATUS.BOOKED;
        await job.save();

        res.json({ success: true, message: 'Payment intent created', data: stripePayment });
    } catch (err: any) {
        return next(new BadRequestError(err.message, err));
    }
};
export const makeExtraEstimatePayment = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { quotationId, paymentMethodId, extraEstimateId } = req.body;
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

        const extraEstimate: any = quotation.extraEstimates.find((estimate: any) => estimate.id === extraEstimateId)
        if (!extraEstimate) throw new Error('No such extra estimat');

        if (extraEstimate.isPaid) throw new Error('Extra estimate already paid');

        let paymentMethod = customer.stripePaymentMethods.find((method) => method.id === paymentMethodId);
        if (!paymentMethod) {
            paymentMethod = customer.stripePaymentMethods[0];
        }
        if (!paymentMethod) throw new Error('No such payment method');

        const charges = await quotation.calculateCharges(extraEstimate.id)
        const metadata = {
            customerId: customer.id,
            constractorId: contractor?.id,
            quotationId: quotation.id,
            jobId,
            extraEstimateId,
            type: 'job_payment',
            email: customer.email,
            remark: 'extra_job_payment',
        } as any
        const transaction = await createTransaction(customerId, contractor.id, jobId, charges, paymentMethod, metadata);
        metadata.transactionId = transaction.id
        const payload = prepareStripePayload({paymentMethodId: paymentMethod.id, customer, contractor, charges, transactionId:transaction.id, jobId, metadata, manualCapture:false});

        const stripePayment = await StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload);
        job.isChangeOrder = false;
        await job.save();

        JobEvent.emit('CHANGE_ORDER_ESTIMATE_PAID', { job, quotation, extraEstimate })
        
        res.json({ success: true, message: 'Payment intent created', data: stripePayment });
    } catch (err: any) {
        return next(new BadRequestError(err.message, err));
    }
};

export const captureJobPayment = async (req: any, res: Response, next: NextFunction) => {
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

        let paymentMethod = customer.stripePaymentMethods.find((method) => method.id === paymentMethodId);
        if (!paymentMethod) {
            paymentMethod = customer.stripePaymentMethods[0];
        }
        if (!paymentMethod) throw new Error('No such payment method');

        if (job.status === JOB_STATUS.BOOKED) {
            return res.status(400).json({ success: false, message: 'This job is not pending, so new payment is not possible' });
        }

        const metadata = {
            customerId: customer.id,
            constractorId: contractor?.id,
            quotationId: quotation.id,
            type: 'job_payment',
            jobId,
            email: customer.email,
            remark: 'initial_job_payment',
        } as any
        const charges = await quotation.calculateCharges();
        const transaction = await createTransaction(customerId, contractor.id, jobId, charges, paymentMethod);
        metadata.transactionId = transaction.id
        const payload = prepareStripePayload({paymentMethodId: paymentMethod.id, customer, contractor, charges, transactionId:transaction.id, jobId, metadata, manualCapture:true});
        const stripePayment = await StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload);

        job.status = JOB_STATUS.BOOKED;
        await job.save();

        res.json({ success: true, message: 'Payment intent created', data: stripePayment });
    } catch (err: any) {
        return next(new BadRequestError(err.message, err));
    }
};

export const CustomerPaymentController = {
    makeJobPayment,
    captureJobPayment,
    makeExtraEstimatePayment
};
