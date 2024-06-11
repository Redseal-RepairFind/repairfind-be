import { Document, Schema, model, Types } from "mongoose";

export enum JOB_DISPUTE_STATUS {
    OPEN = "OPEN",
    PENDING_MEDIATION = "PENDING_MEDIATION",
    MEDIATION_COMPLETE = "MEDIATION_COMPLETE",
    CLOSED = "CLOSED",
}

interface Evidence {
    url: string; // URL or reference of the evidence
    addedBy: string; // Who added the evidence (e.g., customer ID, contractor ID)
    addedAt: Date; // Date and time the evidence was added
}

export interface IJobDispute extends Document {
    description: string;
    job: Types.ObjectId;
    conversation: Types.ObjectId;
    customer: Types.ObjectId;
    contractor: Types.ObjectId;
    filedBy: string; // Who filed the dispute (customer or contractor)
    evidence: Evidence[]; // Array of evidence URLs or references
    status: JOB_DISPUTE_STATUS;
    acceptedBy: Types.ObjectId, 
    resolvedWay: string;
    createdAt: Date;
    updatedAt: Date;
}

const JobDisputeSchema = new Schema<IJobDispute>(
    {
        description: {
            type: String,
            required: true,
        },
        job: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        customer: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        contractor: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        filedBy: {
            type: String,
            required: true,
        },
        evidence: {
            type: [
                {
                    url: { type: String, required: true },
                    addedBy: { type: String, required: true },
                    addedAt: { type: Date, required: true },
                },
            ],
            default: [],
        },
        status: {
            type: String,
            enum: Object.values(JOB_DISPUTE_STATUS),
            required: true,
            default: JOB_DISPUTE_STATUS.OPEN,
        },
        acceptedBy: {
            type: Schema.Types.ObjectId
        },
        resolvedWay: {
            type: String,
        },
        conversation: {
            type: Schema.Types.ObjectId
        }
    },
    {
        timestamps: true,
    }
);

const JobDisputeModel = model<IJobDispute>("job_disputes", JobDisputeSchema);

export { JobDisputeSchema, JobDisputeModel };
