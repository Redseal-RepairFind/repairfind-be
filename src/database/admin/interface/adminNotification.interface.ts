import { Document, Types, ObjectId } from "mongoose";

export interface IAdminNotificationDocument extends Document {
  _id: ObjectId;
  title: string;
  message: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}