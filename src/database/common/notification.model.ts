import { ObjectId, Schema, model } from "mongoose";


export interface INotification extends Document {
    _id: ObjectId;
    user: ObjectId;
    userType: string;
    message: string;
    entity: ObjectId;
    entityType: string; // bookings, jobs, customers, 
    heading: object; //{name, image}
    data: object; 
    createdAt: Date;
    updatedAt: Date;
    readAt: Date;
  }


const NotificationSchema = new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        refPath: 'userType',
        default: null,
      },
      userType: {
        type: String,
        enum: ['contractors', 'customers'],
        required: true,
      },
      message: {
        type: String,
        required: true,
      }, 
      entity: {
        type: Schema.Types.ObjectId,
        refPath: 'entityType',
        default: null,
      },
      entityType: {
        type: String
      },
      heading: Object,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      data: {
        type: Object,
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

  const NotificationModel = model<INotification>("notifications", NotificationSchema);
  
  
  export default NotificationModel;