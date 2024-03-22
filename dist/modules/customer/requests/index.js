"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerHttpRequest = exports.validateFormData = exports.sendJobRequestParams = exports.filterContractorParams = exports.searchCategoryDateParams = exports.searchContractorByCategoryDateParams = exports.searchContractorByLocationParams = exports.UpdateOrDeviceParams = exports.jobListingParams = exports.createStripeSessionParams = exports.rateContractorParams = exports.confirmInspectionPaymentParams = exports.confirmPaymentParams = exports.acceptAndPayParams = exports.updateProfileParams = exports.getContractorParams = exports.searchParams = exports.verifyPasswordOtpParams = exports.changePasswordParams = exports.resetPasswordParams = exports.forgotPasswordParams = exports.loginParams = exports.verifySocialSignon = exports.emailVerificationParams = exports.signupParams = void 0;
var express_validator_1 = require("express-validator");
var contractorAccountTypes_1 = require("../../../constants/contractorAccountTypes");
exports.signupParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("phoneNumber").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
    (0, express_validator_1.body)('passwordConfirmation')
        .exists({ checkFalsy: true }).withMessage('You must type a confirmation password')
        .custom(function (value, _a) {
        var req = _a.req;
        return value === req.body.password;
    }).withMessage('The passwords do not match'),
    (0, express_validator_1.body)('acceptTerms')
        .notEmpty()
        .custom(function (value, _a) {
        var req = _a.req;
        return value === true;
    }).withMessage('You must accept our terms and conditions'),
];
exports.emailVerificationParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.verifySocialSignon = [
    (0, express_validator_1.body)("accessToken").notEmpty(),
];
exports.loginParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.forgotPasswordParams = [
    (0, express_validator_1.body)("email").isEmail(),
];
exports.resetPasswordParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.changePasswordParams = [
    (0, express_validator_1.body)("currentPassword").notEmpty(),
    (0, express_validator_1.body)("newPassword").notEmpty(),
    (0, express_validator_1.body)('newPasswordConfirmation')
        .exists({ checkFalsy: true }).withMessage('You must type a confirmation password')
        .custom(function (value, _a) {
        var req = _a.req;
        return value === req.body.newPassword;
    }).withMessage('The passwords do not match'),
];
exports.verifyPasswordOtpParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.searchParams = [
    (0, express_validator_1.query)("skill").notEmpty(),
];
exports.getContractorParams = [
    (0, express_validator_1.query)("contractorId").notEmpty(),
    (0, express_validator_1.query)("skill").notEmpty(),
];
exports.updateProfileParams = [
    (0, express_validator_1.query)("fullName").notEmpty(),
    (0, express_validator_1.query)("location").notEmpty(),
    (0, express_validator_1.query)("phoneNumber").notEmpty(),
];
exports.acceptAndPayParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
];
exports.confirmPaymentParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
    (0, express_validator_1.body)("paymentId").notEmpty(),
];
exports.confirmInspectionPaymentParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
    (0, express_validator_1.body)("inspectionPaymemtId").notEmpty(),
];
exports.rateContractorParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
    (0, express_validator_1.body)("cleanliness")
        .isIn([1, 2, 3, 4, 5])
        .withMessage("cleanliness must be 1, 2, 3, 4, 0r 5"),
    (0, express_validator_1.body)("timeliness")
        .isIn([1, 2, 3, 4, 5])
        .withMessage("timeliness must be 1, 2, 3, 4, 0r 5"),
    (0, express_validator_1.body)("skill")
        .isIn([1, 2, 3, 4, 5])
        .withMessage("skill must be 1, 2, 3, 4, 0r 5"),
    (0, express_validator_1.body)("communication")
        .isIn([1, 2, 3, 4, 5])
        .withMessage("communication must be 1, 2, 3, 4, 0r 5"),
    (0, express_validator_1.body)("courteous")
        .isIn([1, 2, 3, 4, 5])
        .withMessage("courteous must be 1, 2, 3, 4, 0r 5"),
    (0, express_validator_1.body)("cleanlinessText").notEmpty(),
    (0, express_validator_1.body)("timelinessText").notEmpty(),
    (0, express_validator_1.body)("skillText").notEmpty(),
    (0, express_validator_1.body)("communicationText").notEmpty(),
    (0, express_validator_1.body)("courteousText").notEmpty(),
];
exports.createStripeSessionParams = [
    (0, express_validator_1.body)("mode").notEmpty(),
];
exports.jobListingParams = [
    (0, express_validator_1.body)("jobCategory").notEmpty(),
    (0, express_validator_1.body)("jobDescription").notEmpty(),
    (0, express_validator_1.body)("jobLocation").notEmpty(),
    (0, express_validator_1.body)("date").notEmpty(),
    (0, express_validator_1.body)("jobExpiry").notEmpty(),
    (0, express_validator_1.body)("contractorType").isIn([contractorAccountTypes_1.contractorAccountTypes.Company, contractorAccountTypes_1.contractorAccountTypes.Employee, contractorAccountTypes_1.contractorAccountTypes.Individual])
        .withMessage("contractorType must be ".concat(contractorAccountTypes_1.contractorAccountTypes.Company, ", ").concat(contractorAccountTypes_1.contractorAccountTypes.Employee, ", or ").concat(contractorAccountTypes_1.contractorAccountTypes.Individual)),
    (0, express_validator_1.body)("emergency").isIn(['yes', 'no'])
        .withMessage("emergency must be yes or no"),
];
exports.UpdateOrDeviceParams = [
    (0, express_validator_1.body)("deviceId").optional(),
    (0, express_validator_1.body)("deviceToken").notEmpty(),
];
exports.searchContractorByLocationParams = [
    (0, express_validator_1.query)("location").notEmpty(),
];
exports.searchContractorByCategoryDateParams = [
    (0, express_validator_1.query)("category").notEmpty(),
    (0, express_validator_1.query)("date").notEmpty(),
];
exports.searchCategoryDateParams = [
    (0, express_validator_1.query)("category").notEmpty(),
];
exports.filterContractorParams = [
    (0, express_validator_1.query)("distance").notEmpty(),
    (0, express_validator_1.query)("emergency").notEmpty(),
    (0, express_validator_1.query)("category").notEmpty(),
    (0, express_validator_1.query)("location").notEmpty(),
    (0, express_validator_1.query)("accountType").notEmpty(),
    (0, express_validator_1.query)("date").notEmpty(),
];
exports.sendJobRequestParams = [
    (0, express_validator_1.body)("contractorId").notEmpty(),
    (0, express_validator_1.body)("jobDescription").notEmpty(),
    (0, express_validator_1.body)("jobLocation").notEmpty(),
    (0, express_validator_1.body)("date").notEmpty(),
];
var validateFormData = function (req, res, next) {
    var errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};
