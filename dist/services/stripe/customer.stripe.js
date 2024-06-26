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
exports.createCustomerAndAttachPaymentMethod = exports.createPaymentMethod = exports.getCustomerById = exports.updateCustomer = exports.getCustomer = exports.createCustomer = void 0;
var stripe_1 = __importDefault(require("stripe"));
var STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
var stripe = new stripe_1.default(STRIPE_SECRET_KEY);
var createCustomer = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var customer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripe.customers.create(params)];
            case 1:
                customer = _a.sent();
                return [2 /*return*/, customer];
        }
    });
}); };
exports.createCustomer = createCustomer;
var getCustomer = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, stripe.customers.list(query)];
            case 1:
                customer = _a.sent();
                if (customer.data.length !== 0) {
                    return [2 /*return*/, customer.data[0]];
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCustomer = getCustomer;
var updateCustomer = function (customerId, params) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('updating customer on stripe', customerId);
                return [4 /*yield*/, stripe.customers.update(customerId, params)];
            case 1:
                customer = _a.sent();
                return [2 /*return*/, customer];
            case 2:
                error_2 = _a.sent();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateCustomer = updateCustomer;
var getCustomerById = function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, stripe.customers.retrieve(customerId)];
            case 1:
                customer = _a.sent();
                return [2 /*return*/, customer];
            case 2:
                error_3 = _a.sent();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCustomerById = getCustomerById;
// Step 1: Create PaymentMethod
var createPaymentMethod = function () { return __awaiter(void 0, void 0, void 0, function () {
    var paymentMethod;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripe.paymentMethods.create({
                    type: 'card',
                    card: {
                        number: '4242424242424242',
                        exp_month: 12,
                        exp_year: 2022,
                        cvc: '123',
                    },
                })];
            case 1:
                paymentMethod = _a.sent();
                return [2 /*return*/, paymentMethod];
        }
    });
}); };
exports.createPaymentMethod = createPaymentMethod;
// Step 2: Create Customer and Attach PaymentMethod
var createCustomerAndAttachPaymentMethod = function (paymentMethodId) { return __awaiter(void 0, void 0, void 0, function () {
    var customer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripe.customers.create({
                    payment_method: paymentMethodId,
                })];
            case 1:
                customer = _a.sent();
                return [2 /*return*/, customer];
        }
    });
}); };
exports.createCustomerAndAttachPaymentMethod = createCustomerAndAttachPaymentMethod;
