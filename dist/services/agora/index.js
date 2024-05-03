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
var agora_access_token_1 = require("agora-access-token");
var config_1 = require("../../config");
var AgoraTokenService = /** @class */ (function () {
    function AgoraTokenService() {
    }
    AgoraTokenService.generateRtcToken = function (channelName, uid, role, privilegeExpiredTs) {
        if (privilegeExpiredTs === void 0) { privilegeExpiredTs = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var rtcRole, token;
            return __generator(this, function (_a) {
                try {
                    console.log(channelName, uid, role);
                    rtcRole = agora_access_token_1.RtcRole.PUBLISHER;
                    if (role == 'publisher') {
                        rtcRole = agora_access_token_1.RtcRole.PUBLISHER;
                    }
                    ;
                    if (role == 'audience') {
                        rtcRole = agora_access_token_1.RtcRole.SUBSCRIBER;
                    }
                    ;
                    token = agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(config_1.config.agora.appId, config_1.config.agora.appCertificate, channelName, uid, rtcRole, // Adjust role according to your requirements
                    privilegeExpiredTs);
                    console.log('RTC Token generated successfully');
                    return [2 /*return*/, token];
                }
                catch (error) {
                    console.error('Error generating RTC token:', error);
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    AgoraTokenService.generateRtmToken = function (uid, privilegeExpiredTs) {
        if (privilegeExpiredTs === void 0) { privilegeExpiredTs = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                try {
                    token = agora_access_token_1.RtmTokenBuilder.buildToken(config_1.config.agora.appId, config_1.config.agora.appCertificate, uid, agora_access_token_1.RtmRole.Rtm_User, // Adjust role according to your requirements
                    privilegeExpiredTs);
                    console.log('RTM Token generated successfully');
                    return [2 /*return*/, token];
                }
                catch (error) {
                    console.error('Error generating RTM token:', error);
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    return AgoraTokenService;
}());
exports.default = AgoraTokenService;
