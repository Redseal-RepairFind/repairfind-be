import { Document, Types, ObjectId } from "mongoose";

export interface ITransactionDocument extends Document {
  _id: ObjectId;
  type: string;
  amount: number;
  initiator: string;
  from: string;
  to: string;
  fromId: string;
  toId: string;
  description: string;
  status: string;
  form: string;
  invoiceId: string;
  jobId: string;
  createdAt: Date;
  updatedAt: Date;
}