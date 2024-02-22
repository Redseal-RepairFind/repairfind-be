import { Document, Types, ObjectId } from "mongoose";

export interface IContractor extends Document {
  _id: ObjectId;
  
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  status: string;
  phoneNumber: string;
  accountType: string;
  acceptTerms: string;

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

  createdAt: Date;
  updatedAt: Date;
}
