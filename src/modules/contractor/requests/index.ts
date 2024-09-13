import { body } from "express-validator";
import mongoose from "mongoose";


export const CreateContractorRequest = [
  body('email').isEmail(),
  body('password').notEmpty(),
  body('passwordConfirmation')
    .exists({ checkFalsy: true }).withMessage('You must type a confirmation password')
    .custom((value, { req }) => value === req.body.password).withMessage('The passwords do not match'),
  body('phoneNumber').notEmpty(),
  body('accountType')
    .notEmpty()
    .isIn(['Individual', 'Company', 'Employee']).withMessage('Account type must be one of: Individual, Company or Employee'),
  body('acceptTerms')
    .notEmpty()
    .custom((value, { req }) => value === true).withMessage('You must accept our terms and conditions'),
  body('accountType').notEmpty(),
  // Conditional validations based on accountType

  body('firstName')
    .if((value: any, { req }: any) => ['Employee', 'Individual'].includes(req.body.accountType))
    .notEmpty().withMessage('First name is required for Employee or Individual accounts'),
  body('lastName')
    .if((value: any, { req }: any) => ['Employee', 'Individual'].includes(req.body.accountType))
    .notEmpty().withMessage('Last name is required for Employee or Individual accounts'),
  body('dateOfBirth')
    .if((value: any, { req }: any) => ['Employee', 'Individual'].includes(req.body.accountType))
    .notEmpty().withMessage('Date of birth is required for Employee or Individual accounts'),
  body('companyName')
    .if((value: any, { req }: any) => req.body.accountType === 'Company')
    .notEmpty().withMessage('Company name is required for Company accounts'),
];


export const CreateProfileRequest = [

  //  validate for all
  body("location.address").notEmpty(),
  body("profilePhoto.url").optional().isURL(),
  body("location.latitude").notEmpty().isNumeric(),
  body("location.longitude").notEmpty().isNumeric(),


  //  only validate when  accountType  is  Company and Individual
  body("skill").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty(),
  body("experienceYear").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isNumeric(),
  body("about").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional(),
  body("website").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isURL(),
  body("email").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isEmail(),
  body("phoneNumber").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isNumeric(),
  body("emergencyJobs").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty(),
  body("availability").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty().isArray(),
  body("previousJobPhotos").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),
  body("previousJobVideos").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),



];

export const UpdateProfileRequest = [

  //  validate for all
  body("location.address").optional(),
  body("profilePhoto.url").optional().isURL(),
  body("location.latitude").optional().isNumeric(),
  body("location.longitude").optional().isNumeric(),
  body("skill").optional(),


  //  only validate when  accountType  is  Company and Individual
  body("gstName").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional(),
  body("gstNumber").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional(),
  body("gstType").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional(),
  body("experienceYear").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isNumeric(),
  body("about").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional(),
  body("website").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isURL(),
  body("email").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isEmail(),
  body("phoneNumber").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isObject(),
  body("emergencyJobs").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().notEmpty(),
  body("availability").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().notEmpty().isArray(),
  body("previousJobPhotos").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),
  body("previousJobVideos").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),



];
export const UpgradeEmployeeProfileRequest = [

  body("location.address").optional(),
  body("location.latitude").optional().isNumeric(),
  body("location.longitude").optional().isNumeric(),

  // body('backgroundCheckConsent')
  //   .exists({ checkFalsy: true }).withMessage('Background consent is required')
  //   .custom((value) => value === true).withMessage('You must consent to us running a background check'),
  body("skill").optional(),

  body("gstDetails.gstNumber").optional(),
  body("gstDetails.gstName").optional(),
  body("gstDetails.gstType").optional(),

  body("experienceYear").optional().isNumeric(),
  body("about").optional(),
  body("website").optional().isURL(),
  body("email").optional().isEmail(),
  body("phoneNumber").optional().isNumeric(),
  body("emergencyJobs").optional(),
  body("availability").optional().isArray(),
  body("previousJobPhotos").optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),
  body("previousJobVideos").optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),



];

// Custom validation function for checking if an array of media objects contains 'url' property
const validateMediaArray = (value: any): boolean => {
  return Array.isArray(value) && value.every((item) => typeof item === 'object' && 'url' in item && typeof item.url === 'string' && item.url.trim() !== '');
};


export const EmailVerificationRequest = [
  body("email").isEmail(),
  body("otp").notEmpty(),
];

export const LoginRequest = [
  body("email").notEmpty(),
  body("password").notEmpty(),
];


export const LoginWithPhoneRequest = [
  body("number").notEmpty(),
  body("code").notEmpty(),
  body("password").notEmpty(),
];


export const ResendEmailRequest = [
  body("email").isEmail(),
];

export const PasswordResetRequest = [
  body("email").isEmail(),
  body("otp").notEmpty(),
  body("password").notEmpty(),
];

export const PasswordChangeRequest = [
  body("currentPassword").notEmpty(),
  body("newPassword").notEmpty(),
  body('newPasswordConfirmation')
    .exists({ checkFalsy: true }).withMessage('You must type a confirmation password')
    .custom((value, { req }) => value === req.body.newPassword).withMessage('The passwords do not match'),
];

export const UpdateBankDetailRequest = [
  body("institutionName").notEmpty(),
  body("transitNumber").notEmpty(),
  body("institutionNumber").notEmpty(),
  body("accountNumber").notEmpty(),
];

