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
exports.checkPayoutStatus = exports.transferToEmail = void 0;
var axios_1 = __importDefault(require("axios"));
var config_1 = require("../../config");
var uuid_1 = require("uuid");
var logger_1 = require("../logger");
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
// Transfer Funds to PayPal Email (Payouts)
var transferToEmail = function (recipientEmail, amount, currency) {
    if (currency === void 0) { currency = 'USD'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var accessToken, response, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getPayPalAccessToken()];
                case 1:
                    accessToken = _c.sent();
                    return [4 /*yield*/, axios_1.default.post(config_1.config.paypal.apiUrl + '/v1/payments/payouts', {
                            sender_batch_header: {
                                sender_batch_id: (0, uuid_1.v4)(), // Unique ID for the batch
                                email_subject: 'You have a payment from RepairFind!',
                            },
                            items: [
                                {
                                    recipient_type: 'EMAIL',
                                    amount: {
                                        value: amount.toString(), // Amount in dollars
                                        currency: currency,
                                    },
                                    receiver: recipientEmail,
                                    note: 'Payment for your completed job on RepairFind',
                                    sender_item_id: (0, uuid_1.v4)(), // Unique ID for the transaction
                                },
                            ],
                        }, {
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _c.sent();
                    // if (response.data.batch_header.batch_status !== 'SUCCESS') {
                    //   throw new BadRequestError('Failed to send payment.');
                    // }
                    return [2 /*return*/, response.data];
                case 3:
                    error_1 = _c.sent();
                    logger_1.Logger.error("Error transfering to email:", error_1.response.data);
                    throw new Error(((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error_1.message);
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.transferToEmail = transferToEmail;
// Check the status of a payout item
var checkPayoutStatus = function (payoutItemId) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getPayPalAccessToken()];
            case 1:
                accessToken = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1.default.get(config_1.config.paypal.apiUrl + "".concat(payoutItemId), {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                            'Content-Type': 'application/json',
                        },
                    })];
            case 3:
                response = _a.sent();
                console.log('Payout item status:', response.data.transaction_status);
                return [2 /*return*/, response.data];
            case 4:
                error_2 = _a.sent();
                console.error('Error fetching payout item status:', error_2.response ? error_2.response.data : error_2.message);
                throw error_2;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.checkPayoutStatus = checkPayoutStatus;
