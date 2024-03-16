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
exports.setupIntentSucceeded = exports.identityVerificationCreated = exports.setupIntentCreated = exports.StripeWebhookHandler = void 0;
var stripe_1 = __importDefault(require("stripe"));
var custom_errors_1 = require("../../utils/custom.errors");
var _1 = require(".");
var contractor_model_1 = require("../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../database/customer/models/customer.model"));
var STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
var STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
var stripeClient = new stripe_1.default(STRIPE_SECRET_KEY);
var StripeWebhookHandler = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payloadString, sig, event_1, eventType, eventData;
    return __generator(this, function (_a) {
        try {
            payloadString = JSON.stringify(req.body);
            sig = req.headers['stripe-signature'];
            event_1 = stripeClient.webhooks.constructEvent(
            //@ts-ignore
            req.rawBody, sig, STRIPE_WEBHOOK_SECRET);
            eventType = event_1.type;
            eventData = event_1.data;
            // console.log(event)
            // Log.info(event)
            switch (eventType) {
                case 'setup_intent.created':
                    (0, exports.setupIntentCreated)(eventData.object);
                    break;
                case 'setup_intent.succeeded':
                    (0, exports.setupIntentSucceeded)(eventData.object);
                    break;
                case 'identity.verification_session.created':
                    (0, exports.identityVerificationCreated)(eventData.object);
                    break;
                default:
                    console.log("Unhandled event type: ".concat(eventType));
                    break;
            }
        }
        catch (error) {
            throw new custom_errors_1.BadRequestError(error.message || "Something went wrong");
        }
        return [2 /*return*/];
    });
}); };
exports.StripeWebhookHandler = StripeWebhookHandler;
var setupIntentCreated = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            //  const customer = await StripeService.customer.getCustomerById(payload.customer)
            //  console.log('Customer from setupIntentCreated', customer)
        }
        catch (error) {
            throw new custom_errors_1.BadRequestError(error.message || "Something went wrong");
        }
        return [2 /*return*/];
    });
}); };
exports.setupIntentCreated = setupIntentCreated;
var identityVerificationCreated = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                userType = (_a = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _a === void 0 ? void 0 : _a.userType;
                userId = (_b = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _b === void 0 ? void 0 : _b.userId;
                user = null;
                if (!(userType == 'contractor')) return [3 /*break*/, 2];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 1:
                user = _c.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 3:
                user = _c.sent();
                _c.label = 4;
            case 4:
                if (user) {
                    user.stripeIdentity = payload;
                    user.save();
                }
                return [3 /*break*/, 6];
            case 5:
                error_1 = _c.sent();
                throw new custom_errors_1.BadRequestError(error_1.message || "Something went wrong");
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.identityVerificationCreated = identityVerificationCreated;
var setupIntentSucceeded = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, paymentMethod, userType, userId, user, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                return [4 /*yield*/, _1.StripeService.customer.getCustomerById(payload.customer)];
            case 1:
                customer = _c.sent();
                return [4 /*yield*/, _1.StripeService.payment.getPaymentMethod(payload.payment_method)];
            case 2:
                paymentMethod = _c.sent();
                userType = (_a = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _a === void 0 ? void 0 : _a.userType;
                userId = (_b = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _b === void 0 ? void 0 : _b.userId;
                user = null;
                if (!(userType == 'contractor')) return [3 /*break*/, 4];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 3:
                user = _c.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 5:
                user = _c.sent();
                _c.label = 6;
            case 6:
                if (user) {
                    user.stripePaymentMethod = paymentMethod;
                    user.save();
                }
                return [3 /*break*/, 8];
            case 7:
                error_2 = _c.sent();
                throw new custom_errors_1.BadRequestError(error_2.message || "Something went wrong");
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.setupIntentSucceeded = setupIntentSucceeded;