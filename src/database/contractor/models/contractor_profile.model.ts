import { Schema, model } from "mongoose";
import { config } from "../../../config";
import { IContractorProfile, IContractorJobPhoto, IContractorJobVideo, IContractorLocation } from "../interface/contractor_profile.interface";


// Define subdocument schemas
const IContractorLocationSchema = new Schema<IContractorLocation>({
  address: String,
  city: String,
  region: String,
  country: String,
  latitude: String,
  longitude: String,
});


const IContractorJobPhotoSchema = new Schema<IContractorJobPhoto>({
  url: String,
  description: String,
  mime: String,
  size: String,
  title: String,
});



const IContractorJobVideoSchema = new Schema<IContractorJobPhoto>({
  url: String,
  description: String,
  mime: String,
  size: String,
  title: String,
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
        required: true, 
      },
      gstType: {
        type: String, 
      },

      profileType: {
        type: String,
      },
      
      location: {
        type: IContractorLocationSchema,
      },

      backgrounCheckConsent: {
        type: Boolean,
      },
      skill: {
        type: String,
      },
     
      website: {
        type: String,
      },
      
      phoneNumber: {
        type: String,
      },
      email: {
        type: String,
      },

      experienceYear: {
        type: Number,
      },

      availableDays: {
        type: Array,
        items: {
          type: String,
        },
      },

      about: {
        type: String,
      },

      profilePhoto: {
        type: Object,
      },

      emergencyJobs: {
        type: Boolean,
      },

      previousJobPhotos: {
        type: [IContractorJobPhotoSchema],
      },

      previousJobVideos: {
        type: [IContractorJobVideoSchema],
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
  