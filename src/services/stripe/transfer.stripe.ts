import Stripe from 'stripe';

const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);


export const createTransfer = async (connectedAccountId: string, amount: number, charge: any) => {
  try {
    const payout = await stripeClient.transfers.create({
      amount,
      currency: 'usd',
      destination: connectedAccountId,
      description: '',
      metadata: charge
      });
    console.log(`Transfer created with ID ${payout.id}`);
  } catch (error) {
    console.error('Error creating transfer:', error);
  }
};
