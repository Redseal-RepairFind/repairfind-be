import { Document, Types, ObjectId } from "mongoose";
import { ICustomer } from "./customer.interface";

export interface ICustomerNotificationDocument extends Document {
  _id: ObjectId;
  customerId: ICustomer['_id']
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}