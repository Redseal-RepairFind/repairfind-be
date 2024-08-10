import { Document, Schema, model, Types, ObjectId } from "mongoose";
import { IConversation } from "./conversations.schema";

export enum JOB_DISPUTE_STATUS {
    OPEN = "OPEN",
    ONGOING = "ONGOING",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
    REVISIT = "REVISIT",
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
    conversations: { customerContractor: IConversation['id'], arbitratorContractor:  IConversation['id'], arbitratorCustomer:  IConversation['id'] };
    customer: Types.ObjectId;
    contractor: Types.ObjectId;
    disputer: Types.ObjectId;
    disputerType: string // customers, contractors;
    evidence: Evidence[]; // Array of evidence URLs or references
    status: JOB_DISPUTE_STATUS;
    arbitrator: Types.ObjectId, 
    resolvedWay: string;
    remark: string;
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
            ref: 'jobs'
        },
        customer: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'customers'
        },
        contractor: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'contractors'
        },
        disputer: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "disputerType"
        },
        disputerType: {type: String, required: true},
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
        arbitrator: {
            type: Schema.Types.ObjectId,
            ref: 'admins'
        },
        resolvedWay: {
            type: String,
        },
        remark: {
            type: String,
        },
        conversation: {
            type: Schema.Types.ObjectId
        },
        conversations: {
            type: Object,
        }
    },
    {
        timestamps: true,
    }
);




const JobDisputeModel = model<IJobDispute>("job_disputes", JobDisputeSchema);

export { JobDisputeSchema, JobDisputeModel };
