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
exports.chargeRefundUpdated = exports.chargeRefunded = exports.chargeSucceeded = exports.paymentMethodDetached = exports.paymentMethodAttached = exports.setupIntentSucceeded = exports.setupIntentCreated = exports.paymentIntentSucceeded = exports.accountUpdated = exports.identityVerificationVerified = exports.identityVerificationRequiresInput = exports.identityVerificationCreated = exports.customerCreated = exports.customerUpdated = exports.StripeWebhookHandler = void 0;
var stripe_1 = __importDefault(require("stripe"));
var _1 = require(".");
var contractor_model_1 = require("../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../database/customer/models/customer.model"));
var contractor_devices_model_1 = __importDefault(require("../../database/contractor/models/contractor_devices.model"));
var interface_dto_util_1 = require("../../utils/interface_dto.util");
var payment_schema_1 = require("../../database/common/payment.schema");
var job_model_1 = require("../../database/common/job.model");
var job_quotation_model_1 = require("../../database/common/job_quotation.model");
var notifications_1 = require("../notifications");
var transaction_model_1 = __importStar(require("../../database/common/transaction.model"));
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
                case 'charge.refunded':
                    (0, exports.chargeRefunded)(eventData.object);
                    break;
                case 'charge.refund.updated':
                    (0, exports.chargeRefundUpdated)(eventData.object);
                    break;
                default:
                    console.log("Unhandled event type: ".concat(eventType), eventData.object);
                    break;
            }
        }
        catch (error) {
            // throw new BadRequestError(error.message || "Something went wrong");
            console.log(error.message || "Something went wrong inside stripe webhook");
            return [2 /*return*/];
        }
        return [2 /*return*/];
    });
}); };
exports.StripeWebhookHandler = StripeWebhookHandler;
var customerUpdated = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, _a, error_1;
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
                error_1 = _d.sent();
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerUpdated = customerUpdated;
var customerCreated = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, _a, error_2;
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
                error_2 = _d.sent();
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerCreated = customerCreated;
var identityVerificationCreated = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, deviceTokens, devices, error_3;
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
                error_3 = _c.sent();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.identityVerificationCreated = identityVerificationCreated;
var identityVerificationRequiresInput = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, deviceTokens, devices, message, verification, _a, fileLink, s3fileUrl, error_4;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 10, , 11]);
                console.log('Verification check failed: ' + payload.last_error.reason);
                userType = (_b = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                user = null;
                deviceTokens = [];
                devices = [];
                if (!(userType == 'contractors')) return [3 /*break*/, 3];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 1:
                user = _g.sent();
                return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: user === null || user === void 0 ? void 0 : user.id }).select('deviceToken')];
            case 2:
                devices = _g.sent();
                deviceTokens = devices.map(function (device) { return device.deviceToken; });
                return [3 /*break*/, 6];
            case 3: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 4:
                user = _g.sent();
                return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: user === null || user === void 0 ? void 0 : user.id }).select('deviceToken')];
            case 5:
                devices = _g.sent();
                deviceTokens = devices.map(function (device) { return device.deviceToken; });
                _g.label = 6;
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
                notifications_1.NotificationService.sendNotification({
                    user: user.id.toString(),
                    userType: userType,
                    title: 'Stripe Identity Verification',
                    type: 'STRIPE_IDENTITY',
                    message: message,
                    heading: { name: "".concat(user.name), image: (_d = user.profilePhoto) === null || _d === void 0 ? void 0 : _d.url },
                    payload: {
                        status: payload.status,
                        type: payload.type,
                        reason: payload.last_error.reason,
                        code: payload.last_error.code,
                        options: payload.options,
                        message: message,
                        event: 'identity.verification_session.requires_input',
                    }
                }, { socket: true });
                return [4 /*yield*/, _1.StripeService.identity.retrieveVerificationSession(payload.id)];
            case 7:
                verification = _g.sent();
                console.log(verification);
                return [4 /*yield*/, _1.StripeService.file.createFileLink({
                        //@ts-ignore
                        file: (_f = (_e = verification === null || verification === void 0 ? void 0 : verification.last_verification_report) === null || _e === void 0 ? void 0 : _e.selfie) === null || _f === void 0 ? void 0 : _f.selfie,
                        expires_at: Math.floor(Date.now() / 1000) + 30, // link expires in 30 seconds
                    }, true)];
            case 8:
                _a = _g.sent(), fileLink = _a.fileLink, s3fileUrl = _a.s3fileUrl;
                console.log('fileLink from stripe', fileLink);
                console.log('s3fileUrl of file uploaded to s3', s3fileUrl);
                //@ts-ignore
                user.stripeIdentity = verification;
                user.profilePhoto = { url: s3fileUrl };
                return [4 /*yield*/, user.save()];
            case 9:
                _g.sent();
                return [3 /*break*/, 11];
            case 10:
                error_4 = _g.sent();
                console.log(error_4);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.identityVerificationRequiresInput = identityVerificationRequiresInput;
