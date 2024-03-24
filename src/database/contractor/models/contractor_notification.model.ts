import { ObjectId, Schema, model } from "mongoose";


export interface IContractorNotificationDocument extends Document {
    _id: ObjectId;
    contractorId: ObjectId
    message: string;
    entity: ObjectId;
    entityType: string; // bookings, jobs, customers, 
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }


const ContractorNotificationSchema = new Schema(
    {
      contractorId: {
        type: Schema.Types.ObjectId, ref: 'contractors',
        required: true,
      },
      message: {
        type: String,
        required: true,
      }, 
      entity: {
        type: Schema.Types.ObjectId,
        refPath: 'entityType', // Dynamically reference either Customer or Contractor model
        default: null,
      },
      entityType: {
        type: String,
        enum: ['contractors', 'customers', 'bookings', 'jobs', 'others'],
        default: 'others', // false becos we of alert kind of messages
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
      readAt: {
        type: Date,
        default: null,
      },
    
    },
    {
      timestamps: true,
    }
  );
  
  const ContractorNotificationModel = model<IContractorNotificationDocument>("ContractorNotification", ContractorNotificationSchema);
  
  export default ContractorNotificationModel;