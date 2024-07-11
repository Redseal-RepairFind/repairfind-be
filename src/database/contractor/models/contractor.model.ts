import { Schema, model, ObjectId, FilterQuery } from "mongoose";
import { COMPANY_STATUS, CONTRACTOR_BADGE, CONTRACTOR_STATUS, CONTRACTOR_TYPES, GST_STATUS, IContractor, IContractorCertnDetails, IContractorCompanyDetails, IContractorGstDetails } from "../interface/contractor.interface";
import { contractorStatus } from "../../../constants/contractorStatus";
import ContractorQuizModel from "./contractor_quiz.model";
import { StripeCustomerSchema } from "../../common/stripe_customer.schema";
import { StripeAccountSchema } from "../../common/stripe_account.schema";
import { StripePaymentMethodSchema } from "../../common/stripe_paymentmethod.schema";
import QuestionModel, { IQuestion } from "../../admin/models/question.model";
import { CertnService } from "../../../services";
import { deleteObjectFromS3 } from "../../../services/storage";
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
import { stringify } from "querystring";
import { JobQuotationModel } from "../../common/job_quotation.model";
import { JOB_STATUS, JobModel } from "../../common/job.model";



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
  statusReason: String,
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
      type: Object
    },

    phoneNumber: {
      code: {type: String}, 
      number: {type: String, unique: true, }, 
      verifiedAt: {type: Date, default: null },
      
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
    
    

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
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

    reviews: [{ review: { type: Schema.Types.ObjectId, ref: 'reviews' }, averageRating: Number }],
    stats: { 
      formattedResponseTime: { type: Schema.Types.Mixed }, 
      responseTime: { type: Schema.Types.Mixed }, 
      jobsCompleted: { type: Schema.Types.Mixed }, 
      jobsCanceled: { type: Schema.Types.Mixed }, 
      jobsPending: { type: Schema.Types.Mixed },
      jobsTotal: { type: Schema.Types.Mixed } 
    },


    badge: {
      label: { type: String, default: CONTRACTOR_BADGE.PROSPECT },
      icon: { type: String, default: null },
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
      stage: { default: { status: 1, label: 'stripeIdentity' }, type: Object },
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
  const detailsSubmitted = stripeAccount?.details_submitted || false;
  const payoutsEnabled = stripeAccount?.payouts_enabled || false;
  const chargesEnabled = stripeAccount?.charges_enabled || false;
  const transfersEnabled = stripeAccount?.capabilities?.transfers === 'active' || false;
  const cardPaymentsEnabled = stripeAccount?.capabilities?.card_payments === 'active' || false;
  const status = (detailsSubmitted && payoutsEnabled && chargesEnabled && transfersEnabled && cardPaymentsEnabled) ? 'active' : 'inactive'

  return stripeAccount ? {
    details_submitted: detailsSubmitted,
    payouts_enabled: payoutsEnabled,
    charges_enabled: chargesEnabled,
    transfers_enabled: transfersEnabled,
    card_payments_enabled: cardPaymentsEnabled,
    status: status
  } : {
    details_submitted: detailsSubmitted,
    payouts_enabled: payoutsEnabled,
    charges_enabled: chargesEnabled,
    transfers_enabled: transfersEnabled,
    card_payments_enabled: cardPaymentsEnabled,
    status: status
  };
});



ContractorSchema.virtual('accountStatus').get(function (this: IContractor) {
  return CONTRACTOR_STATUS.APPROVED
});


ContractorSchema.virtual('certnStatus').get(function (this: IContractor) {
  const certnDetails: IContractorCertnDetails = this.certnDetails;

  let status = 'NOT_STARTED'
  if (certnDetails) {
    if (!certnDetails.is_submitted) {
      status = 'NOT_SUBMITTED'
    } else {
      for (const execution of certnDetails.check_executions) {
        if (execution.status !== 'COMPLETED') {
          status = 'FAILED'; // If any check is not completed, status is failed
          break; // No need to continue, we already found a failed check
        }
      }
    }
  }

  return status
});

