import { Document, Types, ObjectId } from "mongoose";
import { IContractor } from "./contractor.interface";

export interface IContractorNotificationDocument extends Document {
  _id: ObjectId;
  contractorId: IContractor['_id']
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}