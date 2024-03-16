import { Schema, model } from "mongoose";
import { config } from "../../../config";
import { IContractorProfile, IContractorJobPhoto, IContractorJobVideo, IContractorLocation, IContractorBankDetails } from "../interface/contractor_profile.interface";


// Define subdocument schemas
const ContractorLocationSchema = new Schema<IContractorLocation>({
  address: String,
  city: String,
  region: String,
  country: String,
  latitude: String,
  longitude: String,
});


const ContractorJobPhotoSchema = new Schema<IContractorJobPhoto>({
  url: String,
  description: String,
  mime: String,
  size: String,
  title: String,
});



const ContractorJobVideoSchema = new Schema<IContractorJobPhoto>({
  url: String,
  description: String,
  mime: String,
  size: String,
  title: String,
});



// Subdocument schema for bank details
const BankDetailsSchema = new Schema<IContractorBankDetails>({
  institutionName: String,
  transitNumber: String,
  institutionNumber: String,
  accountNumber: String,
});


const CompanyProfileSchema = new Schema<IContractorProfile>(
    {
    
      contractor: {
        type: Schema.Types.ObjectId, 
        ref: "contractors",
        required: true,
      },

      name: {
        type: String,
        required: true,   
      },

      gstNumber: {
        type: String,
        required: false, 
      },
      gstType: {
        type: String, 
      },

      profileType: {
        type: String,
      },
      
      location: {
        type: ContractorLocationSchema,
      },

      backgroundCheckConsent: {
        type: Boolean,
      },
      skill: {
        type: String,
      },
     
      website: {
        type: String,
      },
      
      email: {
        type: String,
      },

      experienceYear: {
        type: Number,
      },

      availableDays: {
        type: [String],
      },
      isOffDuty: {
        type: Boolean,
      },

      about: {
        type: String,
      },
      emergencyJobs: {
        type: Boolean,
      },

      previousJobPhotos: {
        type: [ContractorJobPhotoSchema],
      },

      previousJobVideos: {
        type: [ContractorJobVideoSchema],
      },

      bankDetails: {
        type: BankDetailsSchema, // Embed the BankDetails subdocument
      },

      certnId: {
        type: String,
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
  
  export const  ContractorProfileModel = model<IContractorProfile>(config.mongodb.collections.contractor_profiles, CompanyProfileSchema);
  