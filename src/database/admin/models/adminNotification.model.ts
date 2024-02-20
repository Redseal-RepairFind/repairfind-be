import { Schema, model } from "mongoose";
import { IAdminNotificationDocument } from "../interface/adminNotification.interface";

const AdminNotificationSchema = new Schema(
    {
      title: {
        type: String,
        default: "",
      },
      message: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["seen", "unseen"],
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
  
  const AdminNotificationModel = model<IAdminNotificationDocument>("AdminNotification", AdminNotificationSchema);
  
  export default AdminNotificationModel;