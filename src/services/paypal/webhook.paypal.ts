import { BadRequestError } from '../../utils/custom.errors';
import { Request, Response } from "express";
import { ContractorModel } from '../../database/contractor/models/contractor.model';
import CustomerModel from '../../database/customer/models/customer.model';
import { castPayloadToDTO } from '../../utils/interface_dto.util';
import TransactionModel, { ITransaction, TRANSACTION_STATUS, TRANSACTION_TYPE, } from '../../database/common/transaction.model';
import { Logger } from '../logger';
import { JobEvent } from '../../events';
import { IPayment, PaymentModel, PAYMENT_TYPE, IPaypalCapture } from '../../database/common/payment.schema';
import { JobModel, JOB_STATUS, JOB_SCHEDULE_TYPE } from '../../database/common/job.model';
import { IJobQuotation, JobQuotationModel, JOB_QUOTATION_STATUS } from '../../database/common/job_quotation.model';
import { ObjectId } from 'mongoose';
import { PaypalPaymentLog } from '../../database/common/paypal_payment_log.model';

const PAYPAL_WEBHOOK_SECRET = <string>process.env.PAYPAL_WEBHOOK_SECRET;

export const PayPalWebhookHandler = async (req: Request) => {
    try {
        const event = req.body;
        const eventType = event.event_type;
        const resourceType = event.resource_type;
        const eventData = event.resource;


        switch (eventType) {
            // Payment Events
            case 'PAYMENT.CAPTURE.COMPLETED':
                paymentCaptureCompleted(eventData, resourceType);
                break;
            case 'PAYMENT.CAPTURE.DENIED':
                paymentCaptureDenied(eventData, resourceType);
                break;
            case 'PAYMENT.CAPTURE.REFUNDED':
                paymentCaptureRefunded(eventData, resourceType);
                break;

            // Order Events
            case 'CHECKOUT.ORDER.APPROVED':
                orderApproved(eventData, resourceType);
                break;

            default:
                Logger.info(`Unhandled event type: ${eventType} - ${resourceType}`, eventData);
                break;
        }
    } catch (error: any) {
        Logger.info(error.message || "Something went wrong inside PayPal webhook handler");
    }
};


