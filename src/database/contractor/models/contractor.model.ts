import { Schema, model } from "mongoose";
import { IContractor } from "../interface/contractor.interface";
import { contractorAccountTypes } from "../../../constants";
import { contractorStatus } from "../../../constants/contractorStatus";
import { config } from "../../../config";
import ContractorQuizModel from "./contractor_quiz.model";


const ContractorSchema = new Schema <IContractor>(
    {
    
      profile: {
        type: Schema.Types.ObjectId, 
        ref: "contractor_profiles",
        required: false,
      },

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

      companyName: {
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
  


// Rest of your schema

ContractorSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.emailOtp;
        delete ret.passwordOtp;
        return ret;
    }
});


ContractorSchema.virtual('quiz').get(async function () {
  const latestQuiz: any = await ContractorQuizModel.findOne({ contractor: this._id }).sort({ createdAt: -1 });
  return await latestQuiz?.result
});




export const ContractorModel = model<IContractor>("contractors", ContractorSchema);
  