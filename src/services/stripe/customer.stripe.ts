import Stripe from 'stripe';
const stripe = new Stripe('sk_test_...');

export const createCustomer = async (params: Stripe.CustomerCreateParams) => {
  const customer: Stripe.Customer = await stripe.customers.create(params);
  return customer
};
