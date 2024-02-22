import { Schema, model } from "mongoose";
import { IContractor } from "../interface/contractor.interface";
import { contractorAccountTypes } from "../../../constants";
import { contractorStatus } from "../../../constants/contractorStatus";


const ContractorSchema = new Schema(
    {
    
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },

      firstName: {
        type: String,
      },

      lastName: {
        type: String,
      },

      password: {
        type: String,
        required: true,
      },

      dateOfBirth: {
        type: String,
        required: false,
      },
     
      status: {
        type: String,
        enum: Object.values(contractorStatus),
        default: contractorStatus.REVIEWING,
      },

      phoneNumber: {
        type: String
      },

      acceptTerms: {
        type: Boolean
      },

      accountType: {
        type: String,
        enum: Object.values(contractorAccountTypes),
      },

      passwordOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
      },
      emailOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
      },
      phoneNumberOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
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
  

  ContractorSchema.set('toJSON', { transform: function(doc, ret, options) { delete ret.password; delete ret.emailOtp;  return ret;} });

  export const ContractorModel = model<IContractor>("contractors", ContractorSchema);
  