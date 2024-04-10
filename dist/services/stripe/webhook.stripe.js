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
exports.chargeSucceeded = exports.paymentIntentSucceeded = exports.accountUpdated = exports.identityVerificationVerified = exports.identityVerificationRequiresInput = exports.identityVerificationCreated = exports.paymentMethodDetached = exports.paymentMethodAttached = exports.customerCreated = exports.customerUpdated = exports.setupIntentSucceeded = exports.setupIntentCreated = exports.StripeWebhookHandler = void 0;
var stripe_1 = __importDefault(require("stripe"));
var custom_errors_1 = require("../../utils/custom.errors");
var _1 = require(".");
var contractor_model_1 = require("../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../database/customer/models/customer.model"));
var expo_1 = require("../expo");
var contractor_devices_model_1 = __importDefault(require("../../database/contractor/models/contractor_devices.model"));
var interface_dto_util_1 = require("../../utils/interface_dto.util");
var payment_schema_1 = require("../../database/common/payment.schema");
var payment_captures_schema_1 = require("../../database/common/payment_captures.schema");
var job_model_1 = require("../../database/common/job.model");
var job_quotation_model_1 = require("../../database/common/job_quotation.model");
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
                // Setup Intent
                case 'setup_intent.created':
                    (0, exports.setupIntentCreated)(eventData.object);
                    break;
                case 'setup_intent.succeeded':
                    (0, exports.setupIntentSucceeded)(eventData.object);
                    break;
                // Identity
                case 'identity.verification_session.created':
                    (0, exports.identityVerificationCreated)(eventData.object);
                    break;
                case 'identity.verification_session.processing':
                    break;
                case 'identity.verification_session.requires_input':
                    (0, exports.identityVerificationRequiresInput)(eventData.object);
                    break;
                case 'identity.verification_session.verified':
                    // All the verification checks passed
                    (0, exports.identityVerificationVerified)(eventData.object);
                    break;
                // Payment Method
                case 'payment_method.attached':
                    (0, exports.paymentMethodAttached)(eventData.object);
                    break;
                case 'payment_method.detached':
                    (0, exports.paymentMethodDetached)(eventData.object);
                    break;
                // Customer
                case 'customer.updated':
                    (0, exports.customerUpdated)(eventData.object);
                    break;
                case 'customer.created':
                    (0, exports.customerCreated)(eventData.object);
                    break;
                // Account
                case 'account.updated':
                    (0, exports.accountUpdated)(eventData.object);
                    break;
                // Payment and Intents
                case 'payment_intent.succeeded':
                    // paymentIntentSucceeded(eventData.object);
                    break;
                case 'charge.succeeded':
                    (0, exports.chargeSucceeded)(eventData.object);
                    break;
                case 'charge.captured':
                    (0, exports.chargeSucceeded)(eventData.object);
                    break;
                default:
                    console.log("Unhandled event type: ".concat(eventType), eventData.object);
                    break;
            }
        }
        catch (error) {
            // throw new BadRequestError(error.message || "Something went wrong");
            console.log(error.message || "Something went wrong inside stripe webhook");
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
            // throw new BadRequestError(error.message || "Something went wrong");
        }
        return [2 /*return*/];
    });
}); };
exports.setupIntentCreated = setupIntentCreated;
var setupIntentSucceeded = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, paymentMethod_1, userType, userId, user, _a, existingPaymentMethodIndex, error_1;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('Stripe Event Handler: setupIntentSucceeded', payload);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 9, , 10]);
                return [4 /*yield*/, _1.StripeService.customer.getCustomerById(payload.customer)];
            case 2:
                customer = _d.sent();
                return [4 /*yield*/, _1.StripeService.payment.getPaymentMethod(payload.payment_method)
                    //  instead of trying to retreive meta from customer get it from the payload metadata
                ];
            case 3:
                paymentMethod_1 = _d.sent();
                userType = (_b = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                if (!userType || !userId)
                    return [2 /*return*/]; // Ensure userType and userId are valid
                if (!(userType === 'contractors')) return [3 /*break*/, 5];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 4:
                _a = _d.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 6:
                _a = _d.sent();
                _d.label = 7;
            case 7:
                user = _a;
                if (!user)
                    return [2 /*return*/]; // Ensure user exists
                existingPaymentMethodIndex = user.stripePaymentMethods.findIndex(function (pm) { return pm.id === paymentMethod_1.id; });
                if (existingPaymentMethodIndex !== -1) {
                    // If paymentMethod already exists, update it
                    user.stripePaymentMethods[existingPaymentMethodIndex] = paymentMethod_1;
                }
                else {
                    // If paymentMethod doesn't exist, push it to the array
                    user.stripePaymentMethods.push(paymentMethod_1);
                }
                return [4 /*yield*/, user.save()];
            case 8:
                _d.sent();
                return [3 /*break*/, 10];
            case 9:
                error_1 = _d.sent();
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.setupIntentSucceeded = setupIntentSucceeded;
var customerUpdated = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, _a, error_2;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('Stripe Event Handler: customerUpdated', payload);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 7, , 8]);
                userType = (_b = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                if (!userType || !userId)
                    return [2 /*return*/]; // Ensure userType and userId are valid
                if (!(userType === 'contractors')) return [3 /*break*/, 3];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 2:
                _a = _d.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 4:
                _a = _d.sent();
                _d.label = 5;
            case 5:
                user = _a;
                if (!user)
                    return [2 /*return*/]; // Ensure user exists
                user.stripeCustomer = payload;
                return [4 /*yield*/, user.save()];
            case 6:
                _d.sent();
                return [3 /*break*/, 8];
            case 7:
                error_2 = _d.sent();
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerUpdated = customerUpdated;
var customerCreated = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, _a, error_3;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('Stripe Event Handler: customerCreated', payload);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 7, , 8]);
                userType = (_b = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                if (!userType || !userId)
                    return [2 /*return*/]; // Ensure userType and userId are valid
                if (!(userType === 'contractors')) return [3 /*break*/, 3];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 2:
                _a = _d.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 4:
                _a = _d.sent();
                _d.label = 5;
            case 5:
                user = _a;
                if (!user)
                    return [2 /*return*/]; // Ensure user exists
                user.stripeCustomer = payload;
                return [4 /*yield*/, user.save()];
            case 6:
                _d.sent();
                return [3 /*break*/, 8];
            case 7:
                error_3 = _d.sent();
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerCreated = customerCreated;
var paymentMethodAttached = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, paymentMethod_2, userType, userId, user, _a, existingPaymentMethodIndex, error_4;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('Stripe Event Handler: paymentMethodAttached', payload);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 9, , 10]);
                if (payload.object != 'payment_method')
                    return [2 /*return*/];
                return [4 /*yield*/, _1.StripeService.customer.getCustomerById(payload.customer)];
            case 2:
                customer = _d.sent();
                console.log('customer', customer);
                return [4 /*yield*/, _1.StripeService.payment.getPaymentMethod(payload.id)];
            case 3:
                paymentMethod_2 = _d.sent();
                userType = (_b = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                if (!userType || !userId)
                    return [2 /*return*/]; // Ensure userType and userId are valid
                if (!(userType === 'contractors')) return [3 /*break*/, 5];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 4:
                _a = _d.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 6:
                _a = _d.sent();
                _d.label = 7;
            case 7:
                user = _a;
                if (!user)
                    return [2 /*return*/]; // Ensure user exists
                existingPaymentMethodIndex = user.stripePaymentMethods.findIndex(function (pm) { return pm.id === paymentMethod_2.id; });
                if (existingPaymentMethodIndex !== -1) {
                    // If paymentMethod already exists, update it
                    user.stripePaymentMethods[existingPaymentMethodIndex] = paymentMethod_2;
                }
                else {
                    // If paymentMethod doesn't exist, push it to the array
                    user.stripePaymentMethods.push(paymentMethod_2);
                }
                console.log(user);
                return [4 /*yield*/, user.save()];
            case 8:
                _d.sent();
                return [3 /*break*/, 10];
            case 9:
                error_4 = _d.sent();
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.paymentMethodAttached = paymentMethodAttached;
var paymentMethodDetached = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentMethodId_1, user, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (payload.object != 'payment_method')
                    return [2 /*return*/];
                paymentMethodId_1 = payload.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ "stripePaymentMethods.id": paymentMethodId_1 })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/]; // User not found with the detached payment method
                // Remove the detached payment method from user's stripePaymentMethods array
                user.stripePaymentMethods = user.stripePaymentMethods.filter(function (pm) { return pm.id !== paymentMethodId_1; });
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.paymentMethodDetached = paymentMethodDetached;
var identityVerificationCreated = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, deviceTokens, devices, error_6;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                userType = (_a = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _a === void 0 ? void 0 : _a.userType;
                userId = (_b = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _b === void 0 ? void 0 : _b.userId;
                user = null;
                deviceTokens = [];
                devices = [];
                if (!(userType == 'contractors')) return [3 /*break*/, 3];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 1:
                user = _c.sent();
                return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: user === null || user === void 0 ? void 0 : user.id }).select('deviceToken')];
            case 2:
                devices = _c.sent();
                deviceTokens = devices.map(function (device) { return device.deviceToken; });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 4:
                user = _c.sent();
                _c.label = 5;
            case 5:
                if (user) {
                    user.stripeIdentity = payload;
                    user.save();
                }
                return [3 /*break*/, 7];
            case 6:
                error_6 = _c.sent();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.identityVerificationCreated = identityVerificationCreated;
