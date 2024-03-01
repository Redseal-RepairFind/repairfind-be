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

export interface IContractorBankDetails extends Document  {
  institutionName: string,
  transitNumber: string,
  institutionNumber: string,
  accountNumber: string,
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
  name: string;
  gstNumber: string;
  gstType: string;
  location: IContractorLocation
  
  profilePhoto: {
    type: object
    properties: {
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
    }
  };
  backgrounCheckConsent: boolean;
  skill: string;
  experienceYear: number;
  about: string;
  website: string;
  email: string;
  phoneNumber: string;
  emergencyJobs: boolean;
  availableDays: {
    type: Array<String>,
    items: {
      type: String,
    },
  },
  profileType: string,
  previousJobPhotos:  Array<IContractorJobPhoto>;
  previousJobVideos: Array<IContractorJobVideo>
  bankDetails: IContractorBankDetails

  certnId: string;

  createdAt: Date;
  updatedAt: Date;
}

