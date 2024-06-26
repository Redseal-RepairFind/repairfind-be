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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorStripeController = exports.createCustomer = exports.createSetupIntent = exports.createSession = void 0;
var express_validator_1 = require("express-validator");
var stripe_1 = require("../../../services/stripe");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var createSession = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mode, contractorId, errors, contractor, stripeCustomer, stripeSession, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                mode = req.body.mode;
                contractorId = req.contractor.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _a.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor not found' })];
                }
                return [4 /*yield*/, stripe_1.StripeService.customer.getCustomer({
                        email: contractor.email,
                        limit: 1
                    })
                    // if (!stripeCustomer) {
                ];
            case 2:
                stripeCustomer = _a.sent();
                return [4 /*yield*/, stripe_1.StripeService.customer.createCustomer({
                        email: contractor.email,
                        metadata: {
                            userId: contractor.id,
                            userType: 'contractors'
                        },
                        name: "".concat(contractor.firstName, " ").concat(contractor.lastName, " "),
                        phone: "".concat(contractor.phoneNumber.code).concat(contractor.phoneNumber.number, " "),
                    })
                    // }
                ];
            case 3:
                // if (!stripeCustomer) {
                stripeCustomer = _a.sent();
                if (!stripeCustomer) return [3 /*break*/, 5];
                return [4 /*yield*/, stripe_1.StripeService.session.createSession({
                        mode: mode,
                        currency: 'cad',
                        customer: stripeCustomer.id,
                        setup_intent_data: {
                            metadata: {
                                userType: 'contractors',
                                userId: contractorId,
                            }
                        }
                    })];
            case 4:
                stripeSession = _a.sent();
                contractor.stripeCustomer = stripeCustomer;
                contractor.save();
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Stripe Session created', data: stripeSession })];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error('Error Creating Session', error_1);
                return [2 /*return*/, res.status(error_1.code || 500).json({ success: false, message: error_1.message || 'Internal Server Error' })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createSession = createSession;
var createSetupIntent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mode, contractorId, errors, contractor, stripeCustomer, ephemeralKey, stripeSetupIntent, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                mode = req.body.mode;
                contractorId = req.contractor.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _a.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor not found' })];
                }
                return [4 /*yield*/, stripe_1.StripeService.customer.getCustomer({
                        email: contractor.email,
                        limit: 1
                    })];
            case 2:
                stripeCustomer = _a.sent();
                if (!!stripeCustomer) return [3 /*break*/, 4];
                return [4 /*yield*/, stripe_1.StripeService.customer.createCustomer({
                        email: contractor.email,
                        metadata: {
                            userId: contractor.id,
                            userType: 'contractors'
                        },
                        name: "".concat(contractor.firstName, " ").concat(contractor.lastName, " "),
                        phone: "".concat(contractor.phoneNumber.code).concat(contractor.phoneNumber.number, " "),
                    })];
            case 3:
                stripeCustomer = _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, stripe_1.StripeService.session.createEphemeralKey({
                    customer: stripeCustomer.id
                })];
            case 5:
                ephemeralKey = _a.sent();
                return [4 /*yield*/, stripe_1.StripeService.payment.createSetupIntent({
                        customer: stripeCustomer.id,
                        payment_method_types: [
                            'card'
                        ],
                        metadata: {
                            userType: 'contractors',
                            userId: contractorId,
                        }
                    })];
            case 6:
                stripeSetupIntent = _a.sent();
                contractor.stripeCustomer = stripeCustomer;
                contractor.save();
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Stripe setup intent created', data: {
                            stripeSetupIntent: stripeSetupIntent,
                            ephemeralKey: ephemeralKey,
                            stripeCustomer: stripeCustomer
                        } })];
            case 7:
                error_2 = _a.sent();
                console.error('Error Creating Session', error_2);
                return [2 /*return*/, res.status(error_2.code || 500).json({ success: false, message: error_2.message || 'Internal Server Error' })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createSetupIntent = createSetupIntent;
var createCustomer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, memberId, role, contractorId, errors, contractor, stripeCustomer, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, memberId = _a.memberId, role = _a.role;
                contractorId = req.contractor.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor not found' })];
                }
                return [4 /*yield*/, stripe_1.StripeService.customer.createCustomer({
                        email: contractor.email,
                        metadata: {},
                        name: "".concat(contractor.firstName, " ").concat(contractor.lastName, " "),
                        phone: "".concat(contractor.phoneNumber.code).concat(contractor.phoneNumber.number, " "),
                    })];
            case 2:
                stripeCustomer = _b.sent();
                contractor.stripeCustomer = stripeCustomer;
                contractor.save();
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Stripe Customer created', data: stripeCustomer })];
            case 3:
                error_3 = _b.sent();
                console.error('Error creating stripe customer:', error_3);
                return [2 /*return*/, res.status(error_3.code || 500).json({ success: false, message: error_3.message || 'Internal Server Error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createCustomer = createCustomer;
exports.ContractorStripeController = {
    createSession: exports.createSession,
    createCustomer: exports.createCustomer,
    createSetupIntent: exports.createSetupIntent,
};
