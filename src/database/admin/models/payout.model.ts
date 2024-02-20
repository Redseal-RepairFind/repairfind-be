import { Schema, model } from "mongoose";
import { IPayout } from "../interface/payout.interface";

const PayoutSchema = new Schema(
    {
      amount: {
        type: Number,
        required: true,
      },
      accountNumber: {
        type: String,
        required: true,
      },
      accountName: {
        type: String,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
      recieverId: {
        type: String,
        required: true,
      },
      jobId: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed"]
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
  
  const PayoutModel = model<IPayout>("Payout", PayoutSchema);
  
  export default PayoutModel;