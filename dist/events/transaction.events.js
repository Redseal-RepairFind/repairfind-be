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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionEvent = void 0;
var events_1 = require("events");
var customer_model_1 = __importDefault(require("../database/customer/models/customer.model"));
var contractor_model_1 = require("../database/contractor/models/contractor.model");
var services_1 = require("../services");
var coupon_schema_1 = require("../database/common/coupon.schema");
var transaction_model_1 = __importStar(require("../database/common/transaction.model"));
exports.TransactionEvent = new events_1.EventEmitter();
exports.TransactionEvent.on('ESCROW_TRANSFER_SUCCESSFUL', function (transaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var fromUser, _b, toUser, _c, coupons, error_1;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 11, , 12]);
                    console.log('handling ESCROW_TRANSFER_SUCCESSFUL event', transaction.id);
                    if (!(transaction.fromUserType == 'customers')) return [3 /*break*/, 2];
                    return [4 /*yield*/, customer_model_1.default.findById(transaction.fromUser)];
                case 1:
                    _b = _d.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, contractor_model_1.ContractorModel.findById(transaction.fromUser)];
                case 3:
                    _b = _d.sent();
                    _d.label = 4;
                case 4:
                    fromUser = _b;
                    if (!(transaction.toUserType == 'customers')) return [3 /*break*/, 6];
                    return [4 /*yield*/, customer_model_1.default.findById(transaction.toUser)];
                case 5:
                    _c = _d.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, contractor_model_1.ContractorModel.findById(transaction.toUser)];
                case 7:
                    _c = _d.sent();
                    _d.label = 8;
                case 8:
                    toUser = _c;
                    if (!toUser) return [3 /*break*/, 10];
                    services_1.NotificationService.sendNotification({
                        user: toUser.id,
                        userType: transaction.toUserType,
                        title: 'Fund transfer',
                        type: 'FUND_TRANSFER', //
                        message: "Fund transfer successful",
                        heading: { name: "".concat(toUser.name), image: (_a = toUser.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: transaction.id,
                            entityType: 'transactions',
                            message: "Fund transfer successful",
                            customer: toUser.id,
                            event: 'FUND_TRANSFER',
                            transactionId: transaction.id,
                        }
                    }, { push: true, socket: true });
                    if (!(transaction.toUserType === 'contractors')) return [3 /*break*/, 10];
                    return [4 /*yield*/, coupon_schema_1.CouponModel.find({ user: toUser.id, userType: 'contractors', status: coupon_schema_1.COUPON_STATUS.ACTIVE, type: coupon_schema_1.COUPON_TYPE.REFERRAL_BONUS })];
                case 9:
                    coupons = _d.sent();
                    coupons.map(function (coupon) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: 
                                //create refund transaction for each payment
                                return [4 /*yield*/, transaction_model_1.default.create({
                                        type: transaction_model_1.TRANSACTION_TYPE.REFERRAL_BONUS_PAYMENT,
                                        amount: coupon.value,
                                        toUser: coupon.user,
                                        toUserType: coupon.userType,
                                        description: "Referral Bonus Payment for: ".concat(coupon === null || coupon === void 0 ? void 0 : coupon.code),
                                        status: transaction_model_1.TRANSACTION_STATUS.APPROVED,
                                        remark: 'bonus_payout',
                                        invoice: {
                                            items: [],
                                            charges: { amount: coupon.value }
                                        },
                                        metadata: __assign(__assign({}, coupon), { amount: coupon.value }),
                                    })];
                                case 1:
                                    //create refund transaction for each payment
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    _d.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    error_1 = _d.sent();
                    console.error("Error handling ESCROW_TRANSFER_SUCCESSFUL event: ".concat(error_1));
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
});
