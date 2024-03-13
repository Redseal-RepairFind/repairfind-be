// @ts-nocheck
import { Schema, model } from "mongoose";
import { IContractor } from "../interface/contractor.interface";
import { contractorAccountTypes } from "../../../constants";
import { contractorStatus } from "../../../constants/contractorStatus";
import { config } from "../../../config";
import ContractorQuizModel from "./contractor_quiz.model";
import { StripeCustomerSchema } from "../../common/stripe_customer.schema";


export enum CONTRACTOR_TYPES  {
  INDIVIDUAL = "Individual",
  EMPLOYEE = "Employee",
  COMPANY = "Company"
}
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

      acceptTerms: {
        type: Boolean
      },

      accountType: {
        type: String,
        enum: Object.values(contractorAccountTypes),
      },

      profilePhoto: {
        type: Object,
      },

      phoneNumber: {
        code: {
          type: String
        },
        number: {
          type: String
        },
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

      stripeCustomer: StripeCustomerSchema
    
    },
    {
      timestamps: true,
    }
  );
  


// Rest of your schema

ContractorSchema.virtual('quiz').get(async function () {
  const latestQuiz: any = await ContractorQuizModel.findOne({ contractor: this._id }).sort({ createdAt: -1 });
  return await latestQuiz?.result
});

ContractorSchema.virtual('name').get(function () {
  if (this.accountType === CONTRACTOR_TYPES.INDIVIDUAL || this.accountType === CONTRACTOR_TYPES.EMPLOYEE) {
    return `${this.firstName} ${this.lastName}`;
  } else if (this.accountType === CONTRACTOR_TYPES.COMPANY) {
    return this.companyName;
  }
});


ContractorSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.emailOtp;
        delete ret.passwordOtp;
        ret.name = doc.name;
        return ret;
    }
});

export const ContractorModel = model<IContractor>("contractors", ContractorSchema);
  