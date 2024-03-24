import { Document, ObjectId, Schema, model } from "mongoose";
import { contractorAccountTypes } from "../../../constants";
import { ICustomer } from "../interface/customer.interface";

export interface IJobLocation extends Document  {
  address?: string,
  city?: string,
  region?: string,
  country?: string,
  latitude: string
  longitude: string,
}

export enum  JobRequestStatus {
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
}

export interface ICustomerJobRequestModel extends Document {
  _id: ObjectId;
  customer: ObjectId
  contractor: ObjectId
  category: string;

  location: IJobLocation;
  date: Date;
  time: string;
  expiry: string;
  emergency: boolean;
  status: JobRequestStatus;

  description: string;
  voiceDescription: object;
  media: object[];

  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<ICustomerJobRequestModel>(
    {
      customer: {
        type: Schema.Types.ObjectId, ref: 'customers',
        required: true,
      },
      contractor: {
        type: Schema.Types.ObjectId, ref: 'contractors',
        required: true,
      },
      category: {
        type: String,
        required: false,
      }, 
      status: {
        type: String,
        enum: Object.values(JobRequestStatus),
        default: JobRequestStatus.PENDING,
      }, 
      description: {
        type: String,
        required: true,
      }, 
      voiceDescription: {
        type: Object,
        default: null
      }, 
      location: {
        type: Object,
        required: true,
      }, 
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: String,
        required: false,
      },
      expiry: {
        type: String,
        required: false,
      },
     
      emergency: {
        type: Boolean,
        default: false
      },
      media: {
        type: [Object],
        default: null
      }, 
      
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    
    },
    {
      timestamps: true,
    }
  );
  
  const CustomerJobRequestModel = model<ICustomerJobRequestModel>("customer_jobrequests", JobSchema);
  
  export default CustomerJobRequestModel;


  