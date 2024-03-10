import { validationResult } from "express-validator";
import { Request, Response } from "express";
import AdminRegModel from "../../../database/admin/models/admin.model";
import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";
import ContractorAvailabilityModel from "../../../database/contractor/models/contractorAvaliability.model";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import { sendEmail } from "../../../utils/send_email_utility";
import { adminToContractorAfterDocsValidSendEmailHtmlMailTemplate } from "../../../templates/email/adminToContractorDocValTem";



//get all contractor document awiting for validation /////////////
export const AdminGetContractorDocForValController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
      
      } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id

      const contractorDocs = await ContractorDocumentValidateModel.find({verified: false})

      let pendingDocument = [];

      for (let i = 0; i < contractorDocs.length; i++) {
        const contractorDoc = contractorDocs[i];

        const contractorProfile = await ContractorModel.findOne({_id: contractorDoc.contractorId}).select('-password')

        const obj = {
            contractorDocument: contractorDoc,
            contractorProfile
        }

        pendingDocument.push(obj)
        
      }

      res.json({  
        pendingDocument
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
  }


//get single contractor document awiting for validation /////////////
export const AdminGetSingleContractorDocForValController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        contractorDocsId
      } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id

      const contractorDoc = await ContractorDocumentValidateModel.findOne({_id: contractorDocsId,verified: false})

      if (!contractorDoc) {
        return res
            .status(401)
            .json({ message: "invalid contractor document ID" });
      }

      const contractorProfile = await ContractorModel.findOne({_id: contractorDoc.contractorId}).select('-password')
      
      let pendingDocument = {
        contractorDocument: contractorDoc,
        contractorProfile
      }

      res.json({  
        pendingDocument
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}



//validate contractor document /////////////
export const AdminValidateContractorDocsController = async (
    req: any,
    res: Response,
) => {
  
    try {
      let {  
        contractorDocsId
      } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id

      const contractorDoc = await ContractorDocumentValidateModel.findOne({_id: contractorDocsId,verified: false})

      if (!contractorDoc) {
        return res
            .status(401)
            .json({ message: "invalid artisan document ID" });
      }

      const contractor = await ContractorModel.findOne({_id: contractorDoc.contractorId});
    
      if (!contractor) {
        return res
            .status(401)
            .json({ message: "artisan do not exist" });
      }


      if (contractorDoc.verified) {
        return res
            .status(401)
            .json({ message: "artisan document already verified" });
      }

      contractorDoc.verified = true;
      await contractorDoc.save()

      // contractor.documentVerification = true;
      contractor.status = 'active';
      await contractor.save()

    
      const html = adminToContractorAfterDocsValidSendEmailHtmlMailTemplate(contractor.firstName)

      let emailData = {
        emailTo: admin.email,
        subject: "Document validation",
        html
      };

      await sendEmail(emailData);
     
      res.json({  
        message: "artisan document successfully verified"
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}