import { Schema, model, Document, Types } from 'mongoose';

// Interface for ContractorDevice
export interface IFavoriteContractor extends Document {
    customer: Types.ObjectId;
    contractor: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose schema for ContractorDevice
const CustomerFavoriteContractorSchema = new Schema<IFavoriteContractor>({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'customers', // Reference to the contractor who owns the device
        required: true
    },
    contractor: {
        type: Schema.Types.ObjectId,
        ref: 'contractors', // Reference to the contractor who owns the device
        required: true
    },
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create and export the ContractorDevice model
const CustomerFavoriteContractorModel = model<IFavoriteContractor>('customer_favorite_contractors', CustomerFavoriteContractorSchema);
export default CustomerFavoriteContractorModel;
