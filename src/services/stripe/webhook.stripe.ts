

import Stripe from 'stripe';
import { BadRequestError } from '../../utils/custom.errors';
import { Request, Response } from "express";
import { StripeService } from '.';
import { ContractorModel } from '../../database/contractor/models/contractor.model';
import CustomerModel from '../../database/customer/models/customer.model';
import ContractorDeviceModel from '../../database/contractor/models/contractor_devices.model';
import { castPayloadToDTO } from '../../utils/interface_dto.util';
import { IStripeAccount } from '../../database/common/stripe_account.schema';
import { ICapture, IPayment, IRefund, PAYMENT_TYPE, PaymentModel } from '../../database/common/payment.schema';
import { JobModel, JOB_STATUS, JOB_SCHEDULE_TYPE } from '../../database/common/job.model';
import { IJobQuotation, JobQuotationModel, JOB_QUOTATION_STATUS } from '../../database/common/job_quotation.model';
import { ObjectId } from 'mongoose';
import { NotificationService } from '../notifications';
import TransactionModel, { ITransaction, TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../database/common/transaction.model';
import { Logger } from '../logger';


const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = <string>process.env.STRIPE_WEBHOOK_SECRET;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);

export const StripeWebhookHandler = async (req: Request) => {
    try {

        const payloadString = JSON.stringify(req.body);

        const sig = <string>req.headers['stripe-signature'];

        const event = stripeClient.webhooks.constructEvent(
            //@ts-ignore
            req.rawBody,
            sig,
            STRIPE_WEBHOOK_SECRET
        );

        const eventType = event.type;
        const eventData = event.data;

        switch (eventType) {

            // Setup Intent
            case 'setup_intent.created':
                setupIntentCreated(eventData.object);
                break;
            case 'setup_intent.succeeded':
                setupIntentSucceeded(eventData.object);
                break;

            // Identity
            case 'identity.verification_session.created':
                identityVerificationCreated(eventData.object);
                break;
            case 'identity.verification_session.processing':
                break
            case 'identity.verification_session.requires_input':
                identityVerificationRequiresInput(eventData.object)
                break
            case 'identity.verification_session.verified':
                // All the verification checks passed
                identityVerificationVerified(eventData.object)
                break

            // Payment Method
            case 'payment_method.attached':
                paymentMethodAttached(eventData.object);
                break;
            case 'payment_method.detached':
                paymentMethodDetached(eventData.object);
                break;

            // Customer
            case 'customer.updated':
                customerUpdated(eventData.object);
                break;
            case 'customer.created':
                customerCreated(eventData.object);
                break;

            // Account
            case 'account.updated':
                accountUpdated(eventData.object);
                break;

            // Payment and Intents
            case 'payment_intent.succeeded':
                // paymentIntentSucceeded(eventData.object);
                break;
            case 'charge.succeeded':
                chargeSucceeded(eventData.object);
                break;
            case 'charge.captured':
                chargeSucceeded(eventData.object);
                break;
            case 'charge.refunded':
                chargeRefunded(eventData.object);
                break;
            case 'charge.refund.updated':
                chargeRefundUpdated(eventData.object);
                break;
            default:
                Logger.info(`Unhandled event type: ${eventType}`, eventData.object);
                break;
        }
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
        Logger.info(error.message || "Something went wrong inside stripe webhook")
        return
    }
};



export const customerUpdated = async (payload: any) => {
    Logger.info('Stripe Event Handler: customerUpdated', payload)
    try {

        // if(payload.object != 'customer') return
        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId
        if (!userType || !userId) return // Ensure userType and userId are valid
        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists
        user.stripeCustomer = payload
        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }

};

export const customerCreated = async (payload: any) => {
    Logger.info('Stripe Event Handler: customerCreated', payload)
    try {

        // if(payload.object != 'customer') return
        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId
        if (!userType || !userId) return // Ensure userType and userId are valid
        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists
        user.stripeCustomer = payload
        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }

};


