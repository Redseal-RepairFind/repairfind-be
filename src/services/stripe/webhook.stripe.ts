

import Stripe from 'stripe';
import { BadRequestError } from '../../utils/custom.errors';
import { Request, Response } from "express";
import { Log } from '../../utils/logger';
import {EventEmitter} from 'events';
import { eventEmitter } from '../../events';
import { StripeService } from '.';
import { ContractorModel } from '../../database/contractor/models/contractor.model';
import CustomerModel from '../../database/customer/models/customer.model';
import { sendPushNotifications } from '../expo';
import ContractorDeviceModel from '../../database/contractor/models/contractor_devices.model';


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
            case 'setup_intent.created':
                setupIntentCreated(eventData.object);
                break;
            case 'setup_intent.succeeded':
                setupIntentSucceeded(eventData.object);
                break;
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
            case 'payment_method.attached':
                paymentMethodAttached(eventData.object);
                break;
            case 'payment_method.detached':
                paymentMethodDetached(eventData.object);
                break;
            default:
                console.log(`Unhandled event type: ${eventType}`, event.object);
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
    try {
        const customer: any = await StripeService.customer.getCustomerById(payload.customer)
        const paymentMethod: any = await StripeService.payment.getPaymentMethod(payload.payment_method)
        const userType = customer?.metadata?.userType
        const userId = customer?.metadata?.userId

        if (!userType || !userId) return // Ensure userType and userId are valid

        const user = userType === 'contractor' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
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
    try {

        if(payload.object != 'payment_method') return

        const customer: any = await StripeService.customer.getCustomerById(payload.customer)
        const paymentMethod: any = await StripeService.payment.getPaymentMethod(payload.id)
        const userType = customer?.metadata?.userType
        const userId = customer?.metadata?.userId

        if (!userType || !userId) return // Ensure userType and userId are valid

        const user = userType === 'contractor' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
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


export const paymentMethodDetached = async (payload: any) => {
    try {

        if(payload.object != 'payment_method') return
        const paymentMethodId = payload.id;
        const user = await ContractorModel.findOne({ "stripePaymentMethods.id": paymentMethodId });

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
        
        let user= null
        let deviceTokens :string[] = []
        let devices  = []

        if(userType == 'contractor'){
            user  = await ContractorModel.findById(userId)
            devices = await ContractorDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
            // console.log('deviceTokens', deviceTokens)
        }else{
            user  = await CustomerModel.findById(userId)
        }

        if(user){
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
        
        let user= null
        let deviceTokens :string[] = []
        let devices  = []

        if(userType == 'contractor'){
            user  = await ContractorModel.findById(userId)
            devices = await ContractorDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }else{
            user  = await CustomerModel.findById(userId)
            devices = await ContractorDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }

        if(!user) return

        let message =  'Verification check failed: ' + payload.last_error.reason

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


        if(!user) return

         //fetch and expand
         let verification  = await StripeService.identity.retrieveVerificationSession(payload.id)
         console.log(verification)
        
 
         // update user profile picture here
         //@ts-ignore
         const {fileLink, s3fileUrl} = await StripeService.file.createFileLink({
              //@ts-ignore
             file: verification?.last_verification_report?.selfie?.selfie,
             expires_at: Math.floor(Date.now() / 1000) + 30,  // link expires in 30 seconds
         }, true)
         console.log('fileLink from stripe', fileLink)
         console.log('s3fileUrl of file uploaded to s3', s3fileUrl)
 
          
         user.stripeIdentity = verification
          //@ts-ignore
         user.profilePhoto = {url: s3fileUrl}
         user.save()

        
        
        sendPushNotifications( deviceTokens , {
            title: 'Identity Verification',
            icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
            body: message,
            data: { 
                event: 'identity.verification_session.requires_input',
                user:{
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
        if(payload.object != 'identity.verification_session')return

        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId
        
        let user= null
        let deviceTokens :string[] = []
        let devices  = []

        if(userType == 'contractor'){
            user  = await ContractorModel.findById(userId)
            devices = await ContractorDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }else{
            user  = await CustomerModel.findById(userId)
            devices = await ContractorDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }

        if(!user) return

       
        //fetch and expand
        let verification  = await StripeService.identity.retrieveVerificationSession(payload.id)
        console.log(verification)
       

        // update user profile picture here
        //@ts-ignore
        const {fileLink, s3fileUrl} = await StripeService.file.createFileLink({
             //@ts-ignore
            file: verification?.last_verification_report?.selfie?.document,
            expires_at: Math.floor(Date.now() / 1000) + 30,  // link expires in 30 seconds
        }, true)
        console.log('fileLink from stripe', fileLink)
        console.log('s3fileUrl of file uploaded to s3', s3fileUrl)

        
        user.stripeIdentity = verification
         //@ts-ignore
        user.profilePhoto = {url: s3fileUrl}
        user.save()
        
        sendPushNotifications( deviceTokens , {
            title: 'Identity Verification',
            icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
            body: 'Identity verification session verified',
            data: { 
                event: 'identity.verification_session.verified',
                user:{
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



