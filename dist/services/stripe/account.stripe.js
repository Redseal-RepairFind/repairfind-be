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
exports.getAccount = exports.createLoginLink = exports.createAccountLink = exports.createCustomAccount = exports.createAccount = void 0;
var stripe_1 = __importDefault(require("stripe"));
var custom_errors_1 = require("../../utils/custom.errors");
var STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
var stripeClient = new stripe_1.default(STRIPE_SECRET_KEY);
var createAccount = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var account, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, stripeClient.accounts.create({
                        type: 'express',
                        capabilities: {
                            card_payments: {
                                requested: true,
                            },
                            transfers: {
                                requested: true,
                            },
                        },
                        // business_type: 'company',
                        metadata: payload,
                    })];
            case 1:
                account = _a.sent();
                console.log(account);
                return [2 /*return*/, account];
            case 2:
                error_1 = _a.sent();
                throw new custom_errors_1.BadRequestError(error_1.message || "Something went wrong");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createAccount = createAccount;
// https://docs.stripe.com/connect/custom-accounts
// https://docs.stripe.com/connect/custom/hosted-onboarding
// Paypal business account
// https://www.paypal.com/c2/webapps/mpp/how-to-guides/sign-up-business-account?locale.x=en_C2
var createCustomAccount = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var account, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, stripeClient.accounts.create({
                        type: 'custom',
                        country: 'US',
                        business_type: 'individual',
                        individual: {
                            first_name: 'John',
                            last_name: 'Doe',
                            email: 'john.doe@example.com',
                            dob: {
                                day: 10,
                                month: 6,
                                year: 1985,
                            },
                            address: {
                                line1: '123 Main St',
                                city: 'Anytown',
                                state: 'CA',
                                postal_code: '12345',
                            },
                        },
                        capabilities: {
                            card_payments: {
                                requested: true,
                            },
                            transfers: {
                                requested: true,
                            },
                        },
                    })];
            case 1:
                account = _a.sent();
                console.log(account);
                return [2 /*return*/, account];
            case 2:
                error_2 = _a.sent();
                throw new custom_errors_1.BadRequestError(error_2.message || "Something went wrong");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createCustomAccount = createCustomAccount;
var createAccountLink = function (accountId) { return __awaiter(void 0, void 0, void 0, function () {
    var accountLink, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, stripeClient.accountLinks.create({
                        account: accountId,
                        refresh_url: 'https://repairfind.ca',
                        return_url: 'https://repairfind.ca',
                        type: 'account_onboarding',
                    })];
            case 1:
                accountLink = _a.sent();
                return [2 /*return*/, accountLink];
            case 2:
                error_3 = _a.sent();
                throw new custom_errors_1.BadRequestError(error_3.message || "Something went wrong");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createAccountLink = createAccountLink;
var createLoginLink = function (accountId) { return __awaiter(void 0, void 0, void 0, function () {
    var loginLink, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, stripeClient.accounts.createLoginLink(accountId)];
            case 1:
                loginLink = _a.sent();
                return [2 /*return*/, loginLink];
            case 2:
                error_4 = _a.sent();
                throw new custom_errors_1.BadRequestError(error_4.message || "Something went wrong");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createLoginLink = createLoginLink;
var getAccount = function (accountId) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, stripeClient.accounts.retrieve(accountId)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_5 = _a.sent();
                console.log(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAccount = getAccount;