export const CreateGstDetailsRequest = [
  body("gstName").notEmpty(),
  body("gstNumber").notEmpty(),
  body("gstType").notEmpty(),
  body("backgroundCheckConsent").notEmpty(),
  body("gstCertitificate").optional(),
  body('backgroundCheckConsent')
    .exists({ checkFalsy: true }).withMessage('Background consent is required')
    .custom((value) => value === true).withMessage('You must consent to us running a background check'),
];

export const CreateCompanyDetailsRequest = [
  body("companyLogo").optional(),
  body("companyStaffId").optional(),
];


export const InviteToTeam = [
  body("memberId").notEmpty(),
  body("role").notEmpty(),
];

export const CreateStripeSessionRequest = [
  body("mode").notEmpty(),
];

export const UpdateOrDevice = [
  body("deviceId").optional(),
  body("deviceToken").notEmpty(),
];



export const CreateScheduleRequest = [
  body('dates').optional().isArray().withMessage('Dates should be an array').notEmpty().withMessage('Dates array should not be empty'),
  body('type').optional().isString().withMessage('Event type should be a string').notEmpty().withMessage('Schedule type cannot be empty'),
  body('recurrence.frequency').optional().isString().withMessage('Recurrence frequency should be a string'),
  body('recurrence.interval').optional().isNumeric().withMessage('Recurrence interval should be a number'),

  body('events').optional().isArray().withMessage('Events should be an array').notEmpty().withMessage('Events array should not be empty'),
  body('events.*.title').optional().isString().withMessage('Event title should be a string').notEmpty().withMessage('Event title cannot be empty'),
  body('events.*.type').optional().isString().withMessage('Event type should be a string').notEmpty().withMessage('Event type cannot be empty'),
  body('events.*.startTime').optional().isISO8601().withMessage('Invalid start time format'),
  body('events.*.endTime').optional().isISO8601().withMessage('Invalid end time format'),
  body('events.*.booking').optional().isNumeric().withMessage('Booking should be a number'),
  body('events.*.description').optional().isString().withMessage('Description should be a string'),
];


// JOB Quotation
export const CreateJobQuotationRequest = [
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
  body("siteVisit").optional().isISO8601(),
  body("estimates").optional().isArray(), // Making estimates optional
  body("estimatedDuration").notEmpty(), 
  body("estimates.*.rate").if(body("estimates").exists()).notEmpty().isNumeric(), // Checking rate only if estimates is provided
  body("estimates.*.quantity").if(body("estimates").exists()).notEmpty().isNumeric(), // Checking quantity only if estimates is provided
  body("estimates.*.description").if(body("estimates").exists()).notEmpty().isString(), // Checking description only if estimates is provided
];

export const CreateJobEnquiryRequest = [
  body("question").notEmpty().isString(),
];

// JOB Extra Quotation
export const CreateExtraJobQuotationRequest = [
  body("estimates").optional().isArray(), // Making estimates optional
  body("estimates.*.rate").if(body("estimates").exists()).notEmpty().isNumeric(), // Checking rate only if estimates is provided
  body("estimates.*.quantity").if(body("estimates").exists()).notEmpty().isNumeric(), // Checking quantity only if estimates is provided
  body("estimates.*.description").if(body("estimates").exists()).notEmpty().isString(), // Checking description only if estimates is provided
];


// Define the validation rules for the message request
export const sendMessageParams = [
  body('type').isIn(['TEXT', 'MEDIA', 'AUDIO', 'VIDEO', 'IMAGE']).withMessage('Invalid messageType'),
  body('message').if(body('type').equals('TEXT')).notEmpty().withMessage('Message is required'),

  body('media').if(body('type').isIn(['MEDIA', 'AUDIO', 'VIDEO', 'IMAGE'])).isArray().withMessage('Media must be an object')
    .bail() // Stop validation if media is not an object
    .custom((value, { req }) => {
      // Check if required properties exist in media object
      if (!value.every((item: any) => typeof item === 'object' && 'url' in item && typeof item.url === 'string' && item.url.trim() !== '')) {
        throw new Error('Media url is required');
      }
      return true;
    }),
];


export const CreateJobDisputeRequest = [
  body("evidence").optional(),
  body("description").notEmpty(),
];



export const CreateAbuseReportRequest = [
  body("reported").notEmpty(),
  body("type").notEmpty(),
  body("comment").notEmpty(),
];


export const ContractorHttpRequest = {
  CreateProfileRequest,
  CreateContractorRequest,
  EmailVerificationRequest,
  LoginRequest,
  LoginWithPhoneRequest,
  ResendEmailRequest,
  PasswordResetRequest,
  UpdateBankDetailRequest,
  InviteToTeam,
  CreateScheduleRequest,
  UpdateProfileRequest,
  PasswordChangeRequest,
  CreateStripeSessionRequest,
  UpdateOrDevice,
  CreateJobQuotationRequest,
  CreateExtraJobQuotationRequest,
  sendMessageParams,
  CreateGstDetailsRequest,
  CreateCompanyDetailsRequest,
  UpgradeEmployeeProfileRequest,
  CreateJobDisputeRequest,
  CreateJobEnquiryRequest,
  CreateAbuseReportRequest
}
