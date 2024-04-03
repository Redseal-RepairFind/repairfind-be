// @ts-nocheck
import { Schema, model } from "mongoose";
import { IContractor } from "../interface/contractor.interface";
import { contractorAccountTypes } from "../../../constants";
import { contractorStatus } from "../../../constants/contractorStatus";
import { config } from "../../../config";
import ContractorQuizModel from "./contractor_quiz.model";
import { StripeCustomerSchema } from "../../common/stripe_customer.schema";


export enum CONTRACTOR_TYPES {
  INDIVIDUAL = "Individual",
  EMPLOYEE = "Employee",
  COMPANY = "Company"
}
const ContractorSchema = new Schema<IContractor>(
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

    stripeCustomer: {
      type: StripeCustomerSchema,
      default: null
    },
    stripeIdentity: {
      type: Object,
      default: null,
    },
    stripeAccount: {
      type: Object,
      default: null,
    },
    stripePaymentMethods: {
      type: Array,
      default: []
    }

  },
  {
    timestamps: true,
  }
);



// Rest of your schema

ContractorSchema.virtual('hasStripeIdentity').get(function (this: IContractor) {
  return !!this.stripeIdentity; // Returns true if stripeIdentity exists, false otherwise
});

ContractorSchema.virtual('hasStripeCustomer').get(function (this: IContractor) {
  return !!this.stripeCustomer; // Returns true if stripeCustomer exists, false otherwise
});

ContractorSchema.virtual('hasStripePaymentMethods').get(function (this: IContractor) {
  return Array.isArray(this.stripePaymentMethods) && this.stripePaymentMethods.length > 0; // Returns true if stripePaymentMethods is an array with at least one element
});


ContractorSchema.virtual('stripeIdentityStatus').get(function (this: IContractor) {
  return this.stripeIdentity ? this.stripeIdentity.status : 'unverified';
});


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

    // Check if the options include virtuals, if not, delete the fields

    
    // Check if the options include virtuals, if not, delete the stripeIdentity field
    if (!options.includeStripeIdentity) {
      delete ret.stripeIdentity;
    }
    if (!options.includeStripePaymentMethods) {
      delete ret.stripePaymentMethods;
    }

    if (!options.includeStripeCustomer) {
      delete ret.stripeCustomer;
    }


    ret.name = doc.name;
    return ret;
  },
  virtuals: true
});

ContractorSchema.set('toObject', { virtuals: true });

export const ContractorModel = model<IContractor>("contractors", ContractorSchema);
