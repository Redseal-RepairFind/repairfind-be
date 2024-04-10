import Stripe from 'stripe';

const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);

 
export const createSetupIntent = async (payload: any) => {
  const setupIntent = await stripeClient.setupIntents.create({
    ...payload,
  });

  return setupIntent;
};


export const chargeUserOnDemand = async (setupIntentId: any) => {
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: 1000, // Amount in cents
    currency: 'usd',
    payment_method: 'pm_card_visa', // Use the Payment Method ID obtained during authorization
    confirmation_method: 'manual',
    confirm: true,
    setup_future_usage: 'off_session', // Indicates that this PaymentIntent may be used for future off-session payments
    customer: 'CUSTOMER_ID', // ID of the customer associated with the Payment Intent
    // setup_intent: setupIntentId, // Pass the Setup Intent ID
  });

  // Step 4: Confirm the Payment Intent
  const confirmedPaymentIntent = await stripeClient.paymentIntents.confirm(paymentIntent.id);
  // Handle the confirmedPaymentIntent result...
  return confirmedPaymentIntent;
};



export const chargeCustomer = async (customerId: any, paymentMethodId: any, payload: any) => {
    const paymentIntent = await stripeClient.paymentIntents.create({
      ...payload
    },
    // header
    // {stripeAccount: payload.on_behalf_of}
    );
    return paymentIntent;
};


export const capturePayment = async (paymentIntent: any) => {
  return await stripeClient.paymentIntents.capture(paymentIntent)
};

export const createPaymentIntent = async (customerId: any, paymentMethodId: any, payload: any) => {
   
  const paymentIntent = await stripeClient.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: payload.line_items,
    metadata: payload.metadata,
    success_url: "https://repairfind.ca/payment-success/",
    cancel_url: "https://cancel.com",
    customer_email: payload.email
  })

};

export const getPaymentMethod = async (paymentMethodId: any) => {
    const paymentMethod = await stripeClient.paymentMethods.retrieve(paymentMethodId);
    return paymentMethod;
};
export const detachPaymentMethod = async (paymentMethodId: any) => {
    return await stripeClient.paymentMethods.detach(paymentMethodId);
};
export const attachPaymentMethod = async (paymentMethodId: any, payload: any) => {
    return await stripeClient.paymentMethods.attach(paymentMethodId, payload);
};


  
