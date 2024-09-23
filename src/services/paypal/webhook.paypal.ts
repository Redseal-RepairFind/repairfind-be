import { BadRequestError } from '../../utils/custom.errors';
import { Request, Response } from "express";
import { ContractorModel } from '../../database/contractor/models/contractor.model';
import CustomerModel from '../../database/customer/models/customer.model';
import { castPayloadToDTO } from '../../utils/interface_dto.util';
import TransactionModel, { ITransaction, TRANSACTION_STATUS, TRANSACTION_TYPE,  } from '../../database/common/transaction.model';
import { Logger } from '../logger';
import { JobEvent } from '../../events';
import { IPayment, PaymentModel, PAYMENT_TYPE } from '../../database/common/payment.schema';
import { JobModel, JOB_STATUS, JOB_SCHEDULE_TYPE } from '../../database/common/job.model';
import { IJobQuotation, JobQuotationModel, JOB_QUOTATION_STATUS } from '../../database/common/job_quotation.model';
import { ObjectId } from 'mongoose';

const PAYPAL_WEBHOOK_SECRET = <string>process.env.PAYPAL_WEBHOOK_SECRET;

export const PayPalWebhookHandler = async (req: Request) => {
    try {
        const event = req.body;
        const eventType = event.event_type;
        const eventData = event.resource;

        switch (eventType) {
            // Payment Events
            case 'PAYMENT.CAPTURE.COMPLETED':
                paymentCaptureCompleted(eventData);
                break;
            case 'PAYMENT.CAPTURE.DENIED':
                paymentCaptureDenied(eventData);
                break;
            case 'PAYMENT.CAPTURE.REFUNDED':
                paymentCaptureRefunded(eventData);
                break;

            // Order Events
            case 'CHECKOUT.ORDER.APPROVED':
                orderApproved(eventData);
                break;
            
            default:
                Logger.info(`Unhandled event type: ${eventType}`, eventData);
                break;
        }
    } catch (error: any) {
        Logger.info(error.message || "Something went wrong inside PayPal webhook handler");
    }
};


export const paymentCaptureCompleted = async (payload: any) => {
    Logger.info('PayPal Event Handler: paymentCaptureCompleted', payload);
    try {
        // Ensure the payload is of type capture
        if (payload.object !== 'capture') return;

        const { invoice_id, custom_id, payer_id, amount, id } = payload;
        const { value, currency_code } = amount;
        
        // Extract necessary metadata
        const [userType, userId] = custom_id.split('_');

        if (!userType || !userId) return; // Ensure userType and userId are valid

        const user = userType === 'contractors'
            ? await ContractorModel.findById(userId)
            : await CustomerModel.findById(userId);

        if (!user) return; // Ensure user exists

        const paymentDTO: IPayment = {
            ...castPayloadToDTO(payload, payload as IPayment),
            capture_id: id,
            type: payload.custom,
            user: user._id,
            userType: userType,
            amount: parseFloat(value),
            currency: currency_code
        };

        let payment = await PaymentModel.findOneAndUpdate({ capture_id: paymentDTO.capture_id }, paymentDTO, {
            new: true, upsert: true
        });

        if (payment) {
            // handle transaction creation
            const transaction = new TransactionModel({
                type: paymentDTO.type,
                amount: paymentDTO.amount,
                currency: paymentDTO.currency,
                initiatorUser: userId,
                initiatorUserType: userType,
                fromUser: userId,
                fromUserType: userType,
                description: 'Payment capture for PayPal',
                status: TRANSACTION_STATUS.SUCCESSFUL,
                payment: payment._id,
                metadata: { invoice_id, payer_id }
            });

            payment.transaction = transaction._id;
            await Promise.all([payment.save(), transaction.save()]);
        }
    } catch (error: any) {
        Logger.info('Error handling paymentCaptureCompleted PayPal webhook event', error);
    }
};


export const paymentCaptureDenied = async (payload: any) => {
    Logger.info('PayPal Event Handler: paymentCaptureDenied', payload);
    try {
        // Ensure the payload is of type capture
        if (payload.object !== 'capture') return;

        const { id } = payload;

        let payment = await PaymentModel.findOne({ capture_id: id });
        if (payment) {
            payment.status = 'DENIED';
            await payment.save();
        }
    } catch (error: any) {
        Logger.info('Error handling paymentCaptureDenied PayPal webhook event', error);
    }
};




export const paymentCaptureRefunded = async (payload: any) => {
    Logger.info('PayPal Event Handler: paymentCaptureRefunded', payload);
    try {
        if (payload.object !== 'capture') return;

        const { id, amount } = payload;
        const { value } = amount;

        let payment = await PaymentModel.findOne({ capture_id: id });
        if (payment) {
            payment.amount_refunded = parseFloat(value);
            payment.status = 'REFUNDED';
            await payment.save();
        }
    } catch (error: any) {
        Logger.info('Error handling paymentCaptureRefunded PayPal webhook event', error);
    }
};


export const orderApproved = async (payload: any) => {
    Logger.info('PayPal Event Handler: orderApproved', payload);
    try {
        const { id, purchase_units } = payload;

        // You can process the approved order here
        Logger.info(`Order ${id} approved with purchase units:`, purchase_units);
    } catch (error: any) {
        Logger.info('Error handling orderApproved PayPal webhook event', error);
    }
};
