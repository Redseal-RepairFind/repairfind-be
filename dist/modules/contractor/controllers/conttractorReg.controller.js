"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorResendEmailController = exports.contractorUpdateBioController = exports.contractorDeatilController = exports.contractorSignInController = exports.contractorVerifiedEmailController = exports.contractorSignUpController = void 0;
var express_validator_1 = require("express-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var otpGenerator_1 = require("../../../utils/otpGenerator");
var send_email_utility_1 = require("../../../utils/send_email_utility");
var contractorDocumentValidate_model_1 = __importDefault(require("../../../database/contractor/models/contractorDocumentValidate.model"));
var upload_utility_1 = require("../../../utils/upload.utility");
var uuid_1 = require("uuid");
var sendEmailTemplate_1 = require("../../../templates/sendEmailTemplate");
var contractorWelcomeTemplate_1 = require("../../../templates/contractorEmail/contractorWelcomeTemplate");
var contractorAvaliability_model_1 = __importDefault(require("../../../database/contractor/models/contractorAvaliability.model"));
var job_model_1 = __importDefault(require("../../../database/contractor/models/job.model"));
var adminNotification_model_1 = __importDefault(require("../../../database/admin/models/adminNotification.model"));
//contractor signup /////////////
var contractorSignUpController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, firstName, dateOfBirth, lastName, errors, userEmailExists, otp, createdTime, emailOtp, html, emailData, welcomeHtml, welcomeEmailData, hashedPassword, contractor, contractorSaved, adminNoti, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, dateOfBirth = _a.dateOfBirth, lastName = _a.lastName;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
            case 1:
                userEmailExists = _b.sent();
                // check if user exists
                if (userEmailExists) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Email exists already" })];
                }
                otp = (0, otpGenerator_1.generateOTP)();
                createdTime = new Date();
                emailOtp = {
                    otp: otp,
                    createdTime: createdTime,
                    verified: false
                };
                html = (0, sendEmailTemplate_1.htmlMailTemplate)(otp, firstName, "We have received a request to verify your email");
                emailData = {
                    emailTo: email,
                    subject: "email verification",
                    html: html
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(emailData)];
            case 2:
                _b.sent();
                welcomeHtml = (0, contractorWelcomeTemplate_1.htmlContractorWelcomeTemplate)(firstName);
                welcomeEmailData = {
                    emailTo: email,
                    subject: "Welcome",
                    html: welcomeHtml
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(welcomeEmailData)];
            case 3:
                _b.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 4:
                hashedPassword = _b.sent();
                contractor = new contractor_model_1.ContractorModel({
                    email: email,
                    firstName: firstName,
                    dateOfBirth: dateOfBirth,
                    lastName: lastName,
                    password: hashedPassword,
                    emailOtp: emailOtp
                });
                return [4 /*yield*/, contractor.save()];
            case 5:
                contractorSaved = _b.sent();
                adminNoti = new adminNotification_model_1.default({
                    title: "New Account Created",
                    message: "A contractor - ".concat(firstName, " just created an account."),
                    status: "unseen"
                });
                return [4 /*yield*/, adminNoti.save()];
            case 6:
                _b.sent();
                res.json({
                    message: "Signup successful",
                    user: {
                        id: contractorSaved._id,
                        firstName: contractorSaved.firstName,
                        lastName: contractorSaved.lastName,
                        email: contractorSaved.email,
                        dateOfbirth: contractorSaved.dateOfBirth,
                    },
                });
                return [3 /*break*/, 8];
            case 7:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.contractorSignUpController = contractorSignUpController;
