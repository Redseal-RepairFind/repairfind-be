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
exports.CustomerAuthController = exports.appleSignon = exports.facebookSignon = exports.googleSignon = exports.verifyResetPasswordOtp = exports.resetPassword = exports.forgotPassword = exports.resendEmail = exports.signInWithPhone = exports.signIn = exports.verifyEmail = exports.signUp = void 0;
var express_validator_1 = require("express-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var otpGenerator_1 = require("../../../utils/otpGenerator");
var send_email_utility_1 = require("../../../utils/send_email_utility");
var sendEmailTemplate_1 = require("../../../templates/sendEmailTemplate");
var google_1 = require("../../../services/google");
var customer_interface_1 = require("../../../database/customer/interface/customer.interface");
var facebook_1 = require("../../../services/facebook");
var services_1 = require("../../../services");
var config_1 = require("../../../config");
var welcome_email_1 = require("../../../templates/customer/welcome_email");
var email_verification_1 = require("../../../templates/common/email_verification");
//customer signup /////////////
var signUp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, firstName, lastName, acceptTerms, phoneNumber, errors, userEmailExists, otp, createdTime, emailOtp, welcomeHtml, emailVerificationHtml, hashedPassword, customer, customerSaved, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, acceptTerms = _a.acceptTerms, phoneNumber = _a.phoneNumber;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ email: email })];
            case 1:
                userEmailExists = _b.sent();
                // check if user exists
                if (userEmailExists) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Email exists already" })];
                }
                otp = (0, otpGenerator_1.generateOTP)();
                createdTime = new Date();
                emailOtp = {
                    otp: otp,
                    createdTime: createdTime,
                    verified: false
                };
                welcomeHtml = (0, welcome_email_1.CustomerWelcomeEmailTemplate)(lastName);
                services_1.EmailService.send(email, 'Welcome to Repairfind', welcomeHtml);
                emailVerificationHtml = (0, email_verification_1.EmailVerificationTemplate)(otp, firstName);
                services_1.EmailService.send(email, 'Email Verification', emailVerificationHtml);
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                customer = new customer_model_1.default({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    password: hashedPassword,
                    emailOtp: emailOtp,
                    acceptTerms: acceptTerms
                });
                return [4 /*yield*/, customer.save()];
            case 3:
                customerSaved = _b.sent();
                // admin notification 
                // const adminNoti = new AdminNoficationModel({
                //   title: "New Account Created",
                //   message: `A customer - ${lastName}  just created an account.`,
                //   status: "unseen"
                // })
                // await adminNoti.save();
                res.json({
                    success: true,
                    message: "Signup successful",
                    data: {
                        id: customerSaved._id,
                        firstName: customerSaved.firstName,
                        lastName: customerSaved.lastName,
                        phoneNumber: customerSaved.phoneNumber,
                        email: customerSaved.email,
                    },
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ success: false, message: err_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.signUp = signUp;
//customer verified email /////////////
var verifyEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, currentTimezone, errors, customer, timeDiff, accessToken, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, otp = _a.otp, currentTimezone = _a.currentTimezone;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ email: email })];
            case 1:
                customer = _b.sent();
                // check if contractor exists
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid email" })];
                }
                if (customer.emailOtp.otp != otp) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid otp" })];
                }
                if (customer.emailOtp.verified) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ success: false, message: "Email is already verified" })];
                }
                timeDiff = new Date().getTime() - customer.emailOtp.createdTime.getTime();
                if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "OTP has expired" })];
                }
                customer.emailOtp.verified = true;
                customer.currentTimezone = currentTimezone;
                return [4 /*yield*/, customer.save()];
            case 2:
                _b.sent();
                accessToken = jsonwebtoken_1.default.sign({
                    id: customer === null || customer === void 0 ? void 0 : customer._id,
                    email: customer.email,
                    userType: 'customers',
                }, process.env.JWT_SECRET_KEY, { expiresIn: config_1.config.jwt.tokenLifetime });
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Email verified successfully",
                        accessToken: accessToken,
                        expiresIn: config_1.config.jwt.tokenLifetime,
                        data: customer
                    })];
            case 3:
                err_2 = _b.sent();
                // signup error
                res.status(500).json({ success: false, message: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verifyEmail = verifyEmail;
var signIn = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, currentTimezone, errors, customer, isPasswordMatch, profile, accessToken, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, password = _a.password, currentTimezone = _a.currentTimezone;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ email: email })];
            case 1:
                customer = _b.sent();
                // check if user exists
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid credential" })];
                }
                if (!customer.password && customer.provider !== customer_interface_1.CustomerAuthProviders.PASSWORD) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "The email is associated with a social signon" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, customer.password)];
            case 2:
                isPasswordMatch = _b.sent();
                if (!customer.password && customer.provider) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Account is associated with ".concat(customer.provider, " account") })];
                }
                if (!isPasswordMatch) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Incorrect credential." })];
                }
                if (!customer.emailOtp.verified) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "The email or password you entered is incorrect" })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ email: email }).select('-password')];
            case 3:
                profile = _b.sent();
                accessToken = jsonwebtoken_1.default.sign({
                    id: customer === null || customer === void 0 ? void 0 : customer._id,
                    email: customer.email,
                    userType: 'customers',
                }, process.env.JWT_SECRET_KEY, { expiresIn: config_1.config.jwt.tokenLifetime });
                customer.currentTimezone = currentTimezone;
                return [4 /*yield*/, customer.save()
                    // return access token
                ];
            case 4:
                _b.sent();
                // return access token
                res.json({
                    success: true,
                    message: "Signin successful",
                    accessToken: accessToken,
                    expiresIn: config_1.config.jwt.tokenLifetime,
                    data: profile
                });
                return [3 /*break*/, 6];
            case 5:
                err_3 = _b.sent();
                res.status(500).json({ success: false, message: err_3.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.signIn = signIn;
var signInWithPhone = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, number, code, password, currentTimezone, errors, customer, isPasswordMatch, profile, accessToken, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, number = _a.number, code = _a.code, password = _a.password, currentTimezone = _a.currentTimezone;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ 'phoneNumber.number': number, 'phoneNumber.code': code })];
            case 1:
                customer = _b.sent();
                // check if user exists
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "The phone or password you entered is incorrect" })];
                }
                if (!customer.password && customer.provider !== customer_interface_1.CustomerAuthProviders.PASSWORD) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "These account is associated with a social signon" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, customer.password)];
            case 2:
                isPasswordMatch = _b.sent();
                if (!isPasswordMatch) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Incorrect credential." })];
                }
                if (!customer.phoneNumber.verifiedAt) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Phone number is not verified." })];
                }
                return [4 /*yield*/, customer_model_1.default.findById(customer.id).select('-password')];
            case 3:
                profile = _b.sent();
                accessToken = jsonwebtoken_1.default.sign({
                    id: customer === null || customer === void 0 ? void 0 : customer._id,
                    email: customer.email,
                    userType: 'customers',
                }, process.env.JWT_SECRET_KEY, { expiresIn: config_1.config.jwt.tokenLifetime });
                customer.currentTimezone = currentTimezone;
                return [4 /*yield*/, customer.save()
                    // return access token
                ];
            case 4:
                _b.sent();
                // return access token
                res.json({
                    success: true,
                    message: "Signin successful",
                    accessToken: accessToken,
                    expiresIn: config_1.config.jwt.tokenLifetime,
                    data: profile
                });
                return [3 /*break*/, 6];
            case 5:
                err_4 = _b.sent();
                res.status(500).json({ success: false, message: err_4.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.signInWithPhone = signInWithPhone;
//customer resend for verification email /////////////
var resendEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, errors, customer, otp, createdTime, html, emailData, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                email = req.body.email;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ email: email })];
            case 1:
                customer = _a.sent();
                // check if contractor exists
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid email" })];
                }
                if (customer.emailOtp.verified) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ success: false, message: "Email already verified" })];
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
                html = (0, sendEmailTemplate_1.htmlMailTemplate)(otp, customer.firstName, "We have received a request to verify your email");
                emailData = {
                    emailTo: email,
                    subject: "email verification",
                    html: html
                };
                (0, send_email_utility_1.sendEmail)(emailData);
                return [2 /*return*/, res.status(200).json({ success: true, message: "OTP sent successfully to your email." })];
            case 3:
                err_5 = _a.sent();
                // signup error
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.resendEmail = resendEmail;
var forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, errors, customer, otp, createdTime, html, emailData, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                email = req.body.email;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ email: email })];
            case 1:
                customer = _a.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid email" })];
                }
                otp = (0, otpGenerator_1.generateOTP)();
                createdTime = new Date();
                customer.passwordOtp = {
                    otp: otp,
                    createdTime: createdTime,
                    verified: true
                };
                return [4 /*yield*/, (customer === null || customer === void 0 ? void 0 : customer.save())];
            case 2:
                _a.sent();
                html = (0, sendEmailTemplate_1.htmlMailTemplate)(otp, customer.firstName, "We have received a request to change your password");
                emailData = {
                    emailTo: email,
                    subject: "C password change",
                    html: html
                };
                (0, send_email_utility_1.sendEmail)(emailData);
                return [2 /*return*/, res.status(200).json({ success: true, message: "OTP sent successfully to your email." })];
            case 3:
                err_6 = _a.sent();
                res.status(500).json({ success: false, message: err_6.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
var resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, password, errors, customer, _b, createdTime, verified, timeDiff, hashedPassword, err_7;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, otp = _a.otp, password = _a.password;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ email: email })];
            case 1:
                customer = _c.sent();
                // check if contractor exists
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid email" })];
                }
                _b = customer.passwordOtp, createdTime = _b.createdTime, verified = _b.verified;
                timeDiff = new Date().getTime() - createdTime.getTime();
                if (!verified || timeDiff > otpGenerator_1.OTP_EXPIRY_TIME || otp !== customer.passwordOtp.otp) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Unable to reset password" })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _c.sent();
                customer.password = hashedPassword;
                customer.passwordOtp.verified = false;
                return [4 /*yield*/, customer.save()];
            case 3:
                _c.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: "password successfully change" })];
            case 4:
                err_7 = _c.sent();
                res.status(500).json({ success: false, message: err_7.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
var verifyResetPasswordOtp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, errors, customer, _b, createdTime, verified, timeDiff, err_8;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, otp = _a.otp;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ email: email })];
            case 1:
                customer = _c.sent();
                // Check if customer exists
                if (!customer) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Invalid email" })];
                }
                _b = customer.passwordOtp, createdTime = _b.createdTime, verified = _b.verified;
                timeDiff = new Date().getTime() - createdTime.getTime();
                if (!verified || timeDiff > otpGenerator_1.OTP_EXPIRY_TIME || otp !== customer.passwordOtp.otp) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Unable to verify OTP" })];
                }
                // Mark the OTP as verified
                customer.passwordOtp.verified = true;
                return [4 /*yield*/, customer.save()];
            case 2:
                _c.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: "OTP verified successfully" })];
            case 3:
                err_8 = _c.sent();
                res.status(500).json({ success: false, message: err_8.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verifyResetPasswordOtp = verifyResetPasswordOtp;
//customer signup /////////////
var googleSignon = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, errors, providerUser, email, name_1, picture, sub, firstName, lastName, createdTime, emailOtp, user, token, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                accessToken = req.body.accessToken;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() })];
                }
                return [4 /*yield*/, google_1.GoogleServiceProvider.getUserInfo(accessToken)];
            case 1:
                providerUser = _a.sent();
                email = providerUser.email, name_1 = providerUser.name, picture = providerUser.picture, sub = providerUser.sub;
                firstName = name_1.split(' ')[0];
                lastName = name_1.split(' ')[1];
                createdTime = new Date();
                emailOtp = {
                    otp: sub,
                    createdTime: createdTime,
                    verified: true
                };
                return [4 /*yield*/, customer_model_1.default.findOneAndUpdate({ email: email }, {
                        $setOnInsert: {
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            provider: customer_interface_1.CustomerAuthProviders.GOOGLE,
                            profilePhoto: { url: picture },
                            emailOtp: {
                                otp: sub,
                                createdTime: new Date(),
                                verified: true,
                            },
                        },
                    }, {
                        new: true, // Return the updated document
                        upsert: true, // Create a new document if it doesn't exist
                        setDefaultsOnInsert: true, // Set default values for fields during insert
                    })];
            case 2:
                user = _a.sent();
                token = jsonwebtoken_1.default.sign({
                    id: user._id,
                    email: user.email,
                    userType: 'customers',
                }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
                res.json({
                    status: true,
                    message: 'Signon successful',
                    accessToken: token,
                    data: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                err_9 = _a.sent();
                // signup error
                res.status(500).json({ success: false, message: err_9.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.googleSignon = googleSignon;
var facebookSignon = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, errors, providerUser, id, name_2, email, picture, firstName, lastName, createdTime, emailOtp, user, token, err_10;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                accessToken = req.body.accessToken;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() })];
                }
                return [4 /*yield*/, facebook_1.FacebookServiceProvider.getFacebookUserInfo(accessToken)];
            case 1:
                providerUser = _b.sent();
                id = providerUser.id, name_2 = providerUser.name, email = providerUser.email, picture = providerUser.picture;
                firstName = name_2.split(' ')[0];
                lastName = name_2.split(' ')[1];
                createdTime = new Date();
                emailOtp = {
                    otp: id,
                    createdTime: createdTime,
                    verified: true,
                };
                return [4 /*yield*/, customer_model_1.default.findOneAndUpdate({ email: email }, {
                        $setOnInsert: {
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            provider: customer_interface_1.CustomerAuthProviders.FACEBOOK,
                            profileImg: (_a = picture === null || picture === void 0 ? void 0 : picture.data) === null || _a === void 0 ? void 0 : _a.url,
                            emailOtp: {
                                otp: id,
                                createdTime: new Date(),
                                verified: true,
                            },
                        },
                    }, {
                        new: true, // Return the updated document
                        upsert: true, // Create a new document if it doesn't exist
                        setDefaultsOnInsert: true, // Set default values for fields during insert
                    })];
            case 2:
                user = _b.sent();
                token = jsonwebtoken_1.default.sign({
                    id: user._id,
                    email: user.email,
                    userType: 'customers',
                }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
                res.json({
                    status: true,
                    message: 'Signon successful',
                    accessToken: token,
                    data: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                err_10 = _b.sent();
                // signup error
                res.status(500).json({ success: false, message: err_10.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.facebookSignon = facebookSignon;
var appleSignon = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, accessToken, email, firstName, lastName, errors, decodedToken, decodedIdToken, decodedAccessToken, appleUserId, appleEmail, createdTime, emailOtp, user, token, err_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, accessToken = _a.accessToken, email = _a.email, firstName = _a.firstName, lastName = _a.lastName;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() })];
                }
                decodedToken = {
                    sub: 'customerrepairfind.com',
                    email: 'customer@repairfind.com'
                };
                return [4 /*yield*/, services_1.AppleIdServiceProvider.verifyIdToken(accessToken)];
            case 1:
                decodedIdToken = _b.sent();
                return [4 /*yield*/, services_1.AppleIdServiceProvider.decodeAccessToken(accessToken)];
            case 2:
                decodedAccessToken = _b.sent();
                console.log('decodedIdToken', decodedIdToken);
                console.log('decodedAccessToken', decodedAccessToken);
                appleUserId = decodedToken.sub;
                appleEmail = decodedToken.email;
                createdTime = new Date();
                emailOtp = {
                    otp: appleUserId,
                    createdTime: createdTime,
                    verified: true,
                };
                return [4 /*yield*/, customer_model_1.default.findOneAndUpdate({ email: email }, {
                        $setOnInsert: {
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            provider: customer_interface_1.CustomerAuthProviders.APPLE,
                            emailOtp: emailOtp,
                        },
                    }, {
                        new: true, // Return the updated document
                        upsert: true, // Create a new document if it doesn't exist
                        setDefaultsOnInsert: true, // Set default values for fields during insert
                    })];
            case 3:
                user = _b.sent();
                token = jsonwebtoken_1.default.sign({
                    id: user._id,
                    email: user.email,
                    userType: 'customers',
                }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
                res.json({
                    status: true,
                    message: 'Signon successful',
                    accessToken: token,
                    data: user,
                });
                return [3 /*break*/, 5];
            case 4:
                err_11 = _b.sent();
                // Handle errors appropriately
                res.status(400).json({ success: false, message: err_11.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.appleSignon = appleSignon;
exports.CustomerAuthController = {
    signUp: exports.signUp,
    verifyEmail: exports.verifyEmail,
    forgotPassword: exports.forgotPassword,
    resetPassword: exports.resetPassword,
    signIn: exports.signIn,
    resendEmail: exports.resendEmail,
    verifyResetPasswordOtp: exports.verifyResetPasswordOtp,
    googleSignon: exports.googleSignon,
    facebookSignon: exports.facebookSignon,
    appleSignon: exports.appleSignon,
    signInWithPhone: exports.signInWithPhone
};
