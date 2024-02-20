import { Schema, model } from "mongoose";
import { IContractorNotificationDocument } from "../interface/contractorNotification.interface";

const ContractorNotificationSchema = new Schema(
    {
      contractorId: {
        type: Schema.Types.ObjectId, ref: 'ContractorReg',
        required: true,
      },
      message: {
        type: String,
        required: true,
      }, 
      status: {
        type: String,
        enum: ["seen", "unseen"]
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
  
  const ContractorNotificationModel = model<IContractorNotificationDocument>("ContractorNotification", ContractorNotificationSchema);
  
  export default ContractorNotificationModel;