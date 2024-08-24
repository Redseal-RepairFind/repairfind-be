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
exports.FCMNotification = exports.sendFCMNotification = void 0;
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var axios_1 = __importDefault(require("axios"));
var config_1 = require("../../config");
var logger_1 = require("../logger");
var initializeFirebase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var serviceAccount, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get(config_1.config.google.serviceJson)];
            case 1:
                serviceAccount = (_a.sent()).data;
                firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.cert(serviceAccount)
                });
                logger_1.Logger.info('Firebase Admin SDK initialized');
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                logger_1.Logger.error('Error fetching service account JSON:', error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var sendFCMNotification = function (FcmToken, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var message_1, response_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger_1.Logger.info("sendFCMNotification", [FcmToken, payload]);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                message_1 = {
                    tokens: [FcmToken], // Ensure FcmToken is a valid array of tokens
                    android: {
                        notification: payload.notification,
                        data: payload.data, // Ensure payload is an object with string values only
                    },
                    apns: {
                        payload: __assign({ aps: __assign({ alert: payload.notification }, payload.iosOptions) }, payload.data)
                    }
                };
                return [4 /*yield*/, firebase_admin_1.default.messaging().sendMulticast(message_1)];
            case 2:
                response_1 = _a.sent();
                response_1.responses.forEach(function (resp, index) {
                    var _a;
                    if (!resp.success) {
                        logger_1.Logger.error("Error sending message to token ".concat(message_1.tokens[index], ": ").concat((_a = resp === null || resp === void 0 ? void 0 : resp.error) === null || _a === void 0 ? void 0 : _a.message));
                    }
                    else {
                        logger_1.Logger.info('Notification sent successfully:', response_1);
                    }
                });
                return [2 /*return*/, response_1];
            case 3:
                error_2 = _a.sent();
                logger_1.Logger.error('Error sending notification', error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendFCMNotification = sendFCMNotification;
initializeFirebase();
exports.FCMNotification = { sendNotification: exports.sendFCMNotification };
