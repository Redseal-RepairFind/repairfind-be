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
exports.CustomerUpdateProfileController = exports.CustomerResendEmailController = exports.customerSignInController = exports.customerVerifiedEmailController = exports.customerSignUpController = void 0;
var express_validator_1 = require("express-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var customerReg_model_1 = __importDefault(require("../../../database/customer/models/customerReg.model"));
var otpGenerator_1 = require("../../../utils/otpGenerator");
var send_email_utility_1 = require("../../../utils/send_email_utility");
var sendEmailTemplate_1 = require("../../../templates/sendEmailTemplate");
var upload_utility_1 = require("../../../utils/upload.utility");
var uuid_1 = require("uuid");
var customerWelcomTemplate_1 = require("../../../templates/customerEmail/customerWelcomTemplate");
var adminNotification_model_1 = __importDefault(require("../../../database/admin/models/adminNotification.model"));
//customer signup /////////////
var customerSignUpController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, fullName, phonenumber, errors, userEmailExists, otp, createdTime, emailOtp, html, welcomeHtml, welcomeEmailData, emailData, hashedPassword, customer, customerSaved, adminNoti, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, password = _a.password, fullName = _a.fullName, phonenumber = _a.phonenumber;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, customerReg_model_1.default.findOne({ email: email })];
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
                html = (0, sendEmailTemplate_1.htmlMailTemplate)(otp, fullName, "We have received a request to verify your email");
                welcomeHtml = (0, customerWelcomTemplate_1.htmlcustomerWelcomTemplate)(fullName);
                welcomeEmailData = {
                    emailTo: email,
                    subject: "welcome",
                    html: welcomeHtml
                };
                emailData = {
                    emailTo: email,
                    subject: "email verification",
                    html: html
                };
                (0, send_email_utility_1.sendEmail)(welcomeEmailData);
                (0, send_email_utility_1.sendEmail)(emailData);
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                customer = new customerReg_model_1.default({
                    email: email,
                    fullName: fullName,
                    phoneNumber: phonenumber,
                    password: hashedPassword,
                    emailOtp: emailOtp
                });
                return [4 /*yield*/, customer.save()];
            case 3:
                customerSaved = _b.sent();
                adminNoti = new adminNotification_model_1.default({
                    title: "New Account Created",
                    message: "A customer - ".concat(fullName, "  just created an account."),
                    status: "unseen"
                });
                return [4 /*yield*/, adminNoti.save()];
            case 4:
                _b.sent();
                res.json({
                    message: "Signup successful",
                    user: {
                        id: customerSaved._id,
                        fullName: customerSaved.fullName,
                        phoneNumber: customerSaved.phoneNumber,
                        email: customerSaved.email,
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
exports.customerSignUpController = customerSignUpController;
//customer verified email /////////////
var customerVerifiedEmailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, errors, customer, timeDiff, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, otp = _a.otp;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, customerReg_model_1.default.findOne({ email: email })];
            case 1:
                customer = _b.sent();
                // check if contractor exists
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid email" })];
                }
                if (customer.emailOtp.otp != otp) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid otp" })];
                }
                if (customer.emailOtp.verified) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "email already verified" })];
                }
                timeDiff = new Date().getTime() - customer.emailOtp.createdTime.getTime();
                if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
                    return [2 /*return*/, res.status(400).json({ message: "otp expired" })];
                }
                customer.emailOtp.verified = true;
                return [4 /*yield*/, customer.save()];
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
exports.customerVerifiedEmailController = customerVerifiedEmailController;
//customer signin /////////////
var customerSignInController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, errors, customer, isPasswordMatch, profile, accessToken, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, customerReg_model_1.default.findOne({ email: email })];
            case 1:
                customer = _b.sent();
                // check if user exists
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, customer.password)];
            case 2:
                isPasswordMatch = _b.sent();
                if (!isPasswordMatch) {
                    return [2 /*return*/, res.status(401).json({ message: "incorrect credential." })];
                }
                if (!customer.emailOtp.verified) {
                    return [2 /*return*/, res.status(401).json({ message: "email not verified." })];
                }
                return [4 /*yield*/, customerReg_model_1.default.findOne({ email: email }).select('-password')];
            case 3:
                profile = _b.sent();
                accessToken = jsonwebtoken_1.default.sign({
                    id: customer === null || customer === void 0 ? void 0 : customer._id,
                    email: customer.email,
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
exports.customerSignInController = customerSignInController;
//customer resend for verification email /////////////
var CustomerResendEmailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, errors, customer, otp, createdTime, html, emailData, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                email = req.body.email;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, customerReg_model_1.default.findOne({ email: email })];
            case 1:
                customer = _a.sent();
                // check if contractor exists
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid email" })];
                }
                if (customer.emailOtp.verified) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "email already verified" })];
                }
                otp = (0, otpGenerator_1.generateOTP)();
                createdTime = new Date();
                customer.emailOtp = {
                    otp: otp,
                    createdTime: createdTime,
                    verified: false
                };
                return [4 /*yield*/, (customer === null || customer === void 0 ? void 0 : customer.save())];
            case 2:
                _a.sent();
                html = (0, sendEmailTemplate_1.htmlMailTemplate)(otp, customer.fullName, "We have received a request to verify your email");
                emailData = {
                    emailTo: email,
                    subject: "email verification",
                    html: html
                };
                (0, send_email_utility_1.sendEmail)(emailData);
                return [2 /*return*/, res.status(200).json({ message: "OTP sent successfully to your email." })];
            case 3:
                err_4 = _a.sent();
                // signup error
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.CustomerResendEmailController = CustomerResendEmailController;
//customer customer update profile /////////////
var CustomerUpdateProfileController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullName, location_1, phoneNumber, errors, customer, customerId, file, customerDb, profileImage, filename, result, updateBioData, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, fullName = _a.fullName, location_1 = _a.location, phoneNumber = _a.phoneNumber;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                file = req.file;
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: customerId })];
            case 1:
                customerDb = _b.sent();
                // check if customer exists
                if (!customerDb) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Id" })];
                }
                profileImage = void 0;
                if (!!file) return [3 /*break*/, 2];
                profileImage = customerDb.profileImg;
                return [3 /*break*/, 4];
            case 2:
                filename = (0, uuid_1.v4)();
                return [4 /*yield*/, (0, upload_utility_1.uploadToS3)(req.file.buffer, "".concat(filename, ".jpg"))];
            case 3:
                result = _b.sent();
                profileImage = result === null || result === void 0 ? void 0 : result.Location;
                _b.label = 4;
            case 4: return [4 /*yield*/, customerReg_model_1.default.findOneAndUpdate({ _id: customerId }, {
                    fullName: fullName,
                    phoneNumber: phoneNumber,
                    location: location_1,
                    profileImg: profileImage
                }, { new: true })];
            case 5:
                updateBioData = _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "data successfully updated" })];
            case 6:
                err_5 = _b.sent();
                // signup error
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.CustomerUpdateProfileController = CustomerUpdateProfileController;
