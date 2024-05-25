import { Document, Types, ObjectId } from "mongoose";
import { IStripeCustomer } from "../../common/stripe_customer.interface";
import { IStripeAccount } from "../../common/stripe_account.schema";



export interface IContractorGstDetails extends Document {
  gstName: string,
  gstNumber: string,
  gstType: string,
  backgroundCheckConsent: boolean
  status: string
  approvedBy: ObjectId
  approvedAt: Date
  recentRemark: string
  gstCertificate: string
  statusReason: string
}

export interface IContractorCompanyDetails extends Document {
  companyLogo: string,
  companyStaffId: string, //url
  status: string,
  approvedBy: ObjectId,
  approvedAt: Date,
  recentRemark: String,
}


export interface IContractorCertnDetails {
  id: string;
  created: string;
  modified: string;
  is_submitted: boolean;
  applicant_type: string;
  check_executions: {
    id: string;
    check_name: string;
    status: string;
  }[];
  result: string;
  result_label: string;
  report_status: string;
  applicant_account: {
    id: string;
    email: string;
    email_verified: boolean;
    phone_number: string | null;
  };
  application: {
    created: string;
    modified: string;
    id: string;
    applicant: {
      id: string;
      status: string;
      email: string;
      phone_number: string | null;
      application_url: string,
      report_url: string,
    };
    owner: {
      id: string;
      email: string;
    };
  };
  adjudication_status: string;
  adjudication_status_label: string;
  is_favourite: boolean;
  reliability_risk: string | null;
  workplace_misconduct: string | null;
  early_termination: string | null;
  applicant_result_summary: string;
  social_result_summary: string;
  identity_verified_summary: string;
  status: string;
  status_label: string;
}


export enum GST_STATUS {
  PENDING = "PENDING",
  REVIEWING = "REVIEWING",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED"
}

export enum CONTRACTOR_TYPES {
  Individual = "Individual",
  Company = "Company",
  Employee = "Employee",
}

export enum COMPANY_STATUS {
  PENDING = "PENDING",
  REVIEWING = "REVIEWING",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED"
}



// export enum CONTRACTOR_REVIEW_TYPE {
//   JOB_COMPLETION = "JOB_COMPLETION",
//   JOB_CANCELETION = "JOB_CANCELETION"
// }



// export interface IContractorReview {
//   customer?: ObjectId; // Optional: ObjectId referencing the User who left the rating
//   averageRating: number; // avaraged from the items in ratings array
//   ratings?: Array<{ item: string; rating: number }>; //Rating value (e.g., 1-5 stars)
//   review?: string; // Optional: Textual feedback
//   job?: ObjectId; // Optional: Textual feedback
//   createdAt: Date;
//   type: string;
// }

// reviews?: Array<{ item: string; rating: number }> = [
//   { item: "Professionalism", rating: 2 },
//   { item: "Cleanliness", rating: 5 }
// ];

export interface IContractor extends Document {
  _id: ObjectId;
  profile: ObjectId;
  firstName: string;
  lastName: string;
  name: string;
  companyName: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  status: string;
  phoneNumber: {
    code: string,
    number: string
  };
  accountType: string;
  profilePhoto: {
    url: String,
    label?: String,
    descriptions?: Array<string>,
  };
  acceptTerms: Boolean;
  passwordOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  emailOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  phoneNumberOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  stripeCustomer: IStripeCustomer
  stripeIdentity: object,
  stripeAccount: IStripeAccount,
  stripePaymentMethods: Array<object>,
  gstDetails: IContractorGstDetails
  companyDetails: IContractorCompanyDetails
  certnDetails: IContractorCertnDetails
  reviews: Array<{review: ObjectId, averageRating: number}>,
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  quiz: any;
  stripeAccountStatus: {
    details_submitted: boolean,
    payouts_enabled: boolean,
    charges_enabled: boolean,
    transfers_enabled: boolean,
    card_payments_enabled: boolean,
  } | null,
  onboarding: {
    hasStripeAccount: boolean,
    hasStripeIdentity: boolean,
    hasStripePaymentMethods: boolean,
    hasStripeCustomer: boolean,
    hasProfile: boolean,
    hasGstDetails: boolean,
    hasCompanyDetails: boolean
    hasPassedQuiz: boolean
    stage: Object
  };
  certnId: string;
  getOnboarding: () => {
    hasStripeAccount: boolean,
    hasStripeIdentity: boolean,
    hasStripePaymentMethods: boolean,
    hasStripeCustomer: boolean,
    hasProfile: boolean,
    hasGstDetails: boolean,
    hasCompanyDetails: boolean
    hasPassedQuiz: boolean
    stage: number
  };

}
