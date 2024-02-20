import { Document, Types, ObjectId } from "mongoose";
import { IContractorReg } from "./contractor.interface";

export interface IContractorNotificationDocument extends Document {
  _id: ObjectId;
  contractorId: IContractorReg['_id']
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}