import { ObjectId, Schema, model } from "mongoose";

export enum BLOCK_USER_REASON {
    HARASSMENT = "HARASSMENT",
    FRAUD = "FRAUD",
    ABUSE = "ABUSE",
    OTHER = "OTHER"
}


export interface IBlockedUser {
    customer: ObjectId; // User who reported
    contractor: ObjectId; // User being reported
    blockedBy: string; // 'customers' or 'contractors'
    reason: BLOCK_USER_REASON; // Type of report
    comment?: string; // Optional: Additional comments
    createdAt: Date; // Date when the report was created
}

const BlockedUserSchema = new Schema<IBlockedUser>({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'customers',
        required: true
    },
    contractor: {
        type: Schema.Types.ObjectId,
        ref: 'contractors',
        required: true
    },
    blockedBy: {
        type: String,
        enum: ['customer', 'contractor'],
        required: true
    },
    reason: {
        type: String,
        enum: Object.values(BLOCK_USER_REASON),
        required: true
    },
    comment: {
        type: String
    },
   
   
    createdAt: {
        type: Date,
        default: Date.now
    },
   
});



BlockedUserSchema.set('toObject', { virtuals: true });
BlockedUserSchema.set('toJSON', { virtuals: true });

export const BlockedUserModel = model<IBlockedUser>("blocked_users", BlockedUserSchema);
