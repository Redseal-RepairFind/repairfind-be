

import Stripe from 'stripe';
import { BadRequestError } from '../../utils/custom.errors';

const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);


export const createSession = async (payload: any) => {
  try {
    const session = await stripeClient.checkout.sessions.create({
        mode: payload.mode, // 'setup
        currency: payload.currency, // usd
        customer: payload.customer,
        success_url: 'https://repairfind.ca/payment-successful',
        cancel_url: 'https://repairfind.ca/payment-cancelled/',
      });
    
      return session;
  } catch (error:any) {
        // console.log(error)
        throw new BadRequestError(error.message || "Something went wrong");
  }
};

