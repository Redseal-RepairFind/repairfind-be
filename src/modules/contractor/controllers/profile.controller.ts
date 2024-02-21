import { validationResult } from "express-validator";
import { s3FileUpload, uploadToS3 } from "../../../utils/upload.utility";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";
import { sendEmail } from "../../../utils/send_email_utility";
import AdminRegModel from "../../../database/admin/models/adminReg.model";
import SkillRegrModel from "../../../database/admin/models/skill.model";
import fetch from "node-fetch";
import AdminNoficationModel from "../../../database/admin/models/adminNotification.model";
import { htmlContractorDocumentValidatinToAdminTemplate } from "../../../templates/adminEmail/adminContractorDocumentTemplate";
import { htmlContractorDocumentValidatinTemplate } from "../../../templates/contractorEmail/contractorDocumentTemplate";
import { Base } from "../../../abstracts/base.abstract";
import { handleAsyncError } from "../../../abstracts/decorators.abstract";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { IContractorProfile } from "../../../database/contractor/interface/contractor_profile.interface";


class ProfileHandler extends Base {
    @handleAsyncError()
    public async createProfile(): Promise<Response | void> {
        let req = <any>this.req
        let res = this.res
        try {
            const {  
              name,
              gstNumber,
              gstType,
              location,
              backgrounCheckConsent,
              skill,
              website,
              experienceYear,
              about,
              email,
              phoneNumber,
              emergencyJobs,
              availableDays,
              profilePhoto,
              previousJobPhotos,
              previousJobVideos
            } : IContractorProfile = req.body;
      
      
            // Check for validation errors
            const errors = validationResult(req);
        
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
        
            const contractor =  req.contractor;
            const contractorId = contractor.id
        
            const constractor = await ContractorModel.findOne({_id: contractorId});
        
            if (!constractor) {
              return res
                .status(401)
                .json({ message: "invalid credential" });
            }
      

            let certnToken = process.env.CERTN_KEY
      
            if (!certnToken) {
              return res
                .status(401)
                .json({ message: "Certn API Key is missing" });
            }
      
            // let imageUrl =  s3FileUpload(files['profilePhoto'][0]);
            // console.log(imageUrl)
          
            const data = {
              request_enhanced_identity_verification: true,
              request_enhanced_criminal_record_check: true,
              email: constractor.email
            };
      
            const options = {
              method: "POST",
              headers: {
                'Authorization': `Bearer ${certnToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            };
      
            const certn = await fetch("https://api.certn.co/hr/v1/applications/invite/", options)      
            const certnData =  await certn.json()
      
            if (certnData.applicant.status != 'Pending') {
              return res
                .status(401)
                .json({ message: "unable to initialize certn invite" });
            }
      
            
            const profile =  ContractorProfileModel.create({
              contractorId: contractorId,
              name,
              gstNumber,
              gstType,
              location,
              backgrounCheckConsent,
              skill,
              website,
              experienceYear,
              about,
              email,
              phoneNumber,
              emergencyJobs,
              availableDays,
              profilePhoto,
              previousJobPhotos,
              previousJobVideos,
              certnId: certnData.applicant.id
            })
      
            // send email to contractor
            const htmlCon = htmlContractorDocumentValidatinTemplate(contractor.firstName);
            let emailData = {
              emailTo: contractor.email,
              subject: "Document validation from artisan",
              html: htmlCon
            };
      
            sendEmail(emailData);
            
            // send email to admin
            const html = htmlContractorDocumentValidatinToAdminTemplate(contractor.firstName)
            const admins = await AdminRegModel.find();
      
            for (let i = 0; i < admins.length; i++) {
              const admin = admins[i];
              if (admin.validation) {
                let emailData = {
                  emailTo: admin.email,
                  subject: "Document validation from artisan",
                  html
                };
                sendEmail(emailData);
              }
            }
      
          
            res.json({  
              success: true,
              message: "Profile created successfully",
              data: profile
            });
            
          } catch (err: any) {
            console.log("error", err)
            res.status(500).json({ message: err.message });
          }
    }

}


export const ProfileController = (...args: [Request, Response, NextFunction]) =>
    new ProfileHandler(...args);