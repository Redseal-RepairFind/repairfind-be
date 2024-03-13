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
exports.CustomerStripeController = exports.createAccount = exports.createSession = void 0;
var express_validator_1 = require("express-validator");
var stripe_1 = require("../../../services/stripe");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var createSession = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mode, customerId, errors, customer, stripeCustomer, stripeSession, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                mode = req.body.mode;
                customerId = req.customer.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() })];
                }
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 1:
                customer = _a.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Customer not found' })];
                }
                return [4 /*yield*/, stripe_1.StripeService.customer.getCustomer({
                        email: customer.email,
                        limit: 1
                    })];
            case 2:
                stripeCustomer = _a.sent();
                if (!!stripeCustomer) return [3 /*break*/, 4];
                return [4 /*yield*/, stripe_1.StripeService.customer.createCustomer({
                        email: customer.email,
                        metadata: {},
                        name: "".concat(customer.firstName, " ").concat(customer.lastName, " "),
                        phone: "".concat(customer.phoneNumber.code).concat(customer.phoneNumber.number, " "),
                    })];
            case 3:
                stripeCustomer = _a.sent();
                _a.label = 4;
            case 4:
                if (!stripeCustomer) return [3 /*break*/, 6];
                return [4 /*yield*/, stripe_1.StripeService.session.createSession({
                        mode: mode,
                        currency: 'usd',
                        customer: stripeCustomer.id,
                        setup_intent_data: {
                            metadata: {
                                userType: 'customer',
                                userId: customer.id,
                            }
                        }
                    })];
            case 5:
                stripeSession = _a.sent();
                customer.stripeCustomer = stripeCustomer;
                customer.save();
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Stripe Session created', data: stripeSession })];
            case 6: return [3 /*break*/, 8];
            case 7:
                error_1 = _a.sent();
                console.error('Error creating stripe session:', error_1);
                return [2 /*return*/, res.status(error_1.code || 500).json({ success: false, message: error_1.message || 'Internal Server Error' })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createSession = createSession;
var createAccount = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, memberId, role, customerId, errors, customer, stripeCustomer, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, memberId = _a.memberId, role = _a.role;
                customerId = req.customer.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() })];
                }
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 1:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Customer not found' })];
                }
                return [4 /*yield*/, stripe_1.StripeService.customer.createCustomer({
                        email: customer.email,
                        metadata: {},
                        name: "".concat(customer.firstName, " ").concat(customer.lastName, " "),
                        phone: "".concat(customer.phoneNumber.code).concat(customer.phoneNumber.number, " "),
                    })];
            case 2:
                stripeCustomer = _b.sent();
                customer.stripeCustomer = stripeCustomer;
                customer.save();
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Stripe Customer created', data: stripeCustomer })];
            case 3:
                error_2 = _b.sent();
                console.error('Error creating stripe customer:', error_2);
                return [2 /*return*/, res.status(error_2.code || 500).json({ success: false, message: error_2.message || 'Internal Server Error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createAccount = createAccount;
exports.CustomerStripeController = {
    createSession: exports.createSession,
    createAccount: exports.createAccount
};