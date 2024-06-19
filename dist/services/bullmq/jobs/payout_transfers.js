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
exports.handlePayoutTransfer = void 0;
var __1 = require("../..");
var payment_schema_1 = require("../../../database/common/payment.schema");
var transaction_model_1 = __importStar(require("../../../database/common/transaction.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var transaction_events_1 = require("../../../events/transaction.events");
var logger_1 = require("../../../utils/logger");
var stripe_1 = require("../../stripe");
var handlePayoutTransfer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var transactions, _i, transactions_1, transaction, toUser, toUserStripeConnectAccount, connectAccountId, payment, amount, transactionMeta, metadata, stripeTransfer, error_1, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                return [4 /*yield*/, transaction_model_1.default.find({
                        type: transaction_model_1.TRANSACTION_TYPE.PAYOUT,
                        status: transaction_model_1.TRANSACTION_STATUS.APPROVED
                    })];
            case 1:
                transactions = _b.sent();
                _i = 0, transactions_1 = transactions;
                _b.label = 2;
            case 2:
                if (!(_i < transactions_1.length)) return [3 /*break*/, 10];
                transaction = transactions_1[_i];
                _b.label = 3;
            case 3:
                _b.trys.push([3, 8, , 9]);
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(transaction.toUser)];
            case 4:
                toUser = _b.sent();
                if (!toUser)
                    throw 'Contractor not found';
                toUserStripeConnectAccount = toUser === null || toUser === void 0 ? void 0 : toUser.stripeAccount;
                if (!toUserStripeConnectAccount)
                    throw 'Contractor does not have an active connect account';
                connectAccountId = toUserStripeConnectAccount.id;
                return [4 /*yield*/, payment_schema_1.PaymentModel.findById(transaction.payment)];
            case 5:
                payment = _b.sent();
                if (!payment)
                    return [2 /*return*/];
                amount = (transaction.amount * 100) // change to base currency
                ;
                transactionMeta = transaction.metadata;
                metadata = (_a = __assign({}, transactionMeta)) !== null && _a !== void 0 ? _a : {};
                metadata.transactionId = transaction.id;
                metadata.paymentId = payment.id;
                return [4 /*yield*/, stripe_1.StripeService.transfer.createTransfer(connectAccountId, amount, metadata)];
            case 6:
                stripeTransfer = _b.sent();
                metadata.transfer = stripeTransfer;
                transaction.metadata = metadata;
                transaction.status = transaction_model_1.TRANSACTION_STATUS.SUCCESSFUL;
                return [4 /*yield*/, transaction.save()
                    //emit event and handle notifications from there ?
                ];
            case 7:
                _b.sent();
                //emit event and handle notifications from there ?
                transaction_events_1.TransactionEvent.emit('PAYOUT_TRANSFER_SUCCESSFUL', transaction);
                return [3 /*break*/, 9];
            case 8:
                error_1 = _b.sent();
                logger_1.Logger.error("Error processing payout transfer: ".concat(transaction.id), error_1);
                return [3 /*break*/, 9];
            case 9:
                _i++;
                return [3 /*break*/, 2];
            case 10: return [3 /*break*/, 12];
            case 11:
                error_2 = _b.sent();
                logger_1.Logger.error('Error processing payout transfer:', error_2);
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.handlePayoutTransfer = handlePayoutTransfer;
function sendNotification(customer, contractor, job, message) {
    var _a, _b;
    __1.NotificationService.sendNotification({
        user: contractor.id,
        userType: 'contractors',
        title: 'Job Schedule Reminder',
        type: 'JOB_DAY_REMINDER', //
        message: message,
        heading: { name: "".concat(customer.name), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
        payload: {
            entity: job.id,
            entityType: 'jobs',
            message: message,
            contractor: contractor.id,
            event: 'JOB_DAY_REMINDER',
        }
    }, { push: true, socket: true });
    // reminder to customer
    __1.NotificationService.sendNotification({
        user: customer.id,
        userType: 'customers',
        title: 'Job Schedule Reminder',
        type: 'JOB_DAY_REMINDER', //
        message: message,
        heading: { name: "".concat(contractor.name), image: (_b = contractor.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
        payload: {
            entity: job.id,
            entityType: 'jobs',
            message: message,
            contractor: contractor.id,
            event: 'JOB_DAY_REMINDER',
        }
    }, { push: true, socket: true });
}
