import { Schema, model } from "mongoose";
import { IBankDetail } from "../interface/contractorBankDetail.interfce";

const BankDetailSchema = new Schema(
    {
    
      contractorId: {
        type: Schema.Types.ObjectId, ref: 'ContractorReg',
        required: true,
      },
      financialInstitution: {
        type: String,  
      },
      accountNumber: {
        type: String,
        required: true, 
      },
      transitNumber: {
        type: String, 
      },
      financialInstitutionNumber: {
        type: String,
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
  
  const BankDeatilModel = model<IBankDetail>("BankDetail", BankDetailSchema);
  
  export default BankDeatilModel;