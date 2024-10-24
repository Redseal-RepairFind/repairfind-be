"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEscrowTransfer = void 0;
var payment_schema_1 = require("../../../database/common/payment.schema");
var transaction_model_1 = __importStar(require("../../../database/common/transaction.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var transaction_events_1 = require("../../../events/transaction.events");
var logger_1 = require("../../logger");
var paypal_1 = require("../../paypal");
var stripe_1 = require("../../stripe");
var email_1 = require("../../email"); // Import the email service
var generic_email_1 = require("../../../templates/common/generic_email");
var handleEscrowTransfer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var transactions, _i, transactions_1, transaction, toUser, payment, transferDetails, toUserStripeConnectAccount, connectAccountId, amount, transactionMeta, metadata, stripeTransfer, amount, paypalTransfer, transactionMeta, metadata, error_1, _a, name_1, message, details, error_2, error_3;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 20, , 21]);
                return [4 /*yield*/, transaction_model_1.default.find({
                        type: transaction_model_1.TRANSACTION_TYPE.ESCROW,
                        status: transaction_model_1.TRANSACTION_STATUS.APPROVED
                    })];
            case 1:
                transactions = _d.sent();
                logger_1.Logger.info("Found ".concat(transactions.length, " escrow transactions to process."));
                _i = 0, transactions_1 = transactions;
                _d.label = 2;
            case 2:
                if (!(_i < transactions_1.length)) return [3 /*break*/, 19];
                transaction = transactions_1[_i];
                _d.label = 3;
            case 3:
                _d.trys.push([3, 15, 16, 18]);
                logger_1.Logger.info("Processing escrow transfer for transaction ".concat(transaction.id));
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(transaction.toUser)];
            case 4:
                toUser = _d.sent();
                if (!toUser) {
                    logger_1.Logger.error("Contractor not found for transaction ".concat(transaction.id));
                    throw 'Contractor not found';
                }
                return [4 /*yield*/, payment_schema_1.PaymentModel.findById(transaction.payment)];
            case 5:
                payment = _d.sent();
                if (!payment) {
                    logger_1.Logger.error("Payment not found for transaction ".concat(transaction.id));
                    return [3 /*break*/, 18];
                }
                transferDetails = void 0;
                if (!(payment.channel === 'stripe')) return [3 /*break*/, 9];
                logger_1.Logger.info("Processing Stripe transfer for transaction ".concat(transaction.id));
                toUserStripeConnectAccount = toUser === null || toUser === void 0 ? void 0 : toUser.stripeAccount;
                if (!toUserStripeConnectAccount) {
                    logger_1.Logger.error("No active Stripe connect account found for contractor ".concat(toUser.id));
                    throw 'Contractor does not have an active connect account';
                }
                connectAccountId = toUserStripeConnectAccount.id;
                amount = (transaction.amount * 100);
                transactionMeta = (_b = transaction.metadata) !== null && _b !== void 0 ? _b : {};
                metadata = __assign(__assign({}, transactionMeta), { transactionId: transaction.id, paymentId: payment.id });
                return [4 /*yield*/, stripe_1.StripeService.transfer.createTransfer(connectAccountId, amount, metadata)];
            case 6:
                stripeTransfer = _d.sent();
                metadata.transfer = stripeTransfer;
                transaction.metadata = metadata;
                transaction.status = transaction_model_1.TRANSACTION_STATUS.SUCCESSFUL;
                transferDetails = stripeTransfer;
                return [4 /*yield*/, transaction.save()];
            case 7:
                _d.sent();
                logger_1.Logger.info("Stripe transfer successful for transaction ".concat(transaction.id));
                transaction_events_1.TransactionEvent.emit('ESCROW_TRANSFER_SUCCESSFUL', transaction);
                return [4 /*yield*/, sendEscrowTransferEmail(toUser, transaction, payment, transferDetails)];
            case 8:
                _d.sent();
                _d.label = 9;
            case 9:
                if (!(payment.channel === 'paypal')) return [3 /*break*/, 14];
                logger_1.Logger.info("Processing PayPal transfer for transaction ".concat(transaction.id));
                _d.label = 10;
            case 10:
                _d.trys.push([10, 13, , 14]);
                amount = transaction.amount;
                return [4 /*yield*/, paypal_1.PayPalService.payout.transferToEmail(toUser.email, amount, 'CAD')];
            case 11:
                paypalTransfer = _d.sent();
                transactionMeta = (_c = transaction.metadata) !== null && _c !== void 0 ? _c : {};
                metadata = __assign(__assign({}, transactionMeta), { transactionId: transaction.id, paymentId: payment.id, transfer: paypalTransfer });
                transaction.metadata = metadata;
                transaction.status = transaction_model_1.TRANSACTION_STATUS.SUCCESSFUL;
                transferDetails = paypalTransfer;
                logger_1.Logger.info("PayPal transfer successful for transaction ".concat(transaction.id));
                transaction_events_1.TransactionEvent.emit('ESCROW_TRANSFER_SUCCESSFUL', transaction);
                return [4 /*yield*/, sendEscrowTransferEmail(toUser, transaction, payment, transferDetails)];
            case 12:
                _d.sent();
                return [3 /*break*/, 14];
            case 13:
                error_1 = _d.sent();
                logger_1.Logger.error("PayPal transfer error for transaction ".concat(transaction.id, ":"), error_1);
                // Extract PayPal error details if available
                if (error_1.response && error_1.response.data) {
                    _a = error_1.response.data, name_1 = _a.name, message = _a.message, details = _a.details;
                    logger_1.Logger.error("PayPal Error Name: ".concat(name_1));
                    logger_1.Logger.error("PayPal Error Message: ".concat(message));
                    if (details && Array.isArray(details)) {
                        details.forEach(function (detail) {
                            logger_1.Logger.error("PayPal Error Detail: ".concat(JSON.stringify(detail)));
                        });
                    }
                    // Specific handling of known error (e.g., Authorization issue)
                    if (name_1 === 'Authorization' && details.some(function (detail) { return detail.issue === 'CAPTURE_FULLY_REFUNDED'; })) {
                        logger_1.Logger.info("Transaction authorization failed: ".concat(transaction.id));
                        transaction.status = transaction_model_1.TRANSACTION_STATUS.FAILED;
                    }
                }
                // Re-throw error for further handling if it's not a known issue
                throw error_1;
            case 14: return [3 /*break*/, 18];
            case 15:
                error_2 = _d.sent();
                logger_1.Logger.error("Error processing payout transfer for transaction ".concat(transaction.id, ":"), error_2);
                return [3 /*break*/, 18];
            case 16: 
            // Ensure transaction is saved regardless of success or failure
            return [4 /*yield*/, transaction.save()];
            case 17:
                // Ensure transaction is saved regardless of success or failure
                _d.sent();
                return [7 /*endfinally*/];
            case 18:
                _i++;
                return [3 /*break*/, 2];
            case 19: return [3 /*break*/, 21];
            case 20:
                error_3 = _d.sent();
                logger_1.Logger.error('Error processing handleEscrowTransfer:', error_3);
                return [3 /*break*/, 21];
            case 21: return [2 /*return*/];
        }
    });
}); };
exports.handleEscrowTransfer = handleEscrowTransfer;
// Function to send email after successful escrow transfer
var sendEscrowTransferEmail = function (contractor, transaction, payment, transferDetails) { return __awaiter(void 0, void 0, void 0, function () {
    var emailSubject, emailContent, html, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                emailSubject = 'Escrow Payment Received';
                emailContent = "\n        <h2>".concat(emailSubject, "</h2>\n        <p style=\"color: #333333;\">Hello ").concat(contractor.name, ",</p>\n        <p style=\"color: #333333;\">The payment for the job has been released from escrow and transferred to your account.</p>\n        <p><strong>Job Description:</strong> ").concat(transaction.jobDescription, "</p>\n        <p><strong>Transaction Amount:</strong> $").concat(transaction.amount.toFixed(2), "</p>\n        <p><strong>Payment Method:</strong> ").concat(payment.channel === 'stripe' ? 'Stripe' : 'PayPal', "</p>\n        <p style=\"color: #333333;\">Thank you for using RepairFind!</p>\n        <p style=\"color: #333333;\">If you have any issues, feel free to contact us via support.</p>\n    ");
                html = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.name, subject: emailSubject, content: emailContent });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, email_1.EmailService.send(contractor.email, emailSubject, html)];
            case 2:
                _a.sent();
                logger_1.Logger.info("Escrow transfer email sent to ".concat(contractor.email, " for transaction ").concat(transaction.id));
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                logger_1.Logger.error("Failed to send escrow transfer email to ".concat(contractor.email, " for transaction ").concat(transaction.id, ":"), error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
