import mongoose, { Document, Schema, Types } from 'mongoose';
import { ContractorModel } from '../contractor/models/contractor.model';
import CustomerModel from '../customer/models/customer.model';

export enum MessageType {
    TEXT = "TEXT",
    ALERT = "ALERT",
    MEDIA = "MEDIA",
}

export enum MESSAGE_MEDIA_TYPE {
    TEXT = "AUDIO",
    ALERT = "VIDEO",
    MEDIA = "IMAGE",
}

interface IMedia {
    url: string;
    metrics?: string;
    duration?: string;
    type: MESSAGE_MEDIA_TYPE;
}

// Define base interface for messages
export interface IMessage extends Document {
    id: string;
    conversation: string;
    sender: Types.ObjectId; // Reference to the sender (contractor or customer)
    senderType: 'contractor' | 'customer'; // Type of the sender
    messageType: 'TEXT' | 'ALERT' | 'MEDIA'; //
    message?: string; // Optional message
    media: IMedia[]; // Array of media objects
    readBy: Types.ObjectId[]; // References to contractors who have read the message
    heading: Object;
    isOwn: Boolean;
}

const MediaSchema = new Schema<IMedia>({
    url: {
        type: String,
        required: true,
    },
    metrics: {
        type: String,
        required: false,
    },
    duration: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        enum: Object.values(MESSAGE_MEDIA_TYPE),
        required: true,
    },
});

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
        required: false,
    },
    media: [MediaSchema],
    readBy: [
        {
            type: Schema.Types.ObjectId,
            refPath: 'senderType', // Dynamically reference either Customer or Contractor model
        },
    ],
    heading: {
        type: Object
    },
    isOwn: {
        type: Boolean
    }
}, { timestamps: true });


MessageSchema.methods.getIsOwn = async function (loggedInUserId: string) {
    return this.sender.toString() == loggedInUserId;
};


MessageSchema.methods.getHeading = async function (loggedInUserId: string) {

    if (this.senderType == 'contractors') {
        const contractor = await ContractorModel.findById(this.sender) // Assuming your user model is named 'User'
        if(!contractor)return {}
        return {
            // @ts-ignore
            name: contractor.name,
            profilePhoto: contractor.profilePhoto,
        };

    } else {
        const customer = await CustomerModel.findById(this.sender) // Assuming your user model is named 'User'
        if(!customer)return {}
        return {
            // @ts-ignore
            name: customer.name,
            image: customer.profilePhoto?.url,
        };
    }

};

// Create and export the Message model
export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
