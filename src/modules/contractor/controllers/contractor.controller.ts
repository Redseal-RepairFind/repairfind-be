import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import AdminRegModel from "../../../database/admin/models/admin.model";
import { Base } from "../../../abstracts/base.abstract";
import { handleAsyncError } from "../../../abstracts/decorators.abstract";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { IContractorBankDetails, IContractorProfile } from "../../../database/contractor/interface/contractor_profile.interface";
import { CertnService, EmailService } from "../../../services";
import { StripeService } from "../../../services/stripe";
import ContractorDeviceModel from "../../../database/contractor/models/contractor_devices.model";
import { IStripeAccount } from "../../../database/common/stripe_account.schema";
import { COMPANY_STATUS, CONTRACTOR_TYPES, GST_STATUS, IContractorCompanyDetails, IContractorGstDetails } from "../../../database/contractor/interface/contractor.interface";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import { JOB_STATUS, JobModel } from "../../../database/common/job.model";
import BlacklistedToken from "../../../database/common/blacklisted_tokens.schema";
import { Logger } from "../../../services/logger";
import { applyAPIFeature } from "../../../utils/api.feature";
import { ReviewModel } from "../../../database/common/review.model";
import { FeedbackModel } from "../../../database/common/feedback.model";
import { AdminEvent } from "../../../events/admin.events";
import { MessageModel, MessageType } from "../../../database/common/messages.schema";
import { AccountEvent, ConversationEvent } from "../../../events";
import { ABUSE_REPORT_TYPE, AbuseReportModel } from "../../../database/common/abuse_reports.model";
import { BLOCK_USER_REASON, BlockedUserModel } from "../../../database/common/blocked_users.model";
import { BlockedUserUtil } from "../../../utils/blockeduser.util";
import { ConversationUtil } from "../../../utils/conversation.util";
import { GeneratorUtil } from "../../../utils/generator.util";


class ProfileHandler extends Base {

