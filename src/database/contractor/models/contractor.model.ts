import { Schema, model, ObjectId } from "mongoose";
import { COMPANY_STATUS, CONTRACTOR_TYPES, GST_STATUS, IContractor, IContractorCertnDetails, IContractorCompanyDetails, IContractorGstDetails } from "../interface/contractor.interface";
import { contractorStatus } from "../../../constants/contractorStatus";
import { config } from "../../../config";
import ContractorQuizModel from "./contractor_quiz.model";
import { StripeCustomerSchema } from "../../common/stripe_customer.schema";
import { StripeAccountSchema } from "../../common/stripe_account.schema";
import { StripePaymentMethodSchema } from "../../common/stripe_paymentmethod.schema";
import QuestionModel, { IQuestion } from "../../admin/models/question.model";



const GstDetailSchema = new Schema<IContractorGstDetails>({
  gstName: String,
  gstNumber: String,
  gstType: String,
  backgroundCheckConsent: String,
  status: { type: String, enum: Object.values(GST_STATUS), default: GST_STATUS.PENDING },
  approvedBy: Schema.Types.ObjectId,
  approvedAt: Date,
  recentRemark: String,
  gstCertificate: String,
});


const CompanyDetailSchema = new Schema<IContractorCompanyDetails>({
  companyLogo: String,
  companyStaffId: String, //url
  status: { type: String, enum: Object.values(COMPANY_STATUS), default: COMPANY_STATUS.PENDING },
  approvedBy: Schema.Types.ObjectId,
  approvedAt: Date,
  recentRemark: String,
});



const CertnDetailSchema = new Schema<IContractorCertnDetails>({
  created: String,
  modified: String,
  is_submitted: Boolean,
  applicant_type: String,
  check_executions: [
    {
      id: String,
      check_name: String,
      status: String,
    },
  ],
  result: String,
  result_label: String,
  report_status: String,
  applicant_account: {
    id: String,
    email: String,
    email_verified: Boolean,
    phone_number: String,
  },
  application: {
    created: String,
    modified: String,
    id: String,
    applicant: {
      id: String,
      status: String,
      email: String,
      phone_number: String,
      application_url: String,
      report_url: String,
    },
    owner: {
      id: String,
      email: String,
    },
  },
  adjudication_status: String,
  adjudication_status_label: String,
  is_favourite: Boolean,
  reliability_risk: String,
  workplace_misconduct: String,
  early_termination: String,
  applicant_result_summary: String,
  social_result_summary: String,
  identity_verified_summary: String,
  status: String,
  status_label: String,
});


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
      enum: Object.values(CONTRACTOR_TYPES),
    },

    profilePhoto: {
      type: Object,
      default: {
        url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png'
      }
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
      type: StripeAccountSchema,
    },
    stripePaymentMethods: {
      type: [StripePaymentMethodSchema],
    },

    gstDetails: {
      type: GstDetailSchema
    },
    companyDetails: {
      type: CompanyDetailSchema
    },
    certnId: {
      type: String,
    },
    certnDetails: {
      type: CertnDetailSchema
    },
    onboarding: {
      hasStripeAccount: { default: false, type: Boolean },
      hasStripeIdentity: { default: false, type: Boolean },
      hasStripePaymentMethods: { default: false, type: Boolean },
      hasStripeCustomer: { default: false, type: Boolean },
      hasProfile: { default: false, type: Boolean },
      hasGstDetails: { default: false, type: Boolean },
      hasCompanyDetails: { default: false, type: Boolean },
      hasPassedQuiz: { default: false, type: Boolean },
      stage: { default: {status: 1, label: 'stripeIdentity'}, type: Object },
    }

  },
  {
    timestamps: true,
  }
);



ContractorSchema.virtual('stripeIdentityStatus').get(function (this: IContractor) {
  //@ts-ignore
  return this.stripeIdentity ? this.stripeIdentity.status : 'unverified';
});


ContractorSchema.virtual('stripeAccountStatus').get(function (this: IContractor) {
  const stripeAccount = this.stripeAccount;
  return stripeAccount ? {
    details_submitted: stripeAccount.details_submitted,
    payouts_enabled: stripeAccount.payouts_enabled,
    charges_enabled: stripeAccount.charges_enabled,
    transfers_enabled: stripeAccount?.capabilities?.transfers ?? 'inactive',
    card_payments_enabled: stripeAccount?.capabilities?.card_payments ?? 'inactive',
  } : null;
});


