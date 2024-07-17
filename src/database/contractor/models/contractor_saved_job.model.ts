import { Schema, model, Document, Types } from 'mongoose';

// Interface for ContractorDevice
export interface IContractorSavedJob extends Document {
    contractor: Types.ObjectId;
    job: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose schema for ContractorDevice
const ContractorSavedJobSchema = new Schema<IContractorSavedJob>({
    contractor: {
        type: Schema.Types.ObjectId,
        ref: 'contractors', 
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'jobs', 
        required: true
    },
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create and export the ContractorDevice model
const ContractorSavedJobModel = model<IContractorSavedJob>('contractor_saved_jobs', ContractorSavedJobSchema);

export default ContractorSavedJobModel;
