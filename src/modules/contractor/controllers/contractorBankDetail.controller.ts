import { validationResult } from "express-validator";
import { Request, Response } from "express";
import BankDetailModel from "../../../database/contractor/models/contractorBankDetail.model";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";


//contractor enter bank detail/////////////
export const contractorEnterBankdetailController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        financialInstitution,
        accountNumber,
        transitNumber,
        financialInstitutionNumber,
      } = req.body;
  
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

      const checkBackDetail = await BankDetailModel.findOne({contractorId})

      if (checkBackDetail) {
        return res
          .status(401)
          .json({ message: "bank detail already exist" });
      }

      const newBankDetail = new BankDetailModel({
        contractorId,
        financialInstitution,
        accountNumber,
        transitNumber,
        financialInstitutionNumber
      });

      await newBankDetail.save()
  
      res.json({  
        message: "bank detail sucessfully save"
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}



//contractor get bank detail/////////////
export const contractorGetBankDetailController = async (
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
  
      
      const contractor =  req.contractor;
      const contractorId = contractor.id
  
      //get user info from databas
      const contractorExist = await ContractorModel.findOne({_id: contractorId});
  
      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }

      const backDetail = await BankDetailModel.findOne({contractorId})

      if (!backDetail) {
        return res
          .status(401)
          .json({ message: "incorrect credential" });
      }


  
      res.json({  
        backDetail
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}