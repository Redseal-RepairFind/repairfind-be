"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validations = exports.CustomerChangeStatusParams = exports.ContractorChangeStatusParams = exports.SettleDisputeParams = exports.AcceptDisputeParams = exports.DisputeStatusParams = exports.AddPermissionParams = exports.AddStaffParams = exports.EditPermissionParams = exports.PermissionCreationParam = exports.validateResolvedEmergecyIdParams = exports.validateEmergecyIdParams = exports.validatePayoutIDPayContractorParams = exports.validatePayoutIDParams = exports.validateRevenueDateParams = exports.validateDeleteQuestionValidationParams = exports.validateEditQuestionParams = exports.validateQuestionIdValidationParams = exports.createQuizParams = exports.validateAddQuestionParams = exports.validateTRansactionIdValidationParams = exports.validateJobIdValidationParams = exports.validateAddSkillParams = exports.validateContractoDocumentIdValidationParams = exports.validateContractorChangeStatusValidationParams = exports.validateCustomerIdValidationParams = exports.validateContractorIdValidationParams = exports.validateSuperAdmiCchangeStatusParams = exports.validateAdminResetPasswprdParams = exports.validateAdminForgotPasswordParams = exports.validateAdminLoginParams = exports.validatAdminEmailverificationParams = exports.validateSignupParams = void 0;
var express_validator_1 = require("express-validator");
var admin_interface_1 = require("../../../database/admin/interface/admin.interface");
var job_dispute_model_1 = require("../../../database/common/job_dispute.model");
var contractorStatus_1 = require("../../../constants/contractorStatus");
exports.validateSignupParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
    (0, express_validator_1.body)("phoneNumber").notEmpty(),
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
exports.validateSuperAdmiCchangeStatusParams = [
    (0, express_validator_1.body)("staffId").notEmpty(),
    (0, express_validator_1.body)("status").isIn([admin_interface_1.AdminStatus.ACTIVE, admin_interface_1.AdminStatus.PENDING, admin_interface_1.AdminStatus.SUSPENDED,])
        .withMessage("status must be ".concat(admin_interface_1.AdminStatus.ACTIVE, ", ").concat(admin_interface_1.AdminStatus.PENDING, ", or ").concat(admin_interface_1.AdminStatus.SUSPENDED)),
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
exports.validateEmergecyIdParams = [
    (0, express_validator_1.body)("emergencyId").notEmpty(),
];
exports.validateResolvedEmergecyIdParams = [
    (0, express_validator_1.body)("emergencyId").notEmpty(),
    (0, express_validator_1.body)("resolvedWay").notEmpty(),
];
exports.PermissionCreationParam = [
    (0, express_validator_1.body)("name").notEmpty(),
];
exports.EditPermissionParams = [
    (0, express_validator_1.body)("name").notEmpty(),
    (0, express_validator_1.body)("permissionId").notEmpty(),
];
exports.AddStaffParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
    (0, express_validator_1.body)("phoneNumber").notEmpty(),
    (0, express_validator_1.body)("permisions").isArray()
        .custom(function (array) { return array.every(function (item) { return typeof item === 'string'; }); })
        .withMessage("Every permission must be a string")
];
exports.AddPermissionParams = [
    (0, express_validator_1.body)("staffId").notEmpty(),
    (0, express_validator_1.body)("permision").notEmpty(),
];
exports.DisputeStatusParams = [
    (0, express_validator_1.query)("status").isIn(Object.values(job_dispute_model_1.JOB_DISPUTE_STATUS)),
];
exports.AcceptDisputeParams = [
    (0, express_validator_1.body)("disputeId").notEmpty(),
];
exports.SettleDisputeParams = [
    (0, express_validator_1.body)("disputeId").notEmpty(),
    (0, express_validator_1.body)("resolvedWay").notEmpty(),
];
exports.ContractorChangeStatusParams = [
    (0, express_validator_1.body)("status").isIn(Object.values(contractorStatus_1.contractorStatus)),
    (0, express_validator_1.body)("contractorId").notEmpty(),
];
exports.CustomerChangeStatusParams = [
    (0, express_validator_1.body)("status").isIn(Object.values(contractorStatus_1.customerStatus)),
    (0, express_validator_1.body)("customerId").notEmpty(),
];
exports.Validations = {
    PermissionCreationParam: exports.PermissionCreationParam,
    EditPermissionParams: exports.EditPermissionParams,
    AddStaffParams: exports.AddStaffParams,
    AddPermissionParams: exports.AddPermissionParams,
    DisputeStatusParams: exports.DisputeStatusParams,
    AcceptDisputeParams: exports.AcceptDisputeParams,
    SettleDisputeParams: exports.SettleDisputeParams,
    ContractorChangeStatusParams: exports.ContractorChangeStatusParams,
    CustomerChangeStatusParams: exports.CustomerChangeStatusParams
};
