import { Schema, model } from "mongoose";
import { IContractorQuiz } from "../interface/contractorQuiz.interface";

const ContractorQuizSchema = new Schema(
    {
    
      contractorId: {
        type: Schema.Types.ObjectId, ref: 'ContractorReg',
        required: true,
      },
      questionId: {
        type: Schema.Types.ObjectId, ref: 'question',
        required: true,
      },
      answer: {
        type: [String],
        default: [],   
      },
      mark: {
        type: String,
        enum: ["pass", "fail"],
        default: "fail",
      },
      answered: {
        type: String,
        enum: ["yes", "no"],
        default: "no",
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
  
  const ContractorQuizeModel = model<IContractorQuiz>("ContractorQuiz", ContractorQuizSchema);
  
  export default ContractorQuizeModel;