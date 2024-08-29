import { Document, Types, ObjectId } from "mongoose";
import { IStripeCustomer } from "../../common/stripe_customer.interface";
import { IStripePaymentMethod } from "../../common/stripe_paymentmethod.schema";

export enum CustomerAuthProviders  {
  PASSWORD = "PASSWORD",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  APPLE = "APPLE",
}


export interface ICustomerLocation extends Document  {
  address: string,
  city: string,
  region: string,
  country: string,
  latitude: string
  longitude: string,
}

export interface ICustomer extends Document {
  _id: ObjectId;
  
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  name: string;
  phoneNumber?: {
    code: string,
    number: string,
    verifiedAt: {type: Date, default: null },
  };    
  location: ICustomerLocation
  profilePhoto: {
    url: {
      type: String,
    },
    label?: {
      type: String,
    },
    descriptions?: {
      type: Array<string>,
    }
  };
  passwordOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  emailOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  phoneNumberOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  status: string;

  stripeCustomer: IStripeCustomer
  stripePaymentMethods: Array<IStripePaymentMethod>
  stripeAccount: object,
  stripeIdentity: object
  acceptTerms: Boolean;
  provider: CustomerAuthProviders
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  
}


export { IStripeCustomer };

