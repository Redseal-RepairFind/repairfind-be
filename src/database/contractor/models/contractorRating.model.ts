import { Schema, model } from "mongoose";
import { IContractorRating } from "../interface/contractorRating.interface";

const ContractorRatingSchema = new Schema(
    {
        contractorId: {
        type: Schema.Types.ObjectId, ref: 'ContractorReg',
        required: true,
      },
      rate: [
        {
            customerId: { type: String, },
            jobId: { type: String, },
            cleanliness: { type: Number, },
            timeliness: { type: Number, },
            skill: { type: Number, },
            communication: { type: Number, },
            courteous: { type: Number, },
            cleanlinessText: { type: String, },
            timelinessText: { type: String, },
            skillText: { type: String, },
            communicationText: { type: String, },
            courteousText: { type: String, },
        }
      ],
      avgCleanliness: {
        type: Number,
        required: true,
      },
      avgTimeliness: {
        type: Number,
        required: true,
      },
      avgSkill: {
        type: Number,
        required: true,
      },
      avgCommunication: {
        type: Number,
        required: true,
      },
      avgCourteous: {
        type: Number,
        required: true,
      },
      avgRating: {
        type: Number,
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
  
  const ContractorRatingModel = model<IContractorRating>("ContractorRating", ContractorRatingSchema);
  
  export default ContractorRatingModel;