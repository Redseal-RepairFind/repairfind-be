import Stripe from 'stripe';
import { Logger } from '../logger';

const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);


export const createTransfer = async (connectedAccountId: string, amount: number, metadata: any) => {
  try {
    Logger.info('stripe createTransfer', amount)
    const payout = await stripeClient.transfers.create({
      amount,
      currency: 'cad',
      destination: connectedAccountId,
      description: '',
      metadata: metadata
      });
    Logger.info(`Transfer created with ID ${payout.id}`);

  } catch (error: any) {
    Logger.error('Error creating stripe transer', error)
    throw error
  }
};
