

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

        console.log(event)
        Log.info(event)
        
        switch (eventType) {
            case 'setup_intent.created':
                setupIntentCreated(eventData.object);
                break;
            case 'setup_intent.succeeded':
                setupIntentSucceeded(eventData.object);
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
         const customer = await StripeService.customer.getCustomerById(payload.customer)
         console.log('Customer from setupIntentCreated', customer)
         
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
        let user= null
        if(userType == 'contractor'){
            user  = await ContractorModel.findById(userId)
        }else{
            user  = await CustomerModel.findById(userId)
        }

        if(user){
            user.stripePaymentMethod = paymentMethod
            user.save()
        }
        
        // let data = {
        //     customer: payload.customer,
        //     payment_method: payload.payment_method,
        // }
        // eventEmitter.emit('StripePaymentMethodAttached', data )
    } catch (error: any) {
        throw new BadRequestError(error.message || "Something went wrong");
    }

};



