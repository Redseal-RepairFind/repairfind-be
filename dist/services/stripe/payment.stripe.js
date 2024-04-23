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
exports.attachPaymentMethod = exports.detachPaymentMethod = exports.listPaymentMethods = exports.getPaymentMethod = exports.createPaymentIntent = exports.capturePayment = exports.chargeCustomer = exports.chargeUserOnDemand = exports.createSetupIntent = void 0;
var stripe_1 = __importDefault(require("stripe"));
var STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
var stripeClient = new stripe_1.default(STRIPE_SECRET_KEY);
var createSetupIntent = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var setupIntent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripeClient.setupIntents.create(__assign({}, payload))];
            case 1:
                setupIntent = _a.sent();
                return [2 /*return*/, setupIntent];
        }
    });
}); };
exports.createSetupIntent = createSetupIntent;
var chargeUserOnDemand = function (setupIntentId) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentIntent, confirmedPaymentIntent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripeClient.paymentIntents.create({
                    amount: 1000, // Amount in cents
                    currency: 'usd',
                    payment_method: 'pm_card_visa', // Use the Payment Method ID obtained during authorization
                    confirmation_method: 'manual',
                    confirm: true,
                    setup_future_usage: 'off_session', // Indicates that this PaymentIntent may be used for future off-session payments
                    customer: 'CUSTOMER_ID', // ID of the customer associated with the Payment Intent
                    // setup_intent: setupIntentId, // Pass the Setup Intent ID
                })];
            case 1:
                paymentIntent = _a.sent();
                return [4 /*yield*/, stripeClient.paymentIntents.confirm(paymentIntent.id)];
            case 2:
                confirmedPaymentIntent = _a.sent();
                // Handle the confirmedPaymentIntent result...
                return [2 /*return*/, confirmedPaymentIntent];
        }
    });
}); };
exports.chargeUserOnDemand = chargeUserOnDemand;
var chargeCustomer = function (customerId, paymentMethodId, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentIntent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripeClient.paymentIntents.create(__assign({}, payload))];
            case 1:
                paymentIntent = _a.sent();
                return [2 /*return*/, paymentIntent];
        }
    });
}); };
exports.chargeCustomer = chargeCustomer;
var capturePayment = function (paymentIntent) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripeClient.paymentIntents.capture(paymentIntent)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.capturePayment = capturePayment;
var createPaymentIntent = function (customerId, paymentMethodId, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentIntent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripeClient.checkout.sessions.create({
                    mode: 'payment',
                    payment_method_types: ['card'],
                    line_items: payload.line_items,
                    metadata: payload.metadata,
                    success_url: "https://repairfind.ca/payment-success/",
                    cancel_url: "https://cancel.com",
                    customer_email: payload.email
                })];
            case 1:
                paymentIntent = _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createPaymentIntent = createPaymentIntent;
var getPaymentMethod = function (paymentMethodId) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentMethod;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripeClient.paymentMethods.retrieve(paymentMethodId)];
            case 1:
                paymentMethod = _a.sent();
                return [2 /*return*/, paymentMethod];
        }
    });
}); };
exports.getPaymentMethod = getPaymentMethod;
var listPaymentMethods = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentMethods;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripeClient.paymentMethods.list(query)];
            case 1:
                paymentMethods = _a.sent();
                return [2 /*return*/, paymentMethods];
        }
    });
}); };
exports.listPaymentMethods = listPaymentMethods;
var detachPaymentMethod = function (paymentMethodId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripeClient.paymentMethods.detach(paymentMethodId)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.detachPaymentMethod = detachPaymentMethod;
var attachPaymentMethod = function (paymentMethodId, payload) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripeClient.paymentMethods.attach(paymentMethodId, payload)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.attachPaymentMethod = attachPaymentMethod;