  @handleAsyncError()
  public async createProfile(): Promise<Response | void> {
    let req = <any>this.req
    let res = this.res

    try {
      let {
        location,
        backgroundCheckConsent,
        skill,
        website,
        experienceYear,
        about,
        email,
        phoneNumber,
        emergencyJobs,
        availability,
        profilePhoto,
        previousJobPhotos,
        previousJobVideos,
      } = req.body;

      // Check for validation errors


      const contractorId = req.contractor.id;
      const contractor = await ContractorModel.findById(contractorId);

      if (!contractor) {
        return res.status(404).json({ message: "Contractor account not found" });
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let payload = {}

      if ((contractor.accountType == CONTRACTOR_TYPES.Company) || (contractor.accountType == CONTRACTOR_TYPES.Individual)) {
        payload = {
          contractor: contractorId,
          location,
          skill,
          website,
          experienceYear,
          about,
          email,
          phoneNumber,
          emergencyJobs,
          availability,
          profilePhoto,
          previousJobPhotos,
          previousJobVideos,
          backgroundCheckConsent,
        }
      }

      if (contractor.accountType == CONTRACTOR_TYPES.Employee) {
        payload = {
          contractor: contractorId,
          location,
          backgroundCheckConsent,
        }
      }

      const profile = await ContractorProfileModel.findOneAndUpdate({ contractor: contractorId }, {
        ...payload
      }, { upsert: true, new: true, setDefaultsOnInsert: true })

      // Update the ContractorModel with the profile ID
      contractor.profile = profile._id;
      
      await contractor.save();
      contractor.onboarding = await contractor.getOnboarding()

      const contractorResponse = {
        ...contractor.toJSON(),
        profile
      };




      if (contractor.accountType == CONTRACTOR_TYPES.Individual) {
        const data: any = {
          request_enhanced_identity_verification: true,
          request_enhanced_criminal_record_check: true,
          email: contractor.email,
          information: {
            first_name: contractor.firstName,
            last_name: contractor.lastName,
          }
        };

        if (['Electrical', '⁠⁠Mechanical (HVAC)'].includes(skill.trim())) {
          data.request_credential_verification = true
          data.information.credentials = [
            { certification: 'Certificate of Qualification', description: skill }
          ]

        }


        if (!contractor.certnId) {
          CertnService.initiateCertnInvite(data).then(res => {
            contractor.certnId = res.applicant.id
            contractor.save()
            Logger.info('Certn invitation sent', contractor.certnId)
          })
        }

      }

      return res.json({
        success: true,
        message: "Profile created successfully",
        data: contractorResponse
      });

    } catch (err: any) {
      console.log("error", err)
      return res.status(500).json({ success: false, message: err.message });
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
        website,
        experienceYear,
        about,
        email,
        location,
        phoneNumber,
        emergencyJobs,
        availability,
        previousJobPhotos,
        previousJobVideos,
        profilePhoto,
        backgroundCheckConsent,
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

      let payload = {}
      if (contractor.accountType == CONTRACTOR_TYPES.Company || contractor.accountType == CONTRACTOR_TYPES.Individual) {
        payload = {
          contractor: contractorId,
          location,
          skill,
          website,
          experienceYear,
          about,
          email,
          phoneNumber,
          emergencyJobs,
          availability,
          profilePhoto,
          previousJobPhotos,
          previousJobVideos,
          backgroundCheckConsent,
        }
      }

      if (contractor.accountType == CONTRACTOR_TYPES.Employee) {
        payload = {
          contractor: contractorId,
          location,
          backgroundCheckConsent,
        }
      }



      await ContractorProfileModel.findOneAndUpdate(
        { contractor: contractorId },
        { ...payload },
        { new: true }
      );

      await contractor.save();
      contractor.onboarding = await contractor.getOnboarding()
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
  public async upgradeEmployeeProfile(): Promise<Response | void> {
    let req = <any>this.req;
    let res = this.res;
    let next = this.next;
    try {
      const contractor = req.contractor;
      const contractorId = contractor.id;

      const {
        gstDetails,
        website,
        experienceYear,
        about,
        email,
        location,
        phoneNumber,
        emergencyJobs,
        availability,
        previousJobPhotos,
        previousJobVideos,
        skill
      } = req.body;


      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const profile = await ContractorProfileModel.findOneAndUpdate(
        { contractor: contractorId },
        {
          website,
          experienceYear,
          about,
          location,
          email,
          phoneNumber,
          emergencyJobs,
          availability,
          previousJobPhotos,
          previousJobVideos,
          skill,
        },
        { new: true }
      );


      contractor.accountType = CONTRACTOR_TYPES.Individual;
      contractor.gstDetails = gstDetails;
      await contractor.save();
      contractor.onboarding = await contractor.getOnboarding()

      const contractorResponse = {
        ...contractor.toJSON(), // Convert to plain JSON object
        profile
      };


      res.json({
        success: true,
        message: 'Profile upgraded successfully',
        data: contractorResponse,
      });
    } catch (err: any) {
      console.log('error', err);
      res.status(500).json({ success: false, message: err.message });
      next(new BadRequestError('An error occurred', err))
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
        language
      } = req.body;

      let payload = {}
      if (account && account.accountType == 'Company') {
        payload = { profilePhoto, phoneNumber, companyName, language }
      }

      if (account && account.accountType == 'Individual') {
        payload = { profilePhoto, phoneNumber, firstName, lastName, dateOfBirth, language }
      }

      if (account && account.accountType == 'Employee') {
        payload = { profilePhoto, phoneNumber, firstName, lastName, dateOfBirth, language }
      }

      const updatedContractor = await ContractorModel.findOneAndUpdate(
        { _id: contractorId },
        payload,
        { new: true, upsert: true }
      );

      AccountEvent.emit('ACCOUNT_UPDATED', {user: updatedContractor, userType: 'contractors' })
      
      updatedContractor.onboarding = await account.getOnboarding()
      res.json({
        success: true,
        message: 'Account updated successfully',
        data: updatedContractor,
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

      contractor.onboarding = await contractor.getOnboarding()
      const quiz = await contractor.quiz ?? null;

      contractor.stats = await contractor.getStats();

      const contractorResponse = {
        //@ts-ignore
        ...contractor.toJSON({ includeStripeIdentity: true, includeStripeCustomer: true, includeStripePaymentMethods: true, includeStripeAccount: true, includeReviews: { status: true, limit: 20 } }), // Convert to plain JSON object
        quiz,
      };



      if (!contractor) {
        return res.status(404).json({ success: false, message: 'Contractor not found' });
      }

      // check if connected account
      if (!contractor.stripeAccount) {
      }

      if (contractor.accountType == CONTRACTOR_TYPES.Individual) {
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
          phone: `${contractor?.phoneNumber?.code}${contractor?.phoneNumber?.number} `,
        })
      }


      await contractor.save()

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
        // should create account login link  here if account has already onboard, but will need to check status
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
      const { gstName, gstNumber, gstType, backgroundCheckConsent, gstCertificate } = req.body;

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
          return res.status(400).json({ success: false, message: 'GST is currently been reviewed' });
        }
      }

      // Update the bankDetails subdocument
      contractor.gstDetails = <IContractorGstDetails>{
        gstName,
        gstNumber,
        gstCertificate,
        gstType,
        backgroundCheckConsent,
        status: GST_STATUS.PENDING,
      };

      // Save the updated contractor profile
      await contractor.save();
      contractor.onboarding = await contractor.getOnboarding()
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
          return res.status(400).json({ success: false, message: 'Company details are currently been reviewed' });
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
      contractor.onboarding = await contractor.getOnboarding()

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
      contractor.onboarding = await contractor.getOnboarding()

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
      contractor.onboarding = await contractor.getOnboarding()

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
      const { deviceId, deviceType, deviceToken, expoToken, appVersion } = req.body;

      const contractorId = req.contractor.id;

      // Retrieve the user from the database
      const contractor = await ContractorModel.findById(contractorId);

      // Check if the user exists
      if (!contractor) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }


      // Find the contractor device with the provided device ID and type
      let contractorDevice = await ContractorDeviceModel.findOneAndUpdate(
        { contractor: contractorId, deviceId },
        { deviceToken, expoToken, deviceType, appVersion, contractor: contractorId, deviceId },
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
      return res.json({ success: true, message: 'Contractor devices retrieved', data: devices });
    } catch (error: any) {
      console.error('Error retrieving contractor devices:', error);
      return res.status(error.code ?? 500).json({ success: false, message: error.message ?? 'Internal Server Error' });
    }
  }

