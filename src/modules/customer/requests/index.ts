import { body, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { CONTRACTOR_TYPES } from "../../../database/contractor/interface/contractor.interface";

export const signupParams = [
  body("email").isEmail(),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("phoneNumber").notEmpty(),
  body("password").notEmpty(),
  body('passwordConfirmation')
    .exists({ checkFalsy: true }).withMessage('You must type a confirmation password')
    .custom((value, { req }) => value === req.body.password).withMessage('The passwords do not match'),

  body('acceptTerms')
    .notEmpty()
    .custom((value, { req }) => value === true).withMessage('You must accept our terms and conditions'),

];

export const emailVerificationParams = [
  body("email").isEmail(),
  body("otp").notEmpty(),
];
export const verifySocialSignon = [
  body("accessToken").notEmpty(),
];

export const loginParams = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

export const loginWithPhoneParams = [
  body("number").notEmpty(),
  body("code").notEmpty(),
  body("password").notEmpty(),
];

export const forgotPasswordParams = [
  body("email").isEmail(),
];

export const resetPasswordParams = [
  body("email").isEmail(),
  body("otp").notEmpty(),
  body("password").notEmpty(),
];

export const changePasswordParams = [
  body("currentPassword").notEmpty(),
  body("newPassword").notEmpty(),
  body('newPasswordConfirmation')
    .exists({ checkFalsy: true }).withMessage('You must type a confirmation password')
    .custom((value, { req }) => value === req.body.newPassword).withMessage('The passwords do not match'),
];

export const verifyPasswordOtpParams = [
  body("email").isEmail(),
  body("otp").notEmpty(),
];

export const searchParams = [
  query("skill").notEmpty(),
];

export const getContractorParams = [
  query("contractorId").notEmpty(),
  query("skill").notEmpty(),
];

export const updateProfileParams = [
  query("fullName").notEmpty(),
  query("location").notEmpty(),
  query("phoneNumber").notEmpty(),
];

export const acceptAndPayParams = [
  body("jobId").notEmpty(),
];

export const confirmPaymentParams = [
  body("jobId").notEmpty(),
  body("paymentId").notEmpty(),
];

export const confirmInspectionPaymentParams = [
  body("jobId").notEmpty(),
  body("inspectionPaymemtId").notEmpty(),
];

export const rateContractorParams = [
  body("jobId").notEmpty(),
  body("cleanliness")
    .isIn([1, 2, 3, 4, 5])
    .withMessage("cleanliness must be 1, 2, 3, 4, 0r 5"),
  body("timeliness")
    .isIn([1, 2, 3, 4, 5])
    .withMessage("timeliness must be 1, 2, 3, 4, 0r 5"),
  body("skill")
    .isIn([1, 2, 3, 4, 5])
    .withMessage("skill must be 1, 2, 3, 4, 0r 5"),
  body("communication")
    .isIn([1, 2, 3, 4, 5])
    .withMessage("communication must be 1, 2, 3, 4, 0r 5"),
  body("courteous")
    .isIn([1, 2, 3, 4, 5])
    .withMessage("courteous must be 1, 2, 3, 4, 0r 5"),
  body("cleanlinessText").notEmpty(),
  body("timelinessText").notEmpty(),
  body("skillText").notEmpty(),
  body("communicationText").notEmpty(),
  body("courteousText").notEmpty(),
];


export const createStripeSessionParams = [
  body("mode").notEmpty(),
];

export const jobListingParams = [
  body("jobCategory").notEmpty(),
  body("jobDescription").notEmpty(),
  body("jobLocation").notEmpty(),
  body("date").notEmpty(),
  body("jobExpiry").notEmpty(),
  body("contractorType").isIn([CONTRACTOR_TYPES.Company, CONTRACTOR_TYPES.Employee, CONTRACTOR_TYPES.Individual])
    .withMessage(`contractorType must be ${CONTRACTOR_TYPES.Company}, ${CONTRACTOR_TYPES.Employee}, or ${CONTRACTOR_TYPES.Individual}`),
  body("emergency").isIn(['yes', 'no'])
    .withMessage("emergency must be yes or no"),
];

export const UpdateOrDeviceParams = [
  body("deviceId").optional(),
  body("deviceToken").notEmpty(),
];


export const searchContractorByLocationParams = [
  query("location").notEmpty(),
];

export const searchContractorByCategoryDateParams = [
  query("category").notEmpty(),
  query("date").notEmpty(),
];

export const searchCategoryDateParams = [
  query("category").notEmpty(),
];

export const filterContractorParams = [
  query("distance").notEmpty(),
  query("emergency").notEmpty(),
  query("category").notEmpty(),
  query("location").notEmpty(),
  query("accountType").notEmpty(),
  query("date").notEmpty(),
];


export const queryContractorParams = [
  query("distance").if(query("distance").exists()).notEmpty().withMessage("Distance is required"),
  query("emergencyJobs").if(query("emergencyJobs").exists()).notEmpty().withMessage("EmergencyJobs is required"),
  query("category").if(query("category").exists()).notEmpty().withMessage("Category is required"),
  query("accountType").if(query("accountType").exists()).notEmpty().withMessage("AccountType is required"),
  query("date").if(query("date").exists()).notEmpty().notEmpty().withMessage("Date is required"),
  query("isOffDuty").if(query("isOffDuty").exists()).notEmpty().notEmpty().withMessage("isOffDuty is required"),
  query("availability").if(query("availability").exists()).notEmpty().withMessage("AvailableDays is required"),
  query("experienceYear").if(query("experienceYear").exists()).notEmpty().withMessage("ExperienceYear is required"),

  query("latitude").custom((value, { req }) => {
    if (req?.query?.distance && !value) {
      throw new Error("Latitude is required when Distance is specified");
    }
    return true;
  }),
  query("longitude").custom((value, { req }) => {
    if (req?.query?.distance && !value) {
      throw new Error("Longitude is required when Distance is specified");
    }
    return true;
  }),

  query("address").if(query("address").exists()).notEmpty().withMessage("Address is required"),
  query("city").if(query("city").exists()).notEmpty().withMessage("City is required"),
  query("country").if(query("country").exists()).notEmpty().withMessage("Country is required"),
];

export const sendJobRequestParams = [
  body("contractorId").notEmpty(),
  body("jobDescription").notEmpty(),
  body("jobLocation").notEmpty(),
  body("date").notEmpty(),
];


export const createJobRequestParams = [
  body("contractorId").isMongoId(),
  body("description").notEmpty(),
  body('voiceDescription').optional().isObject().withMessage('Voice description must be an object')
    .bail() // Stop validation if media is not an object
    .custom((value, { req }) => {
      // Check if required properties exist in media object
      if (!('url' in value && typeof value.url === 'string' && value.url.trim() !== '')) {
        throw new Error('url is required');
      }
      return true;
    }),
  body("location").notEmpty(),
  body("media").optional(),
  body("emergency").optional(),
  body("date").optional(),
  body("time").optional(),
];

export const createJoListingParams = [
  body("contractorType").optional(),
  body("description").notEmpty(),
  body("expiresIn").notEmpty(),
  body("category").notEmpty(),
  body('voiceDescription').optional().isObject().withMessage('Media must be an object')
    .bail() // Stop validation if media is not an object
    .custom((value, { req }) => {
      // Check if required properties exist in media object
      if (!('url' in value && typeof value.url === 'string' && value.url.trim() !== '')) {
        throw new Error('Media url is required');
      }
      return true;
    }),
  body("location").notEmpty(),
  body("media").optional().isArray(),
  body("emergency").optional(),
  body("date").notEmpty(),
  body("time").optional(),
];

export const tripArrivalComfirmParams = [
  body("verificationCode").notEmpty(),
];


export const createJobDisputeParams = [
  body("evidence").optional(),
  body("description").notEmpty(),
];


// Define the validation rules for the message request
export const sendMessageParams = [
  body('type').isIn(['TEXT', 'MEDIA', 'AUDIO', 'VIDEO', 'IMAGE']).withMessage('Invalid messageType'),
  body('message').if(body('type').equals('TEXT')).notEmpty().withMessage('Message is required'),

  body('media').if(body('type').isIn(['MEDIA','AUDIO','VIDEO','IMAGE'])).isArray().withMessage('Media must be an array')
    .bail() // Stop validation if media is not an object
    .custom((value, { req }) => {
      // Check if required properties exist in media object
      if (!value.every((item: any) => typeof item === 'object' && 'url' in item && typeof item.url === 'string' && item.url.trim() !== '')) {
        throw new Error('Media url is required');
      }
      return true;
    }),
];



export const validateFormData = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};


export const CreateAbuseReportRequest = [
  body("reported").notEmpty(),
  body("type").notEmpty(),
  body("comment").notEmpty(),
];



export const BlocUserkRequest = [
  body("contractorId").notEmpty(),
];




export const CustomerHttpRequest = {
  signupParams,
  emailVerificationParams,
  loginParams,
  loginWithPhoneParams,
  forgotPasswordParams,
  resetPasswordParams,
  changePasswordParams,
  searchParams,
  getContractorParams,
  updateProfileParams,
  acceptAndPayParams,
  confirmPaymentParams,
  confirmInspectionPaymentParams,
  rateContractorParams,
  verifyPasswordOtpParams,
  verifySocialSignon,
  createStripeSessionParams,
  jobListingParams,
  searchContractorByLocationParams,
  searchContractorByCategoryDateParams,
  searchCategoryDateParams,
  filterContractorParams,
  sendJobRequestParams,
  validateFormData,
  UpdateOrDeviceParams,
  queryContractorParams,
  createJobRequestParams,
  createJoListingParams,
  tripArrivalComfirmParams,
  sendMessageParams,
  createJobDisputeParams,
  CreateAbuseReportRequest,
  BlocUserkRequest
}