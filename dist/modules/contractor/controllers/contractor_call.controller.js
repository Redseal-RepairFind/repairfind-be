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
exports.ContractorCallController = exports.endCall = exports.startCall = exports.getLastCall = exports.getSingleCall = exports.createRtcToken = exports.createRtmToken = void 0;
var agora_1 = __importDefault(require("../../../services/agora"));
var custom_errors_1 = require("../../../utils/custom.errors");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var services_1 = require("../../../services");
var call_schema_1 = require("../../../database/common/call.schema");
var conversation_util_1 = require("../../../utils/conversation.util");
var createRtmToken = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var uid, rtmToken, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                uid = req.body.uid;
                return [4 /*yield*/, agora_1.default.generateRtmToken(uid)];
            case 1:
                rtmToken = _a.sent();
                res.status(200).json({ message: 'Token generated', token: rtmToken });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createRtmToken = createRtmToken;
var createRtcToken = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, channelName, role, uid, rtcToken, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, channelName = _a.channelName, role = _a.role;
                uid = req.contractor.id;
                return [4 /*yield*/, agora_1.default.generateRtcToken(channelName, role, 1)];
            case 1:
                rtcToken = _b.sent();
                res.status(200).json({ message: 'Token generated', token: rtcToken });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createRtcToken = createRtcToken;
var getSingleCall = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var callId, call, userId, _a, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                callId = req.params.callId;
                return [4 /*yield*/, call_schema_1.CallModel.findById(callId)];
            case 1:
                call = _b.sent();
                userId = req.contractor.id;
                if (!call) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Call not found' })];
                }
                _a = call;
                return [4 /*yield*/, call.getHeading(userId)];
            case 2:
                _a.heading = _b.sent();
                res.status(200).json({ message: 'Token generated', data: call });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getSingleCall = getSingleCall;
