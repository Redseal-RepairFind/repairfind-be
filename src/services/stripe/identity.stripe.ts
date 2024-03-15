

import Stripe from 'stripe';
import { BadRequestError } from '../../utils/custom.errors';

const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);



export const createVerificationSession = async (payload: any) => {
  try {
    // https://docs.stripe.com/identity/verification-checks

    //https://docs.stripe.com/identity/verify-identity-documents

    // To access the captured selfie and document images, you’ll need to retrieve the associated VerificationReport, 
    //you can do this by expanding the last_verification_report field in the session:

      const verificationSession = await stripeClient.identity.verificationSessions.create({
        type: 'document',
        options: {
            document: {
                require_matching_selfie: true,
            },
        },
        metadata: payload.metadata,
      });
    
      return verificationSession;
  } catch (error:any) {
        // console.log(error)
        throw new BadRequestError(error.message || "Something went wrong");
  }
};

export const retrieveVerificationSession = async (payload: any) => {
  try {
    // To access the captured selfie and document images, you’ll need to retrieve the associated VerificationReport, 
    //you can do this by expanding the last_verification_report field in the session:
    const verificationSession = await stripeClient.identity.verificationSessions.retrieve(
        '{{SESSION_ID}}',
        {
          expand: ['last_verification_report'],
        }
      );
    
      return verificationSession;
  } catch (error:any) {
        // console.log(error)
        throw new BadRequestError(error.message || "Something went wrong");
  }
};


