

import Stripe from 'stripe';
import { BadRequestError } from '../../utils/custom.errors';
import { Request, Response } from "express";
import { Log } from '../../utils/logger';
import { EventEmitter } from 'events';
import { eventEmitter } from '../../events';
import { StripeService } from '.';
import { ContractorModel } from '../../database/contractor/models/contractor.model';
import CustomerModel from '../../database/customer/models/customer.model';
import { sendPushNotifications } from '../expo';
import ContractorDeviceModel from '../../database/contractor/models/contractor_devices.model';
import { castPayloadToDTO } from '../../utils/interface_dto.util';
import { IStripeAccount } from '../../database/common/stripe_account.schema';
import { IPayment, PaymentModel } from '../../database/common/payment.schema';
import { PAYMENT_CAPTURE_STATUS, IPaymentCapture, PaymentCaptureModel } from '../../database/common/payment_captures.schema';
import { JobModel, JOB_STATUS, JOB_SCHEDULE_TYPE } from '../../database/common/job.model';
import { IJobQuotation, JobQoutationModel, JOB_QUOTATION_STATUS } from '../../database/common/job_quotation.model';
import { ObjectId } from 'mongoose';


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

        // console.log(event)
        // Log.info(event)

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
            default:
                console.log(`Unhandled event type: ${eventType}`, eventData.object);
                break;
        }
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
        console.log(error.message || "Something went wrong inside stripe webhook")
    }
};


export const setupIntentCreated = async (payload: any) => {
    try {
        //  const customer = await StripeService.customer.getCustomerById(payload.customer)
        //  console.log('Customer from setupIntentCreated', customer)

    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }
};



