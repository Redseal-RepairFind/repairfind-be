import { Schema, model } from "mongoose";
import { IContractorAvailbility } from "../interface/contractorAvilability.interface";

const ContractorAvailabilitySchema = new Schema(
    {
      contractorId: {
        type: Schema.Types.ObjectId, ref: 'ContractorReg',
        required: true,
      },
      avialable: {
        type: String,
        enum: ["yes", "no"],
      },
      time: {
        from: String,
        to: String,
        sos: Boolean,
        day: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }, 
    
    },
    {
      timestamps: true,
    }
  );
  
  const ContractorAvailabilityModel = model<IContractorAvailbility>("ContractorAvailbility", ContractorAvailabilitySchema);
  
  export default ContractorAvailabilityModel;