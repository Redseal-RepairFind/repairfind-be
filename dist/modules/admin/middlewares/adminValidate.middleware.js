"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePayoutIDPayContractorParams = exports.validatePayoutIDParams = exports.validateRevenueDateParams = exports.validateDeleteQuestionValidationParams = exports.validateEditQuestionParams = exports.validateQuestionIdValidationParams = exports.createQuizParams = exports.validateAddQuestionParams = exports.validateTRansactionIdValidationParams = exports.validateJobIdValidationParams = exports.validateAddSkillParams = exports.validateContractoDocumentIdValidationParams = exports.validateContractorChangeStatusValidationParams = exports.validateCustomerIdValidationParams = exports.validateContractorIdValidationParams = exports.validateSuperAdminValidationParams = exports.validateAdminResetPasswprdParams = exports.validateAdminForgotPasswordParams = exports.validateAdminLoginParams = exports.validatAdminEmailverificationParams = exports.validateSignupParams = void 0;
var express_validator_1 = require("express-validator");
exports.validateSignupParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validatAdminEmailverificationParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.validateAdminLoginParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateAdminForgotPasswordParams = [
    (0, express_validator_1.body)("email").isEmail(),
];
exports.validateAdminResetPasswprdParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateSuperAdminValidationParams = [
    (0, express_validator_1.body)("subAdminId").notEmpty(),
];
exports.validateContractorIdValidationParams = [
    (0, express_validator_1.body)("contractorId").notEmpty(),
];
exports.validateCustomerIdValidationParams = [
    (0, express_validator_1.query)("customerId").notEmpty(),
];
exports.validateContractorChangeStatusValidationParams = [
    (0, express_validator_1.body)("contractorId").notEmpty(),
    (0, express_validator_1.body)("gstStatus")
        .isIn(["PENDING", "REVIEWING", "APPROVED", "DECLINED"])
        .withMessage("gstStatus must be PENDING, REVIEWING, APPROVED, or DECLINED"),
];
exports.validateContractoDocumentIdValidationParams = [
    (0, express_validator_1.body)("contractorDocsId").notEmpty(),
];
exports.validateAddSkillParams = [
    (0, express_validator_1.body)("name").notEmpty(),
];
exports.validateJobIdValidationParams = [
    (0, express_validator_1.query)("jobId").notEmpty(),
];
exports.validateTRansactionIdValidationParams = [
    (0, express_validator_1.query)("transactionId").notEmpty(),
];
exports.validateAddQuestionParams = [
    (0, express_validator_1.body)("question").notEmpty(),
    (0, express_validator_1.body)("options")
        .notEmpty()
        .withMessage('Each item in rejectedReason must be a string'),
    (0, express_validator_1.body)("answer")
        .notEmpty().isArray()
        .withMessage('Each item in rejectedReason must be a string'),
];
exports.createQuizParams = [
    (0, express_validator_1.body)('video_url').notEmpty().isString(),
    (0, express_validator_1.body)('questions').notEmpty().isArray().withMessage('Questions must be an array'),
    (0, express_validator_1.body)('questions.*.question').notEmpty().isString().withMessage('Question must be a string'),
    (0, express_validator_1.body)('questions.*.options').notEmpty().isArray().withMessage('Options must be an array'),
    (0, express_validator_1.body)('questions.*.answer').notEmpty().isArray().withMessage('Answer must be an array of strings'),
];
exports.validateQuestionIdValidationParams = [
    (0, express_validator_1.query)("questionId").notEmpty(),
];
exports.validateEditQuestionParams = [
    (0, express_validator_1.body)("question").notEmpty(),
    (0, express_validator_1.body)("options")
        .notEmpty()
        .withMessage('Each item in rejectedReason must be a string'),
    (0, express_validator_1.body)("answer")
        .notEmpty().isArray()
        .withMessage('Each item in answer must be a string'),
    (0, express_validator_1.body)("questionId").notEmpty(),
];
exports.validateDeleteQuestionValidationParams = [
    (0, express_validator_1.body)("questionId").notEmpty(),
];
exports.validateRevenueDateParams = [
    (0, express_validator_1.query)("year").notEmpty(),
    (0, express_validator_1.query)("month").notEmpty(),
];
exports.validatePayoutIDParams = [
    (0, express_validator_1.query)("payoutId").notEmpty(),
];
exports.validatePayoutIDPayContractorParams = [
    (0, express_validator_1.body)("payoutId").notEmpty(),
];
