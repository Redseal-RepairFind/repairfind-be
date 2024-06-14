"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCustomerRateContractorParams = exports.validateComfirmInspectionPaymentParams = exports.validateComfirmPaymentParams = exports.validateAcceptAndPayParams = exports.validateCustomerUpdateProfileParams = exports.validateCustomerGetContractorParams = exports.validateContractorSearckParams = exports.validatecustomerResetPasswprdParams = exports.validatecustomerForgotPasswordParams = exports.validatecustomeLoginParams = exports.validatecustomerEmailverificationParams = exports.validateSignupParams = void 0;
var express_validator_1 = require("express-validator");
exports.validateSignupParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("fullName").notEmpty(),
    (0, express_validator_1.body)("phonenumber").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validatecustomerEmailverificationParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.validatecustomeLoginParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validatecustomerForgotPasswordParams = [
    (0, express_validator_1.body)("email").isEmail(),
];
exports.validatecustomerResetPasswprdParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateContractorSearckParams = [
    (0, express_validator_1.query)("skill").notEmpty(),
];
exports.validateCustomerGetContractorParams = [
    (0, express_validator_1.query)("contractorId").notEmpty(),
    (0, express_validator_1.query)("skill").notEmpty(),
];
exports.validateCustomerUpdateProfileParams = [
    (0, express_validator_1.query)("fullName").notEmpty(),
    (0, express_validator_1.query)("location").notEmpty(),
    (0, express_validator_1.query)("phoneNumber").notEmpty(),
];
exports.validateAcceptAndPayParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
];
exports.validateComfirmPaymentParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
    (0, express_validator_1.body)("paymentId").notEmpty(),
];
exports.validateComfirmInspectionPaymentParams = [
    (0, express_validator_1.body)("jobId").notEmpty(),
    (0, express_validator_1.body)("inspectionPaymemtId").notEmpty(),
];
exports.validateCustomerRateContractorParams = [
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
