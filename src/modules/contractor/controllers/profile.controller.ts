import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import AdminRegModel from "../../../database/admin/models/adminReg.model";
import { htmlContractorDocumentValidatinToAdminTemplate } from "../../../templates/adminEmail/adminContractorDocumentTemplate";
import { htmlContractorDocumentValidatinTemplate } from "../../../templates/contractorEmail/contractorDocumentTemplate";
import { Base } from "../../../abstracts/base.abstract";
import { handleAsyncError } from "../../../abstracts/decorators.abstract";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { IContractorBankDetails, IContractorProfile } from "../../../database/contractor/interface/contractor_profile.interface";
import { initiateCertnInvite } from "../../../services/certn";
import { EmailService } from "../../../services";


class ProfileHandler extends Base {
    @handleAsyncError()
    public async createProfile(): Promise<Response | void> {
        let req = <any>this.req
        let res = this.res
        try {
            let {  
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
              profileType,
              firstName,
              lastName
            } = req.body;
      
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

            if(profileType == 'Employee'){
              name =  `${firstName} ${lastName}`
            }

            profileType = contractor.accountType
      
            const profile =  await ContractorProfileModel.findOneAndUpdate({contractor: contractorId},{
              contractor: contractorId,
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
              profileType
            }, { upsert: true, new: true, setDefaultsOnInsert: true })

            // Update the ContractorModel with the profile ID
            contractor.profile = profile._id;
            await contractor.save();


            const contractorResponse = {
              //@ts-ignore
             ...contractor.toJSON(), // Convert to plain JSON object
               profile
           };


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
              data: contractorResponse
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

            const profile = await ContractorProfileModel.findOne({ contractor: contractorId }).populate({
              path: 'contractor', // Specify the path to populate
              model: 'contractors', // Specify the model to use for population
            })
            .exec();;

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
                { contractor: contractorId },
                {
                    name,
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


    @handleAsyncError()
    public async getUser(): Promise<Response | void> {
      let req = <any>this.req
      let res = this.res 
      try {
            const contractorId = req.contractor.id;
            const contractor = await ContractorModel.findById(contractorId).populate('profile').exec();
            const quiz = await contractor?.quiz ?? null
            
            const contractorResponse = {
               //@ts-ignore
              ...contractor.toJSON(), // Convert to plain JSON object
                //@ts-ignore
              quiz,
            };

            if (!contractor) {
                return res.status(404).json({ success: false, message: 'Contractor not found' });
            }

            res.json({
                success: true,
                message: 'Account fetchedd successfully',
                data: contractorResponse,
            });
        } catch (err: any) {
            console.log('error', err);
            res.status(500).json({ success: false, message: err.message });
        }
    }

    @handleAsyncError()
    public async updateBankDetails(): Promise<Response | void> {
      let req = <any>this.req
      let res = this.res 
      try {
        const { institutionName, transitNumber, institutionNumber, accountNumber } = req.body;
    
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        // Assuming that you have a middleware to attach the contractor ID to the request
        const contractorId: string = req.contractor.id;
    
        // Check if the contractor profile exists
        const contractorProfile: IContractorProfile | null = await ContractorProfileModel.findOne({ contractor: contractorId });
    
        if (!contractorProfile) {
          return res.status(404).json({ success: false, message: 'Contractor profile not found' });
        }
    
        // Update the bankDetails subdocument
        contractorProfile.bankDetails = <IContractorBankDetails> {
          institutionName,
          transitNumber,
          institutionNumber,
          accountNumber,
        };
    
        // Save the updated contractor profile
        await contractorProfile.save();
    
        res.json({
          success: true,
          message: 'Contractor profile bank details updated successfully',
          data: contractorProfile,
        });
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }

    }

    

}


export const ProfileController = (...args: [Request, Response, NextFunction]) =>
    new ProfileHandler(...args);