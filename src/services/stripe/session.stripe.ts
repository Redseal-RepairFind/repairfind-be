

import Stripe from 'stripe';
import { BadRequestError } from '../../utils/custom.errors';

const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);


export const createSession = async (payload: any) => {
  try {
    console.log(payload)
    const session = await stripeClient.checkout.sessions.create({
        mode: payload.mode, // 'setup
        currency: payload.currency, // cad
        customer: payload.customer,
        metadata: payload.metadata,
        setup_intent_data: payload.setup_intent_data,
        success_url: 'https://repairfind.ca/payment-successful',
        cancel_url: 'https://repairfind.ca/payment-cancelled/',
      });
    
      
      return session;
  } catch (error:any) {
      console.log(error)
        // throw new BadRequestError(error.message || "Something went wrong");
  }
};

export const createEphemeralKey = async (payload: any) => {
  try {
    const ephemeralKey = await stripeClient.ephemeralKeys.create({
        customer: payload.customer,
      }, {apiVersion: '2023-10-16'}); //
    
      return ephemeralKey;
  } catch (error:any) {
      console.log(error)
      // throw new BadRequestError(error.message || "Something went wrong");
  }
};


