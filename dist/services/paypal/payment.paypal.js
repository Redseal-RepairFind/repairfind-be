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
exports.refundPayment = exports.createPaymentOrder = void 0;
var checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
// Set up PayPal environment
var environment = new checkout_server_sdk_1.default.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
var client = new checkout_server_sdk_1.default.core.PayPalHttpClient(environment);
// Create a Payment Method (Order) for On-Demand Charges
var createPaymentOrder = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var request, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                request = new checkout_server_sdk_1.default.orders.OrdersCreateRequest();
                request.requestBody({
                    intent: 'CAPTURE',
                    purchase_units: [{
                            amount: {
                                currency_code: 'CAD',
                                value: (payload.amount / 100).toString(), // Amount in dollars
                            },
                        }],
                    application_context: {
                        return_url: 'https://repairfind.ca/payment-success/',
                        cancel_url: 'https://cancel.com',
                    },
                });
                return [4 /*yield*/, client.execute(request)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.result];
        }
    });
}); };
exports.createPaymentOrder = createPaymentOrder;
// Refund Payment
var refundPayment = function (captureId, amountToRefund) { return __awaiter(void 0, void 0, void 0, function () {
    var request, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                request = new checkout_server_sdk_1.default.payments.CapturesRefundRequest(captureId);
                request.requestBody({
                    invoice_id: '',
                    note_to_payer: "",
                    amount: {
                        currency_code: 'CAD',
                        value: (amountToRefund / 100).toString(), // Amount in dollars
                    },
                });
                return [4 /*yield*/, client.execute(request)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.result];
        }
    });
}); };
exports.refundPayment = refundPayment;
