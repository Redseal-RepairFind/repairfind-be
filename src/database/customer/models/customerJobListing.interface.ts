import { Schema, model } from "mongoose";
import { ICustomerJobListingDocument } from "../interface/customerJobListing.interface";
import { contractorAccountTypes } from "../../../constants/contractorAccountTypes";

const CustomerJobListingchema = new Schema(
    {
      customerId: {
        type: Schema.Types.ObjectId, ref: 'CustomerReg',
        required: true,
      },
      jobCategory: {
        type: String,
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
        type: String,
        required: true,
      },
      jobExpiry: {
        type: String,
        required: true,
      },
      contractorType: {
        type: String,
        enum: [contractorAccountTypes.Company, contractorAccountTypes.Employee, contractorAccountTypes.Individual],
        required: true,
      },
      emergency: {
        type: String,
        enum: ["yes", "no"],
        required: true,
      },
      jobImg: {
        type: String,
        default: ''
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
  
  const CustomerJobListingModel = model<ICustomerJobListingDocument>("CustomerJobListing", CustomerJobListingchema);
  
  export default CustomerJobListingModel;


  