//contractor verified email /////////////
var contractorVerifiedEmailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, errors, contractor, timeDiff, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, otp = _a.otp;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
            case 1:
                contractor = _b.sent();
                // check if contractor exists
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid email" })];
                }
                if (contractor.emailOtp.otp != otp) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid otp" })];
                }
                if (contractor.emailOtp.verified) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "email already verified" })];
                }
                timeDiff = new Date().getTime() - contractor.emailOtp.createdTime.getTime();
                if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
                    return [2 /*return*/, res.status(400).json({ message: "otp expired" })];
                }
                contractor.emailOtp.verified = true;
                return [4 /*yield*/, contractor.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res.json({ message: "email verified successfully" })];
            case 3:
                err_2 = _b.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.contractorVerifiedEmailController = contractorVerifiedEmailController;
//contractor signin /////////////
var contractorSignInController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, errors, contractor, isPasswordMatch, profile, accessToken, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
            case 1:
                contractor = _b.sent();
                // check if user exists
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, contractor.password)];
            case 2:
                isPasswordMatch = _b.sent();
                if (!isPasswordMatch) {
                    return [2 /*return*/, res.status(401).json({ message: "incorrect credential." })];
                }
                if (!contractor.emailOtp.verified) {
                    return [2 /*return*/, res.status(401).json({ message: "email not verified." })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email }).select('-password')];
            case 3:
                profile = _b.sent();
                accessToken = jsonwebtoken_1.default.sign({
                    id: contractor === null || contractor === void 0 ? void 0 : contractor._id,
                    email: contractor.email,
                }, process.env.JWT_CONTRACTOR_SECRET_KEY, { expiresIn: "24h" });
                // return access token
                res.json({
                    message: "Login successful",
                    Token: accessToken,
                    profile: profile
                });
                return [3 /*break*/, 5];
            case 4:
                err_3 = _b.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.contractorSignInController = contractorSignInController;
