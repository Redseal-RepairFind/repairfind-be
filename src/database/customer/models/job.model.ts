import { Schema, model } from "mongoose";
import { IJobDocument } from "../interface/job.interface";

const JobSchema = new Schema(
    {
      customerId: {
        type: Schema.Types.ObjectId, ref: 'CustomerReg',
        required: true,
      },
      contractorId: {
        type: Schema.Types.ObjectId, ref: 'contractors',
        required: true,
      }, 
      jobDescription: {
        type: String,
        required: true,
      }, 
      voiceDescription: {
        type: String,
        default: ''
      }, 
      jobLocation: {
        type: String,
        required: true,
      }, 
      date: {
        type: Date,
        required: true,
      },
      jobImg: {
        type: [String],
        default: []
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
  
  const JobModel = model<IJobDocument>("JobRequest", JobSchema);
  
  export default JobModel;