var identityVerificationRequiresInput = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, deviceTokens, devices, message, verification, _a, fileLink, s3fileUrl, error_7;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 9, , 10]);
                console.log('Verification check failed: ' + payload.last_error.reason);
                userType = (_b = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                user = null;
                deviceTokens = [];
                devices = [];
                if (!(userType == 'contractors')) return [3 /*break*/, 3];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 1:
                user = _f.sent();
                return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: user === null || user === void 0 ? void 0 : user.id }).select('deviceToken')];
            case 2:
                devices = _f.sent();
                deviceTokens = devices.map(function (device) { return device.deviceToken; });
                return [3 /*break*/, 6];
            case 3: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 4:
                user = _f.sent();
                return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: user === null || user === void 0 ? void 0 : user.id }).select('deviceToken')];
            case 5:
                devices = _f.sent();
                deviceTokens = devices.map(function (device) { return device.deviceToken; });
                _f.label = 6;
            case 6:
                if (!user)
                    return [2 /*return*/];
                message = 'Verification check failed: ' + payload.last_error.reason;
                // Handle specific failure reasons
                switch (payload.last_error.code) {
                    case 'document_unverified_other': {
                        // The document was invalid
                        break;
                    }
                    case 'document_expired': {
                        // The document was expired
                        break;
                    }
                    case 'document_type_not_supported': {
                        // document type not supported
                        break;
                    }
                    default: {
                        // ...
                    }
                }
                if (!user)
                    return [2 /*return*/];
                return [4 /*yield*/, _1.StripeService.identity.retrieveVerificationSession(payload.id)];
            case 7:
                verification = _f.sent();
                console.log(verification);
                return [4 /*yield*/, _1.StripeService.file.createFileLink({
                        //@ts-ignore
                        file: (_e = (_d = verification === null || verification === void 0 ? void 0 : verification.last_verification_report) === null || _d === void 0 ? void 0 : _d.selfie) === null || _e === void 0 ? void 0 : _e.selfie,
                        expires_at: Math.floor(Date.now() / 1000) + 30, // link expires in 30 seconds
                    }, true)];
            case 8:
                _a = _f.sent(), fileLink = _a.fileLink, s3fileUrl = _a.s3fileUrl;
                console.log('fileLink from stripe', fileLink);
                console.log('s3fileUrl of file uploaded to s3', s3fileUrl);
                user.stripeIdentity = verification;
                //@ts-ignore
                user.profilePhoto = { url: s3fileUrl };
                user.save();
                (0, expo_1.sendPushNotifications)(deviceTokens, {
                    title: 'Identity Verification',
                    icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                    body: message,
                    data: {
                        event: 'identity.verification_session.requires_input',
                        user: {
                            email: user.email,
                            profilePhoto: user.profilePhoto,
                        },
                        payload: {
                            status: payload.status,
                            type: payload.type,
                            reason: payload.last_error.reason,
                            code: payload.last_error.code,
                            options: payload.options
                        }
                    },
                });
                return [3 /*break*/, 10];
            case 9:
                error_7 = _f.sent();
                new custom_errors_1.BadRequestError(error_7.message || "Something went wrong");
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.identityVerificationRequiresInput = identityVerificationRequiresInput;
var identityVerificationVerified = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, deviceTokens, devices, verification, _a, fileLink, s3fileUrl, error_8;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 9, , 10]);
                console.log('Verification session verified: ' + payload.status);
                console.log(payload);
                if (payload.object != 'identity.verification_session')
                    return [2 /*return*/];
                userType = (_b = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                user = null;
                deviceTokens = [];
                devices = [];
                if (!(userType == 'contractors')) return [3 /*break*/, 3];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 1:
                user = _f.sent();
                return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: user === null || user === void 0 ? void 0 : user.id }).select('deviceToken')];
            case 2:
                devices = _f.sent();
                deviceTokens = devices.map(function (device) { return device.deviceToken; });
                return [3 /*break*/, 6];
            case 3: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 4:
                user = _f.sent();
                return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: user === null || user === void 0 ? void 0 : user.id }).select('deviceToken')];
            case 5:
                devices = _f.sent();
                deviceTokens = devices.map(function (device) { return device.deviceToken; });
                _f.label = 6;
            case 6:
                if (!user)
                    return [2 /*return*/];
                return [4 /*yield*/, _1.StripeService.identity.retrieveVerificationSession(payload.id)];
            case 7:
                verification = _f.sent();
                console.log(verification);
                return [4 /*yield*/, _1.StripeService.file.createFileLink({
                        //@ts-ignore
                        file: (_e = (_d = verification === null || verification === void 0 ? void 0 : verification.last_verification_report) === null || _d === void 0 ? void 0 : _d.selfie) === null || _e === void 0 ? void 0 : _e.document,
                        expires_at: Math.floor(Date.now() / 1000) + 30, // link expires in 30 seconds
                    }, true)];
            case 8:
                _a = _f.sent(), fileLink = _a.fileLink, s3fileUrl = _a.s3fileUrl;
                console.log('fileLink from stripe', fileLink);
                console.log('s3fileUrl of file uploaded to s3', s3fileUrl);
                user.stripeIdentity = verification;
                //@ts-ignore
                user.profilePhoto = { url: s3fileUrl };
                user.save();
                (0, expo_1.sendPushNotifications)(deviceTokens, {
                    title: 'Identity Verification',
                    icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                    body: 'Identity verification session verified',
                    data: {
                        event: 'identity.verification_session.verified',
                        user: {
                            email: user.email,
                            profilePhoto: user.profilePhoto,
                        },
                        payload: {
                            status: payload.status,
                            type: payload.type,
                            options: payload.options
                        }
                    },
                });
                return [3 /*break*/, 10];
            case 9:
                error_8 = _f.sent();
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.identityVerificationVerified = identityVerificationVerified;
var accountUpdated = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, email, user, _a, stripeAccountDTO, error_9;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('Stripe Event Handler: accountUpdated', payload);
                _e.label = 1;
            case 1:
                _e.trys.push([1, 7, , 8]);
                if (payload.object != 'account')
                    return [2 /*return*/];
                userType = (_b = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                email = (_d = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _d === void 0 ? void 0 : _d.email;
                if (!userType || !email)
                    return [2 /*return*/]; // Ensure userType and email are valid,  userId can change on our end
                if (!(userType === 'contractors')) return [3 /*break*/, 3];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: email })];
            case 2:
                _a = _e.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, customer_model_1.default.findOne({ email: email })];
            case 4:
                _a = _e.sent();
                _e.label = 5;
            case 5:
                user = _a;
                if (!user)
                    return [2 /*return*/]; // Ensure user exists
                stripeAccountDTO = (0, interface_dto_util_1.castPayloadToDTO)(payload, {});
                user.stripeAccount = stripeAccountDTO;
                return [4 /*yield*/, user.save()];
            case 6:
                _e.sent();
                return [3 /*break*/, 8];
            case 7:
                error_9 = _e.sent();
                // throw new BadRequestError(error.message || "Something went wrong");
                console.log('accountUpdated', error_9);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.accountUpdated = accountUpdated;
