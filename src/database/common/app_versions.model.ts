import { Schema, model } from "mongoose";

export interface IAppVersion {
    version: string;
    createdAt: Date;
    changelogs?: Array<{ title: string; description: string }>;
    type: string; // IOS, ANDROID
    status: 'beta' | 'stable' | 'alpha' | 'release-candidate';
    isCurrent?: boolean; // This will not be used in the schema
}

const AppVersionSchema = new Schema<IAppVersion>({
    version: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    changelogs: {
        type: [
            {
                title: { type: String, required: true },
                description: { type: String, required: true },
            },
        ],
        required: false,
    },
    type: {
        type: String,
        enum: ['IOS', 'ANDROID'],
        required: true,
    },
    status: {
        type: String,
        enum: ['beta', 'stable', 'alpha', 'release-candidate'],
        required: true,
    },
    isCurrent: { type: Boolean, default: false}
});



export const AppVersionModel = model<IAppVersion>("app_versions", AppVersionSchema);
