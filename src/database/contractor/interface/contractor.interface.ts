import { Document, Types, ObjectId } from "mongoose";

export interface IContractor extends Document {
  _id: ObjectId;
  
  email: string;
  password: string;
  firstName: string;
  dateOfBirth: string;
  lastName: string;
  documentVerification: boolean;
  location: string;
  profileImage: string;
  bio: string;
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