export const paymentCaptureCompleted = async (payload: any, resourceType: any) => {
    Logger.info('PayPal Event Handler: paymentCaptureCompleted', payload);
    try {
        // Ensure the payload is of type capture
        if (resourceType !== 'capture') return;

        const { custom_id, amount } = payload;
        const { value, currency_code } = amount;

        // Extract necessary metadata
        const metaId = custom_id;
        const meta = await PaypalPaymentLog.findById(metaId)

        if (!meta || !meta.userType || !meta.user) return; // Ensure userType and userId are valid
        const metadata = meta.metadata

        console.log('meta', meta)
        const user = meta.userType === 'contractors'
            ? await ContractorModel.findById(meta.user)
            : await CustomerModel.findById(meta.user);

        if (!user) return; // Ensure user exists

        const captureDto: IPaypalCapture = castPayloadToDTO(payload, payload as IPaypalCapture)
        const paymentDTO: IPayment = {
            ...castPayloadToDTO(payload, payload as IPayment),
            capture_id: captureDto.id,
            charge: captureDto.id,
            paypalCapture: captureDto,
            type: metadata.paymentType,
            user: user._id,
            userType: meta.userType,
            amount: parseFloat(value),
            amount_captured: parseFloat(value),
            currency: currency_code,
            object: resourceType
        };



        let payment = await PaymentModel.findOneAndUpdate({ capture_id: paymentDTO.capture_id }, paymentDTO, {
            new: true, upsert: true
        });



        if (payment) {

            // handle transaction creation
            const transaction = new TransactionModel({
                type: metadata.paymentType,
                amount: paymentDTO.amount,
                currency: paymentDTO.currency,
                initiatorUser: user.id,
                initiatorUserType: meta.userType,
                fromUser: user.id,
                fromUserType: meta.userType,
                toUser: metadata.contractorId,
                toUserType: 'contractors',
                description: meta.metadata.paymentType.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
                payment: payment._id,
                remark: metadata.remark,
                metadata: metadata,
                paymentMethod: meta.metadata.paymentMethod,
                job: metadata.jobId,
                status: TRANSACTION_STATUS.SUCCESSFUL

            });

            payment.transaction = transaction._id;


            // make sure that  payment if for a job
            if (metadata.jobId) {
                const jobId = metadata.jobId
                const paymentType = metadata.paymentType
                const quotationId = metadata.quotationId



                if (jobId && paymentType && quotationId) {

                    let job = await JobModel.findById(jobId)
                    let quotation = await JobQuotationModel.findById(quotationId)
                    if (!job || !quotation) return
                    const charges = await quotation.calculateCharges()

                    transaction.invoice = {
                        items: quotation.estimates,
                        charges: charges
                    }


                    if (paymentType == PAYMENT_TYPE.JOB_DAY_PAYMENT) {
                        job.status = JOB_STATUS.BOOKED
                        job.contract = quotation.id
                        job.contractor = quotation.contractor

                        quotation.isPaid = true
                        quotation.payment = payment.id
                        quotation.status = JOB_QUOTATION_STATUS.ACCEPTED


                        job.schedule = {
                            startDate: quotation.startDate ?? job.date,
                            estimatedDuration: quotation.estimatedDuration,
                            type: JOB_SCHEDULE_TYPE.JOB_DAY,
                            remark: 'Initial job schedule'
                        };


                        await Promise.all([
                            quotation.save(),
                            job.save()
                        ])
                        JobEvent.emit('JOB_BOOKED', { jobId, contractorId: quotation.contractor, customerId: job.customer, quotationId, paymentType })

                    }


                    if (paymentType == PAYMENT_TYPE.SITE_VISIT_PAYMENT) {
                        job.status = JOB_STATUS.BOOKED
                        job.contract = quotation.id
                        job.contractor = quotation.contractor

                        quotation.siteVisitEstimate.isPaid = true
                        quotation.siteVisitEstimate.payment = payment.id
                        quotation.status = JOB_QUOTATION_STATUS.ACCEPTED

                        if (quotation.siteVisit instanceof Date) {
                            job.schedule = {
                                startDate: quotation.siteVisit,
                                estimatedDuration: quotation.estimatedDuration,
                                type: JOB_SCHEDULE_TYPE.SITE_VISIT,
                                remark: 'Site visit schedule'
                            };
                        } else {
                            Logger.info('quotation.siteVisit.date is not a valid Date object.');
                        }

                        await Promise.all([
                            quotation.save(),
                            job.save()
                        ])

                        JobEvent.emit('JOB_BOOKED', { jobId, contractorId: quotation.contractor, customerId: job.customer, quotationId, paymentType })

                    }


                    if (paymentType == PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) {
                        const changeOrderEstimate: any = quotation.changeOrderEstimate
                        if (!changeOrderEstimate) return
                        changeOrderEstimate.isPaid = true
                        changeOrderEstimate.payment = payment.id
                    }

                    if (!job.payments.includes(payment.id)) job.payments.push(payment.id)


 

                    // Create Escrow Transaction here
                    await TransactionModel.create({
                        type: TRANSACTION_TYPE.ESCROW,
                        amount: payment.amount,
                        initiatorUser: user.id,
                        initiatorUserType: 'customers',
                        fromUser: job.customer,
                        fromUserType: 'customers',
                        toUser: job.contractor,
                        toUserType: 'contractors',
                        description: `Escrow Transaction for job: ${job?.title}`,
                        status: TRANSACTION_STATUS.PENDING,
                        remark: 'job_escrow_transaction',
                        invoice: {
                            items: [],
                            charges: quotation.charges
                        },
                        metadata: {
                            paymentType,
                            parentTransaction: transaction.id
                        },
                        job: job.id,
                        payment: payment.id,
                    })


                    await Promise.all([ quotation.save(), job.save() ])

                }

            }




            await Promise.all([payment.save(), transaction.save()]);
        }


    } catch (error: any) {
        Logger.info('Error handling paymentCaptureCompleted PayPal webhook event', error);
    }
};


export const paymentCaptureDenied = async (payload: any, resourceType: any) => {
    Logger.info('PayPal Event Handler: paymentCaptureDenied', payload);
    try {
        // Ensure the payload is of type capture
        if (payload.object !== 'capture') return;

        const { id } = payload;

    } catch (error: any) {
        Logger.info('Error handling paymentCaptureDenied PayPal webhook event', error);
    }
};


export const paymentCaptureRefunded = async (payload: any, resourceType: any) => {
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


export const orderApproved = async (payload: any, resourceType: any) => {
    Logger.info('PayPal Event Handler: orderApproved', payload);
    try {
        const { id, purchase_units } = payload;

        // You can process the approved order here
        Logger.info(`Order ${id} approved with purchase units:`, purchase_units);
    } catch (error: any) {
        Logger.info('Error handling orderApproved PayPal webhook event', error);
    }
};
