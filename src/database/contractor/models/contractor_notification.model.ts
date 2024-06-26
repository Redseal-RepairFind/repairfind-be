import { ObjectId, Schema, model } from "mongoose";


export interface IContractorNotificationDocument extends Document {
    _id: ObjectId;
    contractor: ObjectId
    message: string;
    entity: ObjectId;
    entityType: string; // bookings, jobs, customers, 
    createdAt: Date;
    updatedAt: Date;
    readAt: Date;
  }


const ContractorNotificationSchema = new Schema(
    {
      contractor: {
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

  
  
  const ContractorNotificationModel = model<IContractorNotificationDocument>("contractor_notifications", ContractorNotificationSchema);
  
  
  export default ContractorNotificationModel;