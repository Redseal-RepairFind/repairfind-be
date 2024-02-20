import { Schema, model } from "mongoose";
import { ICustomerNotificationDocument } from "../interface/customerNotification.interface";

const CustomerNotificationSchema = new Schema(
    {
        customerId: {
        type: Schema.Types.ObjectId, ref: 'CustomerReg',
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
  
  const CustomerNotificationModel = model<ICustomerNotificationDocument>("CustomerNotification", CustomerNotificationSchema);
  
  export default CustomerNotificationModel;