import { Schema } from "mongoose";


import { Document } from 'mongoose';

export interface IStripePaymentMethod {
    id: string;
    object?: string;
    customer: string;
    type?: string;
    card?: {
      brand: string;
      checks: {
        address_line1_check?: string;
        address_postal_code_check?: string;
        cvc_check?: string;
      };
      country: string;
      display_brand: string;
      exp_month: number;
      exp_year: number;
      fingerprint: string;
      funding: string;
      generated_from?: string | null;
      last4: string;
      networks: {
        available: string[];
        preferred?: string | null;
      };
      three_d_secure_usage: {
        supported: boolean;
      };
      wallet?: string | null;
    };
    billing_details?: {
      address: {
        city?: string | null;
        country: string;
        line1?: string | null;
        line2?: string | null;
        postal_code?: string | null;
        state?: string | null;
      };
      email: string;
      name: string;
      phone?: string | null;
    };
    livemode?: boolean;
  }
  


export const StripePaymentMethodSchema = new Schema<IStripePaymentMethod>({
    id: { type: String, required: true },
    object: { type: String,  },
    customer: { type: String, },
    type: { type: String,  },
    card: { type: Object},
    billing_details: { type: Object, },
    livemode: { type: Boolean }
  });