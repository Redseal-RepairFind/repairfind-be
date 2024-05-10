import { Document, ObjectId, Schema, model } from "mongoose";

export enum JOB_DAY_STATUS {
    STARTED = 'STARTED',
    ARRIVED = 'ARRIVED',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
}

export interface IJobDay extends Document {
    _id: ObjectId;
    customer: ObjectId;
    contractor: ObjectId;
    job: ObjectId;
    status: string;
    verificationCode: number;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    contractorPreJobMedia: string[]; // Array of contractor's pre-job media URLs or references
    contractorPostJobMedia: string[]; // Array of contractor's post-job media URLs or references
    customerPreJobMedia: string[]; // Array of customer's pre-job media URLs or references
    customerPostJobMedia: string[]; // Array of customer's post-job media URLs or references
}

const JobDaySchema = new Schema(
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
      verificationCode: {
        type: Number,
      }, 
      verified: {
        type: Boolean,
        default: false,  
      }, 
      contractorPreJobMedia: {
        type: [String], // Array of contractor's pre-job media URLs or references
        default: [],
      },
      contractorPostJobMedia: {
        type: [String], // Array of contractor's post-job media URLs or references
        default: [],
      },
      customerPreJobMedia: {
        type: [String], // Array of customer's pre-job media URLs or references
        default: [],
      },
      customerPostJobMedia: {
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

const JobDayModel = model<IJobDay>("job_day", JobDaySchema);

export { JobDaySchema, JobDayModel };
