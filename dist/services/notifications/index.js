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
exports.NotificationService = void 0;
var contractor_model_1 = require("../../database/contractor/models/contractor.model");
var contractor_devices_model_1 = __importDefault(require("../../database/contractor/models/contractor_devices.model"));
var contractor_notification_model_1 = __importDefault(require("../../database/contractor/models/contractor_notification.model"));
var customer_model_1 = __importDefault(require("../../database/customer/models/customer.model"));
var customer_devices_model_1 = __importDefault(require("../../database/customer/models/customer_devices.model"));
var customer_notification_model_1 = __importDefault(require("../../database/customer/models/customer_notification.model"));
var expo_1 = require("../expo");
var socket_1 = __importDefault(require("../socket"));
var NotificationService = /** @class */ (function () {
    function NotificationService() {
    }
    NotificationService.sendNotification = function (params, options) {
        if (options === void 0) { options = {
            push: false, // false by default
            socket: true,
            database: true
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var user, deviceTokens, devices, customerNotification, customerNotification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = null;
                        deviceTokens = [];
                        devices = [];
                        if (!(params.userType == 'contractor')) return [3 /*break*/, 3];
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(params.userId)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: user === null || user === void 0 ? void 0 : user.id }).select('deviceToken')];
                    case 2:
                        devices = _a.sent();
                        deviceTokens = devices.map(function (device) { return device.deviceToken; });
                        _a.label = 3;
                    case 3:
                        if (!(params.userType == 'customer')) return [3 /*break*/, 6];
                        return [4 /*yield*/, customer_model_1.default.findById(params.userId)];
                    case 4:
                        user = _a.sent();
                        return [4 /*yield*/, customer_devices_model_1.default.find({ contractor: user === null || user === void 0 ? void 0 : user.id }).select('deviceToken')];
                    case 5:
                        devices = _a.sent();
                        deviceTokens = devices.map(function (device) { return device.deviceToken; });
                        _a.label = 6;
                    case 6:
                        if (!user)
                            return [2 /*return*/];
                        if ('firebase' in options) {
                        }
                        if ('socket' in options) {
                            socket_1.default.sendNotification(user.email, params.type, {
                                type: params.type,
                                message: params.message,
                                data: params.payload
                            });
                        }
                        if ('push' in options) {
                            (0, expo_1.sendPushNotifications)(deviceTokens, {
                                title: 'Identity Verification',
                                icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                                body: 'Identity verification session created',
                                data: {
                                    event: 'identity.verification_session.created',
                                    payload: params.payload
                                },
                            });
                        }
                        if (!options.hasOwnProperty('database')) return [3 /*break*/, 10];
                        if (!(params && params.payload.customer)) return [3 /*break*/, 8];
                        customerNotification = new customer_notification_model_1.default(params.payload);
                        return [4 /*yield*/, customerNotification.save()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!(params && params.payload.contractor)) return [3 /*break*/, 10];
                        customerNotification = new contractor_notification_model_1.default(params.payload);
                        return [4 /*yield*/, customerNotification.save()];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return NotificationService;
}());
exports.NotificationService = NotificationService;
