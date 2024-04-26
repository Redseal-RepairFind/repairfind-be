

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
  } catch (error:any) {
        throw new BadRequestError(error.message || "Something went wrong");
  }
};


export const createAccountLink = async (accountId: any) => {
  try {
    
    const accountLink = await stripeClient.accountLinks.create({
        account: accountId,
        refresh_url: 'https://example.com/reauth',
        return_url: 'https://example.com/return',
        type: 'account_onboarding',
    });
    
    return accountLink;

  } catch (error:any) {
        throw new BadRequestError(error.message || "Something went wrong");
  }
};

export const createLoginLink = async (accountId: any) => {
  try {
    
    const loginLink = await stripeClient.accounts.createLoginLink(accountId);
    return loginLink;

  } catch (error:any) {
        throw new BadRequestError(error.message || "Something went wrong");
  }
};

export const getAccount = async (accountId: any) => {
  try {
    
    return  await stripeClient.accounts.retrieve(accountId);

  } catch (error:any) {
    console.log(error)
    // throw new BadRequestError(error.message || "Something went wrong");
  }
};



