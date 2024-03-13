
import Stripe from 'stripe';
import { BadRequestError } from '../../utils/custom.errors';

const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(STRIPE_SECRET_KEY);


export const createCustomer = async (params: Stripe.CustomerCreateParams) => {
  const customer: Stripe.Customer = await stripe.customers.create(params);
  return customer
};

export const getCustomer = async (query: any) => {
  try {
    const customer = await stripe.customers.list(query);
   if(customer.data.length !== 0){
    return customer.data[0];
   }
  } catch (error: any) {
   throw new BadRequestError(error.message || "Something went wrong");
 }


};



// Step 1: Create PaymentMethod
export const createPaymentMethod = async () => {
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2022,
      cvc: '123',
    },
  });
  return paymentMethod;
};

// Step 2: Create Customer and Attach PaymentMethod
export const createCustomerAndAttachPaymentMethod = async (paymentMethodId: any) => {
  const customer = await stripe.customers.create({
    payment_method: paymentMethodId,
  });
  return customer;
};

