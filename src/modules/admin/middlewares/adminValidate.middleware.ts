import { body, query } from "express-validator";

export const validateSignupParams = [
  body("email").isEmail(),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("password").notEmpty(),
];

export const validatAdminEmailverificationParams = [
    body("email").isEmail(),
    body("otp").notEmpty(),
];

export const validateAdminLoginParams = [
    body("email").isEmail(),
    body("password").notEmpty(),
];

export const validateAdminForgotPasswordParams = [
    body("email").isEmail(),
];

export const validateAdminResetPasswprdParams = [
    body("email").isEmail(),
    body("otp").notEmpty(),
    body("password").notEmpty(),
];

export const validateSuperAdminValidationParams = [
    body("subAdminId").notEmpty(),
];

export const validateContractorIdValidationParams = [
    body("contractorId").notEmpty(),
];

export const validateCustomerIdValidationParams = [
    query("customerId").notEmpty(),
];

export const validateContractorChangeStatusValidationParams = [
    body("contractorId").notEmpty(),
    body("status")
    .isIn(["suspend", "in-review", "active", "closed"])
    .withMessage("status must be suspend, in-review, active, or closed"),
];

export const validateContractoDocumentIdValidationParams = [
    body("contractorDocsId").notEmpty(),
];

export const validateAddSkillParams = [
    body("name").notEmpty(),
];

export const validateJobIdValidationParams = [
    query("jobId").notEmpty(),
];

export const validateTRansactionIdValidationParams = [
    query("transactionId").notEmpty(),
];

export const validateAddQuestionParams = [
    body("question").notEmpty(),
    body("options")
    .notEmpty()
    .withMessage('Each item in rejectedReason must be a string'),
    body("answer")
    .notEmpty().isArray()
    .withMessage('Each item in rejectedReason must be a string'),
];

export const validateQuestionIdValidationParams = [
    query("questionId").notEmpty(),
];

export const validateEditQuestionParams = [
    body("question").notEmpty(),
    body("options")
    .notEmpty()
    .withMessage('Each item in rejectedReason must be a string'),
    body("answer")
    .notEmpty().isArray()
    .withMessage('Each item in answer must be a string'),
    body("questionId").notEmpty(),
];

export const validateDeleteQuestionValidationParams = [
    body("questionId").notEmpty(),
];

export const validateRevenueDateParams = [
    query("year").notEmpty(),
    query("month").notEmpty(),
];

export const validatePayoutIDParams = [
    query("payoutId").notEmpty(),
];

export const validatePayoutIDPayContractorParams = [
    body("payoutId").notEmpty(),
];