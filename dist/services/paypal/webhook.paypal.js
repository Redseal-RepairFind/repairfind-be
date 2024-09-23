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
exports.orderApproved = exports.paymentCaptureRefunded = exports.paymentCaptureDenied = exports.paymentCaptureCompleted = exports.PayPalWebhookHandler = void 0;
var contractor_model_1 = require("../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../database/customer/models/customer.model"));
var interface_dto_util_1 = require("../../utils/interface_dto.util");
var transaction_model_1 = __importStar(require("../../database/common/transaction.model"));
var logger_1 = require("../logger");
var payment_schema_1 = require("../../database/common/payment.schema");
var PAYPAL_WEBHOOK_SECRET = process.env.PAYPAL_WEBHOOK_SECRET;
var PayPalWebhookHandler = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var event_1, eventType, eventData;
    return __generator(this, function (_a) {
        try {
            event_1 = req.body;
            eventType = event_1.event_type;
            eventData = event_1.resource;
            switch (eventType) {
                // Payment Events
                case 'PAYMENT.CAPTURE.COMPLETED':
                    (0, exports.paymentCaptureCompleted)(eventData);
                    break;
                case 'PAYMENT.CAPTURE.DENIED':
                    (0, exports.paymentCaptureDenied)(eventData);
                    break;
                case 'PAYMENT.CAPTURE.REFUNDED':
                    (0, exports.paymentCaptureRefunded)(eventData);
                    break;
                // Order Events
                case 'CHECKOUT.ORDER.APPROVED':
                    (0, exports.orderApproved)(eventData);
                    break;
                default:
                    logger_1.Logger.info("Unhandled event type: ".concat(eventType), eventData);
                    break;
            }
        }
        catch (error) {
            logger_1.Logger.info(error.message || "Something went wrong inside PayPal webhook handler");
        }
        return [2 /*return*/];
    });
}); };
exports.PayPalWebhookHandler = PayPalWebhookHandler;
var paymentCaptureCompleted = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var invoice_id, custom_id, payer_id, amount, id, value, currency_code, _a, userType, userId, user, _b, paymentDTO, payment, transaction, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                logger_1.Logger.info('PayPal Event Handler: paymentCaptureCompleted', payload);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 9, , 10]);
                // Ensure the payload is of type capture
                if (payload.object !== 'capture')
                    return [2 /*return*/];
                invoice_id = payload.invoice_id, custom_id = payload.custom_id, payer_id = payload.payer_id, amount = payload.amount, id = payload.id;
                value = amount.value, currency_code = amount.currency_code;
                _a = custom_id.split('_'), userType = _a[0], userId = _a[1];
                if (!userType || !userId)
                    return [2 /*return*/]; // Ensure userType and userId are valid
                if (!(userType === 'contractors')) return [3 /*break*/, 3];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 2:
                _b = _c.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 4:
                _b = _c.sent();
                _c.label = 5;
            case 5:
                user = _b;
                if (!user)
                    return [2 /*return*/]; // Ensure user exists
                paymentDTO = __assign(__assign({}, (0, interface_dto_util_1.castPayloadToDTO)(payload, payload)), { capture_id: id, type: payload.custom, user: user._id, userType: userType, amount: parseFloat(value), currency: currency_code });
                return [4 /*yield*/, payment_schema_1.PaymentModel.findOneAndUpdate({ capture_id: paymentDTO.capture_id }, paymentDTO, {
                        new: true, upsert: true
                    })];
            case 6:
                payment = _c.sent();
                if (!payment) return [3 /*break*/, 8];
                transaction = new transaction_model_1.default({
                    type: paymentDTO.type,
                    amount: paymentDTO.amount,
                    currency: paymentDTO.currency,
                    initiatorUser: userId,
                    initiatorUserType: userType,
                    fromUser: userId,
                    fromUserType: userType,
                    description: 'Payment capture for PayPal',
                    status: transaction_model_1.TRANSACTION_STATUS.SUCCESSFUL,
                    payment: payment._id,
                    metadata: { invoice_id: invoice_id, payer_id: payer_id }
                });
                payment.transaction = transaction._id;
                return [4 /*yield*/, Promise.all([payment.save(), transaction.save()])];
            case 7:
                _c.sent();
                _c.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_1 = _c.sent();
                logger_1.Logger.info('Error handling paymentCaptureCompleted PayPal webhook event', error_1);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.paymentCaptureCompleted = paymentCaptureCompleted;
var paymentCaptureDenied = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var id, payment, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger_1.Logger.info('PayPal Event Handler: paymentCaptureDenied', payload);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                // Ensure the payload is of type capture
                if (payload.object !== 'capture')
                    return [2 /*return*/];
                id = payload.id;
                return [4 /*yield*/, payment_schema_1.PaymentModel.findOne({ capture_id: id })];
            case 2:
                payment = _a.sent();
                if (!payment) return [3 /*break*/, 4];
                payment.status = 'DENIED';
                return [4 /*yield*/, payment.save()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                logger_1.Logger.info('Error handling paymentCaptureDenied PayPal webhook event', error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.paymentCaptureDenied = paymentCaptureDenied;
var paymentCaptureRefunded = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var id, amount, value, payment, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger_1.Logger.info('PayPal Event Handler: paymentCaptureRefunded', payload);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (payload.object !== 'capture')
                    return [2 /*return*/];
                id = payload.id, amount = payload.amount;
                value = amount.value;
                return [4 /*yield*/, payment_schema_1.PaymentModel.findOne({ capture_id: id })];
            case 2:
                payment = _a.sent();
                if (!payment) return [3 /*break*/, 4];
                payment.amount_refunded = parseFloat(value);
                payment.status = 'REFUNDED';
                return [4 /*yield*/, payment.save()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                logger_1.Logger.info('Error handling paymentCaptureRefunded PayPal webhook event', error_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.paymentCaptureRefunded = paymentCaptureRefunded;
var orderApproved = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var id, purchase_units;
    return __generator(this, function (_a) {
        logger_1.Logger.info('PayPal Event Handler: orderApproved', payload);
        try {
            id = payload.id, purchase_units = payload.purchase_units;
            // You can process the approved order here
            logger_1.Logger.info("Order ".concat(id, " approved with purchase units:"), purchase_units);
        }
        catch (error) {
            logger_1.Logger.info('Error handling orderApproved PayPal webhook event', error);
        }
        return [2 /*return*/];
    });
}); };
exports.orderApproved = orderApproved;
