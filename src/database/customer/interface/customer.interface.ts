import { Document, Types, ObjectId } from "mongoose";

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
  phoneNumber: string;
  location: string;
  profileImg: string;
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
  acceptTerms: Boolean;
  provider: CustomerAuthProviders
  createdAt: Date;
  updatedAt: Date;
}
