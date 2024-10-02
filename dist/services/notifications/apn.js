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
exports.APNNotification = exports.sendSilentNotification = exports.sendNotification = exports.sendAPN2Notification = exports.sendAPNNotification = void 0;
var JWT = require('google-auth-library').JWT;
var axios = require('axios');
var config_1 = require("../../config");
var fs_1 = __importDefault(require("fs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Ensure correct import of 'jsonwebtoken'
var apn_1 = __importDefault(require("apn"));
var apns2_1 = require("apns2");
var logger_1 = require("../logger");
var IS_PRODUCTION = config_1.config.apple.env == 'production';
function getAccessAPNTokenAsync() {
    return __awaiter(this, void 0, void 0, function () {
        var authorizationToken;
        return __generator(this, function (_a) {
            try {
                authorizationToken = jsonwebtoken_1.default.sign({
                    iss: config_1.config.apple.teamId,
                    iat: Math.round(new Date().getTime() / 1000),
                }, fs_1.default.readFileSync('./apn.p8', "utf8"), {
                    header: {
                        alg: "ES256",
                        kid: config_1.config.apple.keyId,
                    },
                });
                return [2 /*return*/, authorizationToken];
            }
            catch (error) {
                throw new Error("Failed to get access token: ".concat(error.message));
            }
            return [2 /*return*/];
        });
    });
}
var sendAPNNotification = function (deviceToken) { return __awaiter(void 0, void 0, void 0, function () {
    var IS_PRODUCTION_1, AUTHORIZATION_TOKEN, http2, client_1, request, responseBody_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                IS_PRODUCTION_1 = config_1.config.apple.env == 'production';
                return [4 /*yield*/, getAccessAPNTokenAsync()];
            case 1:
                AUTHORIZATION_TOKEN = _a.sent();
                http2 = require('http2');
                client_1 = http2.connect(IS_PRODUCTION_1 ? 'https://api.push.apple.com' : 'https://api.sandbox.push.apple.com');
                request = client_1.request({
                    ':method': 'POST',
                    ':scheme': 'https',
                    'apns-topic': 'com.krendus.repairfindcontractor',
                    "apns-priority": "10", // Priority set to 10 for immediate delivery
                    // "apns-push-type": "background", // Set to 'voip' for VoIP notifications
                    ':path': '/3/device/' + deviceToken, // This is the native device token you grabbed client-side
                    authorization: "bearer ".concat(AUTHORIZATION_TOKEN), // This is the JSON web token generated in the "Authorization" step
                });
                request.setEncoding('utf8');
                request.write(JSON.stringify({
                    aps: {
                        'content-available': 1,
                        "sound": "ringtone.wav",
                        alert: {
                            title: "📧 You've got mail!",
                            body: 'Hello world! 🌐',
                        },
                    },
                }));
                request.end();
                // Handle the response
                request.on('response', function (headers) {
                    logger_1.Logger.info('Response headers:', headers);
                });
                responseBody_1 = '';
                request.on('data', function (chunk) {
                    responseBody_1 += chunk;
                });
                request.on('end', function () {
                    logger_1.Logger.info('Response body:', responseBody_1);
                    client_1.close(); // Close the connection
                });
                request.on('error', function (error) {
                    logger_1.Logger.error('Request error:', error);
                    client_1.close(); // Ensure connection is closed on error
                });
                logger_1.Logger.info('Notification sent successfully');
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error sending APN notification:', error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sendAPNNotification = sendAPNNotification;
var sendAPN2Notification = function (deviceToken, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var IS_PRODUCTION, options, apnProvider, note, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                IS_PRODUCTION = config_1.config.apple.env == 'production';
                options = {
                    token: {
                        key: './apn.p8',
                        keyId: config_1.config.apple.keyId,
                        teamId: config_1.config.apple.teamId,
                    },
                    production: IS_PRODUCTION,
                };
                apnProvider = new apn_1.default.Provider(options);
                note = new apn_1.default.Notification(__assign({}, payload));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, apnProvider.send(note, deviceToken)];
            case 2:
                result = _a.sent();
                if (result.failed.length > 0) {
                    logger_1.Logger.error('Failed to send notification:', result.failed[0].response);
                }
                else {
                    logger_1.Logger.info(result);
                    logger_1.Logger.info('Notification sent successfully');
                }
                return [3 /*break*/, 5];
            case 3:
                error_2 = _a.sent();
                logger_1.Logger.error('Error sending APN notification:', error_2);
                return [3 /*break*/, 5];
            case 4:
                apnProvider.shutdown();
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.sendAPN2Notification = sendAPN2Notification;
// Function to send a notification
var sendNotification = function (deviceTokens, alert, options, data) { return __awaiter(void 0, void 0, void 0, function () {
    var IS_PRODUCTION, client, notifications, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                IS_PRODUCTION = config_1.config.apple.env == 'production';
                client = new apns2_1.ApnsClient({
                    team: config_1.config.apple.teamId,
                    keyId: config_1.config.apple.keyId,
                    signingKey: fs_1.default.readFileSync('./apn.p8'),
                    defaultTopic: 'com.krendus.repairfindcontractor',
                    requestTimeout: 0, // optional, Default: 0 (without timeout)
                    keepAlive: true, // optional, Default: 5000
                    host: IS_PRODUCTION ? 'https://api.push.apple.com' : 'https://api.sandbox.push.apple.com'
                });
                // Error handling
                client.on(apns2_1.Errors.badDeviceToken, function (err) {
                    logger_1.Logger.error('Bad device token:', err);
                    // Handle bad device token accordingly (e.g., remove from database)
                });
                client.on(apns2_1.Errors.error, function (err) {
                    logger_1.Logger.error('APNs error:', err);
                    // Handle other errors
                });
                notifications = deviceTokens.map(function (token) { return new apns2_1.Notification(token, __assign({ alert: alert, data: data }, options)); });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, client.sendMany(notifications)];
            case 2:
                _a.sent();
                logger_1.Logger.info('Notifications sent successfully');
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                logger_1.Logger.info('Error sending notifications:', err_1.reason);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendNotification = sendNotification;
// Function to send a silent notification
var sendSilentNotification = function (deviceTokens) { return __awaiter(void 0, void 0, void 0, function () {
    var client, notifications, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new apns2_1.ApnsClient({
                    team: config_1.config.apple.teamId,
                    keyId: config_1.config.apple.keyId,
                    signingKey: fs_1.default.readFileSync('./apn.p8'),
                    defaultTopic: 'com.krendus.repairfindcontractor',
                    requestTimeout: 0, // optional, Default: 0 (without timeout)
                    keepAlive: true, // optional, Default: 5000
                    host: IS_PRODUCTION ? 'https://api.push.apple.com' : 'https://api.sandbox.push.apple.com'
                });
                // Error handling
                client.on(apns2_1.Errors.badDeviceToken, function (err) {
                    logger_1.Logger.error('Bad device token:', err);
                    // Handle bad device token accordingly (e.g., remove from database)
                });
                client.on(apns2_1.Errors.error, function (err) {
                    logger_1.Logger.error('APNs error:', err);
                    // Handle other errors
                });
                notifications = deviceTokens.map(function (token) { return new apns2_1.SilentNotification(token); });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, client.sendMany(notifications)];
            case 2:
                _a.sent();
                logger_1.Logger.info('Silent notifications sent successfully');
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                logger_1.Logger.error('Error sending silent notifications:', err_2.reason);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendSilentNotification = sendSilentNotification;
exports.APNNotification = {
    sendNotification: exports.sendNotification,
    sendSilentNotification: exports.sendSilentNotification,
    sendAPN2Notification: exports.sendAPN2Notification,
    sendAPNNotification: exports.sendAPNNotification
};
