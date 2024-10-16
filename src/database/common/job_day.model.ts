import { Document, ObjectId, Schema, model } from "mongoose";

export enum JOB_DAY_STATUS {
  PENDING = 'PENDING',
  STARTED = 'STARTED',
  ARRIVED = 'ARRIVED',
  CANCELED = 'CANCELED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
}

export enum JOB_DAY_TYPE {
  JOB_DAY = 'JOB_DAY',
  SITE_VISIT = 'SITE_VISIT'
}



export interface ILocation extends Document {
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  latitude: string;
  longitude: string;
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
  contractorPreJobMedia: string[]; // Array of contractor's pre-job media URLs or references
  contractorPostJobMedia: string[]; // Array of contractor's post-job media URLs or references
  customerPreJobMedia: string[]; // Array of customer's pre-job media URLs or references
  customerPostJobMedia: string[]; // Array of customer's post-job media URLs or references
  jobLocation: ILocation,
  contractorLocation: ILocation,
  isRevisit: boolean;
}


const LocationSchema = new Schema<ILocation>({
  address: { type: String },
  city: { type: String },
  region: { type: String },
  country: { type: String },
  latitude: { type: String },
  longitude: { type: String },
});


const JobDayShema = new Schema <IJobDay>(
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
    jobLocation: LocationSchema,
    contractorLocation: LocationSchema,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isRevisit: { type: Schema.Types.Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const JobDayModel = model<IJobDay>("job_days", JobDayShema);

export { JobDayShema, JobDayModel };
