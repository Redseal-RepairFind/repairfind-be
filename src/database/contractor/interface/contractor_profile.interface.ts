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

export interface IContractorAvailability  extends Document  {
  day: string,
  startTime: string,
  endTime: string,
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
  location: IContractorLocation
  skill: string;
  experienceYear: number;
  about: string;
  website: string;
  email: string;
  emergencyJobs: boolean;
  availability: IContractorAvailability[],
  isOffDuty?: boolean,
  profileType: string,
  previousJobPhotos:  Array<IContractorJobPhoto>;
  previousJobVideos: Array<IContractorJobVideo>
  bankDetails: IContractorBankDetails
  certnId: string;
  createdAt: Date;
  updatedAt: Date;
}

