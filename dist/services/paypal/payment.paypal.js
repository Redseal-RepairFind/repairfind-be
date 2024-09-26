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
exports.retrievePaymentMethod = exports.refundPayment = exports.chargeSavedCard = exports.voidAuthorization = exports.authorizeOrder = exports.captureAuthorization = exports.captureOrder = exports.createOrder = void 0;
var axios_1 = __importDefault(require("axios"));
var custom_errors_1 = require("../../utils/custom.errors");
var config_1 = require("../../config");
var uuid_1 = require("uuid");
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
// Create a Payment Order (Standard Payment)
var createOrder = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getPayPalAccessToken()];
            case 1:
                accessToken = _a.sent();
                return [4 /*yield*/, axios_1.default.post(config_1.config.paypal.apiUrl + '/v2/checkout/orders', {
                        intent: payload.intent, // CAPTURE or AUTHORIZE
                        purchase_units: [
                            {
                                custom_id: payload.metaId,
                                reference_id: payload.metaId,
                                description: payload.description,
                                amount: {
                                    currency_code: 'CAD',
                                    value: (payload.amount / 100).toString(), // Amount in dollars
                                },
                            },
                        ],
                        "payment_source": {
                            "card": {
                                "attributes": {
                                    "vault": {
                                        "store_in_vault": "ON_SUCCESS"
                                    }
                                }
                            }
                        },
                        application_context: {
                            return_url: 'https://repairfind.ca/payment-success/',
                            cancel_url: 'https://cancel.com',
                        },
                    }, {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                            'Content-Type': 'application/json',
                        },
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); };
exports.createOrder = createOrder;
// Capture the Full Payment for an Order using orderId
var captureOrder = function (orderId) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, paymentMethod, captureResponse, orderData, vault, vaultToken, paypalCustomer, cardDetails, error_1;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, getPayPalAccessToken()];
            case 1:
                accessToken = _g.sent();
                paymentMethod = null;
                _g.label = 2;
            case 2:
                _g.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1.default.post("".concat(config_1.config.paypal.apiUrl, "/v2/checkout/orders/").concat(orderId, "/capture"), {}, {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                            'Content-Type': 'application/json',
                        },
                    })];
            case 3:
                captureResponse = _g.sent();
                orderData = captureResponse.data;
                vault = (_c = (_b = (_a = orderData === null || orderData === void 0 ? void 0 : orderData.payment_source) === null || _a === void 0 ? void 0 : _a.card) === null || _b === void 0 ? void 0 : _b.attributes) === null || _c === void 0 ? void 0 : _c.vault;
                if (vault && vault.id) {
                    vaultToken = vault.id;
                    paypalCustomer = (_d = vault.customer) === null || _d === void 0 ? void 0 : _d.id;
                    cardDetails = {
                        lastDigits: orderData.payment_source.card.last_digits,
                        expiry: orderData.payment_source.card.expiry,
                        brand: orderData.payment_source.card.brand,
                    };
                    paymentMethod = {
                        vault_id: vaultToken,
                        customer: paypalCustomer,
                        status: "active",
                        card: {
                            last_digits: cardDetails.lastDigits, // Last 4 digits of the card
                            expiry: cardDetails.expiry, // Card expiration date
                            brand: cardDetails.brand, // Card brand (e.g., Visa, Mastercard)
                        },
                        created_at: new Date(), // Timestamp of when the token was saved
                    };
                }
                return [2 /*return*/, { orderData: orderData, paymentMethod: paymentMethod }];
            case 4:
                error_1 = _g.sent();
                console.error("Error capturing order:", error_1);
                throw new Error(((_f = (_e = error_1.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) || error_1.message);
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.captureOrder = captureOrder;
// Capture the Full Authorized Amount
var captureAuthorization = function (authorizationId) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, authorizationResponse, authorizedAmount, captureResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getPayPalAccessToken()];
            case 1:
                accessToken = _a.sent();
                return [4 /*yield*/, axios_1.default.get(config_1.config.paypal.apiUrl + "/v2/payments/authorizations/".concat(authorizationId), {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                            'Content-Type': 'application/json',
                        },
                    })];
            case 2:
                authorizationResponse = _a.sent();
                authorizedAmount = authorizationResponse.data.amount;
                return [4 /*yield*/, axios_1.default.post(config_1.config.paypal.apiUrl + "/v2/payments/authorizations/".concat(authorizationId, "/capture"), {
                        amount: {
                            currency_code: authorizedAmount.currency_code,
                            value: authorizedAmount.value,
                        },
                        final_capture: true,
                        invoice_id: 'INV-' + Math.floor(Math.random() * 1000000),
                        note_to_payer: 'Thank you for your purchase!',
                        soft_descriptor: 'RepairFind',
                    }, {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                            'Content-Type': 'application/json',
                        },
                    })];
            case 3:
                captureResponse = _a.sent();
                return [2 /*return*/, captureResponse.data];
        }
    });
}); };
exports.captureAuthorization = captureAuthorization;
// Authorize a Payment (without capturing)
var authorizeOrder = function (orderId) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, paymentMethod, response, orderData, vault, vaultToken, paypalCustomer, cardDetails, error_2;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, getPayPalAccessToken()];
            case 1:
                accessToken = _g.sent();
                paymentMethod = null;
                _g.label = 2;
            case 2:
                _g.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1.default.post("".concat(config_1.config.paypal.apiUrl, "/v2/checkout/orders/").concat(orderId, "/authorize"), {}, {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                            'Content-Type': 'application/json',
                        },
                    })];
            case 3:
                response = _g.sent();
                orderData = response.data;
                vault = (_c = (_b = (_a = orderData === null || orderData === void 0 ? void 0 : orderData.payment_source) === null || _a === void 0 ? void 0 : _a.card) === null || _b === void 0 ? void 0 : _b.attributes) === null || _c === void 0 ? void 0 : _c.vault;
                if (vault && vault.id) {
                    vaultToken = vault.id;
                    paypalCustomer = (_d = vault.customer) === null || _d === void 0 ? void 0 : _d.id;
                    cardDetails = {
                        lastDigits: orderData.payment_source.card.last_digits,
                        expiry: orderData.payment_source.card.expiry,
                        brand: orderData.payment_source.card.brand,
                    };
                    paymentMethod = {
                        vault_id: vaultToken,
                        customer: paypalCustomer,
                        status: "active",
                        card: {
                            last_digits: cardDetails.lastDigits, // Last 4 digits of the card
                            expiry: cardDetails.expiry, // Card expiration date
                            brand: cardDetails.brand, // Card brand (e.g., Visa, Mastercard)
                        },
                        created_at: new Date(), // Timestamp of when the token was saved
                    };
                }
                return [2 /*return*/, { orderData: orderData, paymentMethod: paymentMethod }]; // Return both the authorization and payment method details
            case 4:
                error_2 = _g.sent();
                console.error("Error authorizing payment:", error_2);
                throw new Error(((_f = (_e = error_2.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) || error_2.message);
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.authorizeOrder = authorizeOrder;
// Void an Authorization
var voidAuthorization = function (authorizationId) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, response, error_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, getPayPalAccessToken()];
            case 1:
                accessToken = _c.sent();
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1.default.post("".concat(config_1.config.paypal.apiUrl, "/v2/payments/authorizations/").concat(authorizationId, "/void"), {}, {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                            'Content-Type': 'application/json',
                        },
                    })];
            case 3:
                response = _c.sent();
                return [2 /*return*/, response.data];
            case 4:
                error_3 = _c.sent();
                console.error("Error voiding authorization:", error_3);
                throw new Error(((_b = (_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error_3.message);
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.voidAuthorization = voidAuthorization;
// Create a Payment Order (Standard Payment)
var chargeSavedCard = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, requestId, response, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getPayPalAccessToken()];
            case 1:
                accessToken = _a.sent();
                requestId = (0, uuid_1.v4)();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1.default.post(config_1.config.paypal.apiUrl + '/v2/checkout/orders', {
                        intent: 'CAPTURE', // CAPTURE or AUTHORIZE
                        purchase_units: [
                            {
                                custom_id: payload.metaId,
                                reference_id: payload.metaId,
                                description: payload.description,
                                amount: {
                                    currency_code: 'CAD',
                                    value: (payload.amount / 100).toString(), // Amount in dollars
                                },
                            },
                        ],
                        "payment_source": {
                            "card": {
                                "vault_id": payload.paymentToken
                            }
                        }
                    }, {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                            'Content-Type': 'application/json',
                            'PayPal-Request-Id': requestId, // Unique PayPal Request ID
                        },
                    })];
            case 3:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 4:
                error_4 = _a.sent();
                // Handle error, e.g., logging or throwing a custom error
                // console.error('Error occurred:', error);
                throw new Error(error_4);
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.chargeSavedCard = chargeSavedCard;
// Refund a Payment
var refundPayment = function (captureId, amountToRefund) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getPayPalAccessToken()];
            case 1:
                accessToken = _a.sent();
                return [4 /*yield*/, axios_1.default.post(config_1.config.paypal.apiUrl + "/v2/payments/captures/".concat(captureId, "/refund"), {
                        amount: {
                            currency_code: 'CAD',
                            value: (amountToRefund / 100).toString(),
                        },
                    }, {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                            'Content-Type': 'application/json',
                        },
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); };
exports.refundPayment = refundPayment;
// Retrieve Payment Method from Order
var retrievePaymentMethod = function (orderId) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, response, paymentSource, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getPayPalAccessToken()];
            case 1:
                accessToken = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1.default.get(config_1.config.paypal.apiUrl + "/v2/checkout/orders/".concat(orderId), {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                            'Content-Type': 'application/json',
                        },
                    })];
            case 3:
                response = _a.sent();
                paymentSource = response.data.payment_source;
                if (paymentSource) {
                    return [2 /*return*/, {
                            paymentMethod: paymentSource, // Return the payment source information
                            orderDetails: response.data, // You may also return complete order details if needed
                        }];
                }
                else {
                    throw new custom_errors_1.BadRequestError('No payment source found for this order.');
                }
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                throw new custom_errors_1.BadRequestError("Error retrieving payment method: ".concat(error_5.message));
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.retrievePaymentMethod = retrievePaymentMethod;
