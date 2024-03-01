"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorHttpRequest = exports.UpdateBankDetailRequest = exports.PasswordResetRequest = exports.ResendEmailRequest = exports.LoginRequest = exports.EmailVerificationRequest = exports.CreateProfileRequest = exports.CreateContractorRequest = void 0;
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
    // body("profileType").notEmpty(),
    (0, express_validator_1.body)("location.address").notEmpty(),
    (0, express_validator_1.body)("location.latitude").notEmpty().isNumeric(),
    (0, express_validator_1.body)("location.longitude").notEmpty().isNumeric(),
    (0, express_validator_1.body)("profilePhoto.url").notEmpty().isURL(),
    (0, express_validator_1.body)('backgrounCheckConsent')
        .exists({ checkFalsy: true }).withMessage('Background consent is required')
        .custom(function (value) { return value === true; }).withMessage('You must consent to us running a background check'),
    //  only validate when  accountType  is  Company and Individual
    (0, express_validator_1.body)("name").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("skill").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("gstNumber").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("gstType").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("experienceYear").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional().isNumeric(),
    (0, express_validator_1.body)("about").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional(),
    (0, express_validator_1.body)("website").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional().isURL(),
    (0, express_validator_1.body)("email").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional().isEmail(),
    (0, express_validator_1.body)("phoneNumber").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional().isNumeric(),
    (0, express_validator_1.body)("emergencyJobs").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("availableDays").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).notEmpty().isArray(),
    (0, express_validator_1.body)("previousJobPhotos").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional().isArray().notEmpty().custom(function (value) { return validateMediaArray(value); }),
    (0, express_validator_1.body)("previousJobVideos").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType !== 'Employee';
    }).optional().isArray().notEmpty().custom(function (value) { return validateMediaArray(value); }),
    //  validate only for 'Employee
    (0, express_validator_1.body)("firstName").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType === 'Employee';
    }).notEmpty(),
    (0, express_validator_1.body)("lastName").if(function (value, _a) {
        var req = _a.req;
        return req.contractor.accountType === 'Employee';
    }).notEmpty(),
    // req.body.profileType
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
exports.UpdateBankDetailRequest = [
    (0, express_validator_1.body)("institutionName").notEmpty(),
    (0, express_validator_1.body)("transitNumber").notEmpty(),
    (0, express_validator_1.body)("institutionNumber").notEmpty(),
    (0, express_validator_1.body)("accountNumber").notEmpty(),
];
exports.ContractorHttpRequest = {
    CreateProfileRequest: exports.CreateProfileRequest,
    CreateContractorRequest: exports.CreateContractorRequest,
    EmailVerificationRequest: exports.EmailVerificationRequest,
    LoginRequest: exports.LoginRequest,
    ResendEmailRequest: exports.ResendEmailRequest,
    PasswordResetRequest: exports.PasswordResetRequest,
    UpdateBankDetailRequest: exports.UpdateBankDetailRequest
};
