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
exports.SuperAdminRemovePermissionFromStaffController = exports.SuperAdminAddPermissionToStaffController = exports.AddStaffController = exports.adminUpdateBioController = exports.adminResendEmailController = exports.SuperAdminChangeStaffStatusController = exports.SuperAdminGetAllAdminController = exports.AdminSignInController = exports.adminVerifiedEmailController = exports.adminSignUpController = void 0;
var express_validator_1 = require("express-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var otpGenerator_1 = require("../../../utils/otpGenerator");
var send_email_utility_1 = require("../../../utils/send_email_utility");
var sendEmailTemplate_1 = require("../../../templates/sendEmailTemplate");
var upload_utility_1 = require("../../../utils/upload.utility");
var uuid_1 = require("uuid");
var admin_interface_1 = require("../../../database/admin/interface/admin.interface");
var permission_model_1 = __importDefault(require("../../../database/admin/models/permission.model"));
//admin signup /////////////
var adminSignUpController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, firstName, lastName, phoneNumber, errors, adminEmailExists, superAdmin, validation, checkFirstAdmin, otp, createdTime, emailOtp, html, emailData, hashedPassword, admin, adminSaved, err_1;
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
                // we need a better way validate and manage admins, probably from cli or something
                // or better way to define superadmin who can then
                validation = true;
                superAdmin = true;
                if (checkFirstAdmin.length < 1) {
                    superAdmin = true;
                    validation = true;
                }
                // only one super admin can register
                if (checkFirstAdmin.length > 0) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "unable to registered" })];
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
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email })];
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
                if (admin.status !== admin_interface_1.AdminStatus.ACTIVE) {
                    if (!admin.superAdmin) {
                        return [2 /*return*/, res.status(401).json({ message: "your account is not acive" })];
                    }
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email }).select('-password')];
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
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _b.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "super admin role" })];
                }
                return [4 /*yield*/, admin_model_1.default.find().select('-password')];
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
//super change staff status /////////////
var SuperAdminChangeStaffStatusController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, staffId, status_1, errors, admin, adminId, checkAdmin, subAdmin, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, staffId = _a.staffId, status_1 = _a.status;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _b.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "super admin role" })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: staffId })];
            case 2:
                subAdmin = _b.sent();
                if (!subAdmin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "staff does not exist" })];
                }
                subAdmin.status = status_1;
                return [4 /*yield*/, subAdmin.save()];
            case 3:
                _b.sent();
                res.json({
                    message: "staff status change to ".concat(status_1),
                });
                return [3 /*break*/, 5];
            case 4:
                err_5 = _b.sent();
                // signup error
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.SuperAdminChangeStaffStatusController = SuperAdminChangeStaffStatusController;
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
                _b.trys.push([0, 6, , 7]);
                _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName;
                file = req.file;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
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
                profileImage = { url: 'shdj' };
                if (!file) return [3 /*break*/, 3];
                filename = (0, uuid_1.v4)();
                return [4 /*yield*/, (0, upload_utility_1.uploadToS3)(req.file.buffer, "".concat(filename, ".jpg"))];
            case 2:
                result = _b.sent();
                profileImage = result ? { url: result.Location } : { url: 'shdj' };
                _b.label = 3;
            case 3: return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 4:
                hashedPassword = _b.sent();
                adminExists.firstName = firstName;
                adminExists.lastName = lastName;
                adminExists.email = email;
                adminExists.profilePhoto = profileImage;
                adminExists.password = hashedPassword;
                return [4 /*yield*/, adminExists.save()];
            case 5:
                _b.sent();
                res.json({
                    message: "profile successfully updated",
                });
                return [3 /*break*/, 7];
            case 6:
                err_7 = _b.sent();
                // signup error
                res.status(500).json({ message: err_7.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.adminUpdateBioController = adminUpdateBioController;
//super admin add staff/////////////
var AddStaffController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, firstName, lastName, phoneNumber, permisions, errors, admin, adminId, checkAdmin, adminEmailExists, superAdmin, validation, i, permision, checkPermission, otp, createdTime, emailOtp, html, emailData, hashedPassword, newStaff, staffSaved, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, phoneNumber = _a.phoneNumber, permisions = _a.permisions;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _b.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "super admin role" })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email })];
            case 2:
                adminEmailExists = _b.sent();
                superAdmin = false;
                validation = true;
                // check if user exists
                if (adminEmailExists) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Email exists already" })];
                }
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < permisions.length)) return [3 /*break*/, 6];
                permision = permisions[i];
                return [4 /*yield*/, permission_model_1.default.findOne({ _id: permision })];
            case 4:
                checkPermission = _b.sent();
                if (!checkPermission) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid permission" })];
                }
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
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
            case 7:
                hashedPassword = _b.sent();
                newStaff = new admin_model_1.default({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    superAdmin: superAdmin,
                    permissions: permisions,
                    status: admin_interface_1.AdminStatus.ACTIVE,
                    password: hashedPassword,
                    validation: validation,
                    emailOtp: emailOtp
                });
                return [4 /*yield*/, newStaff.save()];
            case 8:
                staffSaved = _b.sent();
                res.json({
                    message: "Signup successful",
                    admin: {
                        id: staffSaved._id,
                        firstName: staffSaved.firstName,
                        lastName: staffSaved.lastName,
                        email: staffSaved.email,
                        phoneNumber: staffSaved.phoneNumber,
                        permisions: staffSaved.permissions,
                    },
                });
                return [3 /*break*/, 10];
            case 9:
                err_8 = _b.sent();
                // signup error
                res.status(500).json({ message: err_8.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.AddStaffController = AddStaffController;
//super add permission to staff/////////////
var SuperAdminAddPermissionToStaffController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, staffId, permision, errors, admin, adminId, checkAdmin, subAdmin, checkPermission, permissions, i, availabePermission, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, staffId = _a.staffId, permision = _a.permision;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _b.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "super admin role" })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: staffId })];
            case 2:
                subAdmin = _b.sent();
                if (!subAdmin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "staff does not exist" })];
                }
                return [4 /*yield*/, permission_model_1.default.findOne({ _id: permision })];
            case 3:
                checkPermission = _b.sent();
                if (!checkPermission) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid permission" })];
                }
                permissions = [permision];
                for (i = 0; i < subAdmin.permissions.length; i++) {
                    availabePermission = subAdmin.permissions[i];
                    if (availabePermission == permision) {
                        return [2 /*return*/, res
                                .status(401)
                                .json({ message: "staff already has this permission" })];
                    }
                    permissions.push(availabePermission);
                }
                subAdmin.permissions = permissions;
                return [4 /*yield*/, subAdmin.save()];
            case 4:
                _b.sent();
                res.json({
                    message: "permission added successfully",
                });
                return [3 /*break*/, 6];
            case 5:
                err_9 = _b.sent();
                // signup error
                res.status(500).json({ message: err_9.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.SuperAdminAddPermissionToStaffController = SuperAdminAddPermissionToStaffController;
//super remove permission from staff/////////////
var SuperAdminRemovePermissionFromStaffController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, staffId, permision_1, errors, admin, adminId, checkAdmin, subAdmin, checkPermission, remainPermission, err_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, staffId = _a.staffId, permision_1 = _a.permision;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _b.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "super admin role" })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: staffId })];
            case 2:
                subAdmin = _b.sent();
                if (!subAdmin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "staff does not exist" })];
                }
                return [4 /*yield*/, permission_model_1.default.findOne({ _id: permision_1 })];
            case 3:
                checkPermission = _b.sent();
                if (!checkPermission) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid permission" })];
                }
                remainPermission = subAdmin.permissions.filter(function (availabePermission) {
                    return availabePermission != permision_1;
                });
                subAdmin.permissions = remainPermission;
                return [4 /*yield*/, subAdmin.save()];
            case 4:
                _b.sent();
                res.json({
                    message: "permission removed successfully",
                });
                return [3 /*break*/, 6];
            case 5:
                err_10 = _b.sent();
                // signup error
                res.status(500).json({ message: err_10.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.SuperAdminRemovePermissionFromStaffController = SuperAdminRemovePermissionFromStaffController;
