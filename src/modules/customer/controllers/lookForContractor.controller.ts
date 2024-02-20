import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";
import ContractorAvailabilityModel from "../../../database/contractor/models/contractorAvaliability.model";
import ContractorRegModel from "../../../database/contractor/models/contractor.model";
import ContractorRatingModel from "../../../database/contractor/models/contractorRating.model";
import BankDetailModel from "../../../database/contractor/models/contractorBankDetail.model";

const days = [
  'Sunday', 'Monday', 'Tuesday', 'Wednessday', 'Thurday', 'Wednessday', 'Friday', 'Saturday'
]
//get pupular contractor /////////////
export const customerGetPopularContractorController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        
      } = req.body;

  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const customer =  req.customer;
      const customerId = customer.id

      const pipeline: any[] = [
        {
          $group: {
            _id: '$skill',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 5,
        },
      ];
  
      const poplar = await ContractorDocumentValidateModel.aggregate(pipeline);
 
    
      res.json({  
        poplar
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
  }


//search for contractor /////////////
export const customerSearchForContractorController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        
      } = req.body;
  
      const { skill } = req.query;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const customer =  req.customer;
      const customerId = customer.id

      const contractors = [];
  
      const searchContractors = await ContractorDocumentValidateModel.find({ skill: { $regex: new RegExp(skill, 'i') }, verified: true });

      for (let i = 0; i < searchContractors.length; i++) {
        const searchContractor = searchContractors[i];

        if (!searchContractor.verified) continue

        const bankDetail = await BankDetailModel.findOne({contractorId: searchContractor.contractorId})
        if (!bankDetail) continue

        const contractor = await ContractorRegModel.findOne({_id: searchContractor.contractorId})
        if (!contractor) continue

        if (contractor.status != 'active') continue

        if (!contractor.documentVerification) continue

        const availability = await ContractorAvailabilityModel.find({contractorId: searchContractor.contractorId});
        if (availability.length < 1) continue

        let rating = null;

        const contractorRating = await ContractorRatingModel.findOne({contractorId: searchContractor.contractorId})
        if (contractorRating) {
          rating = contractorRating
        }

        const obj = {
          contractor: searchContractor,
          rating,
          availability: availability
        }

        contractors.push(obj)
        
      }
  
      res.json({  
        contractors
      });
      
    } catch (err: any) {
      // signup error
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
  }


//get contractors on skill /////////////
export const customerGetAllContractorOnSkillController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    const {skill} = req.query

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const contractorWithSkills = await ContractorDocumentValidateModel.find({ skill, verified: true },);

    let contractors = [];

    for (let i = 0; i < contractorWithSkills.length; i++) {
      const contractorWithSkill = contractorWithSkills[i];
      const contractoAvailabilitys = await ContractorAvailabilityModel.find({contractorId: contractorWithSkill.contractorId})

      if (contractoAvailabilitys.length < 1) continue

      const contractorProfile = await ContractorRegModel.findOne({_id: contractorWithSkill.contractorId}).select('-password');
      if (contractorProfile?.status != 'active') continue

      if (!contractorProfile.documentVerification) continue

      const bankDetail = await BankDetailModel.findOne({contractorId: contractorWithSkill.contractorId})
      if (!bankDetail) continue

      let rating = null;

      const contractorRating = await ContractorRatingModel.findOne({contractorId: contractorWithSkill.contractorId})
      if (contractorRating) {
        rating = contractorRating
      }
        
      const obj = {
        contractorDetail: contractorWithSkill,
        profile: contractorProfile,
        rating,
        availability: contractoAvailabilitys
      }

      contractors.push(obj)
    }

    res.json({  
      contractors
    });
    
  } catch (err: any) {
    // signup error
    console.log("erorr", err)
    res.status(500).json({ message: err.message });
  }

}


//customer get single contractor contractors on skill /////////////
export const customerGetSingleContractorOnSkillController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    const {
      skill,
      contractorId
    } = req.query

    const files = req.files;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const contractorWithSkill = await ContractorDocumentValidateModel.findOne({ skill, contractorId, verified: true});

    if (!contractorWithSkill) {
      return res
      .status(401)
      .json({ message: "artisan with this skill do not exist" });
    }

    const contractoAvailabilitys = await ContractorAvailabilityModel.find({contractorId: contractorWithSkill.contractorId})
    if (contractoAvailabilitys.length < 1) {
      return res
      .status(401)
      .json({ message: "artisan with this skill do not exist" });
    }

    const contractorProfile = await ContractorRegModel.findOne({_id: contractorWithSkill.contractorId}).select('-password');
    if (!contractorProfile) {
      return res
      .status(401)
      .json({ message: "artisan with this skill do not exist" });
    }

    if (contractorProfile.status != 'active') {
      return res
      .status(401)
      .json({ message: "artisan with this skill do not exist" });
    }

    if (!contractorProfile.documentVerification) {
      return res
      .status(401)
      .json({ message: "artisan with this skill do not exist" });
    }

    const bankDetail = await BankDetailModel.findOne({contractorId: contractorWithSkill.contractorId})
    if (!bankDetail) {
      return res
      .status(401)
      .json({ message: "artisan with this skill do not exist" });
    }

    let rating = null;

    const contractorRating = await ContractorRatingModel.findOne({contractorId: contractorWithSkill.contractorId})
    if (contractorRating) {
      rating = contractorRating
    }
      

    const artisan = {
      contractorDetail: contractorWithSkill,
      profile: contractorProfile,
      rating,
      availability: contractoAvailabilitys
    }

    res.json({  
      artisan
    });
    
  } catch (err: any) {
    // signup error
    console.log("erorr", err)
    res.status(500).json({ message: err.message });
  }

}


