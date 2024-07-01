"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorHttpRequest = exports.CreateJobDisputeRequest = exports.sendMessageParams = exports.CreateExtraJobQuotationRequest = exports.CreateJobQuotationRequest = exports.CreateScheduleRequest = exports.UpdateOrDevice = exports.CreateStripeSessionRequest = exports.InviteToTeam = exports.CreateCompanyDetailsRequest = exports.CreateGstDetailsRequest = exports.UpdateBankDetailRequest = exports.PasswordChangeRequest = exports.PasswordResetRequest = exports.ResendEmailRequest = exports.LoginRequest = exports.EmailVerificationRequest = exports.UpgradeEmployeeProfileRequest = exports.UpdateProfileRequest = exports.CreateProfileRequest = exports.CreateContractorRequest = void 0;
var express_validator_1 = require("express-validator");
exports.CreateContractorRequest = [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').notEmpty(),
    (0, express_validator_1.body)('passwordConfirmation')
        .exists({ checkFalsy: true }).withMessage('You must type a confirmation password')
        .custom(function (value, _a) {
        var req = _a.req;
        return value === req.body.password;
    }).withMessage('The passwords do not match'),
    (0, express_validator_1.body)('phoneNumber').notEmpty(),
    (0, express_validator_1.body)('accountType')
        .notEmpty()
        .isIn(['Individual', 'Company', 'Employee']).withMessage('Account type must be one of: Individual, Company or Employee'),
    (0, express_validator_1.body)('acceptTerms')
        .notEmpty()
        .custom(function (value, _a) {
        var req = _a.req;
        return value === true;
    }).withMessage('You must accept our terms and conditions'),
    (0, express_validator_1.body)('accountType').notEmpty(),
    // Conditional validations based on accountType
    (0, express_validator_1.body)('firstName')
        .if(function (value, _a) {
        var req = _a.req;
        return ['Employee', 'Individual'].includes(req.body.accountType);
    })
        .notEmpty().withMessage('First name is required for Employee or Individual accounts'),
    (0, express_validator_1.body)('lastName')
        .if(function (value, _a) {
        var req = _a.req;
        return ['Employee', 'Individual'].includes(req.body.accountType);
    })
        .notEmpty().withMessage('Last name is required for Employee or Individual accounts'),
    (0, express_validator_1.body)('dateOfBirth')
        .if(function (value, _a) {
        var req = _a.req;
        return ['Employee', 'Individual'].includes(req.body.accountType);
    })
        .notEmpty().withMessage('Date of birth is required for Employee or Individual accounts'),
    (0, express_validator_1.body)('companyName')
        .if(function (value, _a) {
        var req = _a.req;
        return req.body.accountType === 'Company';
    })
        .notEmpty().withMessage('Company name is required for Company accounts'),
];
exports.CreateProfileRequest = [
    //  validate for all
    (0, express_validator_1.body)("location.address").notEmpty(),
    (0, express_validator_1.body)("profilePhoto.url").optional().isURL(),
    (0, express_validator_1.body)("location.latitude").notEmpty().isNumeric(),
    (0, express_validator_1.body)("location.longitude").notEmpty().isNumeric(),
    //  only validate when  accountType  is  Company and Individual
    (0, express_validator_1.body)("skill").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("experienceYear").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().isNumeric(),
    (0, express_validator_1.body)("about").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional(),
    (0, express_validator_1.body)("website").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().isURL(),
    (0, express_validator_1.body)("email").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().isEmail(),
    (0, express_validator_1.body)("phoneNumber").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().isNumeric(),
    (0, express_validator_1.body)("emergencyJobs").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("availableDays").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).notEmpty().isArray(),
    (0, express_validator_1.body)("previousJobPhotos").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().isArray().notEmpty().custom(function (value) { return validateMediaArray(value); }),
    (0, express_validator_1.body)("previousJobVideos").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().isArray().notEmpty().custom(function (value) { return validateMediaArray(value); }),
];
exports.UpdateProfileRequest = [
    //  validate for all
    (0, express_validator_1.body)("location.address").optional(),
    (0, express_validator_1.body)("profilePhoto.url").optional().isURL(),
    (0, express_validator_1.body)("location.latitude").optional().isNumeric(),
    (0, express_validator_1.body)("location.longitude").optional().isNumeric(),
    (0, express_validator_1.body)("skill").optional(),
    //  only validate when  accountType  is  Company and Individual
    (0, express_validator_1.body)("gstName").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional(),
    (0, express_validator_1.body)("gstNumber").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional(),
    (0, express_validator_1.body)("gstType").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional(),
    (0, express_validator_1.body)("experienceYear").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().isNumeric(),
    (0, express_validator_1.body)("about").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional(),
    (0, express_validator_1.body)("website").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().isURL(),
    (0, express_validator_1.body)("email").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().isEmail(),
    (0, express_validator_1.body)("phoneNumber").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().isObject(),
    (0, express_validator_1.body)("emergencyJobs").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().notEmpty(),
    (0, express_validator_1.body)("availableDays").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().notEmpty().isArray(),
    (0, express_validator_1.body)("previousJobPhotos").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().isArray().notEmpty().custom(function (value) { return validateMediaArray(value); }),
    (0, express_validator_1.body)("previousJobVideos").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).optional().isArray().notEmpty().custom(function (value) { return validateMediaArray(value); }),
];
exports.UpgradeEmployeeProfileRequest = [
    (0, express_validator_1.body)("location.address").optional(),
    (0, express_validator_1.body)("location.latitude").optional().isNumeric(),
    (0, express_validator_1.body)("location.longitude").optional().isNumeric(),
    // body('backgroundCheckConsent')
    //   .exists({ checkFalsy: true }).withMessage('Background consent is required')
    //   .custom((value) => value === true).withMessage('You must consent to us running a background check'),
    (0, express_validator_1.body)("skill").optional(),
    (0, express_validator_1.body)("gstDetails.gstNumber").optional(),
    (0, express_validator_1.body)("gstDetails.gstName").optional(),
    (0, express_validator_1.body)("gstDetails.gstType").optional(),
    (0, express_validator_1.body)("experienceYear").optional().isNumeric(),
    (0, express_validator_1.body)("about").optional(),
    (0, express_validator_1.body)("website").optional().isURL(),
    (0, express_validator_1.body)("email").optional().isEmail(),
    (0, express_validator_1.body)("phoneNumber").optional().isNumeric(),
    (0, express_validator_1.body)("emergencyJobs").optional(),
    (0, express_validator_1.body)("availableDays").optional().isArray(),
    (0, express_validator_1.body)("previousJobPhotos").optional().isArray().notEmpty().custom(function (value) { return validateMediaArray(value); }),
    (0, express_validator_1.body)("previousJobVideos").optional().isArray().notEmpty().custom(function (value) { return validateMediaArray(value); }),
];
// Custom validation function for checking if an array of media objects contains 'url' property
var validateMediaArray = function (value) {
    return Array.isArray(value) && value.every(function (item) { return typeof item === 'object' && 'url' in item && typeof item.url === 'string' && item.url.trim() !== ''; });
};
exports.EmailVerificationRequest = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.LoginRequest = [
    (0, express_validator_1.body)("email").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.ResendEmailRequest = [
    (0, express_validator_1.body)("email").isEmail(),
];
exports.PasswordResetRequest = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.PasswordChangeRequest = [
    (0, express_validator_1.body)("currentPassword").notEmpty(),
    (0, express_validator_1.body)("newPassword").notEmpty(),
    (0, express_validator_1.body)('newPasswordConfirmation')
        .exists({ checkFalsy: true }).withMessage('You must type a confirmation password')
        .custom(function (value, _a) {
        var req = _a.req;
        return value === req.body.newPassword;
    }).withMessage('The passwords do not match'),
];
exports.UpdateBankDetailRequest = [
    (0, express_validator_1.body)("institutionName").notEmpty(),
    (0, express_validator_1.body)("transitNumber").notEmpty(),
    (0, express_validator_1.body)("institutionNumber").notEmpty(),
    (0, express_validator_1.body)("accountNumber").notEmpty(),
];
exports.CreateGstDetailsRequest = [
    (0, express_validator_1.body)("gstName").notEmpty(),
    (0, express_validator_1.body)("gstNumber").notEmpty(),
    (0, express_validator_1.body)("gstType").notEmpty(),
    (0, express_validator_1.body)("backgroundCheckConsent").notEmpty(),
    (0, express_validator_1.body)("gstCertitificate").optional(),
    (0, express_validator_1.body)('backgroundCheckConsent')
        .exists({ checkFalsy: true }).withMessage('Background consent is required')
        .custom(function (value) { return value === true; }).withMessage('You must consent to us running a background check'),
];
exports.CreateCompanyDetailsRequest = [
    (0, express_validator_1.body)("companyLogo").optional(),
    (0, express_validator_1.body)("companyStaffId").optional(),
];
exports.InviteToTeam = [
    (0, express_validator_1.body)("memberId").notEmpty(),
    (0, express_validator_1.body)("role").notEmpty(),
];
exports.CreateStripeSessionRequest = [
    (0, express_validator_1.body)("mode").notEmpty(),
];
exports.UpdateOrDevice = [
    (0, express_validator_1.body)("deviceId").optional(),
    (0, express_validator_1.body)("deviceToken").notEmpty(),
];
exports.CreateScheduleRequest = [
    (0, express_validator_1.body)('dates').optional().isArray().withMessage('Dates should be an array').notEmpty().withMessage('Dates array should not be empty'),
    (0, express_validator_1.body)('type').optional().isString().withMessage('Event type should be a string').notEmpty().withMessage('Schedule type cannot be empty'),
    (0, express_validator_1.body)('recurrence.frequency').optional().isString().withMessage('Recurrence frequency should be a string'),
    (0, express_validator_1.body)('recurrence.interval').optional().isNumeric().withMessage('Recurrence interval should be a number'),
    (0, express_validator_1.body)('events').optional().isArray().withMessage('Events should be an array').notEmpty().withMessage('Events array should not be empty'),
    (0, express_validator_1.body)('events.*.title').optional().isString().withMessage('Event title should be a string').notEmpty().withMessage('Event title cannot be empty'),
    (0, express_validator_1.body)('events.*.type').optional().isString().withMessage('Event type should be a string').notEmpty().withMessage('Event type cannot be empty'),
    (0, express_validator_1.body)('events.*.startTime').optional().isISO8601().withMessage('Invalid start time format'),
    (0, express_validator_1.body)('events.*.endTime').optional().isISO8601().withMessage('Invalid end time format'),
    (0, express_validator_1.body)('events.*.booking').optional().isNumeric().withMessage('Booking should be a number'),
    (0, express_validator_1.body)('events.*.description').optional().isString().withMessage('Description should be a string'),
];
// JOB Quotation
exports.CreateJobQuotationRequest = [
    (0, express_validator_1.body)("startDate").optional().isISO8601(),
    (0, express_validator_1.body)("endDate").optional().isISO8601(),
    (0, express_validator_1.body)("siteVisit").optional().isISO8601(),
    (0, express_validator_1.body)("estimates").optional().isArray(), // Making estimates optional
    (0, express_validator_1.body)("estimates.*.rate").if((0, express_validator_1.body)("estimates").exists()).notEmpty().isNumeric(), // Checking rate only if estimates is provided
    (0, express_validator_1.body)("estimates.*.quantity").if((0, express_validator_1.body)("estimates").exists()).notEmpty().isNumeric(), // Checking quantity only if estimates is provided
    (0, express_validator_1.body)("estimates.*.description").if((0, express_validator_1.body)("estimates").exists()).notEmpty().isString(), // Checking description only if estimates is provided
];
// JOB Extra Quotation
exports.CreateExtraJobQuotationRequest = [
    (0, express_validator_1.body)("estimates").optional().isArray(), // Making estimates optional
    (0, express_validator_1.body)("estimates.*.rate").if((0, express_validator_1.body)("estimates").exists()).notEmpty().isNumeric(), // Checking rate only if estimates is provided
    (0, express_validator_1.body)("estimates.*.quantity").if((0, express_validator_1.body)("estimates").exists()).notEmpty().isNumeric(), // Checking quantity only if estimates is provided
    (0, express_validator_1.body)("estimates.*.description").if((0, express_validator_1.body)("estimates").exists()).notEmpty().isString(), // Checking description only if estimates is provided
];
// Define the validation rules for the message request
exports.sendMessageParams = [
    (0, express_validator_1.body)('type').isIn(['TEXT', 'MEDIA', 'AUDIO', 'VIDEO', 'IMAGE']).withMessage('Invalid messageType'),
    (0, express_validator_1.body)('message').if((0, express_validator_1.body)('type').equals('TEXT')).notEmpty().withMessage('Message is required'),
    (0, express_validator_1.body)('media').if((0, express_validator_1.body)('type').isIn(['MEDIA', 'AUDIO', 'VIDEO', 'IMAGE'])).isArray().withMessage('Media must be an object')
        .bail() // Stop validation if media is not an object
        .custom(function (value, _a) {
        var req = _a.req;
        // Check if required properties exist in media object
        if (!value.every(function (item) { return typeof item === 'object' && 'url' in item && typeof item.url === 'string' && item.url.trim() !== ''; })) {
            throw new Error('Media url is required');
        }
        return true;
    }),
];
exports.CreateJobDisputeRequest = [
    (0, express_validator_1.body)("evidence").notEmpty(),
    (0, express_validator_1.body)("description").notEmpty(),
];
exports.ContractorHttpRequest = {
    CreateProfileRequest: exports.CreateProfileRequest,
    CreateContractorRequest: exports.CreateContractorRequest,
    EmailVerificationRequest: exports.EmailVerificationRequest,
    LoginRequest: exports.LoginRequest,
    ResendEmailRequest: exports.ResendEmailRequest,
    PasswordResetRequest: exports.PasswordResetRequest,
    UpdateBankDetailRequest: exports.UpdateBankDetailRequest,
    InviteToTeam: exports.InviteToTeam,
    CreateScheduleRequest: exports.CreateScheduleRequest,
    UpdateProfileRequest: exports.UpdateProfileRequest,
    PasswordChangeRequest: exports.PasswordChangeRequest,
    CreateStripeSessionRequest: exports.CreateStripeSessionRequest,
    UpdateOrDevice: exports.UpdateOrDevice,
    CreateJobQuotationRequest: exports.CreateJobQuotationRequest,
    CreateExtraJobQuotationRequest: exports.CreateExtraJobQuotationRequest,
    sendMessageParams: exports.sendMessageParams,
    CreateGstDetailsRequest: exports.CreateGstDetailsRequest,
    CreateCompanyDetailsRequest: exports.CreateCompanyDetailsRequest,
    UpgradeEmployeeProfileRequest: exports.UpgradeEmployeeProfileRequest,
    CreateJobDisputeRequest: exports.CreateJobDisputeRequest
};