export const identityVerificationCreated = async (payload: any) => {
    try {

        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId

        let user = null
        let deviceTokens: string[] = []
        let devices = []

        if (userType == 'contractors') {
            user = await ContractorModel.findById(userId)
            devices = await ContractorDeviceModel.find({ contractor: user?.id }).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
            // Logger.info('deviceTokens', deviceTokens)
        } else {
            user = await CustomerModel.findById(userId)
        }

        if (user) {
            user.stripeIdentity = payload
            user.save()



        }




    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }
};

export const identityVerificationRequiresInput = async (payload: any) => {
    try {

        Logger.info('Verification check failed: ' + payload.last_error.reason);

        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId

        let user = null
        let deviceTokens: string[] = []
        let devices = []

        if (userType == 'contractors') {
            user = await ContractorModel.findById(userId)
            devices = await ContractorDeviceModel.find({ contractor: user?.id }).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        } else {
            user = await CustomerModel.findById(userId)
            devices = await ContractorDeviceModel.find({ contractor: user?.id }).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }

        if (!user) return

        let message = 'Verification check failed: ' + payload.last_error.reason


        // Handle specific failure reasons
        switch (payload.last_error.code) {
            case 'document_unverified_other': {
                // The document was invalid

                break;
            }
            case 'document_expired': {
                // The document was expired
                break;
            }
            case 'document_type_not_supported': {
                // document type not supported
                break;
            }
            default: {
                // ...
            }
        }


        NotificationService.sendNotification({
            user: user.id.toString(),
            userType: userType,
            title: 'Stripe Identity Verification',
            type: 'STRIPE_IDENTITY',
            message: message,
            heading: { name: `${user.name}`, image: user.profilePhoto?.url },
            payload: {
                status: payload.status,
                type: payload.type,
                reason: payload.last_error.reason,
                code: payload.last_error.code,
                options: payload.options,
                message: message,
                event: 'identity.verification_session.requires_input',
            }
        }, { socket: true })


        //fetch and expand
        let verification = await StripeService.identity.retrieveVerificationSession(payload.id)
        Logger.info(verification)

        // update user profile picture here
        //@ts-ignore
        const { fileLink, s3fileUrl } = await StripeService.file.createFileLink({
            //@ts-ignore
            file: verification?.last_verification_report?.selfie?.selfie,
            expires_at: Math.floor(Date.now() / 1000) + 30,  // link expires in 30 seconds
        }, true)
        Logger.info('fileLink from stripe', fileLink)
        Logger.info('s3fileUrl of file uploaded to s3', s3fileUrl)


        //@ts-ignore
        user.stripeIdentity = verification
        user.profilePhoto = { url: s3fileUrl };
        await user.save()


    } catch (error: any) {
        Logger.info(error)
        // new BadRequestError(error.message || "Something went wrong");
    }
};

export const identityVerificationVerified = async (payload: any) => {
    try {

        Logger.info('Verification session verified: ' + payload.status);
        Logger.info(payload)
        if (payload.object != 'identity.verification_session') return

        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId

        let user = null

        if (userType == 'contractors') {
            user = await ContractorModel.findById(userId)
        } else {
            user = await CustomerModel.findById(userId)
        }

        if (!user) return

        const message = 'Identity verification successful'
        NotificationService.sendNotification({
            user: user.id.toString(),
            userType: userType,
            title: 'Stripe Identity Verification',
            type: 'STRIPE_IDENTITY',
            message: message,
            heading: { name: `${user.name}`, image: user.profilePhoto?.url },
            payload: {
                status: payload.status,
                type: payload.type,
                options: payload.options,
                message: message,
                event: 'identity.verification_session.verified',
            }
        }, { socket: true })


        //fetch and expand
        let verification = await StripeService.identity.retrieveVerificationSession(payload.id)
        Logger.info(verification)


        // update user profile picture here
        //@ts-ignore
        const { fileLink, s3fileUrl } = await StripeService.file.createFileLink({
            //@ts-ignore
            file: verification?.last_verification_report?.selfie?.selfie,
            expires_at: Math.floor(Date.now() / 1000) + 30,  // link expires in 30 seconds
        }, true)
        Logger.info('fileLink from stripe', fileLink)
        Logger.info('s3fileUrl of file uploaded to s3', s3fileUrl)

        //@ts-ignore
        user.stripeIdentity = verification
        user.profilePhoto = { url: s3fileUrl };
        await user.save()



    } catch (error: any) {
        console.error(error.message, error)
    }
};


