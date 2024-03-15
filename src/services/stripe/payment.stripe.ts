import Stripe from 'stripe';

const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);


export const createSetupIntent = async () => {
  const setupIntent = await stripeClient.setupIntents.create({
    payment_method: 'pm_card_visa', // Use the Payment Method ID obtained during authorization
    customer: 'CUSTOMER_ID', // ID of the customer associated with the Setup Intent
  });

  // Capture the Setup Intent ID and store it in your database
  const setupIntentId = setupIntent.id;
  // Store setupIntentId in your database...
  return setupIntentId;
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


export const chargeCustomer = async (customerId: any, paymentMethodId: any) => {
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: 1000,
      currency: 'usd',
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true, // Indicates that this PaymentIntent may be used for future off-session payments
      confirm: true,
    });
    return paymentIntent;
};

export const getPaymentMethod = async (paymentMethodId: any) => {
    const paymentMethod = await stripeClient.paymentMethods.retrieve(paymentMethodId);
    return paymentMethod;
};


  
