import { Document, ObjectId, Schema, model } from "mongoose";

export enum JobApplicationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
}

export interface IJobApplication extends Document {
    contractorId: ObjectId;
    status: JobApplicationStatus;
    estimate: IJobApplicationEstimate[];
    startDate: Date;
    endDate: Date;
    siteVerification: boolean;
    processingFee: number;
}

export interface IJobApplicationEstimate {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

const JobApplicationSchema = new Schema<IJobApplication>({
    contractorId: { type: Schema.Types.ObjectId, ref: 'contractors', required: true },
    status: { type: String, enum: Object.values(JobApplicationStatus), required: true },
    estimate: { type: [Object], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    siteVerification: { type: Boolean },
    processingFee: { type: Number },
}, { timestamps: true });

const JobApplicationModel = model<IJobApplication>('job_applications', JobApplicationSchema);

export { JobApplicationModel };
