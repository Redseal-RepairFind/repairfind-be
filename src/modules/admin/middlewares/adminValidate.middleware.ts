import { body, query } from "express-validator";
import { AdminStatus } from "../../../database/admin/interface/admin.interface";
import { JOB_DISPUTE_STATUS } from "../../../database/common/job_dispute.model";
import { contractorStatus, customerStatus } from "../../../constants/contractorStatus";

export const validateSignupParams = [
  body("email").isEmail(),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("password").notEmpty(),
  body("phoneNumber").notEmpty(),
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

export const validateSuperAdmiCchangeStatusParams = [
    body("staffId").notEmpty(),
    body("status").isIn([AdminStatus.ACTIVE, AdminStatus.PENDING, AdminStatus.SUSPENDED,])
    .withMessage(`status must be ${AdminStatus.ACTIVE}, ${AdminStatus.PENDING}, or ${AdminStatus.SUSPENDED}`),
];

export const validateContractorIdValidationParams = [
    body("contractorId").notEmpty(),
];

export const validateCustomerIdValidationParams = [
    query("customerId").notEmpty(),
];

export const validateContractorChangeStatusValidationParams = [
    body("contractorId").notEmpty(),
    body("gstStatus")
    .isIn(["PENDING", "REVIEWING", "APPROVED", "DECLINED"])
    .withMessage("gstStatus must be PENDING, REVIEWING, APPROVED, or DECLINED"),
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


export const createQuizParams = [
    body('video_url').notEmpty().isString(),
    body('questions').notEmpty().isArray().withMessage('Questions must be an array'),
    body('questions.*.question').notEmpty().isString().withMessage('Question must be a string'),
    body('questions.*.options').notEmpty().isArray().withMessage('Options must be an array'),
    body('questions.*.answer').notEmpty().isArray().withMessage('Answer must be an array of strings'),
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

export const validateEmergecyIdParams = [
    body("emergencyId").notEmpty(),
];

export const validateResolvedEmergecyIdParams = [
    body("emergencyId").notEmpty(),
    body("resolvedWay").notEmpty(),
];

export const PermissionCreationParam = [
    body("name").notEmpty(),
];

export const EditPermissionParams = [
    body("name").notEmpty(),
    body("permissionId").notEmpty(),
];

export const AddStaffParams = [
    body("email").isEmail(),
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("password").notEmpty(),
    body("phoneNumber").notEmpty(),
    body("permisions").isArray()
    .custom((array) => array.every((item: any) => typeof item === 'string'))
    .withMessage("Every permission must be a string")
];

export const AddPermissionParams = [
    body("staffId").notEmpty(),
    body("permision").notEmpty(),
];

export const DisputeStatusParams = [
    query("status").isIn(Object.values(JOB_DISPUTE_STATUS)),
];

export const AcceptDisputeParams = [
    body("disputeId").notEmpty(),
];

export const SettleDisputeParams = [
    body("disputeId").notEmpty(),
    body("resolvedWay").notEmpty(),
];

export const ContractorChangeStatusParams = [
    body("status").isIn(Object.values(contractorStatus)),
    body("contractorId").notEmpty(),
];

export const CustomerChangeStatusParams = [
    body("status").isIn(Object.values(customerStatus)),
    body("customerId").notEmpty(),
];

export const Validations = {
    PermissionCreationParam,
    EditPermissionParams,
    AddStaffParams,
    AddPermissionParams,
    DisputeStatusParams,
    AcceptDisputeParams,
    SettleDisputeParams,
    ContractorChangeStatusParams,
    CustomerChangeStatusParams
}