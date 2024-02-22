"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
var express_validator_1 = require("express-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var otpGenerator_1 = require("../../../utils/otpGenerator");
var send_email_utility_1 = require("../../../utils/send_email_utility");
var sendEmailTemplate_1 = require("../../../templates/sendEmailTemplate");
var contractorWelcomeTemplate_1 = require("../../../templates/contractorEmail/contractorWelcomeTemplate");
var adminNotification_model_1 = __importDefault(require("../../../database/admin/models/adminNotification.model"));
var decorators_abstract_1 = require("../../../abstracts/decorators.abstract");
var base_abstract_1 = require("../../../abstracts/base.abstract");
var AuthHandler = /** @class */ (function (_super) {
    __extends(AuthHandler, _super);
    function AuthHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AuthHandler.prototype.signUp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, email, password, firstName, dateOfBirth, lastName, phoneNumber, acceptTerms, accountType, bussinessName, errors, userEmailExists, otp, createdTime, emailOtp, html, emailData, welcomeHtml, welcomeEmailData, hashedPassword, contractor, contractorSaved, adminNoti, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, dateOfBirth = _a.dateOfBirth, lastName = _a.lastName, phoneNumber = _a.phoneNumber, acceptTerms = _a.acceptTerms, accountType = _a.accountType, bussinessName = _a.bussinessName;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
                    case 2:
                        userEmailExists = _b.sent();
                        if (userEmailExists) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Email exists already" })];
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
                    case 3:
                        _b.sent();
                        welcomeHtml = (0, contractorWelcomeTemplate_1.htmlContractorWelcomeTemplate)(firstName);
                        welcomeEmailData = {
                            emailTo: email,
                            subject: "Welcome",
                            html: welcomeHtml
                        };
                        return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(welcomeEmailData)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                    case 5:
                        hashedPassword = _b.sent();
                        contractor = new contractor_model_1.ContractorModel({
                            email: email,
                            firstName: firstName,
                            dateOfBirth: dateOfBirth,
                            lastName: lastName,
                            password: hashedPassword,
                            emailOtp: emailOtp,
                            phoneNumber: phoneNumber,
                            acceptTerms: acceptTerms,
                            accountType: accountType
                        });
                        if (accountType == 'Company' && bussinessName) {
                            // create profile here
                        }
                        return [4 /*yield*/, contractor.save()];
                    case 6:
                        contractorSaved = _b.sent();
                        adminNoti = new adminNotification_model_1.default({
                            title: "New Account Created",
                            message: "A contractor - ".concat(firstName, " just created an account."),
                            status: "unseen"
                        });
                        return [4 /*yield*/, adminNoti.save()];
                    case 7:
                        _b.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                message: "Signup successful",
                                data: contractor,
                            })];
                    case 8:
                        err_1 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_1.message })];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.verifyEmail = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, email, otp, errors, contractor, timeDiff, accessToken, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        _a = req.body, email = _a.email, otp = _a.otp;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: "validation errors", errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
                    case 2:
                        contractor = _b.sent();
                        // check if contractor exists
                        if (!contractor) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "invalid email" })];
                        }
                        if (contractor.emailOtp.otp != otp) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "invalid otp" })];
                        }
                        if (contractor.emailOtp.verified) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "email already verified" })];
                        }
                        timeDiff = new Date().getTime() - contractor.emailOtp.createdTime.getTime();
                        if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: "otp expired" })];
                        }
                        contractor.emailOtp.verified = true;
                        return [4 /*yield*/, contractor.save()];
                    case 3:
                        _b.sent();
                        accessToken = jsonwebtoken_1.default.sign({
                            id: contractor === null || contractor === void 0 ? void 0 : contractor._id,
                            email: contractor.email,
                        }, process.env.JWT_CONTRACTOR_SECRET_KEY, { expiresIn: "24h" });
                        // return access token
                        return [2 /*return*/, res.json({
                                success: true,
                                message: "Login successful",
                                Token: accessToken,
                                contractor: contractor
                            })];
                    case 4:
                        err_2 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_2.message })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.signin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, email, password, errors, contractor, isPasswordMatch, profile, accessToken, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        _a = req.body, email = _a.email, password = _a.password;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
                    case 2:
                        contractor = _b.sent();
                        // check if user exists
                        if (!contractor) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "invalid credential" })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(password, contractor.password)];
                    case 3:
                        isPasswordMatch = _b.sent();
                        if (!isPasswordMatch) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "incorrect credential." })];
                        }
                        if (!contractor.emailOtp.verified) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "email not verified." })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email }).select('-password')];
                    case 4:
                        profile = _b.sent();
                        accessToken = jsonwebtoken_1.default.sign({
                            id: contractor === null || contractor === void 0 ? void 0 : contractor._id,
                            email: contractor.email,
                        }, process.env.JWT_CONTRACTOR_SECRET_KEY, { expiresIn: "24h" });
                        // return access token
                        return [2 /*return*/, res.json({
                                success: true,
                                message: "Login successful",
                                Token: accessToken,
                                profile: profile
                            })];
                    case 5:
                        err_3 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_3.message })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.resendEmail = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, email, errors, contractor, otp, createdTime, html, emailData, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        email = req.body.email;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
                    case 2:
                        contractor = _a.sent();
                        // check if contractor exists
                        if (!contractor) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "invalid email" })];
                        }
                        if (contractor.emailOtp.verified) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "email already verified" })];
                        }
                        otp = (0, otpGenerator_1.generateOTP)();
                        createdTime = new Date();
                        contractor.emailOtp = {
                            otp: otp,
                            createdTime: createdTime,
                            verified: false
                        };
                        return [4 /*yield*/, (contractor === null || contractor === void 0 ? void 0 : contractor.save())];
                    case 3:
                        _a.sent();
                        html = (0, sendEmailTemplate_1.htmlMailTemplate)(otp, contractor.firstName, "We have received a request to verify your email");
                        emailData = {
                            emailTo: email,
                            subject: "email verification",
                            html: html
                        };
                        (0, send_email_utility_1.sendEmail)(emailData);
                        return [2 /*return*/, res.status(200).json({ success: true, message: "OTP sent successfully to your email." })];
                    case 4:
                        err_4 = _a.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_4.message })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.forgotPassword = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, email, errors, contractor, otp, createdTime, html, emailData, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        email = req.body.email;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'validation errors', errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
                    case 2:
                        contractor = _a.sent();
                        // check if user exists
                        if (!contractor) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "invalid email" })];
                        }
                        otp = (0, otpGenerator_1.generateOTP)();
                        createdTime = new Date();
                        contractor.passwordOtp = {
                            otp: otp,
                            createdTime: createdTime,
                            verified: true
                        };
                        return [4 /*yield*/, (contractor === null || contractor === void 0 ? void 0 : contractor.save())];
                    case 3:
                        _a.sent();
                        html = (0, sendEmailTemplate_1.htmlMailTemplate)(otp, contractor.firstName, "We have received a request to change your password");
                        emailData = {
                            emailTo: email,
                            subject: "constractor password change",
                            html: html
                        };
                        (0, send_email_utility_1.sendEmail)(emailData);
                        return [2 /*return*/, res.status(200).json({ success: true, message: "OTP sent successfully to your email." })];
                    case 4:
                        err_5 = _a.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_5.message })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.resetPassword = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, email, otp, password, errors, contractor, _b, createdTime, verified, timeDiff, hashedPassword, err_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        _a = req.body, email = _a.email, otp = _a.otp, password = _a.password;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
                    case 2:
                        contractor = _c.sent();
                        // check if contractor exists
                        if (!contractor) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "invalid email" })];
                        }
                        _b = contractor.passwordOtp, createdTime = _b.createdTime, verified = _b.verified;
                        timeDiff = new Date().getTime() - createdTime.getTime();
                        if (!verified || timeDiff > otpGenerator_1.OTP_EXPIRY_TIME || otp !== contractor.passwordOtp.otp) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ sucess: false, message: "unable to reset password" })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                    case 3:
                        hashedPassword = _c.sent();
                        contractor.password = hashedPassword;
                        contractor.passwordOtp.verified = false;
                        return [4 /*yield*/, contractor.save()];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, message: "password successfully change" })];
                    case 5:
                        err_6 = _c.sent();
                        // signup error
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_6.message })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.verifyResetPasswordOtp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, email, otp, errors, contractor, createdTime, timeDiff, err_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = req.body, email = _a.email, otp = _a.otp;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
                    case 2:
                        contractor = _b.sent();
                        // check if contractor exists
                        if (!contractor) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "invalid email" })];
                        }
                        createdTime = contractor.passwordOtp.createdTime;
                        timeDiff = new Date().getTime() - createdTime.getTime();
                        if (otp !== contractor.passwordOtp.otp) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ sucess: false, message: "invalid password reset otp" })];
                        }
                        if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ sucess: false, message: "reset password otp has expired" })];
                        }
                        return [2 /*return*/, res.status(200).json({ success: true, message: "password reset otp verified" })];
                    case 3:
                        err_7 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_7.message })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AuthHandler.prototype, "signUp", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AuthHandler.prototype, "verifyEmail", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AuthHandler.prototype, "signin", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AuthHandler.prototype, "resendEmail", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AuthHandler.prototype, "forgotPassword", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AuthHandler.prototype, "resetPassword", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AuthHandler.prototype, "verifyResetPasswordOtp", null);
    return AuthHandler;
}(base_abstract_1.Base));
var AuthController = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new (AuthHandler.bind.apply(AuthHandler, __spreadArray([void 0], args, false)))();
};
exports.AuthController = AuthController;
