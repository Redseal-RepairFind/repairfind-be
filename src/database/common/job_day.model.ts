import { Document, ObjectId, Schema, model } from "mongoose";

export enum JOB_DAY_STATUS {
    STARTED = 'STARTED',
    ARRIVED = 'ARRIVED',
    CANCELED = 'CANCELED',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
}

export enum JOB_DAY_TYPE {
    JOB_DAY = 'JOB_DAY',
    SITE_VISIT = 'SITE_VISIT'
}






export interface IJobDay extends Document {
    _id: ObjectId;
    customer: ObjectId;
    contractor: ObjectId;
    job: ObjectId;
    status: string;
    type: JOB_DAY_TYPE;
    verificationCode: number;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    contractorPreTripMedia: string[]; // Array of contractor's pre-job media URLs or references
    contractorPostTripMedia: string[]; // Array of contractor's post-job media URLs or references
    customerPreTripMedia: string[]; // Array of customer's pre-job media URLs or references
    customerPostTripMedia: string[]; // Array of customer's post-job media URLs or references
}

const JobDayShema = new Schema(
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
        enum: Object.values(JOB_DAY_STATUS),
        default: JOB_DAY_STATUS.STARTED,  
      }, 
      type: {
        type: String,
        enum: Object.values(JOB_DAY_TYPE),
        default: JOB_DAY_TYPE.JOB_DAY,  
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

const JobDayModel = model<IJobDay>("job_days", JobDayShema);

export { JobDayShema, JobDayModel };