var identityVerificationVerified = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, message, verification, _a, fileLink, s3fileUrl, error_5;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 8, , 9]);
                console.log('Verification session verified: ' + payload.status);
                console.log(payload);
                if (payload.object != 'identity.verification_session')
                    return [2 /*return*/];
                userType = (_b = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                user = null;
                if (!(userType == 'contractors')) return [3 /*break*/, 2];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 1:
                user = _g.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 3:
                user = _g.sent();
                _g.label = 4;
            case 4:
                if (!user)
                    return [2 /*return*/];
                message = 'Identity verification successful';
                notifications_1.NotificationService.sendNotification({
                    user: user.id.toString(),
                    userType: userType,
                    title: 'Stripe Identity Verification',
                    type: 'STRIPE_IDENTITY',
                    message: message,
                    heading: { name: "".concat(user.name), image: (_d = user.profilePhoto) === null || _d === void 0 ? void 0 : _d.url },
                    payload: {
                        status: payload.status,
                        type: payload.type,
                        options: payload.options,
                        message: message,
                        event: 'identity.verification_session.verified',
                    }
                }, { socket: true });
                return [4 /*yield*/, _1.StripeService.identity.retrieveVerificationSession(payload.id)];
            case 5:
                verification = _g.sent();
                console.log(verification);
                return [4 /*yield*/, _1.StripeService.file.createFileLink({
                        //@ts-ignore
                        file: (_f = (_e = verification === null || verification === void 0 ? void 0 : verification.last_verification_report) === null || _e === void 0 ? void 0 : _e.selfie) === null || _f === void 0 ? void 0 : _f.selfie,
                        expires_at: Math.floor(Date.now() / 1000) + 30, // link expires in 30 seconds
                    }, true)];
            case 6:
                _a = _g.sent(), fileLink = _a.fileLink, s3fileUrl = _a.s3fileUrl;
                console.log('fileLink from stripe', fileLink);
                console.log('s3fileUrl of file uploaded to s3', s3fileUrl);
                //@ts-ignore
                user.stripeIdentity = verification;
                user.profilePhoto = { url: s3fileUrl };
                return [4 /*yield*/, user.save()];
            case 7:
                _g.sent();
                return [3 /*break*/, 9];
            case 8:
                error_5 = _g.sent();
                console.error(error_5.message, error_5);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.identityVerificationVerified = identityVerificationVerified;
// COnnect Account
var accountUpdated = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, email, user, _a, stripeAccountDTO, error_6;
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
                stripeAccountDTO = (0, interface_dto_util_1.castPayloadToDTO)(payload, payload);
                user.stripeAccount = stripeAccountDTO;
                return [4 /*yield*/, user.save()];
            case 6:
                _e.sent();
                return [3 /*break*/, 8];
            case 7:
                error_6 = _e.sent();
                // throw new BadRequestError(error.message || "Something went wrong");
                console.log('accountUpdated', error_6);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.accountUpdated = accountUpdated;
// Payment Intent and Payment Method
var paymentIntentSucceeded = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, userType, userId, user, _a, paymentMethod_1, existingPaymentMethodIndex, error_7;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('Stripe Event Handler: paymentIntentSucceeded', payload);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 9, , 10]);
                if (payload.object != 'payment_intent')
                    return [2 /*return*/];
                return [4 /*yield*/, _1.StripeService.customer.getCustomerById(payload.customer)
                    // const userType = customer?.metadata?.userType
                    // const userId = customer?.metadata?.userId
                ];
            case 2:
                customer = _d.sent();
                userType = (_b = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _c === void 0 ? void 0 : _c.userId;
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
                return [4 /*yield*/, _1.StripeService.payment.getPaymentMethod(payload.payment_method)];
            case 7:
                paymentMethod_1 = _d.sent();
                if (paymentMethod_1) {
                    existingPaymentMethodIndex = user.stripePaymentMethods.findIndex(function (pm) { return pm.id === paymentMethod_1.id; });
                    if (existingPaymentMethodIndex !== -1) {
                        // If paymentMethod already exists, update it
                        user.stripePaymentMethods[existingPaymentMethodIndex] = paymentMethod_1;
                    }
                    else {
                        // If paymentMethod doesn't exist, push it to the array
                        user.stripePaymentMethods.push(paymentMethod_1);
                    }
                }
                return [4 /*yield*/, user.save()];
            case 8:
                _d.sent();
                return [3 /*break*/, 10];
            case 9:
                error_7 = _d.sent();
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.paymentIntentSucceeded = paymentIntentSucceeded;
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
// only this send metadata
var setupIntentSucceeded = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, paymentMethod_2, userType, userId, user, _a, existingPaymentMethodIndex, error_8;
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
                paymentMethod_2 = _d.sent();
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
                existingPaymentMethodIndex = user.stripePaymentMethods.findIndex(function (pm) { return pm.id === paymentMethod_2.id; });
                if (existingPaymentMethodIndex !== -1) {
                    // If paymentMethod already exists, update it
                    user.stripePaymentMethods[existingPaymentMethodIndex] = paymentMethod_2;
                }
                else {
                    // If paymentMethod doesn't exist, push it to the array
                    user.stripePaymentMethods.push(paymentMethod_2);
                }
                return [4 /*yield*/, user.save()];
            case 8:
                _d.sent();
                return [3 /*break*/, 10];
            case 9:
                error_8 = _d.sent();
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.setupIntentSucceeded = setupIntentSucceeded;
var paymentMethodAttached = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, paymentMethod_3, userType, userId, user, existingPaymentMethodIndex, error_9;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log('Stripe Event Handler: paymentMethodAttached', payload);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, , 7]);
                if (payload.object != 'payment_method')
                    return [2 /*return*/];
                return [4 /*yield*/, _1.StripeService.customer.getCustomerById(payload.customer)];
            case 2:
                customer = _c.sent();
                return [4 /*yield*/, _1.StripeService.payment.getPaymentMethod(payload.id)];
            case 3:
                paymentMethod_3 = _c.sent();
                userType = (_a = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _a === void 0 ? void 0 : _a.userType;
                userId = (_b = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _b === void 0 ? void 0 : _b.userId;
                if (!userType || !userId)
                    return [2 /*return*/]; // Ensure userType and userId are valid
                return [4 /*yield*/, customer_model_1.default.findById(userId)]; // assume only customers have to add payment method
            case 4:
                user = _c.sent() // assume only customers have to add payment method
                ;
                if (!user)
                    return [2 /*return*/]; // Ensure user exists
                existingPaymentMethodIndex = user.stripePaymentMethods.findIndex(function (pm) { return pm.id === paymentMethod_3.id; });
                if (existingPaymentMethodIndex !== -1) {
                    // If paymentMethod already exists, update it
                    user.stripePaymentMethods[existingPaymentMethodIndex] = paymentMethod_3;
                }
                else {
                    // If paymentMethod doesn't exist, push it to the array
                    user.stripePaymentMethods.push(paymentMethod_3);
                }
                return [4 /*yield*/, user.save()];
            case 5:
                _c.sent();
                return [3 /*break*/, 7];
            case 6:
                error_9 = _c.sent();
                // throw new BadRequestError(error.message || "Something went wrong");
                console.log('Error on stripe webhook: paymentMethodAttached', error_9);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.paymentMethodAttached = paymentMethodAttached;
var paymentMethodDetached = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentMethodId_1, user, error_10;
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
                error_10 = _a.sent();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.paymentMethodDetached = paymentMethodDetached;
// Charge
var chargeSucceeded = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, stripeChargeDTO, payment, transactionId, transaction, capture, captureDto, capture, captureDto, metadata, jobId, paymentType, quotationId, job, quotation, changeOrderEstimate, onBehalf, destination, transferData, error_11;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log('Stripe Event Handler: chargeSucceeded', payload);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 13, , 14]);
                if (payload.object != 'charge')
                    return [2 /*return*/];
                userType = 'customers';
                userId = (_a = payload === null || payload === void 0 ? void 0 : payload.metadata) === null || _a === void 0 ? void 0 : _a.customerId;
                if (!userType || !userId)
                    return [2 /*return*/]; // Ensure userType and userId are valid
                return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 2:
                user = _c.sent();
                if (!user)
                    return [2 /*return*/]; // Ensure user exists
                //convert from base currency
                payload.amount = payload.amount / 100;
                payload.amount_refunded = payload.amount_refunded / 100;
                payload.amount_captured = payload.amount_captured / 100;
                payload.application_fee_amount = payload.application_fee_amount / 100;
                stripeChargeDTO = (0, interface_dto_util_1.castPayloadToDTO)(payload, payload);
                stripeChargeDTO.charge = payload.id;
                stripeChargeDTO.type = payload.metadata.type;
                stripeChargeDTO.user = user.id;
                stripeChargeDTO.userType = userType;
                delete stripeChargeDTO.id;
                return [4 /*yield*/, payment_schema_1.PaymentModel.findOneAndUpdate({ charge: stripeChargeDTO.charge }, stripeChargeDTO, {
                        new: true, upsert: true
                    })
                    // handle things here
                    //1 handle transfer payment method options if it requires future capturing to another model ?
                    //@ts-ignore
                ];
            case 3:
                payment = _c.sent();
                transactionId = (_b = payment === null || payment === void 0 ? void 0 : payment.metadata) === null || _b === void 0 ? void 0 : _b.transactionId;
                return [4 /*yield*/, transaction_model_1.default.findById(transactionId)];
            case 4:
                transaction = _c.sent();
                if (!transaction) return [3 /*break*/, 6];
                if (!payment.captured) {
                    capture = payload.payment_method_details.card;
                    captureDto = (0, interface_dto_util_1.castPayloadToDTO)(capture, capture);
                    captureDto.payment_intent = payload.payment_intent;
                    captureDto.payment_method = payload.payment_method;
                    captureDto.payment = payment.id;
                    captureDto.captured = false;
                    captureDto.currency = payment.currency;
                    payment.capture = captureDto;
                    transaction.status = transaction_model_1.TRANSACTION_STATUS.PENDING;
                }
                else {
                    capture = payload.payment_method_details.card;
                    captureDto = (0, interface_dto_util_1.castPayloadToDTO)(capture, capture);
                    captureDto.payment_intent = payload.payment_intent;
                    captureDto.payment_method = payload.payment_method;
                    captureDto.payment = payment.id;
                    captureDto.captured = payment.captured;
                    captureDto.captured_at = payment.created;
                    captureDto.currency = payment.currency;
                    payment.capture = captureDto;
                    transaction.status = transaction_model_1.TRANSACTION_STATUS.SUCCESSFUL;
                }
                payment.transaction = transaction.id;
                return [4 /*yield*/, Promise.all([
                        payment.save(),
                        transaction.save()
                    ])];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6:
                metadata = payment.metadata;
                if (!metadata.jobId) return [3 /*break*/, 12];
                jobId = metadata.jobId;
                paymentType = metadata.type;
                quotationId = metadata.quotationId;
                if (!(jobId && paymentType && quotationId)) return [3 /*break*/, 12];
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 7:
                job = _c.sent();
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findById(quotationId)];
            case 8:
                quotation = _c.sent();
                if (!job || !quotation)
                    return [2 /*return*/];
                if (paymentType == payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT) {
                    job.status = job_model_1.JOB_STATUS.BOOKED;
                    job.contract = quotation.id;
                    job.contractor = quotation.contractor;
                    quotation.isPaid = true;
                    quotation.payment = payment.id;
                    quotation.status = job_quotation_model_1.JOB_QUOTATION_STATUS.ACCEPTED;
                    if (quotation.startDate) {
                        job.schedule = {
                            startDate: quotation.startDate,
                            type: job_model_1.JOB_SCHEDULE_TYPE.JOB_DAY,
                            remark: 'Initial job schedule'
                        };
                    }
                }
                if (paymentType == payment_schema_1.PAYMENT_TYPE.SITE_VISIT_PAYMENT) {
                    job.status = job_model_1.JOB_STATUS.BOOKED;
                    job.contract = quotation.id;
                    job.contractor = quotation.contractor;
                    quotation.siteVisitEstimate.isPaid = true;
                    quotation.siteVisitEstimate.payment = payment.id;
                    quotation.status = job_quotation_model_1.JOB_QUOTATION_STATUS.ACCEPTED;
                    if (quotation.siteVisit instanceof Date) {
                        job.schedule = {
                            startDate: quotation.siteVisit,
                            type: job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT,
                            remark: 'Site visit schedule'
                        };
                    }
                    else {
                        console.log('quotation.siteVisit.date is not a valid Date object.');
                    }
                }
                if (paymentType == payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) {
                    changeOrderEstimate = quotation.changeOrderEstimate;
                    if (!changeOrderEstimate)
                        return [2 /*return*/];
                    changeOrderEstimate.isPaid = true;
                    changeOrderEstimate.payment = payment.id;
                }
                if (!job.payments.includes(payment.id))
                    job.payments.push(payment.id);
                return [4 /*yield*/, quotation.save()];
            case 9:
                _c.sent();
                return [4 /*yield*/, job.save()
                    //handle payout transaction schedule here if payment was made to platform
                ];
            case 10:
                _c.sent();
                if (!payment) return [3 /*break*/, 12];
                onBehalf = payment.on_behalf_of;
                destination = payment.destination;
                transferData = payment.transfer_data;
                if (!(!onBehalf && !destination && !transferData)) return [3 /*break*/, 12];
                //create payout transaction - 
                return [4 /*yield*/, transaction_model_1.default.create({
                        type: transaction_model_1.TRANSACTION_TYPE.TRANSFER,
                        amount: payment.amount,
                        // customer can initiate payout on job completetion or admin on dispute resolution
                        // initiatorUser: customerId,
                        // initiatorUserType: 'customers',
                        fromUser: job.customer,
                        fromUserType: 'customers',
                        toUser: job.contractor,
                        toUserType: 'contractors',
                        description: "Payout for job: ".concat(job === null || job === void 0 ? void 0 : job.title),
                        status: transaction_model_1.TRANSACTION_STATUS.PENDING,
                        remark: 'job_payout',
                        invoice: {
                            items: [],
                            charges: quotation.charges
                        },
                        metadata: {
                            paymentType: paymentType,
                            parentTransaction: transaction === null || transaction === void 0 ? void 0 : transaction.id
                        },
                        job: job.id,
                        payment: payment.id,
                    })];
            case 11:
                //create payout transaction - 
                _c.sent();
                _c.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                error_11 = _c.sent();
                // throw new BadRequestError(error.message || "Something went wrong");
                console.log('Error handling chargeSucceeded stripe webhook event', error_11);
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.chargeSucceeded = chargeSucceeded;
var chargeRefunded = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var stripeChargeDTO, payment, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Stripe Event Handler: chargeRefunded', payload);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (payload.object !== 'charge')
                    return [2 /*return*/];
                stripeChargeDTO = (0, interface_dto_util_1.castPayloadToDTO)(payload, payload);
                stripeChargeDTO.charge = payload.id;
                delete stripeChargeDTO.id;
                return [4 /*yield*/, payment_schema_1.PaymentModel.findOne({ charge: stripeChargeDTO.charge })];
            case 2:
                payment = _a.sent();
                if (!payment) return [3 /*break*/, 4];
                payment.amount_refunded = payload.amount_refunded / 100;
                payment.refunded = payload.refunded;
                return [4 /*yield*/, Promise.all([payment.save()])];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_12 = _a.sent();
                console.log('Error handling chargeRefunded stripe webhook event', error_12);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.chargeRefunded = chargeRefunded;
