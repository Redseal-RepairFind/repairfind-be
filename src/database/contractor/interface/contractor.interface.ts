import { Document, Types, ObjectId } from "mongoose";
import { IStripeCustomer } from "../../common/stripe_customer.interface";
import { IStripeAccount } from "../../common/stripe_account.schema";



export interface IContractorGstDetails  extends Document  {
  gstName: string,
  gstNumber: string,
  gstType: string,
  backgroundCheckConsent: boolean
  status: string
  approvedBy: ObjectId
  approvedAt: Date
  recentRemark: string
  gstCertificate: string
}

export interface IContractorCompanyDetails  extends Document  {
  companyLogo: string,
  companyStaffId: string, //url
  status: string,
  approvedBy: ObjectId,
  approvedAt: Date,
  recentRemark: String,
}

export enum GST_STATUS {
  PENDING= "PENDING",
  REVIEWING = "REVIEWING",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED"
}

export enum CONTRACTOR_ACCOUNT_TYPE {
  Individual = "Individual",
  Company = "Company",
  Employee = "Employee",
}

export enum COMPANY_STATUS {
  PENDING= "PENDING",
  REVIEWING = "REVIEWING",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED"
}



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
    url: {
      type: String,
      required: true,
    },
    label?: {
      type: String,
      unique: true,
    },
    descriptions?: {
      type: Array<string>,
    },
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
  createdAt: Date;
  updatedAt: Date;
  quiz: any;
}
