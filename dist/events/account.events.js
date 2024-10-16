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
exports.AccountEvent = void 0;
var events_1 = require("events");
var logger_1 = require("../services/logger");
var generic_email_1 = require("../templates/common/generic_email");
var services_1 = require("../services");
var customer_model_1 = __importDefault(require("../database/customer/models/customer.model"));
var contractor_model_1 = require("../database/contractor/models/contractor.model");
var i18n_1 = require("../i18n");
var promotion_schema_1 = require("../database/common/promotion.schema");
var generator_util_1 = require("../utils/generator.util");
var coupon_schema_1 = require("../database/common/coupon.schema");
exports.AccountEvent = new events_1.EventEmitter();
exports.AccountEvent.on('ACCOUNT_DELETED', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var user, emailSubject, emailContent, html, translatedHtml, translatedSubject, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    logger_1.Logger.info("handling ACCOUNT_DELETED event");
                    user = payload.user;
                    emailSubject = 'Account Deleted ';
                    emailContent = "\n                <h2>".concat(emailSubject, "</h2>\n                <p style=\"color: #333333;\">Your has been deleted successfully, </p>\n                <p style=\"color: #333333;\">All pending transactions will be processed and settled in 5 business days</p>\n                 <p style=\"color: #333333;\">If you have any enquiry kindly reach via any of our available channels</p>\n                <p style=\"color: #333333;\">Thanks for your patronage</p>\n                ");
                    html = (0, generic_email_1.GenericEmailTemplate)({ name: user.firstName, subject: emailSubject, content: emailContent });
                    return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: html, targetLang: user.language, saveToFile: false, useGoogle: true, contentType: 'html' })];
                case 1:
                    translatedHtml = (_a.sent()) || html;
                    return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: emailSubject, targetLang: user.language })];
                case 2:
                    translatedSubject = (_a.sent()) || emailSubject;
                    services_1.EmailService.send(user.email, translatedSubject, translatedHtml);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.Logger.error("Error handling ACCOUNT_DELETED event: ".concat(error_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
exports.AccountEvent.on('ACCOUNT_UPDATED', function (payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var user, userType;
        return __generator(this, function (_b) {
            try {
                logger_1.Logger.info("handling ACCOUNT_UPDATED event");
                user = payload.user;
                userType = payload.userType;
                //TODO: 07/10/2024
                services_1.NotificationService.sendNotification({
                    user: user.id,
                    userType: userType,
                    title: 'Account Updated',
                    type: 'ACCOUNT_UPDATED',
                    message: "Your account was updated",
                    heading: { name: "".concat(user.name), image: (_a = user.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                    payload: {
                        entity: user.id,
                        entityType: userType == 'customers' ? 'customers' : 'contractors',
                        message: "Your account was updated",
                        language: user.language,
                        event: 'ACCOUNT_UPDATED',
                    }
                }, { socket: true });
            }
            catch (error) {
                logger_1.Logger.error("Error handling ACCOUNT_UPDATED event: ".concat(error));
            }
            return [2 /*return*/];
        });
    });
});
exports.AccountEvent.on('NEW_CONTRACTOR', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var contractor, referralPromotion, couponCode, coupon, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    logger_1.Logger.info("handling NEW_CONTRACTOR event");
                    contractor = payload.contractor;
                    return [4 /*yield*/, promotion_schema_1.PromotionModel.findOne({ code: 'EARLYBIRDCONTRACTOR', status: promotion_schema_1.PROMOTION_STATUS.ACTIVE })];
                case 1:
                    referralPromotion = _a.sent();
                    if (!referralPromotion)
                        return [2 /*return*/];
                    if (referralPromotion.contractorLimit <= 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, generator_util_1.GeneratorUtil.generateCouponCode(6)];
                case 2:
                    couponCode = _a.sent();
                    return [4 /*yield*/, coupon_schema_1.CouponModel.create({
                            promotion: referralPromotion.id,
                            name: '50% Discount on Service Fee',
                            code: couponCode,
                            user: contractor.id,
                            userType: 'contractors',
                            type: coupon_schema_1.COUPON_TYPE.SERVICE_FEE_DISCOUNT,
                            valueType: coupon_schema_1.COUPON_VALUE_TYPE.PERCENTAGE,
                            value: referralPromotion.value,
                            applicableAtCheckout: true,
                            status: coupon_schema_1.COUPON_STATUS.ACTIVE,
                        })];
                case 3:
                    coupon = _a.sent();
                    // Decrease promotion limit
                    referralPromotion.contractorLimit -= 1;
                    return [4 /*yield*/, referralPromotion.save()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, sendEarlyBirdCouponEmail(contractor, referralPromotion)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    logger_1.Logger.error("Error handling NEW_CONTRACTOR event: ".concat(error_2));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
});
exports.AccountEvent.on('ACCOUNT_REPORTED', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var report, reportedUser, _a, emailSubject, emailContent, html, translatedHtml, translatedSubject, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    logger_1.Logger.info("handling ACCOUNT_REPORTED event");
                    report = payload.report;
                    if (!(report.reportedType === 'customers')) return [3 /*break*/, 2];
                    return [4 /*yield*/, customer_model_1.default.findById(report.reported)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, contractor_model_1.ContractorModel.findById(report.reported)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    reportedUser = _a;
                    if (!reportedUser) return [3 /*break*/, 7];
                    emailSubject = 'Account Reported ';
                    emailContent = "\n                    <h2>".concat(emailSubject, "</h2>\n                    <p>Hello ").concat(reportedUser.firstName, ",</p>\n                    <p style=\"color: #333333;\">Your account was reported for abuse and we are currently investigating your account </p>\n                    <p style=\"color: #333333;\">Please note that we operate a three(3) count strike approach, which means that three (3) consecutive reports will lead to your account being temporary suspended</p>\n                     <p style=\"color: #333333;\">If you have any enquiry or concerns kindly reach via any of our available channels</p>\n                    <p style=\"color: #333333;\">Thanks for your patronage</p>\n                    ");
                    html = (0, generic_email_1.GenericEmailTemplate)({ name: reportedUser.firstName, subject: emailSubject, content: emailContent });
                    return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: html, targetLang: reportedUser.language, saveToFile: false, useGoogle: true, contentType: 'html' })];
                case 5:
                    translatedHtml = (_b.sent()) || html;
                    return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: emailSubject, targetLang: reportedUser.language })];
                case 6:
                    translatedSubject = (_b.sent()) || emailSubject;
                    services_1.EmailService.send(reportedUser.email, translatedSubject, translatedHtml);
                    _b.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_3 = _b.sent();
                    logger_1.Logger.error("Error handling ACCOUNT_REPORTED event: ".concat(error_3));
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
});
var sendEarlyBirdCouponEmail = function (contractor, referralPromotion) { return __awaiter(void 0, void 0, void 0, function () {
    var emailSubject, emailContent, html, translatedHtml, translatedSubject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                emailSubject = 'Welcome to Repairfind! You’ve Earned an Early Bird Discount!';
                emailContent = "\n        <h2>".concat(emailSubject, "</h2>\n        <p>Hello ").concat(contractor.firstName, ",</p>\n        <p style=\"color: #333333;\">We're excited to have you as one of the Early Bird Contractors on Repairfind!</p>\n        <p style=\"color: #333333;\">As a token of appreciation for joining early, you\u2019ve earned an exclusive <strong>").concat(referralPromotion.value, "% discount</strong> on our service fee.</p>\n        <p style=\"color: #333333;\">This discount will automatically apply on your first Job.</p>\n        <p style=\"color: #333333;\">We\u2019re thrilled to have you on board and look forward to working with you. Enjoy the perks of being an Early Bird Contractor!</p>\n        <p style=\"color: #333333;\">Best regards,<br>Your Repairfind Team</p>\n    ");
                html = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.firstName, subject: emailSubject, content: emailContent });
                return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true, contentType: 'html' })];
            case 1:
                translatedHtml = (_a.sent()) || html;
                return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: emailSubject, targetLang: contractor.language })];
            case 2:
                translatedSubject = (_a.sent()) || emailSubject;
                return [4 /*yield*/, services_1.EmailService.send(contractor.email, translatedSubject, translatedHtml)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