exports.validateFormData = validateFormData;
exports.CustomerHttpRequest = {
    signupParams: exports.signupParams,
    emailVerificationParams: exports.emailVerificationParams,
    loginParams: exports.loginParams,
    forgotPasswordParams: exports.forgotPasswordParams,
    resetPasswordParams: exports.resetPasswordParams,
    changePasswordParams: exports.changePasswordParams,
    searchParams: exports.searchParams,
    getContractorParams: exports.getContractorParams,
    updateProfileParams: exports.updateProfileParams,
    acceptAndPayParams: exports.acceptAndPayParams,
    confirmPaymentParams: exports.confirmPaymentParams,
    confirmInspectionPaymentParams: exports.confirmInspectionPaymentParams,
    rateContractorParams: exports.rateContractorParams,
    verifyPasswordOtpParams: exports.verifyPasswordOtpParams,
    verifySocialSignon: exports.verifySocialSignon,
    createStripeSessionParams: exports.createStripeSessionParams,
    jobListingParams: exports.jobListingParams,
    searchContractorByLocationParams: exports.searchContractorByLocationParams,
    searchContractorByCategoryDateParams: exports.searchContractorByCategoryDateParams,
    searchCategoryDateParams: exports.searchCategoryDateParams,
    filterContractorParams: exports.filterContractorParams,
    sendJobRequestParams: exports.sendJobRequestParams,
    validateFormData: exports.validateFormData,
    UpdateOrDeviceParams: exports.UpdateOrDeviceParams
};
