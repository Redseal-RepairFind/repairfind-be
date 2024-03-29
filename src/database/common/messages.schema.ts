import mongoose, { Document, Schema, Types } from 'mongoose';

export enum MessageType  {
    TEXT = "TEXT",
    ALERT = "ALERT",
    MEDIA = "MEDIA",
}
// Define base interface for messages
export interface IMessage extends Document {
    _id: string;
    conversation: string;
    sender: Types.ObjectId; // Reference to the sender (contractor or customer)
    senderType: 'contractor' | 'customer'; // Type of the sender
    messageType: 'TEXT' | 'ALERT' | 'MEDIA'; //
    message: string;
    media: { type: string; url: string; blurHash: string }[];
    readBy: Types.ObjectId[]; // References to contractors who have read the message
}

// Define schema for messages
const MessageSchema = new Schema<IMessage>({
    conversation: {
        type: String,
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        refPath: 'senderType', // Dynamically reference either Customer or Contractor model
        required: true,
    },
    senderType: {
        type: String,
        enum: ['contractors', 'customers'],
        required: false, // false becos we of alert kind of messages
    },
    messageType: {
        type: String,
        enum: Object.values(MessageType),
        required: true,
    },
    message: {
        type: String,
        trim: true,
        required: true,
    },
    media: [
        {
            type: {
                type: String,
            },
            url: {
                type: String,
            },
            blurHash: {
                type: String,
            },
        },
    ],
    readBy: [
        {
            type: Schema.Types.ObjectId,
            refPath: 'senderType', // Dynamically reference either Customer or Contractor model
        },
    ],
}, { timestamps: true });

// Create and export the Message model
export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
