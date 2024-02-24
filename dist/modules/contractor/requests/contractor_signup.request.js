"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateContractorRequest = void 0;
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
