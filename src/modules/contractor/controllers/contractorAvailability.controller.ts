import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import ContractorAvailabilityModel from "../../../database/contractor/models/contractorAvaliability.model";


//contractor set avaibility /////////////
export const contractorSetAvailabilityController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        from,
        to,
        days,
        sos
      } = req.body;
  
      const files = req.files;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const contractor =  req.contractor;
      const contractorId = contractor.id
  
      //get user info from databas
      const contractorExist = await ContractorModel.findOne({_id: contractorId});
  
      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }

      if (!contractorExist.documentVerification) {
        return res
          .status(401)
          .json({ message: "document not yet verified" });
      }

      const checkNumberOfavailabilty = await ContractorAvailabilityModel.countDocuments({contractorId})

      if (checkNumberOfavailabilty >= 7) {
        return res
        .status(401)
        .json({ message: "maximun number of availability reach" });
      }

    
      for (let i = 0; i < days.length; i++) {
        const day = days[i];

        const checkNumberOfavailabilty = await ContractorAvailabilityModel.countDocuments({contractorId})
        
        if (checkNumberOfavailabilty >= 7) break

        const newAvailable = new ContractorAvailabilityModel({
          contractorId,
          avialable: "yes",
          time: {
            from,
            to,
            sos,
            day
          }
        })
  
        await newAvailable.save()
        
      }
  
      res.json({  
        message: "availability successfully set",
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
  }



  
//contractor set not avaibility /////////////
export const contractorSetNotAvailabilityController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        from,
        to,
        days
      } = req.body;
  
      const files = req.files;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const contractor =  req.contractor;
      const contractorId = contractor.id
  
      //get user info from databas
      const contractorExist = await ContractorModel.findOne({_id: contractorId});
  
      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }

      for (let i = 0; i < days.length; i++) {
        const day = days[i];

        const newNotAvailable = new ContractorAvailabilityModel({
          contractorId,
          avialable: "no",
          time: {
            from,
            to,
            sos: false,
            day
          }
        })
  
        await newNotAvailable.save()
        
      }

      res.json({  
        message: "not availability successfully set",
      });
      
    } catch (err: any) {
      // signup error
      console.log(err)
      res.status(500).json({ message: err.message });
    }
  
  }



//contractor delete availability /////////////
export const contractorDeleteAvailabilityController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      avaibilityId
    } = req.body;

    const files = req.files;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const deleteAvailable = await ContractorAvailabilityModel.findOneAndDelete({_id: avaibilityId}, {new: true})

    if (!deleteAvailable) {
      return res
        .status(401)
        .json({ message: "incorrect availability ID" });
    }

    res.json({  
      message: "availability successfully remove",
    });
    
  } catch (err: any) {
    // signup error
    console.log(err)
    res.status(500).json({ message: err.message });
  }

}


//contractor edit availability /////////////
export const contractorEditAvailabilityController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      avaibilityId,
      avialable,
      from,
      to,
      sos,
      day
    } = req.body;

    const files = req.files;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const availability = await ContractorAvailabilityModel.findOne({_id: avaibilityId})

    if (!availability) {
      return res
        .status(401)
        .json({ message: "incorrect availability ID" });
    }

    availability.avialable = avialable
    availability.time.from = from
    availability.time.to = to
    availability.time.sos = sos
    availability.time.day = day

    await availability.save()

    res.json({  
      message: "availability successfully updated",
    });
    
  } catch (err: any) {
    // signup error
    console.log(err)
    res.status(500).json({ message: err.message });
  }

}