ContractorSchema.virtual('certnReport').get(function (this: IContractor) {
  const certnDetails: IContractorCertnDetails = this.certnDetails;

  let status = 'NOT_STARTED'
  let action = 'NONE'
  if (certnDetails) {
    if (!certnDetails.is_submitted) {
      status = 'NOT_SUBMITTED'
    } else {
      status = 'COMPLETED'
      for (const execution of certnDetails.check_executions) {
        if (execution.status !== 'COMPLETED') {
          status = 'FAILED'; // If any check is not completed, status is failed
          break; // No need to continue, we already found a failed check
        }
      }
    }
    action = certnDetails.application.applicant.application_url
  }

  return { status, action }
});



// ContractorSchema.virtual('rating').get(function () {
//   const reviews: any = this.reviews;
//   const totalRating = reviews.reduce((acc: any, review: any) => acc + review.averageRating, 0);
//   return reviews.length > 0 ? totalRating / reviews.length : 0;
// });

ContractorSchema.virtual('rating').get(function () {
  // Access reviews using `this.get('reviews')`
  const reviews: any[] = this.get('reviews') || [];
  const totalRating = reviews.reduce((acc, review) => acc + review.averageRating, 0);
  return reviews.length > 0 ? totalRating / reviews.length : 0;
});

ContractorSchema.virtual('reviewCount').get(function () {
  const reviews: any[] = this.get('reviews') || [];
  return reviews.length;
});


ContractorSchema.methods.getOnboarding = async function () {
  const hasStripeAccount = !!this.stripeAccount;
  const hasStripeCustomer = !!this.stripeCustomer;
  const hasStripePaymentMethods = Array.isArray(this.stripePaymentMethods) && this.stripePaymentMethods.length > 0

  const hasStripeIdentity = !!this.stripeIdentity;
  let stripeIdentityStatus = 'requires_input'
  if (hasStripeIdentity && this.stripeIdentity.last_verification_report) {
    stripeIdentityStatus = this.stripeIdentity?.last_verification_report?.document?.status
  }
  const hasProfile = !!this.profile;
  const hasGstDetails = !!this.gstDetails;
  const hasCompanyDetails = !!this.companyDetails;

  let hasPassedQuiz = false
  const latestQuiz: any = await ContractorQuizModel.findOne({ contractor: this._id }).sort({ createdAt: -1 });
  if (latestQuiz) {
    // hasPassedQuiz = await latestQuiz.result.passed
    const questions: IQuestion[] = await QuestionModel.find({ quiz: latestQuiz.quiz });
    const totalQuestions = 10; //total questions sent to contractor  //questions.length;
    const totalCorrect: number = latestQuiz.response.filter((response: any) => response.correct).length;
    const percentageCorrect: number = (totalCorrect / totalQuestions) * 100;
    hasPassedQuiz = (percentageCorrect >= 70);

  }

  let stage: any = { status: 1, label: 'stripeIdentity' };

  if (this.accountType == 'Company') {
    if (stage.status == 1 && hasStripeIdentity && stripeIdentityStatus == 'verified') stage = { status: 2, label: 'companyDetails' }
    if (stage.status == 2 && hasCompanyDetails) stage = { status: 3, label: 'profile' } // 
    if (stage.status == 3 && hasProfile) stage = { status: 4, label: 'gstDetails' }
    if (stage.status == 4 && hasGstDetails) stage = { status: 5, label: 'quiz' }
    if (stage.status == 5 && hasPassedQuiz) stage = { status: 6, label: 'stripeAccount' }
    if (stage.status == 6 && hasStripeAccount) stage = { status: 7, label: 'done' }

  }

  if (this.accountType == 'Individual') {
    if (stage.status == 1 && hasStripeIdentity && stripeIdentityStatus == 'verified') stage = { status: 2, label: 'profle' }
    if (stage.status == 2 && hasProfile) stage = { status: 3, label: 'quiz' }
    // if (stage.status == 3 && hasGstDetails) stage = {status: 4, label: 'quiz'} 
    if (stage.status == 3 && hasPassedQuiz) stage = { status: 4, label: 'stripeAccount' }
    if (stage.status == 4 && hasStripeAccount) stage = { status: 5, label: 'done' }
  }


  if (this.accountType == 'Employee') {
    if (stage.status == 1 && hasStripeIdentity && stripeIdentityStatus == 'verified') stage = { status: 2, label: 'profle' }
    if (stage.status == 2 && hasProfile) stage = { status: 3, label: 'quiz' }
    if (stage.status == 3 && hasPassedQuiz) stage = { status: 4, label: 'done' }
  }



  return {
    hasStripeAccount,
    hasStripeIdentity,
    stripeIdentityStatus,
    hasStripePaymentMethods,
    hasStripeCustomer,
    hasProfile,
    hasGstDetails,
    hasCompanyDetails,
    hasPassedQuiz,
    stage,
  }

};