//contractor detail /////////////
var contractorDeatilController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, files, errors, contractor, contractorId, contractorProfile, contractorDocument, avialability, totalPendingJob, pendingJobs, pendingAmount, index, pendingJob, totalCompletedJob, completedJobs, completedAmount, index, completedJob, totalComplainedJob, complainedJobs, complainedAmount, index, complainedJob, totalNegletedJob, negletedJobs, negletedAmount, index, negletedJob, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 12, , 13]);
                _a = req.body;
                files = req.files;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId }).select('-password')];
            case 1:
                contractorProfile = _b.sent();
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.findOne({ contractorId: contractorId })];
            case 2:
                contractorDocument = _b.sent();
                return [4 /*yield*/, contractorAvaliability_model_1.default.find({ contractorId: contractorId })
                    // contractor pending job detail
                ];
            case 3:
                avialability = _b.sent();
                return [4 /*yield*/, job_model_1.default.countDocuments({ contractorId: contractorId, status: "sent qoutation" })];
            case 4:
                totalPendingJob = _b.sent();
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractorId, status: "sent qoutation" })];
            case 5:
                pendingJobs = _b.sent();
                pendingAmount = 0;
                for (index = 0; index < pendingJobs.length; index++) {
                    pendingJob = pendingJobs[index];
                    pendingAmount = pendingAmount + pendingJob.totalAmountContractorWithdraw;
                }
                return [4 /*yield*/, job_model_1.default.countDocuments({ contractorId: contractorId, status: "comfirmed" })];
            case 6:
                totalCompletedJob = _b.sent();
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractorId, status: "comfirmed" })];
            case 7:
                completedJobs = _b.sent();
                completedAmount = 0;
                for (index = 0; index < completedJobs.length; index++) {
                    completedJob = completedJobs[index];
                    completedAmount = completedAmount + completedJob.totalAmountContractorWithdraw;
                }
                return [4 /*yield*/, job_model_1.default.countDocuments({ contractorId: contractorId, status: "complain" })];
            case 8:
                totalComplainedJob = _b.sent();
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractorId, status: "complain" })];
            case 9:
                complainedJobs = _b.sent();
                complainedAmount = 0;
                for (index = 0; index < complainedJobs.length; index++) {
                    complainedJob = complainedJobs[index];
                    complainedAmount = complainedAmount + complainedJob.totalAmountContractorWithdraw;
                }
                return [4 /*yield*/, job_model_1.default.countDocuments({ contractorId: contractorId, status: "job reject" })];
            case 10:
                totalNegletedJob = _b.sent();
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractorId, status: "job reject" })];
            case 11:
                negletedJobs = _b.sent();
                negletedAmount = 0;
                for (index = 0; index < negletedJobs.length; index++) {
                    negletedJob = negletedJobs[index];
                    negletedAmount = negletedAmount + negletedJob.totalAmountContractorWithdraw;
                }
                res.json({
                    contractorProfile: contractorProfile,
                    contractorDocument: contractorDocument,
                    avialability: avialability,
                    pendingJob: {
                        totalPendingJob: totalPendingJob,
                        pendingAmount: pendingAmount
                    },
                    completedJob: {
                        totalCompletedJob: totalCompletedJob,
                        completedAmount: completedAmount
                    },
                    complainedJob: {
                        totalComplainedJob: totalComplainedJob,
                        complainedAmount: complainedAmount
                    },
                    negletedJob: {
                        totalNegletedJob: totalNegletedJob,
                        negletedAmount: negletedAmount
                    }
                });
                return [3 /*break*/, 13];
            case 12:
                err_4 = _b.sent();
                // signup error
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.contractorDeatilController = contractorDeatilController;
//contractor update bio /////////////
var contractorUpdateBioController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, location_1, bio, file, errors, contractor, contractorId, contractorProfile, contractorDocument, profileImage, filename, result, updateBioData, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, location_1 = _a.location, bio = _a.bio;
                file = req.file;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorProfile = _b.sent();
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.findOne({ contractorId: contractorId })];
            case 2:
                contractorDocument = _b.sent();
                profileImage = void 0;
                if (!!file) return [3 /*break*/, 3];
                return [3 /*break*/, 5];
            case 3:
                filename = (0, uuid_1.v4)();
                return [4 /*yield*/, (0, upload_utility_1.uploadToS3)(req.file.buffer, "".concat(filename, ".jpg"))];
            case 4:
                result = _b.sent();
                profileImage = result === null || result === void 0 ? void 0 : result.Location;
                _b.label = 5;
            case 5: return [4 /*yield*/, contractor_model_1.ContractorModel.findOneAndUpdate({ _id: contractorId }, {
                    location: location_1,
                    profileImage: profileImage,
                    bio: bio
                }, { new: true })];
            case 6:
                updateBioData = _b.sent();
                res.json({
                    message: "Data successfully updated",
                });
                return [3 /*break*/, 8];
            case 7:
                err_5 = _b.sent();
                // signup error
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.contractorUpdateBioController = contractorUpdateBioController;
//contractor resend for verification email /////////////
var ContractorResendEmailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, errors, contractor, otp, createdTime, html, emailData, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                email = req.body.email;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
            case 1:
                contractor = _a.sent();
                // check if contractor exists
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid email" })];
                }
                if (contractor.emailOtp.verified) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "email already verified" })];
                }
                otp = (0, otpGenerator_1.generateOTP)();
                createdTime = new Date();
                contractor.emailOtp = {
                    otp: otp,
                    createdTime: createdTime,
                    verified: false
                };
                return [4 /*yield*/, (contractor === null || contractor === void 0 ? void 0 : contractor.save())];
            case 2:
                _a.sent();
                html = (0, sendEmailTemplate_1.htmlMailTemplate)(otp, contractor.firstName, "We have received a request to verify your email");
                emailData = {
                    emailTo: email,
                    subject: "email verification",
                    html: html
                };
                (0, send_email_utility_1.sendEmail)(emailData);
                return [2 /*return*/, res.status(200).json({ message: "OTP sent successfully to your email." })];
            case 3:
                err_6 = _a.sent();
                // signup error
                res.status(500).json({ message: err_6.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.ContractorResendEmailController = ContractorResendEmailController;