// COnnect Account
export const accountUpdated = async (payload: any) => {
    Logger.info('Stripe Event Handler: accountUpdated', payload)
    try {

        if (payload.object != 'account') return
        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId
        const email = payload?.metadata?.email
        if (!userType || !email) return // Ensure userType and email are valid,  userId can change on our end
        const user = userType === 'contractors' ? await ContractorModel.findOne({ email }) : await CustomerModel.findOne({ email })
        if (!user) return // Ensure user exists


        // Casting payload to DTO
        const stripeAccountDTO: IStripeAccount = castPayloadToDTO(payload, payload as IStripeAccount);
        user.stripeAccount = stripeAccountDTO

        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
        Logger.info('accountUpdated', error)
    }

};


// Payment Intent and Payment Method
export const paymentIntentSucceeded = async (payload: any) => {
    Logger.info('Stripe Event Handler: paymentIntentSucceeded', payload)
    try {

        if (payload.object != 'payment_intent') return

        const customer: any = await StripeService.customer.getCustomerById(payload.customer)

        // const userType = customer?.metadata?.userType
        // const userId = customer?.metadata?.userId
        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId

        if (!userType || !userId) return // Ensure userType and userId are valid


        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists

        const paymentMethod: any = await StripeService.payment.getPaymentMethod(payload.payment_method)
        if (paymentMethod) {
            const existingPaymentMethodIndex: any = user.stripePaymentMethods.findIndex((pm: any) => pm.id === paymentMethod.id)
            if (existingPaymentMethodIndex !== -1) {
                // If paymentMethod already exists, update it
                user.stripePaymentMethods[existingPaymentMethodIndex] = paymentMethod
            } else {
                // If paymentMethod doesn't exist, push it to the array
                user.stripePaymentMethods.push(paymentMethod)
            }
        }


        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }

};

export const setupIntentCreated = async (payload: any) => {
    try {
        //  const customer = await StripeService.customer.getCustomerById(payload.customer)
        //  Logger.info('Customer from setupIntentCreated', customer)

    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }
};

// only this send metadata
export const setupIntentSucceeded = async (payload: any) => {

    Logger.info('Stripe Event Handler: setupIntentSucceeded', payload)
    try {
        const customer: any = await StripeService.customer.getCustomerById(payload.customer)
        const paymentMethod: any = await StripeService.payment.getPaymentMethod(payload.payment_method)

        //  instead of trying to retreive meta from customer get it from the payload metadata
        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId

        if (!userType || !userId) return // Ensure userType and userId are valid

        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists

        const existingPaymentMethodIndex = user.stripePaymentMethods.findIndex((pm: any) => pm.id === paymentMethod.id)
        if (existingPaymentMethodIndex !== -1) {
            // If paymentMethod already exists, update it
            user.stripePaymentMethods[existingPaymentMethodIndex] = paymentMethod
        } else {
            // If paymentMethod doesn't exist, push it to the array
            user.stripePaymentMethods.push(paymentMethod)
        }

        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }
};

