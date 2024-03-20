"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorHttpRequest = exports.CreateScheduleRequest = exports.UpdateOrDevice = exports.CreateStripeSessionRequest = exports.InviteToTeam = exports.UpdateBankDetailRequest = exports.PasswordChangeRequest = exports.PasswordResetRequest = exports.ResendEmailRequest = exports.LoginRequest = exports.EmailVerificationRequest = exports.UpdateProfileRequest = exports.CreateProfileRequest = exports.CreateContractorRequest = void 0;
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
    (0, express_validator_1.body)('backgroundCheckConsent')
        .exists({ checkFalsy: true }).withMessage('Background consent is required')
        .custom(function (value) { return value === true; }).withMessage('You must consent to us running a background check'),
    (0, express_validator_1.body)("skill").notEmpty(),
    //  only validate when  accountType  is  Company and Individual
    (0, express_validator_1.body)("name").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("gstNumber").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("gstType").if(function (value, _a) {
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
    //  validate only for 'Employee
    (0, express_validator_1.body)("firstName").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) === 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("lastName").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) === 'Employee';
    }).notEmpty(),
];
exports.UpdateProfileRequest = [
    //  validate for all
    (0, express_validator_1.body)("location.address").notEmpty(),
    (0, express_validator_1.body)("profilePhoto.url").optional().isURL(),
    (0, express_validator_1.body)("location.latitude").notEmpty().isNumeric(),
    (0, express_validator_1.body)("location.longitude").notEmpty().isNumeric(),
    (0, express_validator_1.body)("skill").notEmpty(),
    //  only validate when  accountType  is  Company and Individual
    (0, express_validator_1.body)("name").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("gstNumber").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("gstType").if(function (value, _a) {
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
    }).optional().isObject(),
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
    //  validate only for 'Employee
    (0, express_validator_1.body)("firstName").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) === 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("lastName").if(function (value, _a) {
        var req = _a.req;
        return (req.body.accountType || req.contractor.accountType) === 'Employee';
    }).notEmpty(),
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
    (0, express_validator_1.body)("email").isEmail(),
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
exports.InviteToTeam = [
    (0, express_validator_1.body)("memberId").notEmpty(),
    (0, express_validator_1.body)("role").notEmpty(),
];
exports.CreateStripeSessionRequest = [
    (0, express_validator_1.body)("mode").notEmpty(),
];
exports.UpdateOrDevice = [
    (0, express_validator_1.body)("deviceId").notEmpty(),
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
    UpdateOrDevice: exports.UpdateOrDevice
};
