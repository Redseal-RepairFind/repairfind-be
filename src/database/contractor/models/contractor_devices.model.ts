import { Schema, model, Document, Types } from 'mongoose';

// Interface for ContractorDevice
export interface IContractorDevice extends Document {
    contractor: Types.ObjectId;
    deviceType: string;
    deviceToken: string;
    deviceId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose schema for ContractorDevice
const ContractorDeviceSchema = new Schema<IContractorDevice>({
    contractor: {
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
        required: true,
        unique: false
    },
    deviceId: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create and export the ContractorDevice model
const ContractorDeviceModel = model<IContractorDevice>('contractor_devices', ContractorDeviceSchema);

export default ContractorDeviceModel;
