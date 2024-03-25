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
exports.identityVerificationVerified = exports.identityVerificationRequiresInput = exports.identityVerificationCreated = exports.paymentMethodDetached = exports.paymentMethodAttached = exports.setupIntentSucceeded = exports.setupIntentCreated = exports.StripeWebhookHandler = void 0;
var stripe_1 = __importDefault(require("stripe"));
var custom_errors_1 = require("../../utils/custom.errors");
var _1 = require(".");
var contractor_model_1 = require("../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../database/customer/models/customer.model"));
var expo_1 = require("../expo");
var contractor_devices_model_1 = __importDefault(require("../../database/contractor/models/contractor_devices.model"));
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
                case 'identity.verification_session.processing':
                    break;
                case 'identity.verification_session.requires_input':
                    (0, exports.identityVerificationRequiresInput)(eventData.object);
                    break;
                case 'identity.verification_session.verified':
                    // All the verification checks passed
                    (0, exports.identityVerificationVerified)(eventData.object);
                    break;
                case 'payment_method.attached':
                    (0, exports.paymentMethodAttached)(eventData.object);
                    break;
                case 'payment_method.detached':
                    (0, exports.paymentMethodDetached)(eventData.object);
                    break;
                default:
                    console.log("Unhandled event type: ".concat(eventType), event_1.object);
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
var setupIntentSucceeded = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, paymentMethod_1, userType, userId, user, _a, existingPaymentMethodIndex, error_1;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 8, , 9]);
                return [4 /*yield*/, _1.StripeService.customer.getCustomerById(payload.customer)];
            case 1:
                customer = _d.sent();
                return [4 /*yield*/, _1.StripeService.payment.getPaymentMethod(payload.payment_method)];
            case 2:
                paymentMethod_1 = _d.sent();
                userType = (_b = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                if (!userType || !userId)
                    return [2 /*return*/]; // Ensure userType and userId are valid
                if (!(userType === 'contractor')) return [3 /*break*/, 4];
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
            case 7:
                _d.sent();
                return [3 /*break*/, 9];
            case 8:
                error_1 = _d.sent();
                throw new custom_errors_1.BadRequestError(error_1.message || "Something went wrong");
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.setupIntentSucceeded = setupIntentSucceeded;
var paymentMethodAttached = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, paymentMethod_2, userType, userId, user, _a, existingPaymentMethodIndex, error_2;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 8, , 9]);
                if (payload.object != 'payment_method')
                    return [2 /*return*/];
                return [4 /*yield*/, _1.StripeService.customer.getCustomerById(payload.customer)];
            case 1:
                customer = _d.sent();
                return [4 /*yield*/, _1.StripeService.payment.getPaymentMethod(payload.id)];
            case 2:
                paymentMethod_2 = _d.sent();
                userType = (_b = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _b === void 0 ? void 0 : _b.userType;
                userId = (_c = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _c === void 0 ? void 0 : _c.userId;
                if (!userType || !userId)
                    return [2 /*return*/]; // Ensure userType and userId are valid
                if (!(userType === 'contractor')) return [3 /*break*/, 4];
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
            case 7:
                _d.sent();
                return [3 /*break*/, 9];
            case 8:
                error_2 = _d.sent();
                throw new custom_errors_1.BadRequestError(error_2.message || "Something went wrong");
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.paymentMethodAttached = paymentMethodAttached;
var paymentMethodDetached = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentMethodId_1, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (payload.object != 'payment_method')
                    return [2 /*return*/];
                paymentMethodId_1 = payload.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ "stripePaymentMethods.id": paymentMethodId_1 })];
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
                error_3 = _a.sent();
                throw new custom_errors_1.BadRequestError(error_3.message || "Something went wrong");
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.paymentMethodDetached = paymentMethodDetached;
var identityVerificationCreated = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, deviceTokens, devices, error_4;
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
                if (!(userType == 'contractor')) return [3 /*break*/, 3];
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
                error_4 = _c.sent();
                throw new custom_errors_1.BadRequestError(error_4.message || "Something went wrong");
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.identityVerificationCreated = identityVerificationCreated;
var identityVerificationRequiresInput = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, deviceTokens, devices, message, verification, _a, fileLink, s3fileUrl, error_5;
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
                if (!(userType == 'contractor')) return [3 /*break*/, 3];
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
                error_5 = _f.sent();
                throw new custom_errors_1.BadRequestError(error_5.message || "Something went wrong");
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.identityVerificationRequiresInput = identityVerificationRequiresInput;
var identityVerificationVerified = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var userType, userId, user, deviceTokens, devices, verification, _a, fileLink, s3fileUrl, error_6;
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
                if (!(userType == 'contractor')) return [3 /*break*/, 3];
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
                error_6 = _f.sent();
                throw new custom_errors_1.BadRequestError(error_6.message || "Something went wrong");
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.identityVerificationVerified = identityVerificationVerified;
