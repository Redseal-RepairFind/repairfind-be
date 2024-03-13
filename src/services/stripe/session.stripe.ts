

import Stripe from 'stripe';

const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);


export const createSession = async (payload: any) => {
  try {
    const session = await stripeClient.checkout.sessions.create({
        mode: payload.mode, // 'setup
        currency: payload.currency, // usd
        customer: payload.customerId,
        success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://example.com/cancel',
      });
    
      return session;
  } catch (error) {
        console.log(error)
  }
};


