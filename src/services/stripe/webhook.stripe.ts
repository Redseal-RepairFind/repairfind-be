

import Stripe from 'stripe';
import { BadRequestError } from '../../utils/custom.errors';
import { Request, Response } from "express";
import { Log } from '../../utils/logger';
import {EventEmitter} from 'events';
import { eventEmitter } from '../../events';
import { StripeService } from '.';
import { ContractorModel } from '../../database/contractor/models/contractor.model';
import CustomerModel from '../../database/customer/models/customer.model';


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
            
            case 'payment_method.attached':
                paymentMethodAttached(eventData.object);
                break;
            case 'payment_method.detached':
                paymentMethodDetached(eventData.object);
                break;
            default:
                console.log(`Unhandled event type: ${eventType}`);
                break;
        }
    } catch (error: any) {
        throw new BadRequestError(error.message || "Something went wrong");
    }
};


export const setupIntentCreated = async (payload: any) => {
    try {
        //  const customer = await StripeService.customer.getCustomerById(payload.customer)
        //  console.log('Customer from setupIntentCreated', customer)
         
    } catch (error: any) {
        throw new BadRequestError(error.message || "Something went wrong");
    }
};

export const identityVerificationCreated = async (payload: any) => {
    try {
        
        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId
        
        let user= null
        if(userType == 'contractor'){
            user  = await ContractorModel.findById(userId)
        }else{
            user  = await CustomerModel.findById(userId)
        }

        if(user){
            user.stripeIdentity = payload
            user.save()
        }
         
    } catch (error: any) {
        throw new BadRequestError(error.message || "Something went wrong");
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
        throw new BadRequestError(error.message || "Something went wrong");
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
        throw new BadRequestError(error.message || "Something went wrong");
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
        throw new BadRequestError(error.message || "Something went wrong");
    }
};



