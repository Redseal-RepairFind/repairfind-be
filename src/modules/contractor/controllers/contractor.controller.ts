import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import AdminRegModel from "../../../database/admin/models/admin.model";
import { htmlContractorDocumentValidatinToAdminTemplate } from "../../../templates/adminEmail/adminContractorDocumentTemplate";
import { htmlContractorDocumentValidatinTemplate } from "../../../templates/contractorEmail/contractorDocumentTemplate";
import { Base } from "../../../abstracts/base.abstract";
import { handleAsyncError } from "../../../abstracts/decorators.abstract";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { IContractorBankDetails, IContractorProfile } from "../../../database/contractor/interface/contractor_profile.interface";
import { initiateCertnInvite } from "../../../services/certn";
import { EmailService } from "../../../services";
import { StripeService } from "../../../services/stripe";
import ContractorDeviceModel from "../../../database/contractor/models/contractor_devices.model";


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
        backgroundCheckConsent,
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
        firstName,
        lastName
      } = req.body;

      // Check for validation errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const contractor = req.contractor;
      const contractorId = contractor.id

      const constractor = await ContractorModel.findOne({ _id: contractorId });

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

      const profileType = contractor.accountType

      if (profileType == 'Employee' || profileType == 'Individual') {
        name = `${firstName} ${lastName}`
      }

      const profile = await ContractorProfileModel.findOneAndUpdate({ contractor: contractorId }, {
        contractor: contractorId,
        name,
        gstNumber,
        gstType,
        location,
        backgroundCheckConsent,
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
      contractor.profilePhoto = profilePhoto;
      await contractor.save();


      const contractorResponse = {
        //@ts-ignore
        ...contractor.toJSON(), // Convert to plain JSON object
        profile
      };


      initiateCertnInvite(data).then(res => {
        profile.certnId = res.applicant.id
        profile.save()
        console.log('Certn invitation sent', profile.certnId)
      })



      // send email to contractor 
      // TODO: Emit event and handle email sending from there
      const htmlCon = htmlContractorDocumentValidatinTemplate(contractor.firstName);
      EmailService.send(contractor.email, 'New Profile', htmlCon)
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
      res.status(500).json({ success: false, message: err.message });
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
        accountType, // for account upgrade
        experienceYear,
        about,
        email,
        phoneNumber,
        emergencyJobs,
        profilePhoto,
        availableDays,
        previousJobPhotos,
        previousJobVideos,
      } = req.body;

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

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
          previousJobPhotos,
          previousJobVideos,
        },
        { new: true }
      );

      if (!profile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      if (accountType) {
        contractor.accountType = accountType;
      }
      contractor.profilePhoto = profilePhoto;
      await contractor.save();

      const contractorResponse = {
        //@ts-ignore
        ...contractor.toJSON(), // Convert to plain JSON object
        profile
      };


      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: contractorResponse,
      });
    } catch (err: any) {
      console.log('error', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  @handleAsyncError()
  public async updateAccount(): Promise<Response | void> {
    let req = <any>this.req;
    let res = this.res;
    try {
      const contractor = req.contractor;
      const contractorId = contractor.id;

      const {
        name,
        firstName,
        lastName,
        profilePhoto,
        phoneNumber,
      } = req.body;

      const account = await ContractorModel.findOneAndUpdate(
        { _id: contractorId },
        {
          name,
          firstName,
          lastName,
          profilePhoto,
          phoneNumber
        },
        { new: true }
      );

      if (!account) {
        return res.status(404).json({ success: false, message: 'Account not found' });
      }

      res.json({
        success: true,
        message: 'Account updated successfully',
        data: account,
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
      const contractor = req.contractor;

      // Check if the contractor profile exists
      const profile: IContractorProfile | null = await ContractorProfileModel.findOne({ contractor: contractorId });

      if (!profile) {
        return res.status(404).json({ success: false, message: 'Contractor profile not found' });
      }

      // Update the bankDetails subdocument
      profile.bankDetails = <IContractorBankDetails>{
        institutionName,
        transitNumber,
        institutionNumber,
        accountNumber,
      };

      // Save the updated contractor profile
      await profile.save();

      const contractorResponse = {
        //@ts-ignore
        ...contractor.toJSON(), // Convert to plain JSON object
        profile
      };

      res.json({
        success: true,
        message: 'Contractor profile bank details updated successfully',
        data: contractorResponse,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }

  }


  @handleAsyncError()
  public async changePassword(): Promise<Response> {
    let req = <any>this.req
    let res = this.res
    try {

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { currentPassword, newPassword } = req.body;

      const contractorId = req.contractor.id;

      // Retrieve the user from the database
      const contractor = await ContractorModel.findById(contractorId);

      // Check if the user exists
      if (!contractor) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Check if the current password matches
      const isPasswordValid = await bcrypt.compare(currentPassword, contractor.password);

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      contractor.password = hashedPassword;
      await contractor.save();

      return res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  @handleAsyncError()
  public async createIdentitySession(): Promise<Response> {
    let req = <any>this.req
    let res = this.res
    try {

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { currentPassword, newPassword } = req.body;

      const contractorId = req.contractor.id;

      // Retrieve the user from the database
      const contractor = await ContractorModel.findById(contractorId);

      // Check if the user exists
      if (!contractor) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const verificationSession = await StripeService.identity.createVerificationSession({
        userType: 'contractor',
        userId: contractorId,
        email: contractor.email
      })

      // Update the user's password
      // contractor.password = 'hashedPassword';
      await contractor.save();

      return res.json({ success: true, message: 'Verification session created', data: verificationSession });
    } catch (error: any) {
      console.error('Error creating stripe verification session:', error);
      return res.status(error.code ?? 500).json({ success: false, message: error.message ?? 'Internal Server Error' });
    }
  }

  // @handleAsyncError()
  public async createOrUpdateDevice(): Promise<Response> {
    let req = <any>this.req
    let res = this.res
    try {

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { deviceId, deviceType, deviceToken } = req.body;

      const contractorId = req.contractor.id;

      // Retrieve the user from the database
      const contractor = await ContractorModel.findById(contractorId);

      // Check if the user exists
      if (!contractor) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }


      // Find the contractor device with the provided device ID and type
      let contractorDevice = await ContractorDeviceModel.findOneAndUpdate(
        { contractor: contractorId, deviceId: deviceId },
        { $set: { deviceToken, deviceId, deviceType, } },
        { new: true, upsert:true }
    );


      return res.json({ success: true, message: 'Contractor device updated', data: contractorDevice });
    } catch (error: any) {
      console.error('Error creating stripe verification session:', error);
      return res.status(error.code ?? 500).json({ success: false, message: error.message ?? 'Internal Server Error' });
    }
  }
  
  @handleAsyncError()
  public async myDevices(): Promise<Response> {
    let req = <any>this.req
    let res = this.res
    try {

      const contractorId = req.contractor.id;

      // Retrieve the user from the database
      const contractor = await ContractorModel.findById(contractorId);

      // Check if the user exists
      if (!contractor) {
        return res.status(404).json({ success: false, message: 'Contractor not found' });
      }

      const devices = await ContractorDeviceModel.find({contractor: contractorId})
      return res.json({ success: true, message: 'Contractor deviced retrieved', data: devices });
    } catch (error: any) {
      console.error('Error retrieving contractor devices:', error);
      return res.status(error.code ?? 500).json({ success: false, message: error.message ?? 'Internal Server Error' });
    }
  }

}


export const ProfileController = (...args: [Request, Response, NextFunction]) =>
  new ProfileHandler(...args);