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
exports.getVaultedPaymentMethods = exports.vaultCustomerPaymentMethod = exports.createSetupToken = exports.updatePayPalCustomer = exports.getPayPalCustomerDetails = exports.createPayPalCustomer = void 0;
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
// Function to create a new PayPal customer
function createPayPalCustomer(payerInfo) {
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
                            url: config_1.config.paypal.apiUrl + '/v1/customer/partners/partner-id/customers',
                            method: 'post',
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                'Content-Type': 'application/json',
                            },
                            data: {
                                customer: {
                                    email: payerInfo.email,
                                    first_name: payerInfo.firstName,
                                    last_name: payerInfo.lastName,
                                    customer_type: 'PERSONAL', // Can be BUSINESS if needed
                                },
                            },
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, response.data];
                case 4:
                    error_1 = _b.sent();
                    console.error('Error creating PayPal customer:', ((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) || error_1.message);
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.createPayPalCustomer = createPayPalCustomer;
// Function to get PayPal customer details
function getPayPalCustomerDetails(customerId) {
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
                            url: "".concat(config_1.config.paypal.apiUrl, "/v1/customer/partners/partner-id/customers/").concat(customerId),
                            method: 'get',
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, response.data];
                case 4:
                    error_2 = _b.sent();
                    console.error('Error retrieving PayPal customer details:', ((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) || error_2.message);
                    throw error_2;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getPayPalCustomerDetails = getPayPalCustomerDetails;
// Function to update PayPal customer details
function updatePayPalCustomer(customerId, updatedInfo) {
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
                            url: "".concat(config_1.config.paypal.apiUrl, "/v1/customer/partners/partner-id/customers/").concat(customerId),
                            method: 'patch',
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                'Content-Type': 'application/json',
                            },
                            data: {
                                customer: {
                                    email: updatedInfo.email,
                                    first_name: updatedInfo.firstName,
                                    last_name: updatedInfo.lastName,
                                },
                            },
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, response.data];
                case 4:
                    error_3 = _b.sent();
                    console.error('Error updating PayPal customer:', ((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) || error_3.message);
                    throw error_3;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.updatePayPalCustomer = updatePayPalCustomer;
// Function to create a PayPal setup token for vaulting payment method
function createSetupToken(customerId) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, response, error_4;
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
                                    card: {
                                    // You can add card details here if available, or leave it for customer input during checkout
                                    },
                                },
                                customer_id: customerId, // Optional: Link setup token to an existing customer
                                usage_type: 'MERCHANT_INITIATED_BILLING', // or 'FIRST_ORDER' if it's the first setup
                            },
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, response.data];
                case 4:
                    error_4 = _b.sent();
                    console.error('Error creating setup token:', ((_a = error_4.response) === null || _a === void 0 ? void 0 : _a.data) || error_4.message);
                    throw error_4;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.createSetupToken = createSetupToken;
// Vault payment method for PayPal customer
function vaultCustomerPaymentMethod(customerId, setupToken) {
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
                            url: "".concat(config_1.config.paypal.apiUrl, "/v3/vault/payment-tokens"),
                            method: 'post',
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                'Content-Type': 'application/json',
                            },
                            data: {
                                payment_source: {
                                    token: {
                                        id: setupToken,
                                        type: 'SETUP_TOKEN',
                                    },
                                },
                                customer_id: customerId, // Link to existing customer
                            },
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, response.data];
                case 4:
                    error_5 = _b.sent();
                    console.error('Error vaulting customer payment method:', ((_a = error_5.response) === null || _a === void 0 ? void 0 : _a.data) || error_5.message);
                    throw error_5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.vaultCustomerPaymentMethod = vaultCustomerPaymentMethod;
// Function to retrieve PayPal vaulted payment methods
function getVaultedPaymentMethods(customerId) {
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
                            url: "".concat(config_1.config.paypal.apiUrl, "/v3/vault/payment-tokens?customer_id=").concat(customerId),
                            method: 'get',
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, response.data];
                case 4:
                    error_6 = _b.sent();
                    console.error('Error retrieving vaulted payment methods:', ((_a = error_6.response) === null || _a === void 0 ? void 0 : _a.data) || error_6.message);
                    throw error_6;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getVaultedPaymentMethods = getVaultedPaymentMethods;