export const paymentMethodAttached = async (payload: any) => {
    Logger.info('Stripe Event Handler: paymentMethodAttached', payload)
    try {

        if (payload.object != 'payment_method') return

        const customer: any = await StripeService.customer.getCustomerById(payload.customer)
        const paymentMethod: any = await StripeService.payment.getPaymentMethod(payload.id)
        const userType = customer?.metadata?.userType
        const userId = customer?.metadata?.userId

        if (!userType || !userId) return // Ensure userType and userId are valid

        const user = await CustomerModel.findById(userId) // assume only customers have to add payment method
        if (!user) return // Ensure user exists

        const existingPaymentMethodIndex = user.stripePaymentMethods.findIndex((pm: any) => pm.id === paymentMethod.id)
        if (existingPaymentMethodIndex !== -1) {
            // If paymentMethod already exists, update it
            user.stripePaymentMethods[existingPaymentMethodIndex] = paymentMethod
        } else {
            // If paymentMethod doesn't exist, push it to the array
            user.stripePaymentMethods.push(paymentMethod)
        }

        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
        Logger.info('Error on stripe webhook: paymentMethodAttached', error)
    }

};

export const paymentMethodDetached = async (payload: any) => {
    try {

        if (payload.object != 'payment_method') return
        const paymentMethodId = payload.id;
        const user = await CustomerModel.findOne({ "stripePaymentMethods.id": paymentMethodId });
        if (!user) return; // User not found with the detached payment method
        // Remove the detached payment method from user's stripePaymentMethods array
        user.stripePaymentMethods = user.stripePaymentMethods.filter((pm: any) => pm.id !== paymentMethodId);

        await user.save();
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }
};

// Charge
export const chargeSucceeded = async (payload: any) => {
    Logger.info('Stripe Event Handler: chargeSucceeded', payload)
    try {

        if (payload.object != 'charge') return

        // const customer: any = await StripeService.customer.getCustomerById(payload.customer)
        // const userType = customer?.metadata?.userType
        // const userId = customer?.metadata?.userId

        const userType = 'customers'
        const userId = payload?.metadata?.customerId

        if (!userType || !userId) return // Ensure userType and userId are valid

        const user = await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists

        //convert from base currency
        payload.amount = payload.amount / 100
        payload.amount_refunded = payload.amount_refunded / 100
        payload.amount_captured = payload.amount_captured / 100
        payload.application_fee_amount = payload.application_fee_amount / 100

        let stripeChargeDTO: IPayment = castPayloadToDTO(payload, payload as IPayment);
        stripeChargeDTO.charge = payload.id
        stripeChargeDTO.type = payload.metadata.type
        stripeChargeDTO.user = user.id
        stripeChargeDTO.userType = userType
        delete (stripeChargeDTO as { id?: any }).id;


        let payment = await PaymentModel.findOneAndUpdate({ charge: stripeChargeDTO.charge }, stripeChargeDTO, {
            new: true, upsert: true
        })

        // handle things here
        //1 handle transfer payment method options if it requires future capturing to another model ?
        let transactionId = null


        if (payment) {
            // handle job booking creating here ?
            const metadata = payment.metadata as { jobId: string, quotationId: string, contractorId: ObjectId, customerId: ObjectId, remark: string, extraEstimateId: ObjectId, paymentType: PAYMENT_TYPE, paymentMethod: string }


            let transaction = new TransactionModel({
                type: metadata.paymentType,
                amount: payment.amount,
                currency: payment.currency,
                initiatorUser: metadata.customerId,
                initiatorUserType: 'customers',
                fromUser: metadata.customerId,
                fromUserType: 'customers',
                toUser: metadata.contractorId,
                toUserType: 'contractors',
                description: metadata.paymentType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
                remark: metadata.remark,
                metadata: metadata,

                paymentMethod: metadata.paymentMethod,
                job: metadata.jobId,
                status: TRANSACTION_STATUS.PENDING
            })

            if (!payment.captured) {

                const capture = payload.payment_method_details.card
                let captureDto: ICapture = castPayloadToDTO(capture, capture as ICapture);

                captureDto.payment_intent = payload.payment_intent
                captureDto.payment_method = payload.payment_method
                captureDto.payment = payment.id
                captureDto.captured = false
                captureDto.currency = payment.currency

                payment.capture = captureDto
                transaction.status = TRANSACTION_STATUS.PENDING

            } else {
                const capture = payload.payment_method_details.card
                let captureDto: ICapture = castPayloadToDTO(capture, capture as ICapture);
                captureDto.payment_intent = payload.payment_intent
                captureDto.payment_method = payload.payment_method
                captureDto.payment = payment.id
                captureDto.captured = payment.captured
                captureDto.captured_at = payment.created
                captureDto.currency = payment.currency

                payment.capture = captureDto
                transaction.status = TRANSACTION_STATUS.SUCCESSFUL

            }

            // link transaction to payment
            payment.transaction = transaction.id



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
                            type: JOB_SCHEDULE_TYPE.JOB_DAY,
                            remark: 'Initial job schedule'
                        };

                       

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
                                type: JOB_SCHEDULE_TYPE.SITE_VISIT,
                                remark: 'Site visit schedule'
                            };
                        } else {
                            Logger.info('quotation.siteVisit.date is not a valid Date object.');
                        }

                    }


                    if (paymentType == PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) {
                        const changeOrderEstimate: any = quotation.changeOrderEstimate
                        if (!changeOrderEstimate) return
                        changeOrderEstimate.isPaid = true
                        changeOrderEstimate.payment = payment.id
                    }

                    if (!job.payments.includes(payment.id)) job.payments.push(payment.id)



                    const onBehalf = payment.on_behalf_of
                    const destination = payment.destination
                    const transferData = payment.transfer_data

                    // payment was made to platform ?
                    if (!onBehalf && !destination && !transferData) {
                        //create payout transaction - 

                        await TransactionModel.create({
                            type: TRANSACTION_TYPE.ESCROW,
                            amount: payment.amount,

                            // customer can initiate payout on job completion or admin on dispute resolution
                            // initiatorUser: customerId,
                            // initiatorUserType: 'customers',

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
                                parentTransaction: transactionId
                            },
                            job: job.id,
                            payment: payment.id,
                        })

                    }


                    await Promise.all([
                        quotation.save(),
                        job.save()
                    ])

                }

            }


            await Promise.all([
                payment.save(),
                transaction.save()
            ])
        }





    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
        Logger.info('Error handling chargeSucceeded stripe webhook event', error)
    }

};

