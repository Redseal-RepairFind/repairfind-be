import { ObjectId, Schema, model } from "mongoose";

export enum BLOCK_USER_REASON {
    HARASSMENT = "HARASSMENT",
    FRAUD = "FRAUD",
    ABUSE = "ABUSE",
    OTHER = "OTHER"
}


export interface IBlockedUser {
    user: ObjectId; // User who reported
    userType: string; // 'customers' or 'contractors'
    blockedUser: ObjectId; // User being reported
    blockedUserType: string; // 'customers' or 'contractors'
    reason: BLOCK_USER_REASON; // Type of report
    comment?: string; // Optional: Additional comments
    createdAt: Date; // Date when the report was created
}

const BlockedUserSchema = new Schema<IBlockedUser>({
    user: {
        type: Schema.Types.ObjectId,
        refPath: 'userType',
        required: true
    },
    blockedUser: {
        type: Schema.Types.ObjectId,
        refPath: 'blockedUserType',
        required: true
    },
    userType: {
        type: String,
        enum: ['customers', 'contractors'],
        required: true
    },
    blockedUserType: {
        type: String,
        enum: ['customers', 'contractors'],
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
