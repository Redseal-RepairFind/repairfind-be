import { body } from "express-validator";

export const validateSignupParams = [
  body("email").isEmail(),
  body("firstName").notEmpty(),
  // body("dateOfBirth").notEmpty(),
  body("lastName").notEmpty(),
  body("password").notEmpty(),
  body('passwordConfirmation')
        .exists({checkFalsy: true}).withMessage('You must type a confirmation password')
        .custom((value, {req}) => value === req.body.password).withMessage("The passwords do not match"),
  body('phoneNumber').notEmpty(),
  body('accountType')
        .notEmpty()
        .isIn(['Individual', 'Company', 'JourneyMan']).withMessage("Account type must be one of: Individual,  Company or JourneyMan "),
        
  body('acceptTerms')
        .notEmpty()
        .custom((value, {req}) => value === true).withMessage("You must accept our terms and conditions"),

];

export const validateEmailVerificatioParams = [
  body("email").isEmail(),
  body("otp").notEmpty(),
];

export const validateEmailLoginParams = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

export const validateEmailParams = [
  body("email").isEmail(),
];

export const validateEmailResetPasswordParams = [
  body("email").isEmail(),
  body("otp").notEmpty(),
  body("password").notEmpty(),
];

export const validateAvailabilityParams = [
  body("from").notEmpty(),
  body("to").notEmpty(),
  body("sos").isBoolean().withMessage("sos must be a boolean"),
  body('days')
  .isArray({ min: 1 })
  .withMessage('to must be an array of days with at least one day')
];

export const validateNotAvailabilityParams = [
  body("from").notEmpty(),
  body("to").notEmpty(),
  body('days')
  .isArray({ min: 1 })
  .withMessage('to must be an array of days with at least one day')
];

export const validateREmoveAvailabilityParams = [
  body("avaibilityId").notEmpty(),
];

export const validateEditAvailabilityParams = [
  body("avaibilityId").notEmpty(),
  body("avialable")
    .isIn(["yes", "no"])
    .withMessage("avialable must be either yes or no"),
  body("from").notEmpty(),
  body("to").notEmpty(),
  body("sos").isBoolean().withMessage("sos must be a boolean"),
  body("day").notEmpty(),
];

export const validateSendJobQoutationParams = [
  body("jobId").notEmpty(),
  body("workmanShip").isNumeric(),
  body('quatations')
    .isArray().withMessage('Quotations must be an array')
    .notEmpty().withMessage('Quotations array cannot be empty')
    .custom((value) => {
      // Validate each object in the array
      if (!Array.isArray(value)) {
        return false;
      }
      
      // Check that each object has the required keys
      const isValid = value.every(item => (
        typeof item === 'object' &&
        'tax' in item &&
        'material' in item &&
        'qty' in item &&
        'amount' in item &&
        'rate' in item
      ));
      
      return isValid;
    }).withMessage('Each item in the quotations array must have keys: tax, material, qty, amount, rate'),
];

export const validateSendJobQoutationParamsTwo = [
  body("jobId").notEmpty(),
  body("materialDetail").notEmpty(),
  body("totalcostMaterial").notEmpty(),
  body("workmanShip").notEmpty,
];

export const validateRejectJobREquestParams = [
  body("jobId").notEmpty(),
  body("rejectedReason")
  .notEmpty().isArray()
  .withMessage('Each item in rejectedReason must be a string'),

];

export const validatejobQouteTwoREquestParams = [
  body("jobId").notEmpty(),
  body("materialDetail").notEmpty(),
  body("totalcostMaterial").notEmpty(),
  body("workmanShip").notEmpty(),
];

export const validateJobIdParams = [
  body("jobId").notEmpty(),
];

export const validateBankDetailEquestParams = [
  body("financialInstitution").notEmpty(),
  body("accountNumber").notEmpty(),
  body("transitNumber").notEmpty(),
  body("financialInstitutionNumber").notEmpty(),
];

export const validateSentQoutationOneByOneParams = [
  body("jobId").notEmpty(),
  body("material").notEmpty(),
  body("qty").isNumeric(),
  body("rate").isNumeric(),
  //body("tax").isNumeric(),
  body("amount").isNumeric(),
];

export const validateSentQoutationCompleteParams = [
  body("jobId").notEmpty(),
  body("workmanShip").isNumeric(),
];


export const validateContractorAwnserQuestionParams = [
  body("quizId").notEmpty(),
  body("answer")
  .notEmpty().isArray()
  .withMessage('Each item in answer must be a string'),
];

export const validateContractorRateCustomerParams = [
  body("jobId").notEmpty(),
  body("environment")
    .isIn([1, 2, 3, 4, 5])
    .withMessage("environment must be 1, 2, 3, 4, 0r 5"),
  body("receptive")
    .isIn([1, 2, 3, 4, 5])
    .withMessage("receptive must be 1, 2, 3, 4, 0r 5"),
  body("courteous")
    .isIn([1, 2, 3, 4, 5])
    .withMessage("courteous must be 1, 2, 3, 4, 0r 5"),
  body("environmentText").notEmpty(),
  body("receptiveText").notEmpty(),
  body("courteousText").notEmpty(),
];