// Instance method to get formatted response time
ContractorSchema.methods.getStats = async function (contractor: any = null) {

  const contractorId = contractor ?? this._id

  // Access the quotations of this contractor instance
  const quotations = await JobQuotationModel.find({ contractor: contractorId });


  // Calculate the average response time
  let totalResponseTime = 0;
  let count: number = 0;

  quotations.forEach(quotation => {
    totalResponseTime += quotation.responseTime;
    count++;
  });

  const responseTime = totalResponseTime / count;

  console.log('responseTime',responseTime)
  // Format the response time
  let formattedResponseTime = '';

  if (!responseTime) {
    formattedResponseTime = "Not available";
  }
  else if (responseTime <= 2 * 60) {
    formattedResponseTime = "Less than 2 mins";
  } else if (responseTime <= 10 * 60) {
    formattedResponseTime = "Within 10 mins";
  } else if (responseTime <= 60 * 60) {
    formattedResponseTime = `${Math.round(responseTime / (60))} mins`;
  } else if (responseTime <= 2 * 60 * 60) {
    formattedResponseTime = "Greater than 2 hours";
  } else if (responseTime <= 24 * 60 * 60) {
    formattedResponseTime = `${Math.round(responseTime / (60 * 60))} hours`;
  } else if (responseTime <= 48 * 60 * 60) {
    formattedResponseTime = "Greater than 1 day";
  } else {
    formattedResponseTime = "More than 2 days";
  }

  //count jobs
  const jobsCompleted = await JobModel.countDocuments({ contractor: contractorId, status: JOB_STATUS.COMPLETED })
  const jobsCanceled = await JobModel.countDocuments({ contractor: contractorId, status: JOB_STATUS.CANCELED })
  const jobsPending = await JobModel.countDocuments({ contractor: contractorId, status: JOB_STATUS.PENDING })
  const jobsTotal = await JobModel.countDocuments({ contractor: contractorId })

  return { formattedResponseTime, responseTime, jobsCompleted, jobsCanceled, jobsPending, jobsTotal };
};



ContractorSchema.virtual('quiz').get(async function () {
  const latestQuiz: any = await ContractorQuizModel.findOne({ contractor: this._id }).sort({ createdAt: -1 });
  return await latestQuiz?.result ?? null
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

    //@ts-ignore
    if (!options.includeReviews) {
      delete ret.reviews;
    }

    if (!ret.profilePhoto || !ret.profilePhoto.url) {
      ret.profilePhoto = {
        url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png'
      }
    }

    if (ret.accountType == CONTRACTOR_TYPES.Company && ret.companyDetails && ret.companyDetails.companyLogo) {
      ret.profilePhoto = {
        url: ret.companyDetails.companyLogo
      }
    }

    //@ts-ignore
    ret.name = doc.name;
    return ret;
  },
  virtuals: true
});




// ["updateOne", "findByIdAndUpdate", "findOneAndUpdate"]

ContractorSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const filterQuery: FilterQuery<Document> = this.getQuery();
    const update = this.getUpdate();

    if (update && '$set' in update && typeof update.$set === 'object' && update.$set !== null) {
      const profilePhoto = update.profilePhoto;

      if (profilePhoto) {
        const documentBeforeUpdate = await ContractorModel.findOne(filterQuery).exec();
        const previousProfilePhoto = documentBeforeUpdate?.profilePhoto;

        if (previousProfilePhoto) {
          //use JOB here 
          // await deleteObjectFromS3(previousProfilePhoto.url as string)
        }
        console.log('Previous Profile Photo:', previousProfilePhoto);
        console.log('Updated Profile Photo:', profilePhoto);
      }
    }

    next();
  } catch (error) {
    next(error as Error); // Type assertion to Error
  }
});


ContractorSchema.plugin(MongooseDelete, { deletedBy: true, overrideMethods: 'all' });


ContractorSchema.set('toObject', { virtuals: true });



export const ContractorModel = model<IContractor, SoftDeleteModel<IContractor>>("contractors", ContractorSchema);
