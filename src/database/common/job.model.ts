import { Document, ObjectId, Schema, model } from "mongoose";
import { IJobApplication, JobApplicationModel } from "./job_application.model";

export interface IJobLocation extends Document {
    address?: string;
    city?: string;
    region?: string;
    country?: string;
    latitude: string;
    longitude: string;
}


export interface IJobHistory {
    eventType: string; // Custom event type identifier
    timestamp: Date;
    details?: any; // Additional details specific to each event
}

export enum JobStatus {
    PENDING = 'PENDING',
    DECLINED = 'DECLINED',
    ACCEPTED = 'ACCEPTED',
    EXPIRED = 'EXPIRED',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    DISPUTED = 'DISPUTED',
}

export enum JobType {
    LISTING = 'LISTING',
    REQUEST = 'REQUEST',
}

export interface IJob extends Document {
    _id: ObjectId;
    customer: ObjectId;
    contractor: ObjectId;
    contractorType: String;
    status: JobStatus;
    type: JobType;
    category: string;
    description: string;
    title: string;
    voiceDescription: string;
    location: IJobLocation;
    date: Date;
    startDate: Date;
    endDate: Date;
    time: Date;
    expiresIn: number;
    media: string[];
    tags?: string[];
    experience?: string;
    createdAt: Date;
    updatedAt: Date;
    applications: string[];
    jobHistory: IJobHistory[];
    emergency: boolean;
}

const JobLocationSchema = new Schema<IJobLocation>({
    address: { type: String },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    latitude: { type: String },
    longitude: { type: String },
});



const JobHistorySchema = new Schema<IJobHistory>({
    eventType: { type: String, required: false }, // Identify the type of event - JOB_REJECTED, JOB_ACCEPTED, JOB_CLOSED, JOB_EXPIRED
    timestamp: { type: Date, default: Date.now }, // Timestamp of the event
    details: { type: Schema.Types.Mixed }, // Additional details specific to the event
});

const JobSchema = new Schema<IJob>({
    customer: { type: Schema.Types.ObjectId, ref: 'customers', required: true },
    contractor: { type: Schema.Types.ObjectId, ref: 'contractors' },
    contractorType: { type: String },
    status: { type: String, enum: Object.values(JobStatus), default: JobStatus.PENDING },
    type: { type: String, enum: Object.values(JobType), default: JobType.LISTING },
    category: { type: String, required: false },
    description: { type: String, required: true },
    title: { type: String },
    voiceDescription: { type: String, default: null },
    location: { type: JobLocationSchema, required: true },
    date: { type: Date, required: true },
    time: { type: Date, required: false },
    expiresIn: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    media: { type: [String], default: [] },
    tags: { type: [String] },
    experience: { type: String },
    jobHistory: [JobHistorySchema], // Array of job history entries
    applications: {
        type: [String],
        ref: 'job_applications'
    },
    emergency: {type: Boolean, default:false}
}, { timestamps: true });




JobSchema.virtual('totalApplications').get(function () {
    return this.applications.length
});


JobSchema.set('toJSON', {
    virtuals: true
});


const JobModel = model<IJob>("jobs", JobSchema);

export { JobModel };
