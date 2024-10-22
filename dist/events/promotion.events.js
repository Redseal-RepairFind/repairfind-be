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
exports.PromotionEvent = void 0;
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
exports.PromotionEvent = new events_1.EventEmitter();
exports.PromotionEvent.on('NEW_REFERRAL', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var referral, referrer, _a, referralPromotion, couponCode, coupon, bonusActivation, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, , 11]);
                    logger_1.Logger.info("Handling NEW_REFERRAL event");
                    referral = payload.referral;
                    if (!(referral.referrerType === 'customers')) return [3 /*break*/, 2];
                    return [4 /*yield*/, customer_model_1.default.findById(referral.referrer)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, contractor_model_1.ContractorModel.findById(referral.referrer)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    referrer = _a;
                    return [4 /*yield*/, promotion_schema_1.PromotionModel.findOne({ code: 'REFERRAL', status: promotion_schema_1.PROMOTION_STATUS.ACTIVE })];
                case 5:
                    referralPromotion = _b.sent();
                    if (!referralPromotion)
                        return [2 /*return*/];
                    // Check for limits
                    if (referral.referrerType === 'contractors' && referralPromotion.contractorLimit <= 0)
                        return [2 /*return*/];
                    if (referral.referrerType === 'customers' && referralPromotion.customerLimit <= 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, generator_util_1.GeneratorUtil.generateCouponCode(6)];
                case 6:
                    couponCode = _b.sent();
                    return [4 /*yield*/, coupon_schema_1.CouponModel.create({
                            promotion: referralPromotion.id,
                            name: 'Referral Bonus',
                            code: couponCode,
                            user: referral.referrer,
                            userType: referral.referrerType,
                            type: coupon_schema_1.COUPON_TYPE.REFERRAL_BONUS,
                            valueType: coupon_schema_1.COUPON_VALUE_TYPE.FIXED,
                            value: referralPromotion.value,
                            applicableAtCheckout: true,
                            status: coupon_schema_1.COUPON_STATUS.PENDING, // TODO: Track and enable when refered user performs a transactable , job completion is a good place
                        })];
                case 7:
                    coupon = _b.sent();
                    referral.coupon = coupon.id;
                    return [4 /*yield*/, referral.save()];
                case 8:
                    _b.sent();
                    // Decrease promotion limit
                    if (referral.referrerType === 'contractors') {
                        referralPromotion.contractorLimit -= 1;
                    }
                    else if (referral.referrerType === 'customers') {
                        referralPromotion.customerLimit -= 1;
                    }
                    return [4 /*yield*/, referralPromotion.save()];
                case 9:
                    _b.sent();
                    if (referrer) {
                        bonusActivation = (referral.referrerType === 'customers')
                            ? 'when the referred customer books their first job.'
                            : 'when the referred contractor completes their first job';
                        //Do not sen out email, wait until coupon becomes active
                        // await sendReferralEmail(referrer, couponCode, referralPromotion, bonusActivation);
                    }
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _b.sent();
                    logger_1.Logger.error("Error handling NEW_REFERRAL event: ".concat(error_1));
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
});
exports.PromotionEvent.on('REFERRAL_COUPON_ACTIVATED', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var coupon, user, _a, userType, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    logger_1.Logger.info("Handling NEW_REFERRAL event");
                    coupon = payload.coupon;
                    if (!(coupon.userType == 'contractors')) return [3 /*break*/, 2];
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(coupon.user)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, customer_model_1.default.findById(coupon.user)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    user = _a;
                    userType = coupon.userType;
                    if (!(coupon && user)) return [3 /*break*/, 6];
                    //Do not sen out email, wait until coupon becomes active
                    return [4 /*yield*/, sendReferralCouponActivatedEmail(coupon, user, userType)];
                case 5:
                    //Do not sen out email, wait until coupon becomes active
                    _b.sent();
                    _b.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _b.sent();
                    logger_1.Logger.error("Error handling NEW_REFERRAL event: ".concat(error_2));
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
});
var sendReferralEmail = function (referrer, couponCode, referralPromotion, bonusActivation) { return __awaiter(void 0, void 0, void 0, function () {
    var emailSubject, emailContent, html, translatedHtml, translatedSubject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                emailSubject = 'Congratulations! You’ve Earned a Referral Bonus!';
                emailContent = "\n        <h2>".concat(emailSubject, "</h2>\n        <p>Hello ").concat(referrer.firstName, ",</p>\n        <p style=\"color: #333333;\">Great news! You have successfully referred a user to Repairfind!</p>\n        <p style=\"color: #333333;\">Your referral coupon code is <strong>").concat(couponCode, "</strong>.</p>\n        <p style=\"color: #333333;\">This bonus of <strong>$").concat(referralPromotion.value, "</strong> will be activated ").concat(bonusActivation, "</p>\n        <p style=\"color: #333333;\">Thank you for sharing the word and helping us grow our community!</p>\n        <p style=\"color: #333333;\">Best regards,<br>Your Repairfind Team</p>\n    ");
                html = (0, generic_email_1.GenericEmailTemplate)({ name: referrer.firstName, subject: emailSubject, content: emailContent });
                return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: html, targetLang: referrer.language, saveToFile: false, useGoogle: true, contentType: 'html' })];
            case 1:
                translatedHtml = (_a.sent()) || html;
                return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: emailSubject, targetLang: referrer.language })];
            case 2:
                translatedSubject = (_a.sent()) || emailSubject;
                return [4 /*yield*/, services_1.EmailService.send(referrer.email, translatedSubject, translatedHtml)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var sendReferralCouponActivatedEmail = function (coupon, user, userType) { return __awaiter(void 0, void 0, void 0, function () {
    var couponCode, emailSubject, emailContent, html, translatedHtml, translatedSubject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                couponCode = coupon.code;
                emailSubject = 'Congratulations! You’ve Earned a Referral Bonus!';
                if (userType === 'customers') {
                    emailContent = "\n            <h2>".concat(emailSubject, "</h2>\n            <p>Hello ").concat(user.firstName, ",</p>\n            <p style=\"color: #333333;\">Great news! You have successfully referred a user to Repairfind!</p>\n            <p style=\"color: #333333;\">Your referral coupon code is <strong>").concat(couponCode, "</strong>, and it's now activated.</p>\n            <p style=\"color: #333333;\">This bonus of <strong>$").concat(coupon.value, "</strong> can be applied when booking your next job.</p>\n            <p style=\"color: #333333;\">Thank you for spreading the word and helping us grow our community!</p>\n            <p style=\"color: #333333;\">Best regards,<br>Your Repairfind Team</p>\n        ");
                }
                else if (userType === 'contractors') {
                    emailContent = "\n            <h2>".concat(emailSubject, "</h2>\n            <p>Hello ").concat(user.firstName, ",</p>\n            <p style=\"color: #333333;\">Great news! You have successfully referred a user to Repairfind!</p>\n            <p style=\"color: #333333;\">Your referral coupon code is <strong>").concat(couponCode, "</strong>, and it's now activated.</p>\n            <p style=\"color: #333333;\">This bonus of <strong>$").concat(coupon.value, "</strong> will be paid out in your next payout.</p>\n            <p style=\"color: #333333;\">Thank you for spreading the word and helping us grow our community!</p>\n            <p style=\"color: #333333;\">Best regards,<br>Your Repairfind Team</p>\n        ");
                }
                html = (0, generic_email_1.GenericEmailTemplate)({ name: user.firstName, subject: emailSubject, content: emailContent });
                return [4 /*yield*/, i18n_1.i18n.getTranslation({
                        phraseOrSlug: html,
                        targetLang: user.language,
                        saveToFile: false,
                        useGoogle: true,
                        contentType: 'html'
                    })];
            case 1:
                translatedHtml = (_a.sent()) || html;
                return [4 /*yield*/, i18n_1.i18n.getTranslation({
                        phraseOrSlug: emailSubject,
                        targetLang: user.language
                    })];
            case 2:
                translatedSubject = (_a.sent()) || emailSubject;
                // Send the email
                return [4 /*yield*/, services_1.EmailService.send(user.email, translatedSubject, translatedHtml)];
            case 3:
                // Send the email
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
