import { Document, Types, ObjectId } from "mongoose";

export interface IPayout extends Document {
  _id: ObjectId;
  amount: number;
  accountNumber: string;
  accountName: string;
  bankName: string;
  recieverId: string;
  jobId: string;
  status: string;

  createdAt: Date;
  updatedAt: Date;
}