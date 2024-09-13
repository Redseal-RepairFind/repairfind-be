import { ObjectId, Schema, model } from "mongoose";

export enum ABUSE_REPORT_TYPE {
    HARASSMENT = "HARASSMENT",
    FRAUD = "FRAUD",
    ABUSE = "ABUSE",
    OTHER = "OTHER"
}

export enum ABUSE_REPORT_STATUS {
    PENDING = "PENDING",
    REVIEWED = "REVIEWED",
    RESOLVED = "RESOLVED",
    REJECTED = "REJECTED"
}

export interface IAbuseReport {
    reporter: ObjectId; // User who reported
    reporterType: string; // 'customers' or 'contractors'
    reported: ObjectId; // User being reported
    reportedType: string; // 'customers' or 'contractors'
    type: ABUSE_REPORT_TYPE; // Type of report
    comment?: string; // Optional: Additional comments
    status: ABUSE_REPORT_STATUS; // Status of the report
    action?: string; // Action taken after review (e.g., warning, suspension)
    createdAt: Date; // Date when the report was created
    admin?: ObjectId; // Optional: Admin who handled the report
}

const AbuseReportSchema = new Schema<IAbuseReport>({
    reporter: {
        type: Schema.Types.ObjectId,
        refPath: 'reporterType',
        required: true
    },
    reported: {
        type: Schema.Types.ObjectId,
        refPath: 'reportedType',
        required: true
    },
    reporterType: {
        type: String,
        enum: ['customers', 'contractors'],
        required: true
    },
    reportedType: {
        type: String,
        enum: ['customers', 'contractors'],
        required: true
    },
    type: {
        type: String,
        enum: Object.values(ABUSE_REPORT_TYPE),
        required: true
    },
    comment: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(ABUSE_REPORT_STATUS),
        default: ABUSE_REPORT_STATUS.PENDING,
        required: true
    },
    action: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    admin: {
        type: Schema.Types.ObjectId, // Updated to ObjectId
        ref: 'admins' 
    }
});

// Virtual field to get reporter details
AbuseReportSchema.virtual('reporterDetails', {
    refPath: 'reporterType',
    localField: 'reporter',
    foreignField: '_id',
    justOne: true
});

// Virtual field to get reported user details
AbuseReportSchema.virtual('reportedDetails', {
    refPath: 'reportedType',
    localField: 'reported',
    foreignField: '_id',
    justOne: true
});

AbuseReportSchema.set('toObject', { virtuals: true });
AbuseReportSchema.set('toJSON', { virtuals: true });

export const AbuseReportModel = model<IAbuseReport>("reports", AbuseReportSchema);
