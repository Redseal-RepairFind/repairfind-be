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
var twilio_1 = __importDefault(require("twilio"));
var config_1 = require("../../config");
var logger_1 = require("../logger");
var TwilioService = /** @class */ (function () {
    function TwilioService() {
    }
    TwilioService.initialize = function () {
        var accountSid = config_1.config.twilio.accountSid;
        var authToken = config_1.config.twilio.authToken;
        this.twilioClient = (0, twilio_1.default)(accountSid, authToken);
        this.verificationServiceSid = config_1.config.twilio.verificationServiceSid;
    };
    TwilioService.placeCall = function (to, from, url) {
        return __awaiter(this, void 0, void 0, function () {
            var call, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isValidPhoneNumber(to) || !this.isValidPhoneNumber(from)) {
                            throw new Error('Invalid phone number format');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.twilioClient.calls.create({
                                twiml: "<Response><Say>Hello!</Say></Response>", // Example TwiML response
                                to: to,
                                from: from,
                                url: url,
                            })];
                    case 2:
                        call = _a.sent();
                        console.log("Call placed successfully. Call SID: ".concat(call.sid));
                        return [2 /*return*/, call.sid];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error placing call:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TwilioService.sendSMS = function (to, from, body) {
        return __awaiter(this, void 0, void 0, function () {
            var message, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isValidPhoneNumber(to) || !this.isValidPhoneNumber(from)) {
                            throw new Error('Invalid phone number format');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.twilioClient.messages.create({
                                to: to,
                                from: from,
                                body: body,
                            })];
                    case 2:
                        message = _a.sent();
                        console.log("SMS sent successfully. Message SID: ".concat(message.sid));
                        return [2 /*return*/, message.sid];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error sending SMS:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TwilioService.sendVerificationCode = function (to) {
        return __awaiter(this, void 0, void 0, function () {
            var verification, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isValidPhoneNumber(to)) {
                            throw new Error('Invalid phone number format');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.twilioClient.verify.v2.services(this.verificationServiceSid)
                                .verifications
                                .create({ to: to, channel: 'sms' })];
                    case 2:
                        verification = _a.sent();
                        console.log("Verification code sent successfully to ".concat(to, ". SID: ").concat(verification.sid));
                        return [2 /*return*/, verification.sid];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error sending verification code:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TwilioService.verifyCode = function (to, code) {
        return __awaiter(this, void 0, void 0, function () {
            var verificationCheck, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isValidPhoneNumber(to)) {
                            throw new Error('Invalid phone number format');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.twilioClient.verify.v2.services(this.verificationServiceSid)
                                .verificationChecks
                                .create({ to: to, code: code })];
                    case 2:
                        verificationCheck = _a.sent();
                        if (verificationCheck.status === 'approved') {
                            logger_1.Logger.info("Phone number verified successfully. to: ".concat(to));
                            return [2 /*return*/, true];
                        }
                        else {
                            logger_1.Logger.info("Verification failed. to: ".concat(to));
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        logger_1.Logger.error('Error verifying code:', error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TwilioService.isValidPhoneNumber = function (phoneNumber) {
        var phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
        return phoneNumberPattern.test(phoneNumber);
    };
    return TwilioService;
}());
exports.default = TwilioService;
