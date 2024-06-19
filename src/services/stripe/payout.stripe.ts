import Stripe from 'stripe';
const stripe = new Stripe('sk_test_...');

// The following example sends 10 USD from a connected account’s Stripe balance to their external account:
export const createPayout = async (connectedAccountId: string, amount: number) => {
  try {
    const payout = await stripe.payouts.create({
      amount,
      currency: 'cad',
    }, {
      stripeAccount: connectedAccountId,
    });
    console.log(`Payout created with ID ${payout.id}`);
  } catch (error) {
    console.error('Error creating payout:', error);
  }
};
