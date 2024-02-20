import { Schema, model } from "mongoose";
import { IContractorRatedJob } from "../interface/contractorRatedJob.interface";

const ContractorRatedJobSchema = new Schema(
    {
        jobId: {
        type: Schema.Types.ObjectId, ref: 'Job',
        required: true,
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
  
  const ContractorRatedJobModel = model<IContractorRatedJob>("ContractorRatedJob", ContractorRatedJobSchema);
  
  export default ContractorRatedJobModel;