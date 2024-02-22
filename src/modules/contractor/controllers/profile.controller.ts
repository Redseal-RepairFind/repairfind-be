import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import AdminRegModel from "../../../database/admin/models/adminReg.model";
import { htmlContractorDocumentValidatinToAdminTemplate } from "../../../templates/adminEmail/adminContractorDocumentTemplate";
import { htmlContractorDocumentValidatinTemplate } from "../../../templates/contractorEmail/contractorDocumentTemplate";
import { Base } from "../../../abstracts/base.abstract";
import { handleAsyncError } from "../../../abstracts/decorators.abstract";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { IContractorProfile } from "../../../database/contractor/interface/contractor_profile.interface";
import { initiateCertnInvite } from "../../../services/certn";
import { EmailService } from "../../../services";


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
          
            const data = {
              request_enhanced_identity_verification: true,
              request_enhanced_criminal_record_check: true,
              email: constractor.email
            };
      

            const profile =  await ContractorProfileModel.findOneAndUpdate({contractorId: contractorId},{
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
            }, { upsert: true, new: true, setDefaultsOnInsert: true })

            initiateCertnInvite(data).then(res=>{
              profile.certnId =  res.applicant.id
              profile.save()
              console.log('Certn invitation sent',  profile.certnId)
            })

      

            // send email to contractor 
            // TODO: Emit event and handle email sending from there
            const htmlCon = htmlContractorDocumentValidatinTemplate(contractor.firstName);
            
            EmailService.send(contractor.email, 'New Profile', htmlCon )
            .then(() => console.log('Email sent successfully'))
            .catch(error => console.error('Error sending email:', error));


           
            // send email to admin
            const html = htmlContractorDocumentValidatinToAdminTemplate(contractor.firstName)
            const adminsWithEmails = await AdminRegModel.find().select('email');
            const adminEmails: Array<string> = adminsWithEmails.map(admin => admin.email);
            EmailService.send(adminEmails, 'New Profile Registered', html, adminEmails)
                .then(() => console.log('Emails sent successfully with CC'))
                .catch(error => console.error('Error sending emails:', error));
            

            res.json({  
              success: true,
              message: "Profile created successfully",
              data: profile
            });
            
          } catch (err: any) {
            console.log("error", err)
            res.status(500).json({success: false,  message: err.message });
          }
    }

    @handleAsyncError()
    public async getProfile(): Promise<Response | void> {
      let req = <any>this.req
      let res = this.res 
      try {
            const contractor = req.contractor;
            const contractorId = contractor.id;

            const profile = await ContractorProfileModel.findOne({ contractorId });

            if (!profile) {
                return res.status(404).json({ success: false, message: 'Profile not found' });
            }

            res.json({
                success: true,
                message: 'Profile fetched successfully',
                data: profile,
            });
        } catch (err: any) {
            console.log('error', err);
            res.status(500).json({ success: false, message: err.message });
        }
    }

    @handleAsyncError()
    public async updateProfile(): Promise<Response | void> {
        let req = <any>this.req;
        let res = this.res;
        try {
            const contractor = req.contractor;
            const contractorId = contractor.id;

            const {
                name,
                gstNumber,
                gstType,
                location,
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
            } = req.body;

            const profile = await ContractorProfileModel.findOneAndUpdate(
                { contractorId },
                {
                    name,
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
                },
                { new: true }
            );

            if (!profile) {
                return res.status(404).json({ success: false, message: 'Profile not found' });
            }

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: profile,
            });
        } catch (err: any) {
            console.log('error', err);
            res.status(500).json({ success: false, message: err.message });
        }
    }

}


export const ProfileController = (...args: [Request, Response, NextFunction]) =>
    new ProfileHandler(...args);