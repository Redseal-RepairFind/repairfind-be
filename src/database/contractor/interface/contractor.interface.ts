import { Document, Types, ObjectId } from "mongoose";
import { IStripeCustomer } from "../../common/stripe_customer.interface";
import { IStripeAccount } from "../../common/stripe_account.schema";



export interface IContractor extends Document {
  _id: ObjectId;
  profile: ObjectId;
  firstName: string;
  lastName: string;
  name: string;
  companyName: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  status: string;
  phoneNumber: {
    code: string,
    number: string
  };  
  accountType: string;
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
  acceptTerms: Boolean;
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
  stripeIdentity: object,
  stripeAccount: IStripeAccount,
  stripePaymentMethods: Array<object>,
  createdAt: Date;
  updatedAt: Date;
  quiz: any;
}
