import { CONTRACTOR_TYPES } from "../contractor/interface/contractor.interface";
import { ContractorModel } from "../contractor/models/contractor.model";
import { ContractorProfileModel } from "../contractor/models/contractor_profile.model";
import CustomerModel from "../customer/models/customer.model";

const contractors = [

  {
    email: "individual@repairfind.com",
    firstName: "Individual",
    lastName: "Contractor",
    dateOfBirth: "23/12/2024",
    password: '$2b$10$34E1yhh/3Z/O1cBn/5seAuyHOBuy/U6uZUH10rhFfAjdJKXehpN2y',
    phoneNumber: {
      code: "+367",
      number: "2344252",
      verifiedAt: new Date()
    },
    profilePhoto: {
      url: "https://dsfds"
    },
    acceptTerms: true,
    accountType: CONTRACTOR_TYPES.Individual,
    passwordOtp: {
      verified: true,
    },
    emailOtp: {
      verified: true,
    },
    profileData: {
      about: "About us here",
      availability: [{
        day: "Monday",
        startTime: "0500",
        endTime: "0900"
      }],
      backgrounCheckConsent: true,
      emergencyJobs: true,
      experienceYear: 5,
      gstNumber: "4442223",
      gstType: "Type",
      location: {
          address: "Toronto, Ontario, Canada",
          latitude: 43.65107,
          longitude: -79.347015
      },
      previousJobPhotos: [
        { url: "https://repairfindbucket.s3-eu-west-3.amazonaws.com/39f0663f-b29f-40ec-9ce5-7b7fa3fbd7c0.jpeg"}
      ],
      previousJobVideos: [
        {
          url: "string",
        }
      ],
      skill: "Plumbing",
      website: "https://skdjfjkfdsjk.com",
      certnId: "5d1aabc8-e9c9-4e99-8b2f-14ac6995f13f"
    },
    certnId: "ebc86274-7d0b-4490-ad8e-060d05e71a95"
  },
 
];

export const ContractorSeeder = async (options: Object) => {
  try {
    contractors.forEach(async (contractor) => {
      let existingContractor = await ContractorModel.findOne({ email: contractor.email });   
      if(existingContractor)return 
      let newContractor = await ContractorModel.findOneAndUpdate({ email: contractor.email }, contractor, { upsert: true, new: true, setDefaultsOnInsert: true });   
      if (newContractor) {
        let newProfile = await ContractorProfileModel.findOneAndUpdate({ contractor: newContractor.id }, {
          contractor: newContractor.id,
          ...contractor.profileData
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        newContractor.profile = newProfile?.id;
        await newContractor.save(); // Make sure to use await here
      }
    });
    return;
  } catch (error) {
    console.log("Error seeding challenge tags", error);
    return;
  }
};


