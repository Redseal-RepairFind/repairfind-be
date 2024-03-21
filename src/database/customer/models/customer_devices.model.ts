import { Schema, model, Document, Types } from 'mongoose';

// Interface for ContractorDevice
export interface ICustomerDevice extends Document {
    customer: Types.ObjectId;
    deviceType: string;
    deviceToken: string;
    deviceId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose schema for ContractorDevice
const CustomerDeviceSchema = new Schema<ICustomerDevice>({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'contractors', // Reference to the contractor who owns the device
        required: true
    },
    deviceType: {
        type: String,
        required: false
    },
    deviceToken: {
        type: String,
        required: false,
        unique: false
    },
    deviceId: {
        type: String,
        required: false,
        unique: false
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create and export the ContractorDevice model
const CustomerDeviceModel = model<ICustomerDevice>('customer_devices', CustomerDeviceSchema);

export default CustomerDeviceModel;
