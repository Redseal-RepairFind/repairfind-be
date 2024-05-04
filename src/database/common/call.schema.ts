import mongoose, { Schema, Document } from 'mongoose';

export interface ICall {
    fromUser: string;
    fromUserType: string;
    toUser: string;
    toUserType: string;
    startTime: Date;
    endTime: Date;
    durationSeconds: number;
    callType: 'incoming' | 'outgoing';
    callStatus: 'answered' | 'missed' | 'rejected' | 'ended';
    recordingUrl?: string;
    // Add any other relevant fields here
  }
  

  export const CallSchema: Schema = new Schema<ICall>({
    fromUser: { type: String, required: true },
    fromUserType: { type: String, required: true },
    toUser: { type: String, required: true },
    toUserType: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    durationSeconds: { type: Number, required: true },
    callType: { type: String, enum: ['incoming', 'outgoing'], required: true },
    callStatus: {
      type: String,
      enum: ['answered', 'missed', 'rejected', 'ended'],
      required: true,
    },
    recordingUrl: { type: String },
    // Add any other relevant fields here
  });

  export const CallModel = mongoose.model<ICall>('calls', CallSchema);
