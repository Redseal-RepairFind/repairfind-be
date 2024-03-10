import { Document, Types, ObjectId } from "mongoose";

export interface IAdmin extends Document {
  _id: ObjectId;
  
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  superAdmin: boolean;
  validation: boolean;
  image: string;
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

  createdAt: Date;
  updatedAt: Date;
}
