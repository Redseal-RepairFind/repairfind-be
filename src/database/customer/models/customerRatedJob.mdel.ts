import { Schema, model } from "mongoose";
import { ICustomerRatedJob } from "../interface/customerRatedJob.interface";

const CustomerRatedJobSchema = new Schema(
    {
        jobId: {
        type: Schema.Types.ObjectId, ref: 'Job',
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
  
  const CustomerRatedJobModel = model<ICustomerRatedJob>("CustomerRatedJob", CustomerRatedJobSchema);
  
  export default CustomerRatedJobModel;