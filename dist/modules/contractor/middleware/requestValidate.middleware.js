"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContractorRateCustomerParams = exports.validateContractorAwnserQuestionParams = exports.validateSentQoutationCompleteParams = exports.validateSentQoutationOneByOneParams = exports.validateBankDetailEquestParams = exports.validateJobIdParams = exports.validatejobQouteTwoREquestParams = exports.validateRejectJobREquestParams = exports.validateSendJobQoutationParamsTwo = exports.validateSendJobQoutationParams = exports.validateEditAvailabilityParams = exports.validateREmoveAvailabilityParams = exports.validateNotAvailabilityParams = exports.validateAvailabilityParams = exports.validateEmailResetPasswordParams = exports.validateEmailParams = exports.validateEmailLoginParams = exports.validateEmailVerificatioParams = exports.validateSignupParams = void 0;
var express_validator_1 = require("express-validator");
exports.validateSignupParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    // body("dateOfBirth").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
    (0, express_validator_1.body)('passwordConfirmation')
        .exists({ checkFalsy: true }).withMessage('You must type a confirmation password')
        .custom(function (value, _a) {
        var req = _a.req;
        return value === req.body.password;
    }).withMessage("The passwords do not match"),
    (0, express_validator_1.body)('phoneNumber').notEmpty(),
    (0, express_validator_1.body)('accountType')
        .notEmpty()
        .isIn(['Individual', 'Company', 'JourneyMan']).withMessage("Account type must be one of: Individual,  Company or JourneyMan "),
    (0, express_validator_1.body)('acceptTerms')
        .notEmpty()
        .custom(function (value, _a) {
        var req = _a.req;
        return value === true;
    }).withMessage("You must accept our terms and conditions"),
];
exports.validateEmailVerificatioParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.validateEmailLoginParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateEmailParams = [
    (0, express_validator_1.body)("email").isEmail(),
];
exports.validateEmailResetPasswordParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateAvailabilityParams = [
    (0, express_validator_1.body)("from").notEmpty(),
    (0, express_validator_1.body)("to").notEmpty(),
    (0, express_validator_1.body)("sos").isBoolean().withMessage("sos must be a boolean"),
    (0, express_validator_1.body)('days')
        .isArray({ min: 1 })
        .withMessage('to must be an array of days with at least one day')
];
exports.validateNotAvailabilityParams = [
    (0, express_validator_1.body)("from").notEmpty(),
    (0, express_validator_1.body)("to").notEmpty(),
    (0, express_validator_1.body)('days')
        .isArray({ min: 1 })
        .withMessage('to must be an array of days with at least one day')
];
exports.validateREmoveAvailabilityParams = [
    (0, express_validator_1.body)("avaibilityId").notEmpty(),
];
exports.validateEditAvailabilityParams = [
    (0, express_validator_1.body)("avaibilityId").notEmpty(),
    (0, express_validator_1.body)("avialable")
        .isIn(["yes", "no"])
        .withMessage("avialable must be either yes or no"),
    (0, express_validator_1.body)("from").notEmpty(),
    (0, express_validator_1.body)("to").notEmpty(),
    (0, express_validator_1.body)("sos").isBoolean().withMessage("sos must be a boolean"),
    (0, express_validator_1.body)("day").notEmpty(),
];
exports.validateSendJobQoutationParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
    (0, express_validator_1.body)("workmanShip").isNumeric(),
    (0, express_validator_1.body)('quatations')
        .isArray().withMessage('Quotations must be an array')
        .notEmpty().withMessage('Quotations array cannot be empty')
        .custom(function (value) {
        // Validate each object in the array
        if (!Array.isArray(value)) {
            return false;
        }
        // Check that each object has the required keys
        var isValid = value.every(function (item) { return (typeof item === 'object' &&
            'tax' in item &&
            'material' in item &&
            'qty' in item &&
            'amount' in item &&
            'rate' in item); });
        return isValid;
    }).withMessage('Each item in the quotations array must have keys: tax, material, qty, amount, rate'),
];
exports.validateSendJobQoutationParamsTwo = [
    (0, express_validator_1.body)("jobId").notEmpty(),
    (0, express_validator_1.body)("materialDetail").notEmpty(),
    (0, express_validator_1.body)("totalcostMaterial").notEmpty(),
    (0, express_validator_1.body)("workmanShip").notEmpty,
];
exports.validateRejectJobREquestParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
    (0, express_validator_1.body)("rejectedReason")
        .notEmpty().isArray()
        .withMessage('Each item in rejectedReason must be a string'),
];
exports.validatejobQouteTwoREquestParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
    (0, express_validator_1.body)("materialDetail").notEmpty(),
    (0, express_validator_1.body)("totalcostMaterial").notEmpty(),
    (0, express_validator_1.body)("workmanShip").notEmpty(),
];
exports.validateJobIdParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
];
exports.validateBankDetailEquestParams = [
    (0, express_validator_1.body)("financialInstitution").notEmpty(),
    (0, express_validator_1.body)("accountNumber").notEmpty(),
    (0, express_validator_1.body)("transitNumber").notEmpty(),
    (0, express_validator_1.body)("financialInstitutionNumber").notEmpty(),
];
exports.validateSentQoutationOneByOneParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
    (0, express_validator_1.body)("material").notEmpty(),
    (0, express_validator_1.body)("qty").isNumeric(),
    (0, express_validator_1.body)("rate").isNumeric(),
    //body("tax").isNumeric(),
    (0, express_validator_1.body)("amount").isNumeric(),
];
exports.validateSentQoutationCompleteParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
    (0, express_validator_1.body)("workmanShip").isNumeric(),
];
exports.validateContractorAwnserQuestionParams = [
    (0, express_validator_1.body)("quizId").notEmpty(),
    (0, express_validator_1.body)("answer")
        .notEmpty().isArray()
        .withMessage('Each item in answer must be a string'),
];
exports.validateContractorRateCustomerParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
    (0, express_validator_1.body)("environment")
        .isIn([1, 2, 3, 4, 5])
        .withMessage("environment must be 1, 2, 3, 4, 0r 5"),
    (0, express_validator_1.body)("receptive")
        .isIn([1, 2, 3, 4, 5])
        .withMessage("receptive must be 1, 2, 3, 4, 0r 5"),
    (0, express_validator_1.body)("courteous")
        .isIn([1, 2, 3, 4, 5])
        .withMessage("courteous must be 1, 2, 3, 4, 0r 5"),
    (0, express_validator_1.body)("environmentText").notEmpty(),
    (0, express_validator_1.body)("receptiveText").notEmpty(),
    (0, express_validator_1.body)("courteousText").notEmpty(),
];
