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
exports.AdminEmailResetPasswordController = exports.AdminEmailForgotPasswordController = void 0;
var express_validator_1 = require("express-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var otpGenerator_1 = require("../../../utils/otpGenerator");
var send_email_utility_1 = require("../../../utils/send_email_utility");
var sendEmailTemplate_1 = require("../../../templates/sendEmailTemplate");
//admin forgot password through email /////////////
var AdminEmailForgotPasswordController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, errors, admin, otp, createdTime, html, emailData, err_1;
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
                // check if user exists
                if (!admin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid email" })];
                }
                otp = (0, otpGenerator_1.generateOTP)();
                createdTime = new Date();
                admin.passwordOtp = {
                    otp: otp,
                    createdTime: createdTime,
                    verified: true
                };
                return [4 /*yield*/, (admin === null || admin === void 0 ? void 0 : admin.save())];
            case 2:
                _a.sent();
                html = (0, sendEmailTemplate_1.htmlMailTemplate)(otp, admin.firstName, "We have received a request to change your password");
                emailData = {
                    emailTo: email,
                    subject: "admin password change",
                    html: html
                };
                (0, send_email_utility_1.sendEmail)(emailData);
                return [2 /*return*/, res.status(200).json({ message: "OTP sent successfully to your email." })];
            case 3:
                err_1 = _a.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminEmailForgotPasswordController = AdminEmailForgotPasswordController;
//admin reset password through email /////////////
var AdminEmailResetPasswordController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, password, errors, admin, _b, createdTime, verified, timeDiff, hashedPassword, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, otp = _a.otp, password = _a.password;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email })];
            case 1:
                admin = _c.sent();
                // check if contractor exists
                if (!admin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid email" })];
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
                return [2 /*return*/, res.status(200).json({ message: "password successfully change" })];
            case 4:
                err_2 = _c.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.AdminEmailResetPasswordController = AdminEmailResetPasswordController;
