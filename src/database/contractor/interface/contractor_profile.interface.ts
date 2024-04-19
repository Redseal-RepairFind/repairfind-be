import { Document, Types, ObjectId } from "mongoose";
import { IContractor } from "./contractor.interface";

export interface IContractorJobPhoto  {
  url: string,
  description?: string,
  mime?: string,
  size?: string,
  title?: string
}

export interface IContractorJobVideo extends Document  {
  url: string,
  description?: string
  mime?: string,
  size?: string,
  title?: string
}

export interface IContractorBankDetails  extends Document  {
  institutionName: string,
  transitNumber: string,
  institutionNumber: string,
  accountNumber: string,
}

export interface IContractorGstDetails  extends Document  {
  gstName: string,
  gstNumber: string,
  gstType: string,
  backgroundCheckConsent: boolean
  status: boolean
  approvedBy: string
  approvedAt: string
  
}



export interface IContractorLocation extends Document  {
  address: string,
  city: string,
  region: string,
  country: string,
  latitude: string
  longitude: string,
}

export interface IContractorProfile extends Document {
  _id: ObjectId;
  contractor: IContractor['_id']
  gstName: string;
  gstNumber: string;
  gstType: string;
  location: IContractorLocation
  backgroundCheckConsent: boolean;
  skill: string;
  experienceYear: number;
  about: string;
  website: string;
  email: string;
  emergencyJobs: boolean;
  availableDays: string[],
  isOffDuty?: boolean,
  profileType: string,
  previousJobPhotos:  Array<IContractorJobPhoto>;
  previousJobVideos: Array<IContractorJobVideo>
  bankDetails: IContractorBankDetails
  gstDetails: IContractorGstDetails
  certnId: string;
  createdAt: Date;
  updatedAt: Date;
}

