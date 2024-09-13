"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validations = exports.validateAppVersionUpdate = exports.validateAppVersionCreation = exports.sendMessageParams = exports.StartCoversaionParams = exports.CustomerChangeStatusParams = exports.ContractorChangeStatusParams = exports.SettleDisputeParams = exports.DisputeStatusParams = exports.AddPermissionParams = exports.AddStaffParams = exports.EditPermissionParams = exports.PermissionCreationParam = exports.validateResolvedEmergecyIdParams = exports.validateEmergecyIdParams = exports.validatePayoutIDPayContractorParams = exports.validatePayoutIDParams = exports.validateRevenueDateParams = exports.validateDeleteQuestionValidationParams = exports.validateEditQuestionParams = exports.validateQuestionIdValidationParams = exports.createQuizParams = exports.validateAddQuestionParams = exports.validateTRansactionIdValidationParams = exports.validateJobIdValidationParams = exports.validateAddSkillParams = exports.validateContractoDocumentIdValidationParams = exports.sendCustomEmail = exports.updateAccount = exports.updateGstDetails = exports.validateCustomerIdValidationParams = exports.validateContractorIdValidationParams = exports.validateSuperAdmiCchangeStatusParams = exports.validateAdminResetPasswprdParams = exports.validateAdminChangePasswordParams = exports.validateAdminForgotPasswordParams = exports.validateAdminLoginParams = exports.validatAdminEmailverificationParams = exports.validateSignupParams = void 0;
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
exports.validateAdminChangePasswordParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("oldPassword").notEmpty(),
    (0, express_validator_1.body)("newPassword").notEmpty(),
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
exports.updateGstDetails = [
    (0, express_validator_1.body)("gstStatus")
        .isIn(["PENDING", "REVIEWING", "APPROVED", "DECLINED"])
        .withMessage("gstStatus must be PENDING, REVIEWING, APPROVED, or DECLINED"),
];
exports.updateAccount = [
    (0, express_validator_1.body)("status")
        .isIn(["PENDING", "REVIEWING", "REJECTED", "SUSPENDED", "BLACKLISTED", "APPROVED", "DECLINED"])
        .withMessage("gstStatus must be PENDING, REVIEWING, APPROVED, or DECLINED"),
];
exports.sendCustomEmail = [
    (0, express_validator_1.body)("subject").notEmpty(),
    (0, express_validator_1.body)("htmlContent").notEmpty()
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
];
exports.AddStaffParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
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
exports.SettleDisputeParams = [
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
exports.StartCoversaionParams = [
    (0, express_validator_1.body)("userId").notEmpty(),
    (0, express_validator_1.body)("userType").notEmpty(),
    (0, express_validator_1.body)("message").notEmpty(),
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
exports.validateAppVersionCreation = [
    (0, express_validator_1.body)("version").notEmpty().withMessage("Version is required"),
    (0, express_validator_1.body)("type")
        .notEmpty()
        .isIn(["IOS", "ANDROID"])
        .withMessage("Type must be either 'IOS' or 'ANDROID'"),
    (0, express_validator_1.body)("status")
        .notEmpty()
        .isIn(["beta", "stable", "alpha", "release-candidate"])
        .withMessage("Status must be one of 'beta', 'stable', 'alpha', 'release-candidate'"),
    (0, express_validator_1.body)("changelogs").optional().isArray().withMessage("Changelogs must be an array"),
    (0, express_validator_1.body)("changelogs.*.title").optional().notEmpty().withMessage("Each changelog must have a title"),
    (0, express_validator_1.body)("changelogs.*.description").optional().notEmpty().withMessage("Each changelog must have a description"),
    (0, express_validator_1.body)("isCurrent").optional().isBoolean().withMessage("isCurrent must be a boolean"),
];
exports.validateAppVersionUpdate = [
    (0, express_validator_1.param)("id").notEmpty().withMessage("App version ID is required"),
    (0, express_validator_1.body)("version").optional().notEmpty().withMessage("Version is required"),
    (0, express_validator_1.body)("type")
        .optional()
        .isIn(["IOS", "ANDROID"])
        .withMessage("Type must be either 'IOS' or 'ANDROID'"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["beta", "stable", "alpha", "release-candidate"])
        .withMessage("Status must be one of 'beta', 'stable', 'alpha', 'release-candidate'"),
    (0, express_validator_1.body)("changelogs").optional().isArray().withMessage("Changelogs must be an array"),
    (0, express_validator_1.body)("changelogs.*.title").optional().notEmpty().withMessage("Each changelog must have a title"),
    (0, express_validator_1.body)("changelogs.*.description").optional().notEmpty().withMessage("Each changelog must have a description"),
    (0, express_validator_1.body)("isCurrent").optional().isBoolean().withMessage("isCurrent must be a boolean"),
];
exports.Validations = {
    PermissionCreationParam: exports.PermissionCreationParam,
    EditPermissionParams: exports.EditPermissionParams,
    AddStaffParams: exports.AddStaffParams,
    AddPermissionParams: exports.AddPermissionParams,
    DisputeStatusParams: exports.DisputeStatusParams,
    SettleDisputeParams: exports.SettleDisputeParams,
    ContractorChangeStatusParams: exports.ContractorChangeStatusParams,
    CustomerChangeStatusParams: exports.CustomerChangeStatusParams,
    StartCoversaionParams: exports.StartCoversaionParams,
    sendMessageParams: exports.sendMessageParams,
    updateGstDetails: exports.updateGstDetails,
    updateAccount: exports.updateAccount,
    sendCustomEmail: exports.sendCustomEmail,
    validateAppVersionUpdate: exports.validateAppVersionUpdate,
    validateAppVersionCreation: exports.validateAppVersionCreation
};
