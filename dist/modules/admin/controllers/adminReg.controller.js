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
exports.adminUpdateBioController = exports.adminResendEmailController = exports.SuperAdminValidateOtherAdminController = exports.SuperAdminGetAllAdminController = exports.AdminSignInController = exports.adminVerifiedEmailController = exports.adminSignUpController = void 0;
var express_validator_1 = require("express-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var adminReg_model_1 = __importDefault(require("../../../database/admin/models/adminReg.model"));
var otpGenerator_1 = require("../../../utils/otpGenerator");
var send_email_utility_1 = require("../../../utils/send_email_utility");
var sendEmailTemplate_1 = require("../../../templates/sendEmailTemplate");
var upload_utility_1 = require("../../../utils/upload.utility");
var uuid_1 = require("uuid");
//admin signup /////////////
var adminSignUpController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, firstName, lastName, errors, adminEmailExists, superAdmin, validation, checkFirstAdmin, otp, createdTime, emailOtp, html, emailData, hashedPassword, admin, adminSaved, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, adminReg_model_1.default.findOne({ email: email })];
            case 1:
                adminEmailExists = _b.sent();
                superAdmin = false;
                validation = false;
                return [4 /*yield*/, adminReg_model_1.default.find()];
            case 2:
                checkFirstAdmin = _b.sent();
                // we need a better way validate and manage admins, probably from cli or something
                // or better way to define superadmin who can then
                validation = true;
                if (checkFirstAdmin.length < 1) {
                    superAdmin = true;
                    validation = true;
                }
                // check if user exists
                if (adminEmailExists) {
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
                (0, send_email_utility_1.sendEmail)(emailData);
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 3:
                hashedPassword = _b.sent();
                admin = new adminReg_model_1.default({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    superAdmin: superAdmin,
                    password: hashedPassword,
                    validation: validation,
                    emailOtp: emailOtp
                });
                return [4 /*yield*/, admin.save()];
            case 4:
                adminSaved = _b.sent();
                res.json({
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
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.adminSignUpController = adminSignUpController;
//admin verified email /////////////
var adminVerifiedEmailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, errors, admin, timeDiff, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, otp = _a.otp;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, adminReg_model_1.default.findOne({ email: email })];
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
                            .json({ message: "invalid otp" })];
                }
                if (admin.emailOtp.verified) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "email already verified" })];
                }
                timeDiff = new Date().getTime() - admin.emailOtp.createdTime.getTime();
                if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
                    return [2 /*return*/, res.status(400).json({ message: "otp expired" })];
                }
                admin.emailOtp.verified = true;
                return [4 /*yield*/, admin.save()];
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
exports.adminVerifiedEmailController = adminVerifiedEmailController;
//admin signin /////////////
var AdminSignInController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, errors, admin, isPasswordMatch, profile, accessToken, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, adminReg_model_1.default.findOne({ email: email })];
            case 1:
                admin = _b.sent();
                // check if user exists
                if (!admin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, admin.password)];
            case 2:
                isPasswordMatch = _b.sent();
                if (!isPasswordMatch) {
                    return [2 /*return*/, res.status(401).json({ message: "incorrect credential." })];
                }
                if (!admin.emailOtp.verified) {
                    return [2 /*return*/, res.status(401).json({ message: "email not verified." })];
                }
                if (!admin.validation) {
                    return [2 /*return*/, res.status(401).json({ message: "unvalidated admin." })];
                }
                return [4 /*yield*/, adminReg_model_1.default.findOne({ email: email }).select('-password')];
            case 3:
                profile = _b.sent();
                accessToken = jsonwebtoken_1.default.sign({
                    id: admin === null || admin === void 0 ? void 0 : admin._id,
                    email: admin.email,
                }, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: "24h" });
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
exports.AdminSignInController = AdminSignInController;
//super admin get all admin /////////////
var SuperAdminGetAllAdminController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, admin, adminId, checkAdmin, admins, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, adminReg_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _b.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "super admin role" })];
                }
                return [4 /*yield*/, adminReg_model_1.default.find().select('-password')];
            case 2:
                admins = _b.sent();
                res.json({
                    admins: admins
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                // signup error
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.SuperAdminGetAllAdminController = SuperAdminGetAllAdminController;
//super admin validate other admin /////////////
var SuperAdminValidateOtherAdminController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var subAdminId, errors, admin, adminId, checkAdmin, subAdmin, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                subAdminId = req.body.subAdminId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, adminReg_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _a.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "super admin role" })];
                }
                return [4 /*yield*/, adminReg_model_1.default.findOne({ _id: subAdminId })];
            case 2:
                subAdmin = _a.sent();
                if (!subAdmin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "sub admin does not exist" })];
                }
                if (!subAdmin.emailOtp.verified) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "sub admin email not verified" })];
                }
                if (subAdmin.validation) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "sub admin already validated" })];
                }
                subAdmin.validation = true;
                return [4 /*yield*/, subAdmin.save()];
            case 3:
                _a.sent();
                res.json({
                    message: "sub admin successfully validate",
                });
                return [3 /*break*/, 5];
            case 4:
                err_5 = _a.sent();
                // signup error
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.SuperAdminValidateOtherAdminController = SuperAdminValidateOtherAdminController;
//admin resend for verification email /////////////
var adminResendEmailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, errors, admin, otp, createdTime, html, emailData, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                email = req.body.email;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, adminReg_model_1.default.findOne({ email: email })];
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
exports.adminResendEmailController = adminResendEmailController;
//admin update bio /////////////
var adminUpdateBioController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, firstName, lastName, file, errors, admin, adminId, adminExists, profileImage, filename, result, hashedPassword, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName;
                file = req.file;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, adminReg_model_1.default.findOne({ _id: adminId })];
            case 1:
                adminExists = _b.sent();
                // check if user exists
                if (!adminExists) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect admin ID" })];
                }
                if (!email || email == '' || !firstName || firstName == '' || !lastName || lastName == '' || !password || password == '') {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "fill in the missing input" })];
                }
                profileImage = void 0;
                if (!!file) return [3 /*break*/, 2];
                profileImage = adminExists.image;
                return [3 /*break*/, 4];
            case 2:
                filename = (0, uuid_1.v4)();
                return [4 /*yield*/, (0, upload_utility_1.uploadToS3)(req.file.buffer, "".concat(filename, ".jpg"))];
            case 3:
                result = _b.sent();
                profileImage = result === null || result === void 0 ? void 0 : result.Location;
                _b.label = 4;
            case 4: return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 5:
                hashedPassword = _b.sent();
                adminExists.firstName = firstName;
                adminExists.lastName = lastName;
                adminExists.email = email;
                adminExists.image = profileImage;
                adminExists.password = hashedPassword;
                return [4 /*yield*/, adminExists.save()];
            case 6:
                _b.sent();
                res.json({
                    message: "profile successfully updated",
                });
                return [3 /*break*/, 8];
            case 7:
                err_7 = _b.sent();
                // signup error
                res.status(500).json({ message: err_7.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.adminUpdateBioController = adminUpdateBioController;
