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
exports.captureBillingAgreement = exports.createBillingAgreementToken = exports.deleteVaultPaymentToken = exports.getPaymentTokens = exports.makeVaultPayment = exports.createPaymentToken = exports.createSetupToken = void 0;
var axios_1 = __importDefault(require("axios"));
var config_1 = require("../../config");
// Function to generate PayPal OAuth token
var getPayPalAccessToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var auth, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                auth = Buffer.from("".concat(config_1.config.paypal.clientId, ":").concat(config_1.config.paypal.secretKey)).toString('base64');
                return [4 /*yield*/, (0, axios_1.default)({
                        url: config_1.config.paypal.apiUrl + '/v1/oauth2/token',
                        method: 'post',
                        headers: {
                            Authorization: "Basic ".concat(auth),
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        data: 'grant_type=client_credentials',
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data.access_token];
        }
    });
}); };
function createSetupToken() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, response, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getPayPalAccessToken()];
                case 1:
                    accessToken = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: config_1.config.paypal.apiUrl + '/v3/vault/setup-tokens',
                            method: 'post',
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                'Content-Type': 'application/json',
                            },
                            data: {
                                payment_source: {
                                    "card": {}
                                },
                            },
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, response.data];
                case 4:
                    error_1 = _b.sent();
                    console.error('Error creating setup token:', ((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) || error_1.message);
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.createSetupToken = createSetupToken;
// Function to create a PayPal Payment Token
function createPaymentToken(setupToken) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, response, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getPayPalAccessToken()];
                case 1:
                    accessToken = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: config_1.config.paypal.apiUrl + '/v3/vault/payment-tokens',
                            method: 'post',
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                'Content-Type': 'application/json',
                            },
                            data: {
                                "payment_source": {
                                    "token": {
                                        "id": setupToken,
                                        "type": "SETUP_TOKEN"
                                    }
                                }
                            },
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, response.data];
                case 4:
                    error_2 = _b.sent();
                    console.error('Error creating payment token:', ((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) || error_2.message);
                    throw error_2;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.createPaymentToken = createPaymentToken;
// Function to make a vault payment using the payment token
function makeVaultPayment(paymentTokenId) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, response, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getPayPalAccessToken()];
                case 1:
                    accessToken = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: config_1.config.paypal.apiUrl + '/v2/checkout/orders',
                            method: 'post',
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                'Content-Type': 'application/json',
                            },
                            data: {
                                intent: 'CAPTURE',
                                purchase_units: [
                                    {
                                        amount: {
                                            currency_code: 'USD',
                                            value: '10.00', // Pass actual amount dynamically
                                        },
                                    },
                                ],
                                payment_source: {
                                    token: {
                                        id: paymentTokenId,
                                        type: 'PAYMENT_TOKEN',
                                    },
                                },
                            },
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, response.data];
                case 4:
                    error_3 = _b.sent();
                    console.error('Error making vault payment:', ((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) || error_3.message);
                    throw error_3;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.makeVaultPayment = makeVaultPayment;
// Function to retrieve payment tokens for a customer
var getPaymentTokens = function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, response, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getPayPalAccessToken()];
            case 1:
                accessToken = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, axios_1.default)({
                        url: "".concat(config_1.config.paypal.apiUrl, "/v3/vault/payment-tokens?customer_id=").concat(customerId),
                        method: 'get',
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                        },
                    })];
            case 3:
                response = _b.sent();
                return [2 /*return*/, response.data];
            case 4:
                error_4 = _b.sent();
                console.error('Error retrieving payment tokens:', ((_a = error_4.response) === null || _a === void 0 ? void 0 : _a.data) || error_4.message);
                throw error_4;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getPaymentTokens = getPaymentTokens;
// Function to delete a PayPal Vault Payment Token
function deleteVaultPaymentToken(paymentTokenId) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, response, error_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getPayPalAccessToken()];
                case 1:
                    accessToken = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(config_1.config.paypal.apiUrl, "/v3/vault/payment-tokens/").concat(paymentTokenId),
                            method: 'delete',
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                            },
                        })];
                case 3:
                    response = _b.sent();
                    console.log('Payment token deleted successfully.');
                    return [2 /*return*/, response.data];
                case 4:
                    error_5 = _b.sent();
                    console.error('Error deleting payment token:', ((_a = error_5.response) === null || _a === void 0 ? void 0 : _a.data) || error_5.message);
                    throw error_5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.deleteVaultPaymentToken = deleteVaultPaymentToken;
// Function to create a billing agreement token
function createBillingAgreementToken() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, response, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getPayPalAccessToken()];
                case 1:
                    accessToken = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(config_1.config.paypal.apiUrl, "/v1/billing-agreements/agreement-tokens"),
                            method: 'post',
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                'Content-Type': 'application/json',
                            },
                            data: {
                                description: "Billing Agreement for future purchases",
                                payer: {
                                    payment_method: "PAYPAL"
                                },
                                plan: {
                                    type: "MERCHANT_INITIATED_BILLING",
                                    merchant_preferences: {
                                        return_url: "https://your-return-url.com/success", // Redirect after approval
                                        cancel_url: "https://your-cancel-url.com/cancel", // Redirect on cancellation
                                        accepted_pymt_type: "INSTANT",
                                        skip_shipping_address: true
                                    }
                                }
                            }
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, response.data];
                case 4:
                    error_6 = _b.sent();
                    console.error('Error creating billing agreement token:', ((_a = error_6.response) === null || _a === void 0 ? void 0 : _a.data) || error_6.message);
                    throw error_6;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.createBillingAgreementToken = createBillingAgreementToken;
// Function to capture the billing agreement using the token
function captureBillingAgreement(billingToken) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, response, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getPayPalAccessToken()];
                case 1:
                    accessToken = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(config_1.config.paypal.apiUrl, "/v1/billing-agreements/agreements"),
                            method: 'post',
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                'Content-Type': 'application/json',
                            },
                            data: {
                                token_id: billingToken
                            }
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, response.data];
                case 4:
                    error_7 = _b.sent();
                    console.error('Error capturing billing agreement:', ((_a = error_7.response) === null || _a === void 0 ? void 0 : _a.data) || error_7.message);
                    throw error_7;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.captureBillingAgreement = captureBillingAgreement;
