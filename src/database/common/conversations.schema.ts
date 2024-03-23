import mongoose, {Document, Schema, model} from 'mongoose';
import {v4 as uuidv4} from 'uuid';

export enum ENTITY_TYPE {
    BOOKING = 'bookings',
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
    heading: Object;
}

const ConversationSchema = new mongoose.Schema<IConversationDocument>({

        members: [
            {
                memberType: {
                    type: String,
                    enum: ['contractors', 'customers'],
                    required: true,
                },
                member: {
                    type: Schema.Types.ObjectId,
                    refPath: 'members.memberType',
                    required: true,
                },
            },
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

        heading: {
            type: Object
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




