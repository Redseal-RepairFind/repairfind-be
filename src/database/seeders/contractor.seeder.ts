import { CONTRACTOR_ACCOUNT_TYPE } from "../contractor/interface/contractor.interface";
import { ContractorModel } from "../contractor/models/contractor.model";
import { ContractorProfileModel } from "../contractor/models/contractor_profile.model";
import CustomerModel from "../customer/models/customer.model";

const contractors = [
  {
    email: "employee@repairfind.com",
    firstName: "Employee",
    lastName: "Contractor",
    dateOfBirth: "23/12/2024",
    password: '$2b$10$34E1yhh/3Z/O1cBn/5seAuyHOBuy/U6uZUH10rhFfAjdJKXehpN2y',
    phoneNumber: {
      code: "+367",
      number: "2344252"
    },
    profilePhoto: {
      url: "https://dsfds"
    },
    acceptTerms: true,
    accountType: CONTRACTOR_ACCOUNT_TYPE.Employee,
    passwordOtp: {
      verified: true,
    },
    emailOtp: {
      verified: true,
    },
    profileData: {
      location: {
        address: "Logics Senct",
        latitude: "12323123123",
        longitude: "2123213213213",
      },
      name: "Behd Guyt",
      profileType: "Employee",
    }
  },
  {
    email: "employee_upgraded@repairfind.com",
    firstName: "Upgraded",
    lastName: "Employee",
    dateOfBirth: "23/12/2024",
    password: '$2b$10$34E1yhh/3Z/O1cBn/5seAuyHOBuy/U6uZUH10rhFfAjdJKXehpN2y',
    phoneNumber: {
      code: "+367",
      number: "2344252"
    },
    profilePhoto: {
      url: "https://dsfds"
    },
    acceptTerms: true,
    accountType: CONTRACTOR_ACCOUNT_TYPE.Employee,
    passwordOtp: {
      verified: true,
    },
    emailOtp: {
      verified: true,
    },
    profileData: {
      about: "About us here",
      availableDays: [
        "Monday",
        "Tuesday"
      ],
      backgrounCheckConsent: true,
      emergencyJobs: true,
      experienceYear: 5,
      gstNumber: "4442223",
      gstType: "Type",
      location: {
        address: "Logics Senct",
        latitude: "12323123123",
        longitude: "2123213213213",
      },
      name: "Behd",
      phoneNumber: "3234234",
      previousJobPhotos: [
        {
          url: "string",
        }
      ],
      previousJobVideos: [
        {
          url: "string",
        }
      ],
      profileType: "Company",
      skill: "Plumber",
      website: "https://skdjfjkfdsjk.com",
      certnId: "5d1aabc8-e9c9-4e99-8b2f-14ac6995f13f"
    }
  },
  {
    email: "individual@repairfind.com",
    firstName: "Individual",
    lastName: "Contractor",
    dateOfBirth: "23/12/2024",
    password: '$2b$10$34E1yhh/3Z/O1cBn/5seAuyHOBuy/U6uZUH10rhFfAjdJKXehpN2y',
    phoneNumber: {
      code: "+367",
      number: "2344252"
    },
    profilePhoto: {
      url: "https://dsfds"
    },
    acceptTerms: true,
    accountType: CONTRACTOR_ACCOUNT_TYPE.Individual,
    passwordOtp: {
      verified: true,
    },
    emailOtp: {
      verified: true,
    },
    profileData: {
      about: "About us here",
      availableDays: [
        "Monday",
        "Tuesday"
      ],
      backgrounCheckConsent: true,
      emergencyJobs: true,
      experienceYear: 5,
      gstNumber: "4442223",
      gstType: "Type",
      location: {
        address: "Logics Senct",
        latitude: "12323123123",
        longitude: "2123213213213",
      },
      name: "Behd",
      phoneNumber: "3234234",
      previousJobPhotos: [
        {
          url: "string",
        }
      ],
      previousJobVideos: [
        {
          url: "string",
        }
      ],
      profileType: "Individual",
      skill: "Plumber",
      website: "https://skdjfjkfdsjk.com",
      certnId: "5d1aabc8-e9c9-4e99-8b2f-14ac6995f13f"
    }
  },
  {
    email: "company@repairfind.com",
    companyName: "Company",
    dateOfBirth: "23/12/2024",
    password: '$2b$10$34E1yhh/3Z/O1cBn/5seAuyHOBuy/U6uZUH10rhFfAjdJKXehpN2y',
    phoneNumber: {
      code: "+367",
      number: "2344252"
    },
    profilePhoto: {
      url: "https://dsfds"
    },
    acceptTerms: true,
    accountType: CONTRACTOR_ACCOUNT_TYPE.Company,
    passwordOtp: {
      verified: true,
    },
    emailOtp: {
      verified: true,
    },
    profileData: {
      about: "About us here",
      availableDays: [
        "Monday",
        "Tuesday"
      ],
      backgrounCheckConsent: true,
      emergencyJobs: true,
      experienceYear: 5,
      gstNumber: "4442223",
      gstType: "Type",
      location: {
        address: "Logics Senct",
        latitude: "12323123123",
        longitude: "2123213213213",
      },
      name: "Behd",
      phoneNumber: "3234234",
      previousJobPhotos: [
        {
          url: "string",
        }
      ],
      previousJobVideos: [
        {
          url: "string",
        }
      ],
      profileType: "Company",
      skill: "Plumber",
      website: "https://skdjfjkfdsjk.com",
      certnId: "5d1aabc8-e9c9-4e99-8b2f-14ac6995f13f"
    }
  }
];

export const ContractorSeeder = async (options: Object) => {
  try {
    contractors.forEach(async (contractor) => {
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


