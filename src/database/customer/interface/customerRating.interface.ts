import { Document, Types, ObjectId } from "mongoose";
import { ICustomer } from "./customer.interface";

interface Rate {
  contractorId: string;
  jobId: string;
  environment: number;
  receptive: number;
  courteous: number;
  environmentText: string;
  receptiveText: string;
  courteousText: string;
}

export interface ICustomerRating extends Document {
  _id: ObjectId;
  customerId: ICustomer['_id'];
  rate: Rate[];
  avgEnvironment: number;
  avgReceptive: number;
  avgCourteous: number;
  avgRating: number;
  createdAt: Date;
  updatedAt: Date;
}
