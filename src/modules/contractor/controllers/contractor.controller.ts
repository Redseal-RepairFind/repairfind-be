import { body, validationResult } from "express-validator";
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
import { IStripeAccount } from "../../../database/common/stripe_account.schema";
import { COMPANY_STATUS, CONTRACTOR_ACCOUNT_TYPE, GST_STATUS, IContractorCompanyDetails, IContractorGstDetails } from "../../../database/contractor/interface/contractor.interface";


class ProfileHandler extends Base {
  @handleAsyncError()
  public async createProfile(): Promise<Response | void> {
    let req = <any>this.req
    let res = this.res
    try {
      let {
        gstName,
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
      } = req.body;

      // Check for validation errors


      const contractorId = req.contractor.id;
      const contractor = await ContractorModel.findOne({ _id: contractorId });

      if (!contractor) {
        return res.status(404).json({ message: "Contractor account not found" });
      }


      // Custom validation function for checking if an array of media objects contains 'url' property
      const validateMediaArray = (value: any): boolean => {
        return Array.isArray(value) && value.every((item) => typeof item === 'object' && 'url' in item && typeof item.url === 'string' && item.url.trim() !== '');
      };


      // Define validation rules for the request body
      // if (contractor.accountType == CONTRACTOR_ACCOUNT_TYPE.Company || contractor.accountType == CONTRACTOR_ACCOUNT_TYPE.Individual) {
      //   await Promise.all([
      //     body("location.address").notEmpty(),          
      //     body("location.latitude").notEmpty().isNumeric(),
      //     body("location.longitude").notEmpty().isNumeric(),
          
      //     body('backgroundCheckConsent')
      //       .exists({ checkFalsy: true }).withMessage('Background consent is required')
      //       .custom((value) => value === true).withMessage('You must consent to us running a background check'),
          
      //     body("skill").notEmpty(),

      //     body("gstDetails.gstNumber").notEmpty(),
      //     body("gstDetails.gstName").notEmpty(),
      //     body("gstDetails.gstType").notEmpty(),
      //     body("gstDetails.gstCertificate").if((value: any, { req }: any) => (req.contractor.accountType) !== 'Company').notEmpty(),
         
         
      //     body("experienceYear").optional().isNumeric(),
      //     body("about").optional(),
      //     body("website").optional().isURL(),
      //     body("email").optional().isEmail(),
      //     body("phoneNumber").optional().isNumeric(),
      //     body("emergencyJobs").notEmpty(),
      //     body("availableDays").notEmpty().isArray(),
      //     body("previousJobPhotos").optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),
      //     body("previousJobVideos").optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),

      //     //  validate only for 'Employee
      //     body("firstName").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) === 'Employee').notEmpty(),
      //     body("lastName").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) === 'Employee').notEmpty(),

      //   ]);
      // }

      // if (contractor.accountType == CONTRACTOR_ACCOUNT_TYPE.Employee) {
      //   await Promise.all([
      //     body("location.address").notEmpty(),          
      //     body("location.latitude").notEmpty().isNumeric(),
      //     body("location.longitude").notEmpty().isNumeric(),
      //     body('backgroundCheckConsent')
      //       .exists({ checkFalsy: true }).withMessage('Background consent is required')
      //       .custom((value) => value === true).withMessage('You must consent to us running a background check'),
      //   ]);
      // }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }



      let certnToken = process.env.CERTN_KEY
      if (!certnToken) {
        return res
          .status(401)
          .json({ message: "Certn API Key is missing" });
      }
      const data = {
        request_enhanced_identity_verification: true,
        request_enhanced_criminal_record_check: true,
        email: contractor.email
      };

      const profileType = contractor.accountType

      const profile = await ContractorProfileModel.findOneAndUpdate({ contractor: contractorId }, {
        contractor: contractorId,
        gstName,
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
        profileType,
        backgroundCheckConsent,
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
        gstName,
        gstType,
        gstNumber,
        website,
        accountType, // for account upgrade
        experienceYear,
        about,
        email,
        location,
        phoneNumber,
        emergencyJobs,
        availableDays,
        previousJobPhotos,
        previousJobVideos,
        skill
      } = req.body;

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const profile = await ContractorProfileModel.find({ contractor: contractorId })

      if (!profile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      await ContractorProfileModel.findOneAndUpdate(
        { contractor: contractorId },
        {
          gstName,
          gstType,
          gstNumber,
          website,
          experienceYear,
          about,
          location,
          email,
          phoneNumber,
          emergencyJobs,
          availableDays,
          previousJobPhotos,
          previousJobVideos,
          skill,
        },
        { new: true }
      );


      if (accountType) {
        contractor.accountType = accountType;
      }

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

      const account = await ContractorModel.findById(contractorId);
      if (!account) {
        return res.status(404).json({ success: false, message: 'Account not found' });
      }

      const {
        firstName,
        lastName,
        companyName,
        profilePhoto,
        phoneNumber,
        dateOfBirth,
      } = req.body;

      let payload = {}
      if (account && account.accountType == 'Company') {
        payload = { profilePhoto, phoneNumber, companyName }
      }

      if (account && account.accountType == 'Individual') {
        payload = { profilePhoto, phoneNumber, firstName, lastName, dateOfBirth }
      }

      if (account && account.accountType == 'Employee') {
        payload = { profilePhoto, phoneNumber, firstName, lastName, dateOfBirth }
      }

      await ContractorModel.findOneAndUpdate(
        { _id: contractorId },
        payload,
        { new: true }
      );


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
  public async getAccount(): Promise<Response | void> {
    let req = <any>this.req
    let res = this.res
    try {
      const contractorId = req.contractor.id;

      let includeStripeIdentity = false;
      let includeStripeCustomer = false;
      let includeStripePaymentMethods = false;
      let includeStripeAccount = false;

      // Parse the query parameter "include" to determine which fields to include
      if (req.query.include) {
        const includedFields = req.query.include.split(',');
        includeStripeIdentity = includedFields.includes('stripeIdentity');
        includeStripeCustomer = includedFields.includes('stripeCustomer');
        includeStripePaymentMethods = includedFields.includes('stripePaymentMethods');
        includeStripeAccount = includedFields.includes('stripeAccount');
      }


      const contractor = await ContractorModel.findById(contractorId).populate('profile');
      if (!contractor) {
        return res.status(404).json({ success: false, message: 'Account not found' });
      }
      const quiz = await contractor.quiz ?? null;

      const contractorResponse = {
        //@ts-ignore
        ...contractor.toJSON({ includeStripeIdentity: true, includeStripeCustomer: true, includeStripePaymentMethods: true, includeStripeAccount: true }), // Convert to plain JSON object
        quiz,
      };



      if (!contractor) {
        return res.status(404).json({ success: false, message: 'Contractor not found' });
      }

      // check if connected account
      if (!contractor.stripeAccount) {
        const stripeAccount = await StripeService.account.createAccount({
          userType: 'contractors',
          userId: contractorId,
          email: contractor.email
        })

        contractor.stripeAccount = {
          id: stripeAccount.id,
          type: stripeAccount.type,
          details_submitted: stripeAccount.details_submitted,
          tos_acceptance: stripeAccount.tos_acceptance,
          payouts_enabled: stripeAccount.payouts_enabled,
          charges_enabled: stripeAccount.charges_enabled,
          country: stripeAccount.country,
          external_accounts: stripeAccount.external_accounts,
        } as IStripeAccount;


        await contractor.save()

      }


      //TODO: for now always update the meta data of stripe customer with this email address
      if (contractor.stripeCustomer) {
        StripeService.customer.updateCustomer(contractor.stripeCustomer.id, {
          metadata: { userType: 'contractors', userId: contractor.id }
        })
      } else {
        StripeService.customer.createCustomer({
          email: contractor.email,
          metadata: {
            userType: 'contractors',
            userId: contractor.id,
          },
          //@ts-ignore
          name: `${contractor.name} `,
          phone: `${contractor.phoneNumber.code}${contractor.phoneNumber.number} `,
        })
      }


      res.json({
        success: true,
        message: 'Account fetched successfully',
        data: contractorResponse,
      });
    } catch (err: any) {
      console.log('error', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  @handleAsyncError()
  public async createStripeAccount(): Promise<Response | void> {
    let req = <any>this.req
    let res = this.res
    try {
      const contractorId = req.contractor.id;
      const contractor = await ContractorModel.findById(contractorId);

      if (!contractor) {
        return res.status(404).json({ success: false, message: 'Contractor not found' });
      }

      let stripeAccountLink = {}
      // check if connected account
      // @ts-ignore
      if (!contractor.stripeAccount || !contractor.stripeAccount.id) {
        const stripeAccount = await StripeService.account.createAccount({
          userType: 'contractors',
          userId: contractorId,
          email: contractor.email
        })

        contractor.stripeAccount = {
          id: stripeAccount.id,
          type: stripeAccount.type,
          details_submitted: stripeAccount.details_submitted,
          tos_acceptance: stripeAccount.tos_acceptance,
          payouts_enabled: stripeAccount.payouts_enabled,
          charges_enabled: stripeAccount.charges_enabled,
          country: stripeAccount.country,
          external_accounts: stripeAccount.external_accounts,
        } as IStripeAccount
        await contractor.save()

        // create account onboarding link 
        // @ts-ignore
        stripeAccountLink = await StripeService.account.createAccountLink(contractor.stripeAccount.id)
        //@ts-ignore
      } else if (!contractor.stripeAccount.payouts_enabled) {
        //@ts-ignore
        stripeAccountLink = await StripeService.account.createAccountLink(contractor.stripeAccount.id)
      }
      else {
        // should create account login link  here if account has already unboarded, but will need to check status shaaa
        // @ts-ignore
        stripeAccountLink = await StripeService.account.createLoginLink(contractor.stripeAccount.id)
      }



      res.json({
        success: true,
        message: 'Stripe connected account create successfully',
        data: stripeAccountLink,
      });
    } catch (err: any) {
      console.log('error', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  @handleAsyncError()
  public async generateStripeAccountDashboardLink(): Promise<Response | void> {
    let req = <any>this.req
    let res = this.res
    try {
      const contractorId = req.contractor.id;
      const contractor = await ContractorModel.findById(contractorId);

      if (!contractor) {
        return res.status(404).json({ success: false, message: 'Contractor not found' });
      }

      let stripeAccountLink = {}
      // check if connected account
      //@ts-ignore
      if (!contractor.stripeAccount || !contractor.stripeAccount.id) {
        const stripeAccount = await StripeService.account.createAccount({
          userType: 'contractors',
          userId: contractorId,
          email: contractor.email
        })

        contractor.stripeAccount = {
          id: stripeAccount.id,
          type: stripeAccount.type,
          details_submitted: stripeAccount.details_submitted,
          tos_acceptance: stripeAccount.tos_acceptance,
          payouts_enabled: stripeAccount.payouts_enabled,
          charges_enabled: stripeAccount.charges_enabled,
          country: stripeAccount.country,
          external_accounts: stripeAccount.external_accounts,
        } as IStripeAccount
        await contractor.save()

        // create account onboarding link 
        // @ts-ignore
        stripeAccountLink = await StripeService.account.createAccountLink(contractor.stripeAccount.id)
      } else {
        // create account onboarding link 
        // @ts-ignore
        stripeAccountLink = await StripeService.account.createLoginLink(contractor.stripeAccount.id)
      }






      res.json({
        success: true,
        message: 'Stripe connected account login link created successfully',
        data: stripeAccountLink,
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
  public async addGstDetails(): Promise<Response | void> {
    let req = <any>this.req
    let res = this.res
    try {
      const { gstName, gstNumber, gstType, backgroundCheckConsent } = req.body;

      // Check for validation errors
      const errors = validationResult(req);


      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Assuming that you have a middleware to attach the contractor ID to the request
      const contractorId: string = req.contractor.id;

      const contractor = await ContractorModel.findById(contractorId);

      if (!contractor) {
        return res.status(404).json({ success: false, message: 'Contractor  not found' });
      }

      // check if gst has already been approved or is reviewing
      if (contractor.gstDetails) {
        if (contractor.gstDetails.status == GST_STATUS.APPROVED) {
          return res.status(400).json({ success: false, message: 'GST has already been approved' });
        }
        if (contractor.gstDetails.status == GST_STATUS.REVIEWING) {
          return res.status(400).json({ success: false, message: 'GST is curretnly been reviewed' });
        }
      }

      // Update the bankDetails subdocument
      contractor.gstDetails = <IContractorGstDetails>{
        gstName,
        gstNumber,
        gstType,
        backgroundCheckConsent,
        status: GST_STATUS.PENDING,
      };

      // Save the updated contractor profile
      await contractor.save();

      res.json({
        success: true,
        message: 'Contractor Gst  details added successfully',
        data: contractor,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }

  }

  @handleAsyncError()
  public async addCompanyDetails(): Promise<Response | void> {
    let req = <any>this.req
    let res = this.res
    try {
      const { companyLogo, companyStaffId } = req.body;

      // Check for validation errors
      const errors = validationResult(req);


      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Assuming that you have a middleware to attach the contractor ID to the request
      const contractorId: string = req.contractor.id;

      const contractor = await ContractorModel.findById(contractorId);

      if (!contractor) {
        return res.status(404).json({ success: false, message: 'Contractor  not found' });
      }

      // check if gst has already been approved or is reviewing
      if (contractor.companyDetails) {
        if (contractor.companyDetails.status == COMPANY_STATUS.APPROVED) {
          return res.status(400).json({ success: false, message: 'Company details has already been approved' });
        }
        if (contractor.companyDetails.status == COMPANY_STATUS.REVIEWING) {
          return res.status(400).json({ success: false, message: 'Company details are curretnly been reviewed' });
        }
      }

      // Update the bankDetails subdocument
      contractor.companyDetails = <IContractorCompanyDetails>{
        companyLogo,
        companyStaffId,
        status: COMPANY_STATUS.PENDING,
      };

      // Save the updated contractor profile
      await contractor.save();

      res.json({
        success: true,
        message: 'Contractor company details added successfully',
        data: contractor,
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
        userType: 'contractors',
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

  @handleAsyncError()
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

      const device = await ContractorDeviceModel.find({ deviceId, deviceToken });
      if (device) {
        //return res.status(404).json({ success: false, message: 'Device already exits' });
      }


      // Find the contractor device with the provided device ID and type
      let contractorDevice = await ContractorDeviceModel.findOneAndUpdate(
        { contractor: contractorId, deviceToken: deviceToken },
        { deviceToken, deviceType },
        { new: true, upsert: true }
      );


      return res.json({ success: true, message: 'Contractor device updated', data: contractorDevice });
    } catch (error: any) {
      console.error('Error creating stripe verification session:', error);
      return res.status(500).json({ success: false, message: error.message ?? 'Internal Server Error' });
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

      const devices = await ContractorDeviceModel.find({ contractor: contractorId })
      return res.json({ success: true, message: 'Contractor deviced retrieved', data: devices });
    } catch (error: any) {
      console.error('Error retrieving contractor devices:', error);
      return res.status(error.code ?? 500).json({ success: false, message: error.message ?? 'Internal Server Error' });
    }
  }


}


export const ContractorController = (...args: [Request, Response, NextFunction]) =>
  new ProfileHandler(...args);