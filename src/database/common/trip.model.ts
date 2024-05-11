import { Document, ObjectId, Schema, model } from "mongoose";

export enum TRIP_STATUS {
    STARTED = 'STARTED',
    ARRIVED = 'ARRIVED',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
}

export enum TRIP_TYPE {
    JOB_DAY = 'JOB_DAY',
    SITE_VISIT = 'SITE_VISIT'
}

export interface ITripDay extends Document {
    _id: ObjectId;
    customer: ObjectId;
    contractor: ObjectId;
    job: ObjectId;
    status: TRIP_STATUS;
    type: TRIP_TYPE;
    verificationCode: number;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    contractorPreTripMedia: string[]; // Array of contractor's pre-job media URLs or references
    contractorPostTripMedia: string[]; // Array of contractor's post-job media URLs or references
    customerPreTripMedia: string[]; // Array of customer's pre-job media URLs or references
    customerPostTripMedia: string[]; // Array of customer's post-job media URLs or references
}

const TripSchema = new Schema(
    {
      customer: {
        type: Schema.Types.ObjectId, 
        ref: 'customers',
        required: true,
      },
      contractor: {
        type: Schema.Types.ObjectId, 
        ref: 'contractors',
        required: true,
      },
      job: {
        type: Schema.Types.ObjectId, 
        ref: 'jobs',
        required: true,
      },
      status: {
        type: String,
        enum: Object.values(TRIP_STATUS),
        default: TRIP_STATUS.STARTED,  
      }, 
      type: {
        type: String,
        enum: Object.values(TRIP_TYPE),
        default: TRIP_TYPE.JOB_DAY,  
      }, 
      verificationCode: {
        type: Number,
      }, 
      verified: {
        type: Boolean,
        default: false,  
      }, 
      contractorPreTripMedia: {
        type: [String], // Array of contractor's pre-job media URLs or references
        default: [],
      },
      contractorPostTripMedia: {
        type: [String], // Array of contractor's post-job media URLs or references
        default: [],
      },
      customerPreTripMedia: {
        type: [String], // Array of customer's pre-job media URLs or references
        default: [],
      },
      customerPostTripMedia: {
        type: [String], // Array of customer's post-job media URLs or references
        default: [],
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

const TripModel = model<ITripDay>("trips", TripSchema);

export { TripSchema, TripModel };
