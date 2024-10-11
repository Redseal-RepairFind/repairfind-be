"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefundReceiptEmail = exports.handleJobRefunds = void 0;
var __1 = require("../..");
var job_model_1 = require("../../../database/common/job.model");
var payment_schema_1 = require("../../../database/common/payment.schema");
var transaction_model_1 = __importStar(require("../../../database/common/transaction.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var i18n_1 = require("../../../i18n");
var generic_email_1 = require("../../../templates/common/generic_email");
var logger_1 = require("../../logger");
var paypal_1 = require("../../paypal");
var stripe_1 = require("../../stripe");
var handleJobRefunds = function () { return __awaiter(void 0, void 0, void 0, function () {
    var transactions, _i, transactions_1, transaction, fromUser, _a, toUser, _b, job, payment, amount, charge, metadata, stripePayment, amount, capture_id, metadata, paypalRefund, error_1, error_2;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 23, , 24]);
                return [4 /*yield*/, transaction_model_1.default.find({
                        type: transaction_model_1.TRANSACTION_TYPE.REFUND,
                        status: transaction_model_1.TRANSACTION_STATUS.PENDING
                    })];
            case 1:
                transactions = _e.sent();
                _i = 0, transactions_1 = transactions;
                _e.label = 2;
            case 2:
                if (!(_i < transactions_1.length)) return [3 /*break*/, 22];
                transaction = transactions_1[_i];
                _e.label = 3;
            case 3:
                _e.trys.push([3, 20, , 21]);
                if (!(transaction.fromUserType == 'customers')) return [3 /*break*/, 5];
                return [4 /*yield*/, customer_model_1.default.findById(transaction.fromUser)];
            case 4:
                _a = _e.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, contractor_model_1.ContractorModel.findById(transaction.fromUser)];
            case 6:
                _a = _e.sent();
                _e.label = 7;
            case 7:
                fromUser = _a;
                if (!(transaction.toUserType == 'customers')) return [3 /*break*/, 9];
                return [4 /*yield*/, customer_model_1.default.findById(transaction.toUser)];
            case 8:
                _b = _e.sent();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, contractor_model_1.ContractorModel.findById(transaction.toUser)];
            case 10:
                _b = _e.sent();
                _e.label = 11;
            case 11:
                toUser = _b;
                return [4 /*yield*/, job_model_1.JobModel.findById(transaction.job)];
            case 12:
                job = _e.sent();
                if (!(fromUser && toUser && job)) return [3 /*break*/, 18];
                return [4 /*yield*/, payment_schema_1.PaymentModel.findById(transaction.payment)];
            case 13:
                payment = _e.sent();
                if (!payment) {
                    return [2 /*return*/];
                }
                if (!(payment.channel == 'stripe')) return [3 /*break*/, 15];
                amount = (transaction.amount * 100);
                charge = payment.charge_id;
                metadata = (_c = transaction.metadata) !== null && _c !== void 0 ? _c : {};
                metadata.transactionId = transaction.id;
                metadata.paymentId = payment.id;
                return [4 /*yield*/, stripe_1.StripeService.payment.refundCharge(charge, amount, metadata)]; // convert to cent
            case 14:
                stripePayment = _e.sent() // convert to cent
                ;
                _e.label = 15;
            case 15:
                if (!(payment.channel == 'paypal')) return [3 /*break*/, 18];
                amount = (transaction.amount);
                capture_id = payment.capture_id;
                metadata = (_d = transaction.metadata) !== null && _d !== void 0 ? _d : {};
                metadata.transactionId = transaction.id;
                metadata.paymentId = payment.id;
                return [4 /*yield*/, paypal_1.PayPalService.payment.refundPayment(capture_id, amount)];
            case 16:
                paypalRefund = _e.sent();
                return [4 /*yield*/, (0, exports.sendRefundReceiptEmail)({ fromUser: fromUser, toUser: toUser, transaction: transaction, payment: payment, job: job })];
            case 17:
                _e.sent();
                transaction.status == transaction_model_1.TRANSACTION_STATUS.SUCCESSFUL;
                _e.label = 18;
            case 18: return [4 /*yield*/, transaction.save()];
            case 19:
                _e.sent();
                return [3 /*break*/, 21];
            case 20:
                error_1 = _e.sent();
                logger_1.Logger.error("Error processing refund transaction: ".concat(transaction.id), error_1);
                return [3 /*break*/, 21];
            case 21:
                _i++;
                return [3 /*break*/, 2];
            case 22: return [3 /*break*/, 24];
            case 23:
                error_2 = _e.sent();
                logger_1.Logger.error('Error processing refund transaction:', error_2);
                return [3 /*break*/, 24];
            case 24: return [2 /*return*/];
        }
    });
}); };
exports.handleJobRefunds = handleJobRefunds;
var sendRefundReceiptEmail = function (_a) {
    var fromUser = _a.fromUser, toUser = _a.toUser, transaction = _a.transaction, payment = _a.payment, job = _a.job;
    return __awaiter(void 0, void 0, void 0, function () {
        var emailSubject, emailContent, html, translatedHtml, translatedSubject, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    emailSubject = 'Job Refund';
                    emailContent = "\n        <h2>".concat(emailSubject, "</h2>\n        <p style=\"color: #333333;\">Hello ").concat(toUser.name, ",</p>\n        <p style=\"color: #333333;\">You have received a refund for the job payment you made on RepairFind.</p>\n        <p><strong>Job Title:</strong> ").concat(job.description, "</p>\n        <p><strong>Original Payment Date:</strong> ").concat(new Date(payment.created).toLocaleDateString(), "</p>\n        <hr>\n        <p><strong>Refund Details</strong></p>\n        <p><strong>Job Title:</strong> ").concat(job.description, "<br>\n        <strong>Refund Amount:</strong> $").concat(transaction.amount.toFixed(2), "</p>\n\n        <p><strong>Original Payment:</strong><br>\n        - Payment Method: ").concat(payment.channel === 'stripe' ? 'Credit/Debit Card (Stripe)' : 'PayPal', "<br>\n        - Transaction ID: RPT").concat(transaction.id, "</p>\n\n        <p style=\"color: #333333;\">The amount has been refunded to your original payment method.</p>\n        <p style=\"color: #333333;\">If you have any issues or questions, please contact us via support.</p>\n        <p style=\"color: #333333;\">Thank you for using RepairFind!</p>\n    ");
                    html = (0, generic_email_1.GenericEmailTemplate)({ name: toUser.name, subject: emailSubject, content: emailContent });
                    return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: html, targetLang: toUser.language, saveToFile: false, useGoogle: true, contentType: 'html' })];
                case 1:
                    translatedHtml = (_b.sent()) || html;
                    return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: emailSubject, targetLang: toUser.language })];
                case 2:
                    translatedSubject = (_b.sent()) || emailSubject;
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, __1.EmailService.send(toUser.email, translatedSubject, translatedHtml)];
                case 4:
                    _b.sent();
                    logger_1.Logger.info("Refund receipt email sent to ".concat(toUser.email));
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _b.sent();
                    logger_1.Logger.error("Failed to send refund receipt email to ".concat(toUser.email, ":"), error_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
};
exports.sendRefundReceiptEmail = sendRefundReceiptEmail;