var chargeRefundUpdated = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var metadata, stripeRefundDTO, payment, transaction, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Stripe Event Handler: chargeRefundUpdated', { object: payload.object, id: payload.id });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                if (payload.object !== 'refund')
                    return [2 /*return*/];
                metadata = payload.metadata;
                console.log(metadata);
                stripeRefundDTO = (0, interface_dto_util_1.castPayloadToDTO)(payload, payload);
                return [4 /*yield*/, payment_schema_1.PaymentModel.findOne({ charge: stripeRefundDTO.charge })];
            case 2:
                payment = _a.sent();
                return [4 /*yield*/, transaction_model_1.default.findOne({ _id: metadata.transactionId })];
            case 3:
                transaction = _a.sent();
                console.log('transaction', transaction);
                if (!(payment && transaction)) return [3 /*break*/, 5];
                if (!payment.refunds.includes(stripeRefundDTO))
                    payment.refunds.push(stripeRefundDTO);
                if (payload.status == 'succeeded')
                    transaction.status = transaction_model_1.TRANSACTION_STATUS.SUCCESSFUL;
                return [4 /*yield*/, Promise.all([payment.save(), transaction.save()])];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_13 = _a.sent();
                console.log('Error handling chargeRefundUpdated stripe webhook event', error_13);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.chargeRefundUpdated = chargeRefundUpdated;
