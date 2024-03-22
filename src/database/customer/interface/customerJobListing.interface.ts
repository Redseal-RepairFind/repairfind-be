import { Document, Types, ObjectId } from "mongoose";
import { ICustomer } from "./customer.interface";

export interface ICustomerJobListingDocument extends Document {
  _id: ObjectId;
  customerId: ICustomer['_id']
  jobCategory: string;
  jobDescription: string;
  voiceDescription: string;
  jobLocation: string;
  date: string;
  jobExpiry: string;
  contractorType: string;
  emergency: string;
  jobImg: string;
  createdAt: Date;
  updatedAt: Date;
}