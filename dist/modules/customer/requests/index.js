"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerHttpRequest = exports.rateContractorParams = exports.confirmInspectionPaymentParams = exports.confirmPaymentParams = exports.acceptAndPayParams = exports.updateProfileParams = exports.getContractorParams = exports.searchParams = exports.verifyPasswordOtpParams = exports.changePasswordParams = exports.resetPasswordParams = exports.forgotPasswordParams = exports.loginParams = exports.verifySocialSignon = exports.emailVerificationParams = exports.signupParams = void 0;
var express_validator_1 = require("express-validator");
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
    verifySocialSignon: exports.verifySocialSignon
};
