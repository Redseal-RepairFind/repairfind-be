import { Document, Types, ObjectId } from "mongoose";

export enum AdminStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface IAdmin extends Document {
  _id: ObjectId;
  
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  name: string;
  phoneNumber: string;
  superAdmin: boolean;
  validation: boolean;
  profilePhoto: {
    url:  String,
    label?:String
    descriptions?: Array<string>,
  };
  permissions: Array<string>;
  status: AdminStatus;
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
