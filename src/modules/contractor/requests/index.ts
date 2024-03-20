import { body } from "express-validator";


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


export const CreateProfileRequest  = [

    //  validate for all
    body("location.address").notEmpty(),
    body("profilePhoto.url").optional().isURL(),
    body("location.latitude").notEmpty().isNumeric(),
    body("location.longitude").notEmpty().isNumeric(),
    body('backgroundCheckConsent')
        .exists({ checkFalsy: true }).withMessage('Background consent is required')
        .custom((value) => value === true).withMessage('You must consent to us running a background check'),
    body("skill").notEmpty(),



    //  only validate when  accountType  is  Company and Individual
    body("name").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty(),
    body("gstNumber").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty(),
    body("gstType").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty(),
    body("experienceYear").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isNumeric(),
    body("about").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').optional(),
    body("website").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isURL(),
    body("email").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isEmail(),
    body("phoneNumber").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isNumeric(),
    body("emergencyJobs").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty(),
    body("availableDays").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty().isArray(),
    body("previousJobPhotos").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),
    body("previousJobVideos").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),

    //  validate only for 'Employee
    body("firstName").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) === 'Employee').notEmpty(),
    body("lastName").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) === 'Employee').notEmpty(),

];

export const UpdateProfileRequest  = [

    //  validate for all
    body("location.address").notEmpty(),
    body("profilePhoto.url").optional().isURL(),
    body("location.latitude").notEmpty().isNumeric(),
    body("location.longitude").notEmpty().isNumeric(),
    body("skill").notEmpty(),

   
    //  only validate when  accountType  is  Company and Individual
    body("name").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty(),
    body("gstNumber").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty(),
    body("gstType").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty(),
    body("experienceYear").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isNumeric(),
    body("about").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').optional(),
    body("website").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isURL(),
    body("email").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isEmail(),
    body("phoneNumber").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isObject(),
    body("emergencyJobs").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty(),
    body("availableDays").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').notEmpty().isArray(),
    body("previousJobPhotos").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),
    body("previousJobVideos").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) !== 'Employee').optional().isArray().notEmpty().custom((value) => validateMediaArray(value)),

    //  validate only for 'Employee
    body("firstName").if((value: any, { req }: any) =>  (req.body.accountType || req.contractor.accountType) === 'Employee').notEmpty(),
    body("lastName").if((value: any, { req }: any) => (req.body.accountType || req.contractor.accountType) === 'Employee').notEmpty(),

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
    body("email").isEmail(),
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

  export const InviteToTeam = [
    body("memberId").notEmpty(),
    body("role").notEmpty(),
  ];

  export const CreateStripeSessionRequest = [
    body("mode").notEmpty(),
  ];

  export const UpdateOrDevice = [
    body("deviceId").notEmpty(),
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
  
  


export const ContractorHttpRequest = {
    CreateProfileRequest,
    CreateContractorRequest,
    EmailVerificationRequest,
    LoginRequest,
    ResendEmailRequest,
    PasswordResetRequest,
    UpdateBankDetailRequest,
    InviteToTeam,
    CreateScheduleRequest,
    UpdateProfileRequest,
    PasswordChangeRequest,
    CreateStripeSessionRequest,
    UpdateOrDevice
    
}