ContractorSchema.virtual('certnStatus').get(function (this: IContractor) {
  const certnDetails: IContractorCertnDetails = this.certnDetails;

  let status = 'NOT_STARTED'
  if (certnDetails) {
    if (!certnDetails.is_submitted) {
      status=  'NOT_SUBMITTED'
    } else {
      status= certnDetails.status
    }
  }

  return status


  // return certnDetails ? {
  //   result: certnDetails.result,
  //   report_status: certnDetails.report_status,
  //   adjudication_status: certnDetails.adjudication_status,
  //   check_executions: certnDetails.check_executions,
  //   is_submitted: certnDetails.is_submitted,

  //   application_url: certnDetails.application.applicant.application_url,
  //   report_url: certnDetails.application.applicant.report_url,

  //   modified: certnDetails.modified,
  //   identity_verified_summary: certnDetails.identity_verified_summary,
  //   status: certnDetails.status,
  //   status_label: certnDetails.status_label,
});


ContractorSchema.methods.getOnboarding = async function () {
  const hasStripeAccount = !!this.stripeAccount;
  const hasStripeCustomer = !!this.stripeCustomer;
  const hasStripePaymentMethods = Array.isArray(this.stripePaymentMethods) && this.stripePaymentMethods.length > 0

  const hasStripeIdentity = !!this.stripeIdentity;
  const hasProfile = !!this.profile;
  const hasGstDetails = !!this.gstDetails;
  const hasCompanyDetails = !!this.companyDetails;

  let hasPassedQuiz = false
  const latestQuiz: any = await ContractorQuizModel.findOne({ contractor: this._id }).sort({ createdAt: -1 });
  if (latestQuiz) {
    // hasPassedQuiz = await latestQuiz.result.passed
    const questions: IQuestion[] = await QuestionModel.find({ quiz: latestQuiz.quiz });
    const totalQuestions = questions.length;
    const totalCorrect: number = latestQuiz.response.filter((response: any) => response.correct).length;
    const percentageCorrect: number = (totalCorrect / totalQuestions) * 100;
    hasPassedQuiz = (percentageCorrect >= 70);

  }

  let stage: any = {status: 1, label: 'stripeIdentity'};

  if (this.accountType == 'Company') {
    if (stage.status == 1 && hasStripeIdentity) stage =  {status: 2, label: 'companyDetails'} 
    if (stage.status == 2 && hasCompanyDetails) stage = {status: 3, label: 'profile'} // 
    if (stage.status == 3 && hasProfile) stage = {status: 4, label: 'gstDetails'}
    if (stage.status == 4 && hasGstDetails) stage = {status: 5, label: 'quiz'}
    if (stage.status == 5 && hasPassedQuiz) stage = {status: 6, label: 'stripeAccount'}
    if (stage.status == 6 && hasStripeAccount) stage = {status: 7, label: 'done'}

  }

  if (this.accountType == 'Individual') {
    if (stage.status == 1 && hasStripeIdentity) stage = {status: 2, label: 'profle'} 
    if (stage.status == 2 && hasProfile) stage = {status: 3, label: 'gstDetails'} 
    if (stage.status == 3 && hasGstDetails) stage = {status: 4, label: 'quiz'} 
    if (stage.status == 4 && hasPassedQuiz) stage = {status: 5, label: 'stripeAccount'}
    if (stage.status == 5 && hasStripeAccount) stage = {status: 6, label: 'done'}
  }


  if (this.accountType == 'Employee') {
    if (stage.status == 1 && hasStripeIdentity) stage = {status: 2, label: 'profle'} 
    if (stage.status == 2 && hasProfile) stage = {status: 3, label: 'quiz'} 
    if (stage.status == 3 && hasPassedQuiz) stage = {status: 4, label: 'done'} 
  }



  return {
    hasStripeAccount,
    hasStripeIdentity,
    hasStripePaymentMethods,
    hasStripeCustomer,
    hasProfile,
    hasGstDetails,
    hasCompanyDetails,
    hasPassedQuiz,
    stage,

  }

};




ContractorSchema.virtual('quiz').get(async function () {
  const latestQuiz: any = await ContractorQuizModel.findOne({ contractor: this._id }).sort({ createdAt: -1 });
  return await latestQuiz?.result
});

ContractorSchema.virtual('name').get(function () {
  if (this.accountType == CONTRACTOR_TYPES.Individual || this.accountType == CONTRACTOR_TYPES.Employee) {
    return `${this.firstName} ${this.lastName}`;
  } else if (this.accountType == CONTRACTOR_TYPES.Company) {
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
    //@ts-ignore
    if (!options.includeStripeIdentity) {
      delete ret.stripeIdentity;
    }
    //@ts-ignore
    if (!options.includeStripePaymentMethods) {
      delete ret.stripePaymentMethods;
    }

    //@ts-ignore
    if (!options.includeStripeCustomer) {
      delete ret.stripeCustomer;
    }
    //@ts-ignore

    if (!options.includeStripeAccount) {
      delete ret.stripeAccount;
    }

    if (!ret.profilePhoto || !ret.profilePhoto.url) {
      ret.profilePhoto = {
        url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png'
      }
    }

    //@ts-ignore
    ret.name = doc.name;
    return ret;
  },
  virtuals: true
});

ContractorSchema.set('toObject', { virtuals: true });

export const ContractorModel = model<IContractor>("contractors", ContractorSchema);
