"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var notification_model_1 = __importDefault(require("../../database/common/notification.model"));
var contractor_model_1 = require("../../database/contractor/models/contractor.model");
var contractor_devices_model_1 = __importDefault(require("../../database/contractor/models/contractor_devices.model"));
var customer_model_1 = __importDefault(require("../../database/customer/models/customer.model"));
var customer_devices_model_1 = __importDefault(require("../../database/customer/models/customer_devices.model"));
var expo_1 = require("../expo");
var socket_1 = require("../socket");
var notification_util_1 = require("../../utils/notification.util");
var admin_model_1 = __importDefault(require("../../database/admin/models/admin.model"));
var apn_1 = require("./apn");
var fcm_1 = require("./fcm");
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
            var user, deviceTokens, devices, alerts, pushLoad, notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = null;
                        deviceTokens = [];
                        devices = [];
                        params.payload.userType = params.userType;
                        params.payload.user = params.user;
                        params.payload.heading = params.heading;
                        params.payload.data = __assign({}, params.payload);
                        if (!(params.userType == 'contractors')) return [3 /*break*/, 3];
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(params.user)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: user === null || user === void 0 ? void 0 : user.id }).select('deviceToken expoToken deviceType')];
                    case 2:
                        devices = _a.sent();
                        deviceTokens = devices.map(function (device) { return device.expoToken; });
                        _a.label = 3;
                    case 3:
                        if (!(params.userType == 'customers')) return [3 /*break*/, 6];
                        return [4 /*yield*/, customer_model_1.default.findById(params.user)];
                    case 4:
                        user = _a.sent();
                        return [4 /*yield*/, customer_devices_model_1.default.find({ customer: user === null || user === void 0 ? void 0 : user.id }).select('deviceToken expoToken deviceType')];
                    case 5:
                        devices = _a.sent();
                        deviceTokens = devices.map(function (device) { return device.expoToken; });
                        _a.label = 6;
                    case 6:
                        if (!(params.userType == 'admins')) return [3 /*break*/, 9];
                        return [4 /*yield*/, admin_model_1.default.findById(params.user)];
                    case 7:
                        user = _a.sent();
                        return [4 /*yield*/, customer_devices_model_1.default.find({ customer: user === null || user === void 0 ? void 0 : user.id }).select('deviceToken expoToken deviceType')];
                    case 8:
                        devices = _a.sent();
                        deviceTokens = devices.map(function (device) { return device.expoToken; });
                        _a.label = 9;
                    case 9:
                        if (!user)
                            return [2 /*return*/];
                        if ('firebase' in options) {
                        }
                        if (!('socket' in options)) return [3 /*break*/, 11];
                        socket_1.SocketService.sendNotification(user.email, params.type, {
                            type: params.type,
                            message: params.message,
                            data: params.payload
                        });
                        if (!(params.type == 'NEW_DISPUTE_MESSAGE' || params.type == 'JOB_BOOKED')) return [3 /*break*/, 11];
                        return [4 /*yield*/, notification_util_1.NotificationUtil.redAlerts(params.user)];
                    case 10:
                        alerts = _a.sent();
                        socket_1.SocketService.sendNotification(user.email, 'RED_DOT_ALERT', {
                            type: 'RED_DOT_ALERT',
                            message: 'New alert update',
                            data: alerts
                        });
                        _a.label = 11;
                    case 11:
                        if ('push' in options) {
                            pushLoad = {
                                title: params.title,
                                sound: 'default',
                                priority: 'high',
                                body: params.message,
                                categoryId: params.type,
                                channelId: params.type,
                                categoryIdentifier: params.type,
                                data: __assign({}, params.payload),
                            };
                            if (params.type == 'NEW_INCOMING_CALL') {
                                pushLoad = {
                                    _contentAvailable: true,
                                    priority: 'high',
                                };
                            }
                            (0, expo_1.sendPushNotifications)(deviceTokens, pushLoad);
                            devices.map(function (device) {
                                if (device.deviceType == 'ANDROID') {
                                    var notification = { title: params.title, subtitle: params.title, body: params.message };
                                    var options_1 = {
                                        badge: 42
                                    };
                                    var data = __assign({ categoryId: params.type, channelId: params.type, categoryIdentifier: params.type }, params.payload);
                                    fcm_1.FCMNotification.sendNotification(device.deviceToken, notification, options_1, data);
                                }
                                if (device.deviceType == 'IOS') {
                                    var alert_1 = { title: params.title, subtitle: params.title, body: params.message, };
                                    var data = __assign({ categoryId: params.type, channelId: params.type, categoryIdentifier: params.type }, params.payload);
                                    var payload = {
                                        expiry: Math.floor(Date.now() / 1000) + 3600, // Expires 1 hour from now
                                        badge: 3,
                                        priority: 10,
                                        mutableContent: true,
                                        aps: {
                                            'content-available': 1,
                                            'mutable-content': 1,
                                        },
                                        sound: 'ringtone.wav',
                                        alert: alert_1,
                                        contentAvailable: true,
                                        payload: data,
                                        topic: 'com.krendus.repairfindcontractor',
                                    };
                                    apn_1.APNNotification.sendAPN2Notification(device.deviceToken, payload);
                                    // APNNotification.sendAPNNotification(device.deviceToken)
                                    // APNNotification.sendNotification([device.token],alert, data, options)
                                }
                            });
                        }
                        if (!options.hasOwnProperty('database')) return [3 /*break*/, 13];
                        params.payload.message = params.message;
                        notification = new notification_model_1.default(params.payload);
                        return [4 /*yield*/, notification.save()];
                    case 12:
                        _a.sent();
                        socket_1.SocketService.sendNotification(user.email, 'NEW_NOTIFICATION', {
                            type: 'NEW_NOTIFICATION',
                            message: params.message,
                            data: params.payload
                        });
                        _a.label = 13;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    return NotificationService;
}());
exports.NotificationService = NotificationService;
