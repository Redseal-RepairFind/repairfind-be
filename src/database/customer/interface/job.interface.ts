import { Document, Types, ObjectId } from "mongoose";
import { ICustomer } from "./customer.interface";
import { IContractor } from "../../contractor/interface/contractor.interface";

export interface IJobDocument extends Document {
  _id: ObjectId;
  customerId: ICustomer['_id']
  contractorId: IContractor['_id']
  jobDescription: string;
  voiceDescription: string;
  jobLocation: string;
  date: Date;
  jobImg: string[];
  createdAt: Date;
  updatedAt: Date;
}