import mongoose, { Schema, Document } from 'mongoose';

export interface ICall {
    fromUser: string;
    fromUserType: string;
    toUser: string;
    toUserType: string;
    startTime: Date;
    endTime?: Date;
    durationSeconds?: number;
    callStatus?: 'answered' | 'missed' | 'declined' | 'ended';
    recordingUrl?: string;
    toUserToken: string;
    fromUserToken: string;
    uid: string;
    channel: string;
  }


  export const CallSchema: Schema = new Schema<ICall>({
    fromUser: { type: String, required: true },
    fromUserType: { type: String, required: true },
    toUser: { type: String, required: true },
    toUserType: { type: String, required: true },
    startTime: { type: Date, required: false },
    endTime: { type: Date, required: false },
    durationSeconds: { type: Number, required: false },
    callStatus: {
      type: String,
      enum: ['answered', 'missed', 'declined', 'ended'],
      required: false,
    },
    recordingUrl: { type: String },
    toUserToken: { type: String },
    fromUserToken: { type: String },
    uid: { type: String },
    channel: { type: String },
  }, { timestamps: true });

  export const CallModel = mongoose.model<ICall>('calls', CallSchema);