var getLastCall = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, call, _a, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId = req.contractor.id;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'User not authenticated' })];
                }
                return [4 /*yield*/, call_schema_1.CallModel.findOne({ $or: [{ toUser: userId }, { fromUser: userId }] }).sort({ createdAt: -1 }).exec()];
            case 1:
                call = _b.sent();
                if (!call) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'No calls found for this user' })];
                }
                _a = call;
                return [4 /*yield*/, call.getHeading(userId)];
            case 2:
                _a.heading = _b.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Last call retrieved', data: call })];
            case 3:
                err_4 = _b.sent();
                return [2 /*return*/, res.status(500).json({ success: false, message: err_4.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getLastCall = getLastCall;
var startCall = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, toUser, toUserType, fromUserId, fromUser, channelName, user, _b, toUserUid, fromUserUid, toUserToken, fromUserToken, callData, call, _c, err_5;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 10, , 11]);
                _a = req.body, toUser = _a.toUser, toUserType = _a.toUserType;
                fromUserId = req.contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(fromUserId)];
            case 1:
                fromUser = _f.sent();
                if (!fromUser)
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'From user not provided' })];
                channelName = "".concat(fromUserId);
                if (!toUserType || !toUser)
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'To user not provided' })];
                if (!(toUserType === 'contractors')) return [3 /*break*/, 3];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(toUser)];
            case 2:
                _b = _f.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, customer_model_1.default.findById(toUser)];
            case 4:
                _b = _f.sent();
                _f.label = 5;
            case 5:
                user = _b;
                if (!user)
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'User not found' })]; // Ensure user exists
                toUserUid = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
                fromUserUid = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
                return [4 /*yield*/, agora_1.default.generateRtcToken(channelName, 'publisher', toUserUid)];
            case 6:
                toUserToken = _f.sent();
                return [4 /*yield*/, agora_1.default.generateRtcToken(channelName, 'publisher', fromUserUid)];
            case 7:
                fromUserToken = _f.sent();
                callData = {
                    fromUser: fromUserId,
                    fromUserType: 'contractors', // Assuming fromUser is always a contractor
                    toUser: toUser,
                    toUserType: toUserType,
                    startTime: new Date(),
                    toUserToken: toUserToken,
                    fromUserToken: fromUserToken,
                    uid: fromUserUid,
                    channel: channelName
                };
                return [4 /*yield*/, call_schema_1.CallModel.create(callData)];
            case 8:
                call = _f.sent();
                _c = call;
                return [4 /*yield*/, call.getHeading(fromUserId)];
            case 9:
                _c.heading = _f.sent();
                services_1.NotificationService.sendNotification({
                    user: user.id,
                    userType: toUserType,
                    title: 'New Incoming Call',
                    type: 'NEW_INCOMING_CALL', //
                    message: "You've an incoming call from ".concat(fromUser.name),
                    heading: { name: "".concat(fromUser.name), image: (_d = fromUser.profilePhoto) === null || _d === void 0 ? void 0 : _d.url },
                    payload: {
                        entity: call.id,
                        entityType: 'calls',
                        channel: channelName,
                        callId: call.id,
                        uid: toUserUid,
                        token: toUserToken,
                        message: "You've an incoming call from ".concat(fromUser.name),
                        name: "".concat(fromUser.name),
                        image: (_e = fromUser.profilePhoto) === null || _e === void 0 ? void 0 : _e.url,
                        event: 'NEW_INCOMING_CALL',
                    }
                }, { database: true, push: true, socket: true });
                res.status(200).json({ message: 'Token generated', data: { token: fromUserToken, uid: fromUserUid, channelName: channelName, call: call } });
                return [3 /*break*/, 11];
            case 10:
                err_5 = _f.sent();
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.startCall = startCall;
var endCall = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var callId, event_1, call, fromUser, _a, toUser, _b, conversation, message, title, type, err_6;
    var _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 12, , 13]);
                callId = req.params.callId;
                event_1 = req.body.event;
                return [4 /*yield*/, call_schema_1.CallModel.findById(callId)];
            case 1:
                call = _g.sent();
                if (!call)
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Call not found' })];
                // Update the call status to ended
                call.endTime = new Date();
                call.callStatus = event_1;
                return [4 /*yield*/, call.save()];
            case 2:
                _g.sent();
                if (!(call.fromUserType === 'contractors')) return [3 /*break*/, 4];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(call.fromUser)];
            case 3:
                _a = _g.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, customer_model_1.default.findById(call.fromUser)];
            case 5:
                _a = _g.sent();
                _g.label = 6;
            case 6:
                fromUser = _a;
                if (!(call.toUserType === 'contractors')) return [3 /*break*/, 8];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(call.toUser)];
            case 7:
                _b = _g.sent();
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, customer_model_1.default.findById(call.toUser)];
            case 9:
                _b = _g.sent();
                _g.label = 10;
            case 10:
                toUser = _b;
                if (!fromUser || !toUser)
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Call parties not found' })];
                return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(fromUser.id, call.fromUserType, toUser.id, call.toUserType)];
            case 11:
                conversation = _g.sent();
                message = "";
                title = 'Call Ended';
                type = 'CALL_ENDED';
                if (fromUser) {
                    message = "Your call with ".concat(toUser.name, " has ended");
                    if (event_1 == 'missed')
                        title = 'Call Missed', type = 'CALL_MISSED', message = "Your call to  ".concat(toUser.name, " was not answered");
                    if (event_1 == 'declined')
                        title = 'Call Declined', type = 'CALL_DECLINED', message = "Your call to  ".concat(toUser.name, " was declined");
                    services_1.NotificationService.sendNotification({
                        user: call.fromUser,
                        userType: call.fromUserType,
                        title: title,
                        type: type,
                        message: message,
                        heading: { name: "".concat(toUser.name), image: (_c = toUser.profilePhoto) === null || _c === void 0 ? void 0 : _c.url },
                        payload: {
                            entity: call.id,
                            entityType: 'calls',
                            conversationId: conversation.id,
                            message: message,
                            name: "".concat(toUser.name),
                            image: (_d = toUser.profilePhoto) === null || _d === void 0 ? void 0 : _d.url,
                            event: type,
                        },
                    }, { database: true, push: true, socket: true });
                }
                if (toUser) {
                    message = "Your call with ".concat(toUser.name, " has ended");
                    if (event_1 == 'missed')
                        title = 'Call Missed', type = 'CALL_MISSED', message = "You have a missed call from  ".concat(fromUser.name);
                    if (event_1 == 'declined')
                        title = 'Call Declined', type = 'CALL_DECLINED', message = "You declined a call from  ".concat(fromUser.name);
                    services_1.NotificationService.sendNotification({
                        user: call.toUser,
                        userType: call.toUserType,
                        title: title,
                        type: type,
                        message: message,
                        heading: { name: "".concat(fromUser.name), image: (_e = fromUser.profilePhoto) === null || _e === void 0 ? void 0 : _e.url },
                        payload: {
                            entity: call.id,
                            entityType: 'calls',
                            conversationId: conversation.id,
                            message: message,
                            name: "".concat(fromUser.name),
                            image: (_f = fromUser.profilePhoto) === null || _f === void 0 ? void 0 : _f.url,
                            event: type,
                        },
                    }, { database: true, push: true, socket: true });
                }
                res.status(200).json({ success: true, message: 'Call ended successfully' });
                return [3 /*break*/, 13];
            case 12:
                err_6 = _g.sent();
                res.status(500).json({ message: err_6.message });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.endCall = endCall;
exports.ContractorCallController = {
    createRtmToken: exports.createRtmToken,
    createRtcToken: exports.createRtcToken,
    startCall: exports.startCall,
    endCall: exports.endCall,
    getSingleCall: exports.getSingleCall,
    getLastCall: exports.getLastCall
};
