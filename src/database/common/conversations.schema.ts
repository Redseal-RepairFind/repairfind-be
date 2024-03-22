import mongoose, {Document, model} from 'mongoose';
import {v4 as uuidv4} from 'uuid';

export enum ENTITY_TYPE {
    BOOKING = 'bookings',
    USER = 'user',
    JOB = 'jobs',
}

export interface IConversationDocument extends Document {
    _id: string;
    members: string[]
    challenge: Object|string;
    lastMessageAt: Date;
    lastMessage: string;
    entity: string
    entityType: ENTITY_TYPE
    groupName: string;
}

const ConversationSchema = new mongoose.Schema<IConversationDocument>({

        members: [
            {
                type: String,
                ref: 'contractors'
            }
        ],

        entity: {
            type: String,
            ref: '',
            index: true,
        },

        entityType: {
            type: String,
            required: true,
            enum: Object.values(ENTITY_TYPE)
        },

        groupName: {
            type: String
        },
        lastMessage: {
            type: String
        },
        lastMessageAt: {
            type: Date
        }
    },
    {
        toObject: {
            virtuals: true,
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                return ret;
            }
        },
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                return ret;
            }
        },
        timestamps: true,
        versionKey: false
    }
);

export const ConversationDb = model<IConversationDocument>('conversations', ConversationSchema);