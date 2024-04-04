import { Document, ObjectId, Schema, model } from "mongoose";

export enum  TripDayStatus {
    STARTED = 'STARTED',
    ARRIVED = 'ARRIVED',
    COMFIRMED = 'COMFIRMED',
}

export interface ITripDay extends Document {
    _id: ObjectId;
    customer: ObjectId;
    contractor: ObjectId;
    job: ObjectId;
    status: string;
    verificationCode: number;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TripDaySchema = new Schema(
    {
      customer: {
        type: Schema.Types.ObjectId, 
        ref: 'customers',
        required: true,
      },
      contractor: {
        type: Schema.Types.ObjectId, 
        ref: 'contractors',
        required: true,
      },
      job: {
        type: Schema.Types.ObjectId, 
        ref: 'jobs',
        required: true,
      },
      status: {
        type: String,
        enum: Object.values(TripDayStatus),
        default: TripDayStatus.STARTED,  
      }, 
      verificationCode: {
        type: Number,
      }, 
      verified: {
        type: Boolean,
        default: false,  
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
  
  const TripDayModel = model<ITripDay>("TripDay", TripDaySchema);
  
  export { TripDayModel };