  @handleAsyncError()
  public async myReviews(): Promise<Response> {
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

      let filter: any = { contractor: contractorId };
      const { data, error } = await applyAPIFeature(ReviewModel.find(filter).populate(['customer']), req.query);

      if (data) {
        await Promise.all(data.data.map(async (review: any) => {
          review.heading = await review.getHeading()
        }));
      }

      return res.json({ success: true, message: 'Contractor reviews retrieved', data: data });
    } catch (error: any) {
      console.error('Error retrieving contractor devices:', error);
      return res.status(error.code ?? 500).json({ success: false, message: error.message ?? 'Internal Server Error' });
    }
  }

  @handleAsyncError()
  public async deleteAccount(): Promise<Response | void> {
    let req = <any>this.req;
    let res = this.res;
    try {
      const contractor = req.contractor;
      const contractorId = contractor.id;

      const account = await ContractorModel.findOne({ _id: contractorId });
      if (!account) {
        return res.status(404).json({ success: false, message: 'Account not found' });
      }

      // perform checks here
      const bookedJobs = await JobModel.find({ contractor: contractorId, status: { $in: [JOB_STATUS.BOOKED] } })
      if (bookedJobs.length > 0) {
        return res.status(400).json({ success: false, message: 'You have an active Job, account cannot be deleted', data: bookedJobs });
      }

      const disputedJobs = await JobModel.find({ contractor: contractorId, status: { $in: [JOB_STATUS.DISPUTED] } })
      if (disputedJobs.length > 0) {
        return res.status(400).json({ success: false, message: 'You have an pending dispute, account cannot be deleted', data: disputedJobs });
      }

      const ongoingJobs = await JobModel.find({ contractor: contractorId, status: { $in: [JOB_STATUS.ONGOING] } })
      if (ongoingJobs.length > 0) {
        return res.status(400).json({ success: false, message: 'You have  ongoing jobs, account cannot be deleted', data: ongoingJobs });
      }

      await ContractorProfileModel.findOneAndUpdate({ contractor: contractorId }, {
        isOffDuty: true
      })

      const deletedAccount = account
      account.email = `${account.email}:${account.id}`
      account.deletedAt = new Date()
      account.phoneNumber = { code: "+", number: account.id, verifiedAt: null }
      account.firstName = 'Deleted'
      account.lastName = 'Account'
      account.profilePhoto = { url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png' }

      await account.save()

      await ContractorModel.deleteById(contractorId)

      AccountEvent.emit('ACCOUNT_DELETED', {user: deletedAccount})

      res.json({ success: true, message: 'Account deleted successfully' });
    } catch (err: any) {
      console.log('error', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  @handleAsyncError()
  public async signOut(): Promise<Response | void> {
    let req = <any>this.req;
    let res = this.res;
    try {

      // Assume the token is in the Authorization header (Bearer token)
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(400).json({ success: false, message: 'Token not provided' });
      }

      // let secret = process.env.JWT_SECRET_KEY;
      // const decoded = jwt.decode(token, { complete: true });
      // const payload = jwt.verify(token, secret!) as unknown as JwtPayload;
      // const contractor = await ContractorModel.findOne({
      //   email: payload.email
      // });


      // Add the token to the blacklist
      await BlacklistedToken.create({ token });


      res.json({ success: true, message: 'Sign out successful' });
    } catch (err: any) {
      console.log('error', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }


  @handleAsyncError()
  public async submitFeedback(): Promise<Response | void> {
    let req = <any>this.req;
    let res = this.res;
    let next = this.next
    try {
      const contractorId = req.contractor.id;
      const {
        media,
        remark,
      } = req.body

      const feedback = await FeedbackModel.create({ user: contractorId, userType: 'contractors', media, remark });

      const user = await ContractorModel.findById(contractorId);
      AdminEvent.emit('NEW_FEEDBACK', { feedback, user })

      res.json({ success: true, message: 'Feedback submitted' });
    } catch (err: any) {
      next(new InternalServerError("An error occurred", err))
    }
  }


  @handleAsyncError()
  public async submitReport(): Promise<Response | void> {
    let req = <any>this.req;
    let res = this.res;
    let next = this.next
    try {
      const { reported, type = ABUSE_REPORT_TYPE.ABUSE, comment } = req.body;
      const contractorId = req.contractor.id
      const { reporter, reporterType, reportedType } = { reporter: contractorId, reporterType: 'contractors', reportedType: 'customers' }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
      }

      // Create a new report
      const newReport = new AbuseReportModel({
        reporter,
        reporterType,
        reported,
        reportedType,
        type,
        comment,
      });

      // Save the report to the database
      const savedReport = await newReport.save();

      AccountEvent.emit('ACCOUNT_REPORTED', {report: savedReport})
      return res.status(201).json({ success: true, message: 'Report successfully created', data: savedReport });
    } catch (err: any) {
      return next(new InternalServerError('Error occurred creating report', err));
    }
  }


  @handleAsyncError()
  public async blockUser(): Promise<Response | void> {
    let req = <any>this.req;
    let res = this.res;
    let next = this.next
    try {
      const { customerId, reason = BLOCK_USER_REASON.ABUSE } = req.body;
      const contractorId = req.contractor.id

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
      }

       // perform checks here
       const bookedJobs = await JobModel.find({ customer: customerId, contractor: contractorId, status: { $in: [JOB_STATUS.BOOKED] } })
       if (bookedJobs.length > 0) {
         return res.status(400).json({ success: false, message: 'You have an active Job, customer cannot be blocked', data: bookedJobs });
       }
 
       const disputedJobs = await JobModel.find({ customer: customerId, contractor: contractorId, status: { $in: [JOB_STATUS.DISPUTED] } })
       if (disputedJobs.length > 0) {
         return res.status(400).json({ success: false, message: 'You have an pending dispute, customer cannot be blocked', data: disputedJobs });
       }
 
       const ongoingJobs = await JobModel.find({ customer: customerId, contractor: contractorId, status: { $in: [JOB_STATUS.ONGOING] } })
       if (ongoingJobs.length > 0) {
         return res.status(400).json({ success: false, message: 'You have  ongoing jobs, customer cannot be blocked', data: ongoingJobs });
       }

       const {isBlocked, block} = await BlockedUserUtil.isUserBlocked({customer:customerId, contractor: contractorId})
       if(isBlocked){
          return res.status(400).json({ success: false, message: `User is already blocked by ${block?.blockedBy}` });
       }

      await BlockedUserModel.findOneAndUpdate({ contractor: contractorId,  customer: customerId }, {
        contractor: contractorId,
        customer: customerId,
        blockedBy: 'contractor',
        reason: reason
      }, { upsert: true, new: true })


      // Send a message to the customer
      const conversation = await ConversationUtil.updateOrCreateConversation(customerId, 'customers', contractorId, 'contractors')
      const message = new MessageModel({
        conversation: conversation?._id,
        sender: contractorId,
        senderType: 'contractors',
        message: "Conversation locked by contractor",
        messageType: MessageType.ALERT,
      });
      await message.save();
      ConversationEvent.emit('NEW_MESSAGE', { message })



      return res.status(201).json({ success: true, message: 'Customer successfully blocked' });
    } catch (err: any) {
      return next(new InternalServerError('Error occurred while blocking customer', err));
    }
  }


  @handleAsyncError()
  public async unBlockUser(): Promise<Response | void> {
    let req = <any>this.req;
    let res = this.res;
    let next = this.next
    try {
      const { customerId, reason = BLOCK_USER_REASON.ABUSE } = req.body;
      const contractorId = req.contractor.id

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
      }

      const {isBlocked, block} = await BlockedUserUtil.isUserBlocked({customer:customerId, contractor: contractorId})
      if(block && block.blockedBy == 'customer'){
        return res.status(400).json({ success: false, message: 'Unable to unblock'});
      }

      await BlockedUserModel.findOneAndDelete({ customer: customerId,  contractor: contractorId, blockedBy: 'contractor' })

      const conversation = await ConversationUtil.updateOrCreateConversation(customerId, 'customers', contractorId, 'contractors')
      const message = new MessageModel({
        conversation: conversation?._id,
        sender: contractorId,
        senderType: 'contractors',
        message: "Conversation unlocked by contractor",
        messageType: MessageType.ALERT,
      });
      await message.save();
      ConversationEvent.emit('NEW_MESSAGE', { message })


      return res.status(201).json({ success: true, message: 'Customer successfully unblocked' });
    } catch (err: any) {
      return next(new InternalServerError('Error occurred while unblocking customer', err));
    }
  }


}


export const ContractorController = (...args: [Request, Response, NextFunction]) =>
  new ProfileHandler(...args);