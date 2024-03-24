import { Document, ObjectId, Schema, model } from "mongoose";
import { IJobApplication } from "./job_application.model";

export interface IJobLocation extends Document {
    address?: string;
    city?: string;
    region?: string;
    country?: string;
    latitude: string;
    longitude: string;
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
    voiceDescription: object;
    location: IJobLocation;
    date: Date;
    startDate: Date;
    endDate: Date;
    time: Date;
    expiresIn: number;
    media: object[];
    tags?: string[];
    experience?: string;
    createdAt: Date;
    updatedAt: Date;
    applications: IJobApplication[];
}

const JobLocationSchema = new Schema<IJobLocation>({
    address: { type: String },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    latitude: { type: String },
    longitude: { type: String },
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
    voiceDescription: { type: Object, default: null },
    location: { type: JobLocationSchema, required: true },
    date: { type: Date, required: true },
    time: { type: Date, required: false },
    expiresIn: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    media: { type: [Object], default: [] },
    tags: { type: [String] },
    experience: { type: String },
}, { timestamps: true });

const JobModel = model<IJob>("jobs", JobSchema);

export { JobModel };
