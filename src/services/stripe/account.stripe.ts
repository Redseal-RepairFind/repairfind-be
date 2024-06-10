

import Stripe from 'stripe';
import { BadRequestError } from '../../utils/custom.errors';

const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);



export const createAccount = async (payload: any) => {
  try {
    const account = await stripeClient.accounts.create({
      type: 'express',
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
      // business_type: 'company',
      metadata: payload,
    });
    console.log(account)
    return account;
  } catch (error: any) {
    throw new BadRequestError(error.message || "Something went wrong");
  }
};



// https://docs.stripe.com/connect/custom-accounts
// https://docs.stripe.com/connect/custom/hosted-onboarding

// Paypal business account
// https://www.paypal.com/c2/webapps/mpp/how-to-guides/sign-up-business-account?locale.x=en_C2
export const createCustomAccount = async (payload: any) => {
  try {
    const account = await stripeClient.accounts.create({
      type: 'custom',
      country: 'US',
      business_type: 'individual',
      individual: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        dob: {
          day: 10,
          month: 6,
          year: 1985,
        },
        address: {
          line1: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          postal_code: '12345',
        },
      },
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },

    })

    console.log(account)
    return account;
  } catch (error: any) {
    throw new BadRequestError(error.message || "Something went wrong");
  }
};


export const createAccountLink = async (accountId: any) => {
  try {

    const accountLink = await stripeClient.accountLinks.create({
      account: accountId,
      refresh_url: 'https://repairfind.ca',
      return_url: 'https://repairfind.ca',
      type: 'account_onboarding',
    });

    return accountLink;

  } catch (error: any) {
    throw new BadRequestError(error.message || "Something went wrong");
  }
};

export const createLoginLink = async (accountId: any) => {
  try {

    const loginLink = await stripeClient.accounts.createLoginLink(accountId);
    return loginLink;

  } catch (error: any) {
    throw new BadRequestError(error.message || "Something went wrong");
  }
};

export const getAccount = async (accountId: any) => {
  try {

    return await stripeClient.accounts.retrieve(accountId);

  } catch (error: any) {
    console.log(error)
    // throw new BadRequestError(error.message || "Something went wrong");
  }
};



