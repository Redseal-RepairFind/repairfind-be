import { Document, Types, ObjectId } from "mongoose";
import { ICustomerReg } from "./customerReg.interface";

export interface ICustomerNotificationDocument extends Document {
  _id: ObjectId;
  customerId: ICustomerReg['_id']
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}