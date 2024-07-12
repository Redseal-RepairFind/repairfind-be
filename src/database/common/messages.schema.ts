import mongoose, { Document, Schema, Types } from 'mongoose';
import { ContractorModel } from '../contractor/models/contractor.model';
import CustomerModel from '../customer/models/customer.model';

export enum MessageType {
    TEXT = "TEXT",
    ALERT = "ALERT",
    MEDIA = "MEDIA",
    AUDIO = "AUDIO",
    VIDEO = "VIDEO",
    IMAGE = "IMAGE",
    FILE = "FILE",
}



interface IMedia {
    url: string;
    metrics?: [];
    duration?: string;
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
    entity?: Types.ObjectId;
    entityType?: string;
    payload?: object;
    createdAt: Date;
}

const MediaSchema = new Schema<IMedia>({
    url: {
        type: String,
        required: true,
    },
    metrics: {
        type: Array,
        required: false,
    },
    duration: {
        type: String,
        required: false,
    }
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
        enum: ['contractors', 'customers', 'admin'],
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
    },
    entity: {
        type: Schema.Types.ObjectId,
        refPath: 'entityType',
        index: true,
    },
    entityType: {
        type: String,
    },
    payload: {
        type: Schema.Types.Mixed
    }
}, { timestamps: true });


MessageSchema.methods.getIsOwn = async function (loggedInUserId: string) {
    return this.sender.toString() == loggedInUserId;
};


MessageSchema.methods.getHeading = async function (loggedInUserId: string) {

    if (this.senderType == 'contractors') {

        
        const findContractor = await ContractorModel.findById(this.sender) 
        const contractor = findContractor?.toJSON()
        if(!contractor)return {}
        return {
            name: contractor.name,
            image: contractor?.profilePhoto?.url,
        };

    } else {
        const customer = await CustomerModel.findById(this.sender)
        if(!customer)return {}
        return {
            name: customer.name,
            image: customer?.profilePhoto?.url,
        };
    }

};

// Create and export the Message model
export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