export const chargeRefunded = async (payload: any) => {
    Logger.info('Stripe Event Handler: chargeRefunded', payload);

    try {
        if (payload.object !== 'charge') return;

        const stripeChargeDTO: IPayment = castPayloadToDTO(payload, payload as IPayment);
        stripeChargeDTO.charge = payload.id;
        delete (stripeChargeDTO as { id?: any }).id;
        const payment = await PaymentModel.findOne({ charge: stripeChargeDTO.charge });
        if (payment) {
            payment.amount_refunded = payload.amount_refunded / 100;
            payment.refunded = payload.refunded;
            await Promise.all([payment.save()]);
        }
    } catch (error: any) {
        Logger.info('Error handling chargeRefunded stripe webhook event', error);
    }
};

export const chargeRefundUpdated = async (payload: any) => {
    Logger.info('Stripe Event Handler: chargeRefundUpdated', { object: payload.object, id: payload.id });

    try {
        if (payload.object !== 'refund') return;
        const metadata = payload.metadata as { charge: string, policyApplied: string, totalAmount: any, refundAmount: any, paymentId: ObjectId, transactionId: ObjectId }
        Logger.info(metadata)
        const stripeRefundDTO: IRefund = castPayloadToDTO(payload, payload as IRefund);
        const payment = await PaymentModel.findOne({ charge: stripeRefundDTO.charge });
        const transaction = await TransactionModel.findOne({ _id: metadata.transactionId });
        Logger.info('transaction', transaction)
        if (payment && transaction) {
            if (!payment.refunds.includes(stripeRefundDTO)) payment.refunds.push(stripeRefundDTO);
            if (payload.status == 'succeeded') transaction.status = TRANSACTION_STATUS.SUCCESSFUL
            await Promise.all([payment.save(), transaction.save()])
        }
    } catch (error: any) {
        Logger.info('Error handling chargeRefundUpdated stripe webhook event', error);
    }
};




