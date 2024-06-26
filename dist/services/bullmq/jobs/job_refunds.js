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
exports.handleJobRefunds = void 0;
var __1 = require("../..");
var payment_schema_1 = require("../../../database/common/payment.schema");
var transaction_model_1 = __importStar(require("../../../database/common/transaction.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var logger_1 = require("../../logger");
var stripe_1 = require("../../stripe");
var handleJobRefunds = function () { return __awaiter(void 0, void 0, void 0, function () {
    var transactions, _i, transactions_1, transaction, fromUser, _a, toUser, _b, payment, amount, charge, metadata, stripePayment, error_1, error_2;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 19, , 20]);
                return [4 /*yield*/, transaction_model_1.default.find({
                        type: transaction_model_1.TRANSACTION_TYPE.REFUND,
                        status: transaction_model_1.TRANSACTION_STATUS.PENDING
                    })];
            case 1:
                transactions = _d.sent();
                _i = 0, transactions_1 = transactions;
                _d.label = 2;
            case 2:
                if (!(_i < transactions_1.length)) return [3 /*break*/, 18];
                transaction = transactions_1[_i];
                _d.label = 3;
            case 3:
                _d.trys.push([3, 16, , 17]);
                if (!(transaction.fromUserType == 'customers')) return [3 /*break*/, 5];
                return [4 /*yield*/, customer_model_1.default.findById(transaction.fromUser)];
            case 4:
                _a = _d.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, contractor_model_1.ContractorModel.findById(transaction.fromUser)];
            case 6:
                _a = _d.sent();
                _d.label = 7;
            case 7:
                fromUser = _a;
                if (!(transaction.toUserType == 'customers')) return [3 /*break*/, 9];
                return [4 /*yield*/, customer_model_1.default.findById(transaction.toUser)];
            case 8:
                _b = _d.sent();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, contractor_model_1.ContractorModel.findById(transaction.toUser)];
            case 10:
                _b = _d.sent();
                _d.label = 11;
            case 11:
                toUser = _b;
                if (!(fromUser && toUser)) return [3 /*break*/, 14];
                return [4 /*yield*/, payment_schema_1.PaymentModel.findById(transaction.payment)];
            case 12:
                payment = _d.sent();
                if (!payment) {
                    return [2 /*return*/];
                }
                amount = (transaction.amount * 100);
                charge = payment.charge;
                metadata = (_c = transaction.metadata) !== null && _c !== void 0 ? _c : {};
                metadata.transactionId = transaction.id;
                metadata.paymentId = payment.id;
                return [4 /*yield*/, stripe_1.StripeService.payment.refundCharge(charge, amount, metadata)]; // convert to cent
            case 13:
                stripePayment = _d.sent() // convert to cent
                ;
                _d.label = 14;
            case 14: return [4 /*yield*/, transaction.save()];
            case 15:
                _d.sent();
                return [3 /*break*/, 17];
            case 16:
                error_1 = _d.sent();
                logger_1.Logger.error("Error processing refund transaction: ".concat(transaction.id), error_1);
                return [3 /*break*/, 17];
            case 17:
                _i++;
                return [3 /*break*/, 2];
            case 18: return [3 /*break*/, 20];
            case 19:
                error_2 = _d.sent();
                logger_1.Logger.error('Error processing refund transaction:', error_2);
                return [3 /*break*/, 20];
            case 20: return [2 /*return*/];
        }
    });
}); };
exports.handleJobRefunds = handleJobRefunds;
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
