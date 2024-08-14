"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerHttpRequest = exports.validateFormData = exports.sendMessageParams = exports.createJobDisputeParams = exports.tripArrivalComfirmParams = exports.createJoListingParams = exports.createJobRequestParams = exports.sendJobRequestParams = exports.queryContractorParams = exports.filterContractorParams = exports.searchCategoryDateParams = exports.searchContractorByCategoryDateParams = exports.searchContractorByLocationParams = exports.UpdateOrDeviceParams = exports.jobListingParams = exports.createStripeSessionParams = exports.rateContractorParams = exports.confirmInspectionPaymentParams = exports.confirmPaymentParams = exports.acceptAndPayParams = exports.updateProfileParams = exports.getContractorParams = exports.searchParams = exports.verifyPasswordOtpParams = exports.changePasswordParams = exports.resetPasswordParams = exports.forgotPasswordParams = exports.loginWithPhoneParams = exports.loginParams = exports.verifySocialSignon = exports.emailVerificationParams = exports.signupParams = void 0;
var express_validator_1 = require("express-validator");
var contractor_interface_1 = require("../../../database/contractor/interface/contractor.interface");
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
exports.loginWithPhoneParams = [
    (0, express_validator_1.body)("number").notEmpty(),
    (0, express_validator_1.body)("code").notEmpty(),
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
    (0, express_validator_1.body)("contractorType").isIn([contractor_interface_1.CONTRACTOR_TYPES.Company, contractor_interface_1.CONTRACTOR_TYPES.Employee, contractor_interface_1.CONTRACTOR_TYPES.Individual])
        .withMessage("contractorType must be ".concat(contractor_interface_1.CONTRACTOR_TYPES.Company, ", ").concat(contractor_interface_1.CONTRACTOR_TYPES.Employee, ", or ").concat(contractor_interface_1.CONTRACTOR_TYPES.Individual)),
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
exports.queryContractorParams = [
    (0, express_validator_1.query)("distance").if((0, express_validator_1.query)("distance").exists()).notEmpty().withMessage("Distance is required"),
    (0, express_validator_1.query)("emergencyJobs").if((0, express_validator_1.query)("emergencyJobs").exists()).notEmpty().withMessage("EmergencyJobs is required"),
    (0, express_validator_1.query)("category").if((0, express_validator_1.query)("category").exists()).notEmpty().withMessage("Category is required"),
    (0, express_validator_1.query)("accountType").if((0, express_validator_1.query)("accountType").exists()).notEmpty().withMessage("AccountType is required"),
    (0, express_validator_1.query)("date").if((0, express_validator_1.query)("date").exists()).notEmpty().notEmpty().withMessage("Date is required"),
    (0, express_validator_1.query)("isOffDuty").if((0, express_validator_1.query)("isOffDuty").exists()).notEmpty().notEmpty().withMessage("isOffDuty is required"),
    (0, express_validator_1.query)("availability").if((0, express_validator_1.query)("availability").exists()).notEmpty().withMessage("AvailableDays is required"),
    (0, express_validator_1.query)("experienceYear").if((0, express_validator_1.query)("experienceYear").exists()).notEmpty().withMessage("ExperienceYear is required"),
    (0, express_validator_1.query)("latitude").custom(function (value, _a) {
        var _b;
        var req = _a.req;
        if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.distance) && !value) {
            throw new Error("Latitude is required when Distance is specified");
        }
        return true;
    }),
    (0, express_validator_1.query)("longitude").custom(function (value, _a) {
        var _b;
        var req = _a.req;
        if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.distance) && !value) {
            throw new Error("Longitude is required when Distance is specified");
        }
        return true;
    }),
    (0, express_validator_1.query)("address").if((0, express_validator_1.query)("address").exists()).notEmpty().withMessage("Address is required"),
    (0, express_validator_1.query)("city").if((0, express_validator_1.query)("city").exists()).notEmpty().withMessage("City is required"),
    (0, express_validator_1.query)("country").if((0, express_validator_1.query)("country").exists()).notEmpty().withMessage("Country is required"),
];
exports.sendJobRequestParams = [
    (0, express_validator_1.body)("contractorId").notEmpty(),
    (0, express_validator_1.body)("jobDescription").notEmpty(),
    (0, express_validator_1.body)("jobLocation").notEmpty(),
    (0, express_validator_1.body)("date").notEmpty(),
];
exports.createJobRequestParams = [
    (0, express_validator_1.body)("contractorId").isMongoId(),
    (0, express_validator_1.body)("description").notEmpty(),
    (0, express_validator_1.body)('voiceDescription').optional().isObject().withMessage('Voice description must be an object')
        .bail() // Stop validation if media is not an object
        .custom(function (value, _a) {
        var req = _a.req;
        // Check if required properties exist in media object
        if (!('url' in value && typeof value.url === 'string' && value.url.trim() !== '')) {
            throw new Error('url is required');
        }
        return true;
    }),
    (0, express_validator_1.body)("location").notEmpty(),
    (0, express_validator_1.body)("media").optional(),
    (0, express_validator_1.body)("emergency").optional(),
    (0, express_validator_1.body)("date").optional(),
    (0, express_validator_1.body)("time").optional(),
];
exports.createJoListingParams = [
    (0, express_validator_1.body)("contractorType").optional(),
    (0, express_validator_1.body)("description").notEmpty(),
    (0, express_validator_1.body)("expiresIn").notEmpty(),
    (0, express_validator_1.body)("category").notEmpty(),
    (0, express_validator_1.body)('voiceDescription').optional().isObject().withMessage('Media must be an object')
        .bail() // Stop validation if media is not an object
        .custom(function (value, _a) {
        var req = _a.req;
        // Check if required properties exist in media object
        if (!('url' in value && typeof value.url === 'string' && value.url.trim() !== '')) {
            throw new Error('Media url is required');
        }
        return true;
    }),
    (0, express_validator_1.body)("location").notEmpty(),
    (0, express_validator_1.body)("media").optional().isArray(),
    (0, express_validator_1.body)("emergency").optional(),
    (0, express_validator_1.body)("date").notEmpty(),
    (0, express_validator_1.body)("time").optional(),
];
exports.tripArrivalComfirmParams = [
    (0, express_validator_1.body)("verificationCode").notEmpty(),
];
exports.createJobDisputeParams = [
    (0, express_validator_1.body)("evidence").optional(),
    (0, express_validator_1.body)("description").notEmpty(),
];
// Define the validation rules for the message request
exports.sendMessageParams = [
    (0, express_validator_1.body)('type').isIn(['TEXT', 'MEDIA', 'AUDIO', 'VIDEO', 'IMAGE']).withMessage('Invalid messageType'),
    (0, express_validator_1.body)('message').if((0, express_validator_1.body)('type').equals('TEXT')).notEmpty().withMessage('Message is required'),
    (0, express_validator_1.body)('media').if((0, express_validator_1.body)('type').isIn(['MEDIA', 'AUDIO', 'VIDEO', 'IMAGE'])).isArray().withMessage('Media must be an array')
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
    loginWithPhoneParams: exports.loginWithPhoneParams,
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
    UpdateOrDeviceParams: exports.UpdateOrDeviceParams,
    queryContractorParams: exports.queryContractorParams,
    createJobRequestParams: exports.createJobRequestParams,
    createJoListingParams: exports.createJoListingParams,
    tripArrivalComfirmParams: exports.tripArrivalComfirmParams,
    sendMessageParams: exports.sendMessageParams,
    createJobDisputeParams: exports.createJobDisputeParams
};
