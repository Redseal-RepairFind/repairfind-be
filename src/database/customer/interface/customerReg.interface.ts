import { Document, Types, ObjectId } from "mongoose";

export interface ICustomerReg extends Document {
  _id: ObjectId;
  
  email: string;
  password: string;
  fullName: string;
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

  createdAt: Date;
  updatedAt: Date;
}
