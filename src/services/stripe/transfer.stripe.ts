import Stripe from 'stripe';

const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);


export const createTransfer = async (connectedAccountId: string, amount: number, metadata: any) => {
  try {
    console.log(amount)
    const payout = await stripeClient.transfers.create({
      amount,
      currency: 'cad',
      destination: connectedAccountId,
      description: '',
      metadata: metadata
      });
    console.log(`Transfer created with ID ${payout.id}`);

  } catch (error: any) {
    throw error.message
  }
};
