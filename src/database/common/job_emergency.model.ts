import { Document, Schema, model, Types } from "mongoose";

export enum EmergencyPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export enum EMERGENCY_STATUS {
    PENDING = 'PENDING',
    RESOLVED = 'RESOLVED',
    IN_PROGRESS = 'IN_PROGRESS',
}

export interface IJobEmergency extends Document {
    description: string;
    jobDay: Types.ObjectId, 
    job: Types.ObjectId, 
    customer: Types.ObjectId, 
    contractor: Types.ObjectId, 
    triggeredBy: string; 
    acceptedBy: Types.ObjectId, 
    resolvedWay: string;
    priority: EmergencyPriority;
    date: Date;
    status: EMERGENCY_STATUS;
    media: string[]; // Array of media URLs or references
    createdAt: Date;
    updatedAt: Date;
}

const JobEmergencySchema = new Schema<IJobEmergency>(
    {
        description: {
            type: String,
            required: true,
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'customers'
        },
        contractor: {
            type: Schema.Types.ObjectId,
             ref: 'contractors'
        },
        job: {
            type: Schema.Types.ObjectId,
             ref: 'jobs'
        },
        triggeredBy: {
            type: String,
        },
        acceptedBy: {
            type: Schema.Types.ObjectId,
        },
        resolvedWay: {
            type: String,
        },
        priority: {
            type: String,
            enum: Object.values(EmergencyPriority),
            required: true,
            default: EmergencyPriority.LOW,
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(EMERGENCY_STATUS),
            required: true,
            default: EMERGENCY_STATUS.PENDING,
        },
        media: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const JobEmergencyModel = model<IJobEmergency>("job_emergencies", JobEmergencySchema);

export { JobEmergencySchema, JobEmergencyModel };