// Payment
var paymentIntentSucceeded = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, userType, userId, user, _a, error_10;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('Stripe Event Handler: paymentIntentSucceeded', payload);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 8, , 9]);
                if (payload.object != 'payment_intent')
                    return [2 /*return*/];
                return [4 /*yield*/, _1.StripeService.customer.getCustomerById(payload.customer)];
            case 2:
                customer = _d.sent();
                userType = (_b = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                if (!userType || !userId)
                    return [2 /*return*/]; // Ensure userType and userId are valid
                if (!(userType === 'contractors')) return [3 /*break*/, 4];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 3:
                _a = _d.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 5:
                _a = _d.sent();
                _d.label = 6;
            case 6:
                user = _a;
                if (!user)
                    return [2 /*return*/]; // Ensure user exists
                return [4 /*yield*/, user.save()];
            case 7:
                _d.sent();
                return [3 /*break*/, 9];
            case 8:
                error_10 = _d.sent();
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.paymentIntentSucceeded = paymentIntentSucceeded;
var chargeSucceeded = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, userType, userId, user, _a, stripeChargeDTO, payment, captureDetails, paymentCaptureDto, paymentCapture, captureDetails, paymentCaptureDto, paymentCapture, metadata, jobId, job, quotationId, quotation_1, error_11;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('Stripe Event Handler: chargeSucceeded', payload);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 17, , 18]);
                if (payload.object != 'charge')
                    return [2 /*return*/];
                return [4 /*yield*/, _1.StripeService.customer.getCustomerById(payload.customer)];
            case 2:
                customer = _d.sent();
                userType = (_b = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                if (!userType || !userId)
                    return [2 /*return*/]; // Ensure userType and userId are valid
                if (!(userType === 'contractors')) return [3 /*break*/, 4];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 3:
                _a = _d.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 5:
                _a = _d.sent();
                _d.label = 6;
            case 6:
                user = _a;
                if (!user)
                    return [2 /*return*/]; // Ensure user exists
                stripeChargeDTO = (0, interface_dto_util_1.castPayloadToDTO)(payload, payload);
                stripeChargeDTO.reference = payload.id;
                delete stripeChargeDTO.id;
                stripeChargeDTO.user = user.id;
                stripeChargeDTO.userType = userType;
                return [4 /*yield*/, payment_schema_1.PaymentModel.findOneAndUpdate({ reference: stripeChargeDTO.reference }, stripeChargeDTO, {
                        new: true, upsert: true
                    })
                    // handle things here
                    //1 handle transfer payment method options if it requires future capturing to another model ?
                ];
            case 7:
                payment = _d.sent();
                if (!!payment.captured) return [3 /*break*/, 9];
                captureDetails = payload.payment_method_details.card;
                paymentCaptureDto = (0, interface_dto_util_1.castPayloadToDTO)(captureDetails, captureDetails);
                paymentCaptureDto.payment_intent = payload.payment_intent;
                paymentCaptureDto.payment_method = payload.payment_method;
                paymentCaptureDto.user = userId;
                paymentCaptureDto.userType = userType;
                paymentCaptureDto.payment = payment.id;
                paymentCaptureDto.status = payment_captures_schema_1.PAYMENT_CAPTURE_STATUS.REQUIRES_CAPTURE;
                paymentCaptureDto.captured = false;
                paymentCaptureDto.currency = payment.currency;
                return [4 /*yield*/, payment_captures_schema_1.PaymentCaptureModel.findOneAndUpdate({ payment: payment.id }, paymentCaptureDto, {
                        new: true, upsert: true
                    })];
            case 8:
                paymentCapture = _d.sent();
                return [3 /*break*/, 11];
            case 9:
                captureDetails = payload.payment_method_details.card;
                paymentCaptureDto = (0, interface_dto_util_1.castPayloadToDTO)(captureDetails, captureDetails);
                paymentCaptureDto.payment_intent = payload.payment_intent;
                paymentCaptureDto.payment_method = payload.payment_method;
                paymentCaptureDto.user = userId;
                paymentCaptureDto.userType = userType;
                paymentCaptureDto.payment = payment.id;
                paymentCaptureDto.status = payment_captures_schema_1.PAYMENT_CAPTURE_STATUS.CAPTURED;
                paymentCaptureDto.captured = payment.captured;
                paymentCaptureDto.captured_at = payment.created;
                paymentCaptureDto.currency = payment.currency;
                return [4 /*yield*/, payment_captures_schema_1.PaymentCaptureModel.findOneAndUpdate({ payment: payment.id }, paymentCaptureDto, {
                        new: true, upsert: true
                    })];
            case 10:
                paymentCapture = _d.sent();
                _d.label = 11;
            case 11:
                metadata = payment.metadata;
                if (!(metadata.type == 'job_payment')) return [3 /*break*/, 16];
                jobId = metadata.jobId;
                if (!jobId) return [3 /*break*/, 16];
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 12:
                job = _d.sent();
                if (!job)
                    return [2 /*return*/];
                quotationId = metadata.quotationId;
                return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.findById(quotationId)];
            case 13:
                quotation_1 = _d.sent();
                if (!quotation_1)
                    return [2 /*return*/];
                if (metadata.remark == 'initial_job_payment') {
                    job.status = job_model_1.JOB_STATUS.BOOKED;
                    job.quotation = quotation_1.id;
                    job.contractor = quotation_1.contractor;
                    quotation_1.isPaid = true;
                    quotation_1.status = job_quotation_model_1.JOB_QUOTATION_STATUS.ACCEPTED;
                    // Check if quotation.startDate is valid and not null or undefined
                    if (quotation_1.startDate) {
                        // Check if job.schedules does not contain a similar schedule with the same startDate and type JOB_DAY
                        if (!job.schedules.some(function (schedule) { return schedule.startDate.getTime() === (quotation_1 === null || quotation_1 === void 0 ? void 0 : quotation_1.startDate.getTime()) && schedule.type === job_model_1.JOB_SCHEDULE_TYPE.JOB_DAY; })) {
                            // Push the new schedule with type JOB_DAY
                            job.schedules.push({
                                startDate: quotation_1.startDate,
                                endDate: quotation_1.endDate,
                                type: job_model_1.JOB_SCHEDULE_TYPE.JOB_DAY
                            });
                        }
                    }
                    else if (quotation_1.siteVisit) {
                        // Check if quotation.siteVisit.date is a valid Date object
                        if (quotation_1.siteVisit instanceof Date) {
                            // Check if job.schedules does not contain a similar schedule with the same startDate and type SITE_VISIT
                            if (!job.schedules.some(function (schedule) { return schedule.startDate.getTime() === (quotation_1 === null || quotation_1 === void 0 ? void 0 : quotation_1.siteVisit.getTime()) && schedule.type === job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT; })) {
                                // Push the new schedule with type SITE_VISIT
                                job.schedules.push({
                                    startDate: quotation_1.siteVisit,
                                    type: job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT
                                });
                            }
                        }
                        else {
                            // Handle case where quotation.siteVisit.date is not a valid Date object
                            console.log('quotation.siteVisit.date is not a valid Date object.');
                        }
                    }
                }
                if (metadata.remark == 'extra_job_payment') {
                }
                if (!job.payments.includes(payment.id))
                    job.payments.push(payment.id);
                // create schedule here ?
                return [4 /*yield*/, quotation_1.save()];
            case 14:
                // create schedule here ?
                _d.sent();
                return [4 /*yield*/, job.save()];
            case 15:
                _d.sent();
                _d.label = 16;
            case 16: return [3 /*break*/, 18];
            case 17:
                error_11 = _d.sent();
                // throw new BadRequestError(error.message || "Something went wrong");
                console.log('Error handling chargeSucceeded stripe webhook event', error_11);
                return [3 /*break*/, 18];
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.chargeSucceeded = chargeSucceeded;
