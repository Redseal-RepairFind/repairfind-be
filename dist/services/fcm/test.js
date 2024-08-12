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
Object.defineProperty(exports, "__esModule", { value: true });
var JWT = require('google-auth-library').JWT;
var axios = require('axios');
var config_1 = require("../../config");
function getAccessTokenAsync() {
    return __awaiter(this, void 0, void 0, function () {
        var serviceAccount, jwtClient, tokens, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, axios.get(config_1.config.google.serviceJson)];
                case 1:
                    serviceAccount = (_a.sent()).data;
                    jwtClient = new JWT(serviceAccount.client_email, serviceAccount.private_key, ['https://www.googleapis.com/auth/cloud-platform']);
                    return [4 /*yield*/, jwtClient.authorize()];
                case 2:
                    tokens = _a.sent();
                    return [2 /*return*/, tokens.access_token];
                case 3:
                    error_1 = _a.sent();
                    throw new Error("Failed to get access token: ".concat(error_1.message));
                case 4: return [2 /*return*/];
            }
        });
    });
}
var sendFCMv1Notification = function () { return __awaiter(void 0, void 0, void 0, function () {
    var firebaseAccessToken, deviceToken, messageBody, response, error, json, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, getAccessTokenAsync()];
            case 1:
                firebaseAccessToken = _a.sent();
                deviceToken = process.env.FCM_DEVICE_TOKEN;
                if (!firebaseAccessToken || !deviceToken) {
                    throw new Error('Missing Firebase access token or device token');
                }
                messageBody = {
                    message: {
                        token: deviceToken,
                        data: {
                            channelId: 'default',
                            message: 'Testing',
                            title: 'This is an FCM notification message',
                            body: JSON.stringify({ title: 'bodyTitle', body: 'bodyBody' }),
                            scopeKey: '@yourExpoUsername/yourProjectSlug',
                            experienceId: '@yourExpoUsername/yourProjectSlug',
                        },
                    },
                };
                return [4 /*yield*/, fetch("https://fcm.googleapis.com/v1/projects/".concat(process.env.FCM_PROJECT_NAME, "/messages:send"), {
                        method: 'POST',
                        headers: {
                            Authorization: "Bearer ".concat(firebaseAccessToken),
                            Accept: 'application/json',
                            'Accept-Encoding': 'gzip, deflate',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(messageBody),
                    })];
            case 2:
                response = _a.sent();
                if (!!response.ok) return [3 /*break*/, 4];
                return [4 /*yield*/, response.text()];
            case 3:
                error = _a.sent();
                throw new Error("HTTP error ".concat(response.status, ": ").concat(error));
            case 4: return [4 /*yield*/, response.json()];
            case 5:
                json = _a.sent();
                console.log("Response JSON: ".concat(JSON.stringify(json, null, 2)));
                return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                console.error('Error sending FCM notification:', error_2);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.default = { sendFCMv1Notification: sendFCMv1Notification };
