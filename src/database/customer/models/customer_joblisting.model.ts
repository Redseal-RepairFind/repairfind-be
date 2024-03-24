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

export interface ICustomerJobListing extends Document {
  _id: ObjectId;
  customer: ObjectId
  contractor: ObjectId
  contractorType: string
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

const CustomerJobListingSchema = new Schema<ICustomerJobListing>(
    {
      customer: {
        type: Schema.Types.ObjectId, ref: 'customers',
        required: true,
      },
      contractor: {
        type: Schema.Types.ObjectId, ref: 'contractors',
        required: false,
      },
      contractorType: {
        type: String,
        enum: [contractorAccountTypes.Company, contractorAccountTypes.Employee, contractorAccountTypes.Individual],
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
  
  const CustomerJobListingModel = model<ICustomerJobListing>("customer_joblistings", CustomerJobListingSchema);
  
  export default CustomerJobListingModel;


  