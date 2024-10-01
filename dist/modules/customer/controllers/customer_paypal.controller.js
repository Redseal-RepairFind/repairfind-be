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
exports.CustomerPaypalController = exports.deletePaypalPaymentMethod = exports.loadCreatePaymentMethodView = exports.authorizePaymentMethodOrder = exports.createPaymentMethodOrder = void 0;
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var config_1 = require("../../../config");
var paypal_1 = require("../../../services/paypal");
var paypal_checkout_1 = require("../../../templates/common/paypal_checkout");
var custom_errors_1 = require("../../../utils/custom.errors");
var createPaymentMethodOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, customer, payload, response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customerId = req.customer.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 2:
                customer = _a.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "customer not found" })];
                }
                payload = { amount: 1, intent: 'AUTHORIZE', returnUrl: 'https://repairfind.ca/card-connected-successfully' };
                return [4 /*yield*/, paypal_1.PayPalService.payment.createOrder(payload)];
            case 3:
                response = _a.sent();
                return [2 /*return*/, res.status(200).json(response)];
            case 4:
                err_1 = _a.sent();
                console.log(err_1);
                res.status(500).json({ success: false, message: err_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createPaymentMethodOrder = createPaymentMethodOrder;
var authorizePaymentMethodOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderID, customerId, customer, _a, orderData, paymentMethod_1, existingPaymentMethodIndex, authorizationId, voidAuthorization, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                orderID = req.body.orderID;
                customerId = req.customer.id;
                console.log("orderID", orderID);
                if (!orderID) {
                    return [2 /*return*/, res.status(400).send({ success: false, message: 'Order ID is required.' })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 2:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(400).send({ success: false, message: 'Customer not found' })];
                }
                return [4 /*yield*/, paypal_1.PayPalService.payment.authorizeOrder(orderID)
                    // create payment method here
                ];
            case 3:
                _a = _b.sent(), orderData = _a.orderData, paymentMethod_1 = _a.paymentMethod;
                // create payment method here
                if (paymentMethod_1) {
                    existingPaymentMethodIndex = customer.paypalPaymentMethods.findIndex(function (pm) { return pm.vault_id === paymentMethod_1.vault_id; });
                    if (existingPaymentMethodIndex !== -1) {
                        customer.paypalPaymentMethods[existingPaymentMethodIndex] = paymentMethod_1;
                    }
                    else {
                        customer.paypalPaymentMethods.push(paymentMethod_1);
                    }
                }
                return [4 /*yield*/, customer.save()];
            case 4:
                _b.sent();
                if (!(orderData &&
                    Array.isArray(orderData.purchase_units) &&
                    orderData.purchase_units.length > 0 &&
                    orderData.purchase_units[0].payments &&
                    Array.isArray(orderData.purchase_units[0].payments.authorizations) &&
                    orderData.purchase_units[0].payments.authorizations.length > 0 &&
                    orderData.purchase_units[0].payments.authorizations[0].id)) return [3 /*break*/, 6];
                authorizationId = orderData.purchase_units[0].payments.authorizations[0].id;
                if (!authorizationId) return [3 /*break*/, 6];
                return [4 /*yield*/, paypal_1.PayPalService.payment.voidAuthorization(authorizationId)];
            case 5:
                voidAuthorization = _b.sent();
                console.log("voidAuthorization", [voidAuthorization, voidAuthorization]);
                _b.label = 6;
            case 6: return [2 /*return*/, res.status(200).send({ success: true, data: [orderData, paymentMethod_1] })];
            case 7:
                error_1 = _b.sent();
                console.error('Error retrieving the order:', error_1);
                return [2 /*return*/, res.status(500).send({ success: false, error: 'Failed to capture order.' })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.authorizePaymentMethodOrder = authorizePaymentMethodOrder;
var loadCreatePaymentMethodView = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, paypalClientId, html;
    return __generator(this, function (_a) {
        try {
            token = req.query.token;
            paypalClientId = config_1.config.paypal.clientId;
            html = (0, paypal_checkout_1.PaypalCheckoutTemplate)({ token: token, paypalClientId: paypalClientId });
            return [2 /*return*/, res.send(html)];
        }
        catch (error) {
            console.error('Error retrieving the order:', error);
            return [2 /*return*/, res.status(500).send({ error: 'Failed to capture order.' })];
        }
        return [2 /*return*/];
    });
}); };
exports.loadCreatePaymentMethodView = loadCreatePaymentMethodView;
var deletePaypalPaymentMethod = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vaultId_1, customerId, customer, paymentMethodIndex, updatedCustomer, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                vaultId_1 = req.params.vaultId;
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 1:
                customer = _a.sent();
                // Check if the customer document exists
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Customer not found" })];
                }
                paymentMethodIndex = customer.paypalPaymentMethods.findIndex(function (method) { return method.vault_id === vaultId_1; });
                // Check if the payment method exists in the array
                if (paymentMethodIndex === -1) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Payment method not found" })];
                }
                // Remove the payment method from the stripePaymentMethods array using splice
                customer.paypalPaymentMethods.splice(paymentMethodIndex, 1);
                //attempt to remove on paypal
                return [4 /*yield*/, paypal_1.PayPalService.customer.deleteVaultPaymentToken(vaultId_1)];
            case 2:
                //attempt to remove on paypal
                _a.sent();
                return [4 /*yield*/, customer.save()];
            case 3:
                updatedCustomer = _a.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: "Payment method removed successfully", data: updatedCustomer })];
            case 4:
                err_2 = _a.sent();
                next(new custom_errors_1.BadRequestError(err_2.message, err_2));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deletePaypalPaymentMethod = deletePaypalPaymentMethod;
exports.CustomerPaypalController = {
    createPaymentMethodOrder: exports.createPaymentMethodOrder,
    authorizePaymentMethodOrder: exports.authorizePaymentMethodOrder,
    loadCreatePaymentMethodView: exports.loadCreatePaymentMethodView,
    deletePaypalPaymentMethod: exports.deletePaypalPaymentMethod
};
