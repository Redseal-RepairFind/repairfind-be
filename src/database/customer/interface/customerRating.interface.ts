import { Document, Types, ObjectId } from "mongoose";
import { ICustomerReg } from "./customer.interface";

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
  customerId: ICustomerReg['_id'];
  rate: Rate[];
  avgEnvironment: number;
  avgReceptive: number;
  avgCourteous: number;
  avgRating: number;
  createdAt: Date;
  updatedAt: Date;
}
