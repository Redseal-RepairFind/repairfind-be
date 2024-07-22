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
exports.AdminAuthController = exports.resendEmail = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.signIn = exports.verifyEmail = exports.signUp = void 0;
var express_validator_1 = require("express-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var otpGenerator_1 = require("../../../utils/otpGenerator");
var sendEmailTemplate_1 = require("../../../templates/sendEmailTemplate");
var admin_interface_1 = require("../../../database/admin/interface/admin.interface");
var services_1 = require("../../../services");
var custom_errors_1 = require("../../../utils/custom.errors");
var signUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, firstName, lastName, phoneNumber, errors, adminEmailExists, superAdmin, validation, checkFirstAdmin, otp, createdTime, emailOtp, html, hashedPassword, admin, adminSaved, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, phoneNumber = _a.phoneNumber;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email })];
            case 1:
                adminEmailExists = _b.sent();
                superAdmin = false;
                validation = false;
                return [4 /*yield*/, admin_model_1.default.find()];
            case 2:
                checkFirstAdmin = _b.sent();
                validation = false;
                superAdmin = false;
                if (checkFirstAdmin.length < 1) {
                    superAdmin = true;
                    validation = true;
                }
                // only one super admin can register
                if (checkFirstAdmin.length > 0) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: true, message: "Registration is disabled" })];
                }
                // check if user exists
                if (adminEmailExists) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: true, message: "Email exists already" })];
                }
                otp = (0, otpGenerator_1.generateOTP)();
                createdTime = new Date();
                emailOtp = {
                    otp: otp,
                    createdTime: createdTime,
                    verified: false
                };
                html = (0, sendEmailTemplate_1.htmlMailTemplate)(otp, firstName, "We have received a request to verify your email");
                services_1.EmailService.send(email, "Email verification", html);
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 3:
                hashedPassword = _b.sent();
                admin = new admin_model_1.default({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    superAdmin: superAdmin,
                    password: hashedPassword,
                    validation: validation,
                    status: admin_interface_1.AdminStatus.ACTIVE,
                    emailOtp: emailOtp
                });
                return [4 /*yield*/, admin.save()];
            case 4:
                adminSaved = _b.sent();
                res.json({
                    success: true,
                    message: "Signup successful",
                    admin: {
                        id: adminSaved._id,
                        firstName: adminSaved.firstName,
                        lastName: adminSaved.lastName,
                        email: adminSaved.email,
                    },
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                next(new custom_errors_1.InternalServerError("An error occurred", error_1));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.signUp = signUp;
var verifyEmail = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, errors, admin, timeDiff, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, otp = _a.otp;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email })];
            case 1:
                admin = _b.sent();
                // check if contractor exists
                if (!admin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid email" })];
                }
                if (admin.emailOtp.otp != otp) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Invalid OTP" })];
                }
                if (admin.emailOtp.verified) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Email already verified" })];
                }
                timeDiff = new Date().getTime() - admin.emailOtp.createdTime.getTime();
                if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
                    return [2 /*return*/, res.status(400).json({ message: "OTP Expired" })];
                }
                admin.emailOtp.verified = true;
                return [4 /*yield*/, admin.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res.json({ message: "Email verified successfully" })];
            case 3:
                error_2 = _b.sent();
                next(new custom_errors_1.InternalServerError("An error occurred", error_2));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verifyEmail = verifyEmail;
var signIn = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, errors, admin, isPasswordMatch, profile, accessToken, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, errors: errors.array() })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email })];
            case 1:
                admin = _b.sent();
                // check if user exists
                if (!admin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid credential" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, admin.password)];
            case 2:
                isPasswordMatch = _b.sent();
                if (!isPasswordMatch) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "incorrect credential." })];
                }
                //TODO: check if user has changed default password
                // if (admin.hasWeakPassword) {
                //   return res.status(401).json({success: false,  message: "email not verified." });
                // }
                if (admin.status !== admin_interface_1.AdminStatus.ACTIVE) {
                    if (!admin.superAdmin) {
                        return [2 /*return*/, res.status(401).json({ success: false, message: "Your account is not active" })];
                    }
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email }).select('-password')];
            case 3:
                profile = _b.sent();
                accessToken = jsonwebtoken_1.default.sign({
                    id: admin === null || admin === void 0 ? void 0 : admin._id,
                    email: admin.email,
                }, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: "24h" });
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Login successful",
                        Token: accessToken,
                        profile: profile
                    })];
            case 4:
                error_3 = _b.sent();
                next(new custom_errors_1.InternalServerError("An error occurred", error_3));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.signIn = signIn;
var forgotPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, errors, admin, otp, createdTime, html, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                email = req.body.email;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, errors: errors.array() })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email })];
            case 1:
                admin = _a.sent();
                if (!admin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid email" })];
                }
                otp = (0, otpGenerator_1.generateOTP)();
                createdTime = new Date();
                admin.passwordOtp = {
                    otp: otp,
                    createdTime: createdTime,
                    verified: true
                };
                return [4 /*yield*/, admin.save()];
            case 2:
                _a.sent();
                html = (0, sendEmailTemplate_1.htmlMailTemplate)(otp, admin.firstName, "We have received a request to change your password");
                services_1.EmailService.send(email, "Admin Forgot Password", html);
                return [2 /*return*/, res.status(200).json({ success: true, message: "OTP sent successfully to your email." })];
            case 3:
                error_4 = _a.sent();
                next(new custom_errors_1.InternalServerError("An error occurred", error_4));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
var resetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, password, errors, admin, _b, createdTime, verified, timeDiff, hashedPassword, error_5;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, otp = _a.otp, password = _a.password;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email })];
            case 1:
                admin = _c.sent();
                if (!admin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid email" })];
                }
                _b = admin.passwordOtp, createdTime = _b.createdTime, verified = _b.verified;
                timeDiff = new Date().getTime() - createdTime.getTime();
                if (!verified || timeDiff > otpGenerator_1.OTP_EXPIRY_TIME || otp !== admin.passwordOtp.otp) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "unable to reset password" })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _c.sent();
                admin.password = hashedPassword;
                admin.passwordOtp.verified = false;
                return [4 /*yield*/, admin.save()];
            case 3:
                _c.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: "password successfully change" })];
            case 4:
                error_5 = _c.sent();
                next(new custom_errors_1.InternalServerError("An error occurred", error_5));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
var changePassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, oldPassword, newPassword, errors, admin, hashedPassword, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                // Check for strong password criteria
                if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Password must be at least 8 characters long and contain letters, numbers, and special characters." })];
                }
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email })];
            case 1:
                admin = _b.sent();
                if (!admin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid email" })];
                }
                if (oldPassword === newPassword) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "You cannot use the same password" })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
            case 2:
                hashedPassword = _b.sent();
                admin.password = hashedPassword;
                admin.hasWeakPassword = false;
                return [4 /*yield*/, admin.save()];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: "Password successfully changed" })];
            case 4:
                error_6 = _b.sent();
                next(new custom_errors_1.InternalServerError("An error occurred", error_6));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.changePassword = changePassword;
var resendEmail = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, errors, admin, otp, createdTime, html, emailData, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                email = req.body.email;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email })];
            case 1:
                admin = _a.sent();
                // check if contractor exists
                if (!admin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid email" })];
                }
                if (admin.emailOtp.verified) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "email already verified" })];
                }
                otp = (0, otpGenerator_1.generateOTP)();
                createdTime = new Date();
                admin.emailOtp = {
                    otp: otp,
                    createdTime: createdTime,
                    verified: false
                };
                return [4 /*yield*/, (admin === null || admin === void 0 ? void 0 : admin.save())];
            case 2:
                _a.sent();
                html = (0, sendEmailTemplate_1.htmlMailTemplate)(otp, admin.firstName, "We have received a request to verify your email");
                emailData = {
                    email: email,
                    subject: "email verification",
                    html: html
                };
                services_1.EmailService.send(email, "email verification", html);
                return [2 /*return*/, res.status(200).json({ message: "OTP sent successfully to your email." })];
            case 3:
                error_7 = _a.sent();
                next(new custom_errors_1.InternalServerError("An error occurred", error_7));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.resendEmail = resendEmail;
exports.AdminAuthController = {
    signUp: exports.signUp,
    signIn: exports.signIn,
    verifyEmail: exports.verifyEmail,
    forgotPassword: exports.forgotPassword,
    resetPassword: exports.resetPassword,
    changePassword: exports.changePassword,
    resendEmail: exports.resendEmail
};
