import { Schema, model } from "mongoose";
import { IJob } from "../interface/job.interface";

const JobSchema = new Schema(
    {
      contractorId: {
        type: Schema.Types.ObjectId, ref: 'ContractorReg',
        required: true,
      },
      customerId: {
        type: Schema.Types.ObjectId, ref: 'CustomerReg',
        required: true,
      },
      time: {
        type: Date,
        
      },
      description: {
        type: String,
        default: ""
      },
      address: {
        type: String,
        default: ""
      },
      image: {
        type: [String],
      },
      postalCode: {
        type: String,
        default: ""
      },
      jobTitle: {
        type: String,
      },

      inspection: {
        status: Boolean,
        confirmPayment: Boolean,
      },


      status: {
        type: String,
        enum: ['pending', 'complain', 'comfirmed', 'completed', "job reject", "sent request", "sent qoutation", "qoutation payment open", "qoutation payment confirm and job in progress", "inspection payment open",]
      },

      totalQuatation: {
        type: Number,
      },
      gst: {
        type: Number,
      },
      companyCharge: {
        type: Number,
      },
      totalAmountCustomerToPaid: {
        type: Number,
      },
      totalAmountContractorWithdraw: {
        type: Number,
      },

      rejected: {
        type: Boolean,
        default: false,
      },
      rejectedReason: {
        type: [String],
      },

      quate: [
       {
        material: { type: String, },
        qty: { type: Number, },
        rate: { type: Number, },
        //tax: { type: Number, },
        amount: { type: Number, },
       }
        
      ],

      qoute:{
        materialDetail:  String,
        totalcostMaterial:  Number,
        workmanShip:  Number, 
      },
      workmanShip: {
        type: Number,
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
  
  const JobModel = model<IJob>("Job", JobSchema);
  
  export default JobModel;