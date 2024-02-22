import { Document, Types, ObjectId } from "mongoose";
import { IContractor } from "./contractor.interface";

export interface IContractorDocument extends Document {
  _id: ObjectId;
  contractorId: IContractor['_id']
  phoneNumber: string;
  businessName?: string;
  //gst: string;
  tradeTicket: string;
  state: string;
  postalCode: string;
  city: string;
  skill: string;
  website?: string;
  //validId: string;
  yearExpirence: string;
  nationIdImage: string;
  verified: boolean;
  certnId: string;
  createdAt: Date;
  updatedAt: Date;
}