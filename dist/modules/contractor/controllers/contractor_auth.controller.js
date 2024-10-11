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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var OtpEmailTemplate_1 = require("../../../templates/common/OtpEmailTemplate");
var welcome_email_1 = require("../../../templates/contractor/welcome_email");
var decorators_abstract_1 = require("../../../abstracts/decorators.abstract");
var base_abstract_1 = require("../../../abstracts/base.abstract");
var services_1 = require("../../../services");
var config_1 = require("../../../config");
var twillio_1 = __importDefault(require("../../../services/twillio"));
var i18n_1 = require("../../../i18n");
var generator_util_1 = require("../../../utils/generator.util");
var referral_code_schema_1 = require("../../../database/common/referral_code.schema");
var referral_schema_1 = require("../../../database/common/referral.schema");
var promotion_events_1 = require("../../../events/promotion.events");
var events_1 = require("../../../events");
var AuthHandler = /** @class */ (function (_super) {
    __extends(AuthHandler, _super);
    function AuthHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AuthHandler.prototype.signUp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, email, password, firstName, dateOfBirth, lastName, phoneNumber, acceptTerms, accountType, companyName, language, referralCode, errors, userEmailExists, userPhoneExists, otp, createdTime, emailOtp, hashedPassword, contractor, userReferral, referral, newReferralCode, html, translatedHtml, translatedSubject, welcomeHtml, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 17, , 18]);
                        _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, dateOfBirth = _a.dateOfBirth, lastName = _a.lastName, phoneNumber = _a.phoneNumber, acceptTerms = _a.acceptTerms, accountType = _a.accountType, companyName = _a.companyName, language = _a.language, referralCode = _a.referralCode;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
                    case 2:
                        userEmailExists = _b.sent();
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ "phoneNumber.code": phoneNumber.code, "phoneNumber.number": phoneNumber.number })];
                    case 3:
                        userPhoneExists = _b.sent();
                        if (userEmailExists) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Email exists already" })];
                        }
                        if (userPhoneExists) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Phone exists already" })];
                        }
                        otp = (0, otpGenerator_1.generateOTP)();
                        createdTime = new Date();
                        emailOtp = {
                            otp: otp,
                            createdTime: createdTime,
                            verified: false
                        };
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                    case 4:
                        hashedPassword = _b.sent();
                        return [4 /*yield*/, contractor_model_1.ContractorModel.create({
                                email: email,
                                firstName: firstName,
                                dateOfBirth: dateOfBirth,
                                lastName: lastName,
                                password: hashedPassword,
                                emailOtp: emailOtp,
                                phoneNumber: phoneNumber,
                                acceptTerms: acceptTerms,
                                accountType: accountType,
                                companyName: companyName,
                                language: language
                            })];
                    case 5:
                        contractor = _b.sent();
                        if (!referralCode) return [3 /*break*/, 8];
                        return [4 /*yield*/, referral_code_schema_1.ReferralCodeModel.findOne({ code: referralCode })];
                    case 6:
                        userReferral = _b.sent();
                        if (!userReferral) return [3 /*break*/, 8];
                        referral = new referral_schema_1.ReferralModel({
                            referralCode: userReferral.id,
                            user: contractor._id,
                            userType: 'contractors',
                            referrer: userReferral.user,
                            referrerType: userReferral.userType,
                            metadata: {},
                            date: new Date(),
                        });
                        contractor.referral = referral._id;
                        return [4 /*yield*/, Promise.all([
                                referral.save(),
                                contractor.save()
                            ])];
                    case 7:
                        _b.sent();
                        promotion_events_1.PromotionEvent.emit('NEW_REFERRAL', { referral: referral });
                        _b.label = 8;
                    case 8: return [4 /*yield*/, generator_util_1.GeneratorUtil.generateReferralCode({ length: 6, userId: contractor.id, userType: 'contractors' })];
                    case 9:
                        newReferralCode = _b.sent();
                        contractor.referralCode = newReferralCode;
                        return [4 /*yield*/, contractor.save()];
                    case 10:
                        _b.sent();
                        html = (0, OtpEmailTemplate_1.OtpEmailTemplate)(otp, firstName !== null && firstName !== void 0 ? firstName : companyName, "We have received a request to verify your email");
                        return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true, contentType: 'html' })];
                    case 11:
                        translatedHtml = (_b.sent()) || html;
                        return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: "Email Verification", targetLang: contractor.language })];
                    case 12:
                        translatedSubject = (_b.sent()) || 'Email Verification';
                        return [4 /*yield*/, services_1.EmailService.send(email, translatedSubject, translatedHtml)];
                    case 13:
                        _b.sent();
                        welcomeHtml = (0, welcome_email_1.ContractorWelcomeTemplate)(firstName !== null && firstName !== void 0 ? firstName : companyName);
                        return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: welcomeHtml, targetLang: contractor.language, saveToFile: false, useGoogle: true, contentType: 'html' })];
                    case 14:
                        translatedHtml = (_b.sent()) || welcomeHtml;
                        return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: "Welcome to Repairfind", targetLang: contractor.language })];
                    case 15:
                        translatedSubject = (_b.sent()) || 'Welcome to Repairfind';
                        return [4 /*yield*/, services_1.EmailService.send(email, translatedSubject, translatedHtml)];
                    case 16:
                        _b.sent();
                        events_1.AccountEvent.emit('NEW_CONTRACTOR', { contractor: contractor });
                        return [2 /*return*/, res.json({
                                success: true,
                                message: "Signup successful",
                                data: contractor,
                            })];
                    case 17:
                        err_1 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_1.message })];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.verifyEmail = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _b, email, otp, currentTimezone, errors, contractor, timeDiff, accessToken, quiz, contractorResponse, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        _b = req.body, email = _b.email, otp = _b.otp, currentTimezone = _b.currentTimezone;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: "validation errors", errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
                    case 2:
                        contractor = _c.sent();
                        if (!contractor) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "invalid email" })];
                        }
                        if (contractor.emailOtp.otp != otp) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "invalid otp" })];
                        }
                        if (contractor.emailOtp.verified) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "email already verified" })];
                        }
                        timeDiff = new Date().getTime() - contractor.emailOtp.createdTime.getTime();
                        if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: "otp expired" })];
                        }
                        contractor.emailOtp.verified = true;
                        contractor.currentTimezone = currentTimezone;
                        return [4 /*yield*/, contractor.save()];
                    case 3:
                        _c.sent();
                        accessToken = jsonwebtoken_1.default.sign({
                            id: contractor === null || contractor === void 0 ? void 0 : contractor._id, email: contractor.email, userType: 'contractors',
                        }, process.env.JWT_SECRET_KEY, { expiresIn: config_1.config.jwt.tokenLifetime });
                        return [4 /*yield*/, (contractor === null || contractor === void 0 ? void 0 : contractor.quiz)];
                    case 4:
                        quiz = (_a = _c.sent()) !== null && _a !== void 0 ? _a : null;
                        contractorResponse = __assign(__assign({}, contractor.toJSON()), { quiz: quiz });
                        // return access token
                        return [2 /*return*/, res.json({
                                success: true,
                                message: "Email verified successful",
                                accessToken: accessToken,
                                expiresIn: config_1.config.jwt.tokenLifetime,
                                user: contractorResponse
                            })];
                    case 5:
                        err_2 = _c.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_2.message })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.sendPhoneOtp = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var req, res, contractorId, contractor, phoneNumber, err_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        contractorId = req.contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
                    case 2:
                        contractor = _c.sent();
                        if (!contractor) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: "Account not found" })];
                        }
                        if (contractor.phoneNumber && (contractor === null || contractor === void 0 ? void 0 : contractor.phoneNumber.verifiedAt)) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Phone already verified" })];
                        }
                        phoneNumber = "".concat((_a = contractor === null || contractor === void 0 ? void 0 : contractor.phoneNumber) === null || _a === void 0 ? void 0 : _a.code).concat((_b = contractor === null || contractor === void 0 ? void 0 : contractor.phoneNumber) === null || _b === void 0 ? void 0 : _b.number);
                        return [4 /*yield*/, twillio_1.default.sendVerificationCode(phoneNumber)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, message: "OTP sent successfully to your phone." })];
                    case 4:
                        err_3 = _c.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_3.message })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.verifyPhone = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var req, res, otp, contractorId, contractor, phoneNumber, verified, err_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        otp = req.body.otp;
                        if (!otp) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: "Otp is required", })];
                        }
                        contractorId = req.contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
                    case 2:
                        contractor = _c.sent();
                        if (!contractor) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: "Account not found" })];
                        }
                        phoneNumber = "".concat((_a = contractor === null || contractor === void 0 ? void 0 : contractor.phoneNumber) === null || _a === void 0 ? void 0 : _a.code).concat((_b = contractor === null || contractor === void 0 ? void 0 : contractor.phoneNumber) === null || _b === void 0 ? void 0 : _b.number);
                        return [4 /*yield*/, twillio_1.default.verifyCode(phoneNumber, otp)];
                    case 3:
                        verified = _c.sent();
                        if (!verified) {
                            return [2 /*return*/, res.status(422).json({
                                    success: false,
                                    message: "Phone verification failed",
                                })];
                        }
                        if (contractor.phoneNumber) {
                            contractor.phoneNumber.verifiedAt = new Date();
                        }
                        return [4 /*yield*/, contractor.save()];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                message: "Phone verified successful",
                            })];
                    case 5:
                        err_4 = _c.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: 'Error verifying phone number' })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.signin = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _b, email, password, currentTimezone, errors, contractor, isPasswordMatch, quiz, _c, accessToken, newReferralCode, contractorResponse, err_5;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 9, , 10]);
                        _b = req.body, email = _b.email, password = _b.password, currentTimezone = _b.currentTimezone;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email }).populate('profile')];
                    case 2:
                        contractor = _d.sent();
                        if (!contractor) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "invalid credential" })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(password, contractor.password)];
                    case 3:
                        isPasswordMatch = _d.sent();
                        if (!isPasswordMatch) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Incorrect credential." })];
                        }
                        if (!contractor.emailOtp.verified) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Email not verified." })];
                        }
                        return [4 /*yield*/, (contractor === null || contractor === void 0 ? void 0 : contractor.quiz)];
                    case 4:
                        quiz = (_a = _d.sent()) !== null && _a !== void 0 ? _a : null;
                        _c = contractor;
                        return [4 /*yield*/, contractor.getOnboarding()
                            // generate access token
                        ];
                    case 5:
                        _c.onboarding = _d.sent();
                        accessToken = jsonwebtoken_1.default.sign({
                            id: contractor === null || contractor === void 0 ? void 0 : contractor._id, email: contractor.email, userType: 'contractors',
                        }, process.env.JWT_SECRET_KEY, { expiresIn: config_1.config.jwt.tokenLifetime });
                        if (!!contractor.referralCode) return [3 /*break*/, 7];
                        return [4 /*yield*/, generator_util_1.GeneratorUtil.generateReferralCode({ length: 6, userId: contractor.id, userType: 'contractors' })];
                    case 6:
                        newReferralCode = _d.sent();
                        contractor.referralCode = newReferralCode;
                        _d.label = 7;
                    case 7:
                        contractor.currentTimezone = currentTimezone;
                        return [4 /*yield*/, contractor.save()];
                    case 8:
                        _d.sent();
                        contractorResponse = __assign(__assign({}, contractor.toJSON()), { quiz: quiz });
                        return [2 /*return*/, res.json({
                                success: true,
                                message: "Login successful",
                                accessToken: accessToken,
                                expiresIn: config_1.config.jwt.tokenLifetime,
                                user: contractorResponse
                            })];
                    case 9:
                        err_5 = _d.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_5.message })];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.signinWithPhone = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _b, password, number, code, currentTimezone, errors, contractor, isPasswordMatch, quiz, _c, contractorResponse, accessToken, newReferralCode, err_6;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 9, , 10]);
                        _b = req.body, password = _b.password, number = _b.number, code = _b.code, currentTimezone = _b.currentTimezone;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ 'phoneNumber.number': number, 'phoneNumber.code': code })];
                    case 2:
                        contractor = _d.sent();
                        if (!contractor) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "Invalid credential" })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(password, contractor.password)];
                    case 3:
                        isPasswordMatch = _d.sent();
                        if (!isPasswordMatch) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Incorrect credential." })];
                        }
                        if (!contractor.emailOtp.verified) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Email not verified." })];
                        }
                        return [4 /*yield*/, (contractor === null || contractor === void 0 ? void 0 : contractor.quiz)];
                    case 4:
                        quiz = (_a = _d.sent()) !== null && _a !== void 0 ? _a : null;
                        _c = contractor;
                        return [4 /*yield*/, contractor.getOnboarding()];
                    case 5:
                        _c.onboarding = _d.sent();
                        contractorResponse = __assign(__assign({}, contractor.toJSON()), { quiz: quiz });
                        accessToken = jsonwebtoken_1.default.sign({
                            id: contractor === null || contractor === void 0 ? void 0 : contractor._id, email: contractor.email, userType: 'contractors',
                        }, process.env.JWT_SECRET_KEY, { expiresIn: config_1.config.jwt.tokenLifetime });
                        if (!!contractor.referralCode) return [3 /*break*/, 7];
                        return [4 /*yield*/, generator_util_1.GeneratorUtil.generateReferralCode({ length: 6, userId: contractor.id, userType: 'contractors' })];
                    case 6:
                        newReferralCode = _d.sent();
                        contractor.referralCode = newReferralCode;
                        _d.label = 7;
                    case 7:
                        contractor.currentTimezone = currentTimezone;
                        return [4 /*yield*/, contractor.save()
                            // return access token
                        ];
                    case 8:
                        _d.sent();
                        // return access token
                        return [2 /*return*/, res.json({
                                success: true,
                                message: "Login successful",
                                accessToken: accessToken,
                                expiresIn: config_1.config.jwt.tokenLifetime,
                                user: contractorResponse
                            })];
                    case 9:
                        err_6 = _d.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_6.message })];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.resendEmail = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, email, errors, contractor, otp, createdTime, html, translatedHtml, translatedSubject, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        email = req.body.email;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid inputs', errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
                    case 2:
                        contractor = _a.sent();
                        if (!contractor) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Invalid email" })];
                        }
                        if (contractor.emailOtp.verified) {
                            // return res.status(401).json({ success: false, message: "Email already verified" });
                        }
                        otp = (0, otpGenerator_1.generateOTP)();
                        createdTime = new Date();
                        contractor.emailOtp = { otp: otp, createdTime: createdTime, verified: false };
                        return [4 /*yield*/, (contractor === null || contractor === void 0 ? void 0 : contractor.save())];
                    case 3:
                        _a.sent();
                        html = (0, OtpEmailTemplate_1.OtpEmailTemplate)(otp, contractor.firstName, "We have received a request to verify your email");
                        return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true, contentType: 'html' })];
                    case 4:
                        translatedHtml = (_a.sent()) || html;
                        return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: "Email Verification", targetLang: contractor.language })];
                    case 5:
                        translatedSubject = (_a.sent()) || 'Email Verification';
                        services_1.EmailService.send(email, translatedSubject, translatedHtml);
                        return [2 /*return*/, res.status(200).json({ success: true, message: "OTP sent successfully to your email." })];
                    case 6:
                        err_7 = _a.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_7.message })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.forgotPassword = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, email, errors, contractor, otp, createdTime, html, translatedHtml, translatedSubject, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        email = req.body.email;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid inputs', errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
                    case 2:
                        contractor = _a.sent();
                        if (!contractor) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "invalid email" })];
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
                        html = (0, OtpEmailTemplate_1.OtpEmailTemplate)(otp, contractor.firstName, "We have received a request to change your password");
                        return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true, contentType: 'html' })];
                    case 4:
                        translatedHtml = _a.sent();
                        return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: 'Password Change', targetLang: contractor.language })];
                    case 5:
                        translatedSubject = _a.sent();
                        services_1.EmailService.send(contractor.email, translatedSubject, translatedHtml);
                        return [2 /*return*/, res.status(200).json({ success: true, message: "OTP sent successfully to your email." })];
                    case 6:
                        err_8 = _a.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_8.message })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.resetPassword = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, email, otp, password, errors, contractor, _b, createdTime, verified, timeDiff, hashedPassword, err_9;
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
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Invalid Email" })];
                        }
                        _b = contractor.passwordOtp, createdTime = _b.createdTime, verified = _b.verified;
                        timeDiff = new Date().getTime() - createdTime.getTime();
                        if (!verified || timeDiff > otpGenerator_1.OTP_EXPIRY_TIME || otp !== contractor.passwordOtp.otp) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Unable to reset password" })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                    case 3:
                        hashedPassword = _c.sent();
                        contractor.password = hashedPassword;
                        contractor.passwordOtp.verified = false;
                        return [4 /*yield*/, contractor.save()];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, message: "Password successfully changed" })];
                    case 5:
                        err_9 = _c.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_9.message })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AuthHandler.prototype.verifyResetPasswordOtp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, email, otp, errors, contractor, createdTime, timeDiff, err_10;
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
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Invalid email" })];
                        }
                        createdTime = contractor.passwordOtp.createdTime;
                        timeDiff = new Date().getTime() - createdTime.getTime();
                        if (otp !== contractor.passwordOtp.otp) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Invalid password reset otp" })];
                        }
                        if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: "Reset password otp has expired" })];
                        }
                        return [2 /*return*/, res.status(200).json({ success: true, message: "Password reset otp verified" })];
                    case 3:
                        err_10 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: err_10.message })];
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
    ], AuthHandler.prototype, "sendPhoneOtp", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AuthHandler.prototype, "verifyPhone", null);
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
    ], AuthHandler.prototype, "signinWithPhone", null);
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