export const setupIntentSucceeded = async (payload: any) => {

    console.log('Stripe Event Handler: setupIntentSucceeded', payload)
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



export const customerUpdated = async (payload: any) => {
    console.log('Stripe Event Handler: customerUpdated', payload)
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
    console.log('Stripe Event Handler: customerCreated', payload)
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


export const paymentMethodAttached = async (payload: any) => {
    console.log('Stripe Event Handler: paymentMethodAttached', payload)
    try {

        if (payload.object != 'payment_method') return

        const customer: any = await StripeService.customer.getCustomerById(payload.customer)

        console.log('customer', customer)
        const paymentMethod: any = await StripeService.payment.getPaymentMethod(payload.id)
        const userType = customer?.metadata?.userType
        const userId = customer?.metadata?.userId



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

        console.log(user)

        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
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
            // console.log('deviceTokens', deviceTokens)
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

        console.log('Verification check failed: ' + payload.last_error.reason);

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


        if (!user) return

        //fetch and expand
        let verification = await StripeService.identity.retrieveVerificationSession(payload.id)
        console.log(verification)


        // update user profile picture here
        //@ts-ignore
        const { fileLink, s3fileUrl } = await StripeService.file.createFileLink({
            //@ts-ignore
            file: verification?.last_verification_report?.selfie?.selfie,
            expires_at: Math.floor(Date.now() / 1000) + 30,  // link expires in 30 seconds
        }, true)
        console.log('fileLink from stripe', fileLink)
        console.log('s3fileUrl of file uploaded to s3', s3fileUrl)


        user.stripeIdentity = verification
        //@ts-ignore
        user.profilePhoto = { url: s3fileUrl }
        user.save()



        sendPushNotifications(deviceTokens, {
            title: 'Identity Verification',
            icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
            body: message,
            data: {
                event: 'identity.verification_session.requires_input',
                user: {
                    email: user.email,
                    profilePhoto: user.profilePhoto,
                },
                payload: {
                    status: payload.status,
                    type: payload.type,
                    reason: payload.last_error.reason,
                    code: payload.last_error.code,
                    options: payload.options
                }
            },
        })



    } catch (error: any) {
        new BadRequestError(error.message || "Something went wrong");
    }
};

export const identityVerificationVerified = async (payload: any) => {
    try {

        console.log('Verification session verified: ' + payload.status);
        console.log(payload)
        if (payload.object != 'identity.verification_session') return

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


        //fetch and expand
        let verification = await StripeService.identity.retrieveVerificationSession(payload.id)
        console.log(verification)


        // update user profile picture here
        //@ts-ignore
        const { fileLink, s3fileUrl } = await StripeService.file.createFileLink({
            //@ts-ignore
            file: verification?.last_verification_report?.selfie?.document,
            expires_at: Math.floor(Date.now() / 1000) + 30,  // link expires in 30 seconds
        }, true)
        console.log('fileLink from stripe', fileLink)
        console.log('s3fileUrl of file uploaded to s3', s3fileUrl)


        user.stripeIdentity = verification
        //@ts-ignore
        user.profilePhoto = { url: s3fileUrl }
        user.save()

        sendPushNotifications(deviceTokens, {
            title: 'Identity Verification',
            icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
            body: 'Identity verification session verified',
            data: {
                event: 'identity.verification_session.verified',
                user: {
                    email: user.email,
                    profilePhoto: user.profilePhoto,
                },
                payload: {
                    status: payload.status,
                    type: payload.type,
                    options: payload.options
                }
            },
        })


    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }
};



export const accountUpdated = async (payload: any) => {
    console.log('Stripe Event Handler: accountUpdated', payload)
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
        console.log('accountUpdated', error)
    }

};


// Payment
export const paymentIntentSucceeded = async (payload: any) => {
    console.log('Stripe Event Handler: paymentIntentSucceeded', payload)
    try {

        if (payload.object != 'payment_intent') return

        const customer: any = await StripeService.customer.getCustomerById(payload.customer)
        const userType = customer?.metadata?.userType
        const userId = customer?.metadata?.userId

        if (!userType || !userId) return // Ensure userType and userId are valid

        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists


        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }

};

export const chargeSucceeded = async (payload: any) => {
    console.log('Stripe Event Handler: chargeSucceeded', payload)
    try {

        if (payload.object != 'charge') return

        const customer: any = await StripeService.customer.getCustomerById(payload.customer)
        const userType = customer?.metadata?.userType
        const userId = customer?.metadata?.userId

        if (!userType || !userId) return // Ensure userType and userId are valid

        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists

        let stripeChargeDTO: IPayment = castPayloadToDTO(payload, payload as IPayment);
        stripeChargeDTO.reference = payload.id
        delete (stripeChargeDTO as { id?: any }).id;

        stripeChargeDTO.user = user.id
        stripeChargeDTO.userType = userType

        let payment = await PaymentModel.findOneAndUpdate({ reference: stripeChargeDTO.reference }, stripeChargeDTO, {
            new: true, upsert: true
        })

        // handle things here
        //1 handle transfer payment method options if it requires future capturing to another model ?
        if (!payment.captured) {
            const captureDetails = payload.payment_method_details.card
            //save payment capture here
            let paymentCaptureDto: IPaymentCapture = castPayloadToDTO(captureDetails, captureDetails as IPaymentCapture);
            paymentCaptureDto.payment_intent = payload.payment_intent
            paymentCaptureDto.payment_method = payload.payment_method
            paymentCaptureDto.user = userId
            paymentCaptureDto.userType = userType
            paymentCaptureDto.payment = payment.id
            paymentCaptureDto.status = PAYMENT_CAPTURE_STATUS.REQUIRES_CAPTURE
            paymentCaptureDto.captured = false
            paymentCaptureDto.currency = payment.currency

            let paymentCapture = await PaymentCaptureModel.findOneAndUpdate({ payment: payment.id }, paymentCaptureDto, {
                new: true, upsert: true
            })
        } else {
            const captureDetails = payload.payment_method_details.card
            //save payment capture here
            let paymentCaptureDto: IPaymentCapture = castPayloadToDTO(captureDetails, captureDetails as IPaymentCapture);
            paymentCaptureDto.payment_intent = payload.payment_intent
            paymentCaptureDto.payment_method = payload.payment_method
            paymentCaptureDto.user = userId
            paymentCaptureDto.userType = userType
            paymentCaptureDto.payment = payment.id
            paymentCaptureDto.status = PAYMENT_CAPTURE_STATUS.CAPTURED
            paymentCaptureDto.captured = payment.captured
            paymentCaptureDto.captured_at = payment.created
            paymentCaptureDto.currency = payment.currency

            let paymentCapture = await PaymentCaptureModel.findOneAndUpdate({ payment: payment.id }, paymentCaptureDto, {
                new: true, upsert: true
            })
        }

        // handle job booking creating here ?
        const metadata = payment.metadata as { jobId: string, quotationId: string, constractorId: ObjectId, type: string, customerId: ObjectId, remark: string, extraEstimateId: ObjectId }
        if (metadata.type == 'job_payment') {
            const jobId = metadata.jobId
            if (jobId) {
                let job = await JobModel.findById(jobId)
                if (!job) return
                const quotationId = metadata.quotationId
                let quotation = await JobQoutationModel.findById(quotationId)
                if (!quotation) return

                if (metadata.remark == 'initial_job_payment') {
                    job.status = JOB_STATUS.BOOKED
                    job.quotation = quotation.id
                    job.contractor = quotation.contractor

                    quotation.isPaid = true
                    quotation.status = JOB_QUOTATION_STATUS.ACCEPTED

                    // Check if quotation.startDate is valid and not null or undefined
                    if (quotation.startDate) {
                        // Check if job.schedules does not contain a similar schedule with the same startDate and type JOB_DAY
                        if (!job.schedules.some(schedule => schedule.startDate.getTime() === quotation?.startDate.getTime() && schedule.type === JOB_SCHEDULE_TYPE.JOB_DAY)) {
                            // Push the new schedule with type JOB_DAY
                            job.schedules.push({
                                startDate: quotation.startDate,
                                endDate: quotation.endDate,
                                type: JOB_SCHEDULE_TYPE.JOB_DAY
                            });
                        }
                    } else if (quotation.siteVisit) {
                        // Check if quotation.siteVisit.date is a valid Date object
                        if (quotation.siteVisit instanceof Date) {
                            // Check if job.schedules does not contain a similar schedule with the same startDate and type SITE_VISIT
                            if (!job.schedules.some(schedule => schedule.startDate.getTime() === quotation?.siteVisit.getTime() && schedule.type === JOB_SCHEDULE_TYPE.SITE_VISIT)) {
                                // Push the new schedule with type SITE_VISIT
                                job.schedules.push({
                                    startDate: quotation.siteVisit,
                                    type: JOB_SCHEDULE_TYPE.SITE_VISIT
                                });
                            }
                        } else {
                            // Handle case where quotation.siteVisit.date is not a valid Date object
                            console.log('quotation.siteVisit.date is not a valid Date object.');
                        }
                    }

                }

                if (metadata.remark == 'extra_job_payment') {


                }

                if (!job.payments.includes(payment.id)) job.payments.push(payment.id)

                // create schedule here ?



                await quotation.save()
                await job.save()

            }

        }





    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
        console.log('Error handling chargeSucceeded stripe webhook event', error)
    }

};


