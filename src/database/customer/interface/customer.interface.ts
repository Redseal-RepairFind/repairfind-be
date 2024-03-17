import { Document, Types, ObjectId } from "mongoose";
import { IStripeCustomer } from "../../common/stripe_customer.interface";

export enum CustomerAuthProviders  {
  PASSWORD = "PASSWORD",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  APPLE = "APPLE",
}

export interface ICustomer extends Document {
  _id: ObjectId;
  
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: {
    code: string,
    number: string
  };    
  location: string;
  profilePhoto: {
    type: object
    properties: {
      url: {
        type: String,
        required: true,
      },
      label?: {
        type: String,
        unique: true,
      },
      descriptions?: {
        type: Array<string>,
      },
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

  stripeCustomer: IStripeCustomer
  stripePaymentMethods: Array<object>
  stripeIdentity: object
  acceptTerms: Boolean;
  provider: CustomerAuthProviders
  createdAt: Date;
  updatedAt: Date;
}


export { IStripeCustomer };

