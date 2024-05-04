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
exports.ContractorCallController = exports.endCall = exports.startCall = exports.createRtcToken = exports.createRtmToken = void 0;
var agora_1 = __importDefault(require("../../../services/agora"));
var custom_errors_1 = require("../../../utils/custom.errors");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var services_1 = require("../../../services");
var call_schema_1 = require("../../../database/common/call.schema");
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
                return [4 /*yield*/, agora_1.default.generateRtcToken(channelName, uid, role)];
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
var startCall = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, toUser, toUserType, fromUserId, fromUser, channelName, user, _b, token, callData, call, err_3;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 8, , 9]);
                _a = req.body, toUser = _a.toUser, toUserType = _a.toUserType;
                fromUserId = req.contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(fromUserId)];
            case 1:
                fromUser = _e.sent();
                if (!fromUser)
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'From user not provided' })];
                channelName = "".concat(fromUserId, ":").concat(toUser);
                if (!toUserType || !toUser)
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'To user not provided' })];
                if (!(toUserType === 'contractors')) return [3 /*break*/, 3];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(toUser)];
            case 2:
                _b = _e.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, customer_model_1.default.findById(toUser)];
            case 4:
                _b = _e.sent();
                _e.label = 5;
            case 5:
                user = _b;
                if (!user)
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'User not found' })]; // Ensure user exists
                return [4 /*yield*/, agora_1.default.generateRtcToken(channelName, fromUserId, 'publisher')];
            case 6:
                token = _e.sent();
                callData = {
                    fromUser: fromUserId,
                    fromUserType: 'contractors', // Assuming fromUser is always a contractor
                    toUser: toUser,
                    toUserType: toUserType,
                    startTime: new Date(),
                };
                return [4 /*yield*/, call_schema_1.CallModel.create(callData)];
            case 7:
                call = _e.sent();
                services_1.NotificationService.sendNotification({
                    user: user.id,
                    userType: toUserType,
                    title: 'New Incoming Call',
                    type: 'NEW_INCOMMING_CALL', //
                    message: "You've an incomming call from ".concat(fromUser.name),
                    heading: { name: "".concat(fromUser.name), image: (_c = fromUser.profilePhoto) === null || _c === void 0 ? void 0 : _c.url },
                    payload: {
                        channel: channelName,
                        callId: call.id,
                        token: token,
                        message: "You've an incomming call from ".concat(fromUser.name),
                        name: "".concat(fromUser.name),
                        image: (_d = fromUser.profilePhoto) === null || _d === void 0 ? void 0 : _d.url,
                        event: 'NEW_INCOMMING_CALL',
                    }
                }, { database: true, push: true, socket: true });
                res.status(200).json({ message: 'Token generated', data: { token: token, channelName: channelName, call: call } });
                return [3 /*break*/, 9];
            case 8:
                err_3 = _e.sent();
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.startCall = startCall;
var endCall = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var callId, call, fromUser, toUser, _a, err_4;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 8, , 9]);
                callId = req.params.callId;
                return [4 /*yield*/, call_schema_1.CallModel.findById(callId)];
            case 1:
                call = _f.sent();
                if (!call)
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Call not found' })];
                // Update the call status to ended
                call.endTime = new Date();
                call.callStatus = 'ended';
                return [4 /*yield*/, call.save()];
            case 2:
                _f.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(call.fromUser)];
            case 3:
                fromUser = _f.sent();
                if (!(call.toUserType === 'contractors')) return [3 /*break*/, 5];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(call.toUser)];
            case 4:
                _a = _f.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, customer_model_1.default.findById(call.toUser)];
            case 6:
                _a = _f.sent();
                _f.label = 7;
            case 7:
                toUser = _a;
                if (!fromUser || !toUser)
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Call parties not found' })];
                services_1.NotificationService.sendNotification({
                    user: call.fromUser,
                    userType: 'contractors', // Assuming fromUser is always a contractor
                    title: 'Call Ended',
                    type: 'CALL_ENDED',
                    message: "Your call with ".concat(toUser.name, " has ended"),
                    heading: { name: "".concat(toUser.name), image: (_b = toUser.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                    payload: {
                        message: "Your call with ".concat(toUser.name, " has ended"),
                        name: "".concat(toUser.name),
                        image: (_c = toUser.profilePhoto) === null || _c === void 0 ? void 0 : _c.url,
                        event: 'CALL_ENDED',
                    },
                }, { database: true, push: true, socket: true });
                services_1.NotificationService.sendNotification({
                    user: call.toUser,
                    userType: call.toUserType,
                    title: 'Call Ended',
                    type: 'CALL_ENDED',
                    message: "Your call with ".concat(fromUser.name, " has ended"),
                    heading: { name: "".concat(fromUser.name), image: (_d = fromUser.profilePhoto) === null || _d === void 0 ? void 0 : _d.url },
                    payload: {
                        message: "Your call with ".concat(fromUser.name, " has ended"),
                        name: "".concat(fromUser.name),
                        image: (_e = fromUser.profilePhoto) === null || _e === void 0 ? void 0 : _e.url,
                        event: 'CALL_ENDED',
                    },
                }, { database: true, push: true, socket: true });
                res.status(200).json({ success: true, message: 'Call ended successfully' });
                return [3 /*break*/, 9];
            case 8:
                err_4 = _f.sent();
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.endCall = endCall;
exports.ContractorCallController = {
    createRtmToken: exports.createRtmToken,
    createRtcToken: exports.createRtcToken,
    startCall: exports.startCall,
    endCall: exports.endCall
};
