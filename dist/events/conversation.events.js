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
exports.ConversationEvent = void 0;
var events_1 = require("events");
var conversations_schema_1 = require("../database/common/conversations.schema");
var notifications_1 = require("../services/notifications");
var contractor_model_1 = require("../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../database/customer/models/customer.model"));
var admin_model_1 = __importDefault(require("../database/admin/models/admin.model"));
var logger_1 = require("../services/logger");
var i18n_1 = require("../i18n");
exports.ConversationEvent = new events_1.EventEmitter();
exports.ConversationEvent.on('NEW_MESSAGE', function (params) {
    return __awaiter(this, void 0, void 0, function () {
        var message_1, senderId, senderType, conversation_1, members, sender_1, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.Logger.info("Handling NEW_MESSAGE event: ".concat(params.message));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    message_1 = params.message;
                    senderId = message_1.sender;
                    senderType = message_1.senderType;
                    return [4 /*yield*/, conversations_schema_1.ConversationModel.findById(message_1.conversation)];
                case 2:
                    conversation_1 = _a.sent();
                    members = conversation_1 === null || conversation_1 === void 0 ? void 0 : conversation_1.members;
                    sender_1 = null;
                    if (!(senderType === 'contractors')) return [3 /*break*/, 4];
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(senderId)];
                case 3:
                    sender_1 = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(senderType === 'admins')) return [3 /*break*/, 6];
                    return [4 /*yield*/, admin_model_1.default.findById(senderId)];
                case 5:
                    sender_1 = _a.sent();
                    _a.label = 6;
                case 6:
                    if (!(senderType === 'customers')) return [3 /*break*/, 8];
                    return [4 /*yield*/, customer_model_1.default.findById(senderId)];
                case 7:
                    sender_1 = _a.sent();
                    _a.label = 8;
                case 8:
                    console.log('sender', sender_1);
                    if (!conversation_1 || !members || !sender_1)
                        return [2 /*return*/];
                    members.forEach(function (member) { return __awaiter(_this, void 0, void 0, function () {
                        var user, _a, toUserId, toUserType, userLang, nTitle, nMessage, userLang, nTitle, nMessage;
                        var _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, contractor_model_1.ContractorModel.findById(member.member)];
                                case 1:
                                    user = _e.sent();
                                    if (!(member.memberType === 'contractors')) return [3 /*break*/, 3];
                                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(member.member)];
                                case 2:
                                    user = _e.sent();
                                    _e.label = 3;
                                case 3:
                                    if (!(member.memberType === 'admins')) return [3 /*break*/, 5];
                                    return [4 /*yield*/, admin_model_1.default.findById(member.member)];
                                case 4:
                                    user = _e.sent();
                                    _e.label = 5;
                                case 5:
                                    if (!(member.memberType === 'customers')) return [3 /*break*/, 7];
                                    return [4 /*yield*/, customer_model_1.default.findById(member.member)];
                                case 6:
                                    user = _e.sent();
                                    _e.label = 7;
                                case 7:
                                    if (!user)
                                        return [2 /*return*/];
                                    _a = message_1;
                                    return [4 /*yield*/, message_1.getIsOwn(user.id)];
                                case 8:
                                    _a.isOwn = _e.sent();
                                    toUserId = member.member;
                                    toUserType = member.memberType;
                                    notifications_1.NotificationService.sendNotification({
                                        user: toUserId,
                                        userType: toUserType,
                                        title: 'New Conversation Message',
                                        type: 'Conversation',
                                        message: "You have a new message",
                                        heading: { name: "".concat(user.name), image: (_b = sender_1.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                                        payload: {
                                            entity: conversation_1.id,
                                            entityType: 'conversations',
                                            message: message_1,
                                            event: 'NEW_MESSAGE',
                                        }
                                    }, { socket: true });
                                    if (!!message_1.isOwn) return [3 /*break*/, 14];
                                    if (!(conversation_1.type == conversations_schema_1.CONVERSATION_TYPE.DIRECT_MESSAGE)) return [3 /*break*/, 11];
                                    userLang = user.language;
                                    return [4 /*yield*/, i18n_1.i18n.getTranslation({
                                            phraseOrSlug: 'New unread message',
                                            targetLang: userLang
                                        })];
                                case 9:
                                    nTitle = _e.sent();
                                    return [4 /*yield*/, i18n_1.i18n.getTranslation({
                                            phraseOrSlug: "You have a new unread message from",
                                            targetLang: userLang
                                        })];
                                case 10:
                                    nMessage = _e.sent();
                                    notifications_1.NotificationService.sendNotification({
                                        user: toUserId,
                                        userType: toUserType,
                                        title: nTitle,
                                        type: 'NEW_UNREAD_MESSAGE',
                                        message: "".concat(nMessage, "  ").concat(sender_1.name),
                                        heading: { name: "".concat(sender_1.name), image: (_c = sender_1.profilePhoto) === null || _c === void 0 ? void 0 : _c.url },
                                        payload: {
                                            entity: conversation_1.id,
                                            entityType: 'conversations',
                                            message: message_1,
                                            event: 'NEW_UNREAD_MESSAGE',
                                        }
                                    }, { socket: true, push: true, database: true });
                                    _e.label = 11;
                                case 11:
                                    if (!(conversation_1.type == conversations_schema_1.CONVERSATION_TYPE.TICKET)) return [3 /*break*/, 14];
                                    userLang = user.language;
                                    return [4 /*yield*/, i18n_1.i18n.getTranslation({
                                            phraseOrSlug: 'New unread dispute message',
                                            targetLang: userLang
                                        })];
                                case 12:
                                    nTitle = _e.sent();
                                    return [4 /*yield*/, i18n_1.i18n.getTranslation({
                                            phraseOrSlug: "You have a new unread job dispute message from",
                                            targetLang: userLang
                                        })];
                                case 13:
                                    nMessage = _e.sent();
                                    notifications_1.NotificationService.sendNotification({
                                        user: toUserId,
                                        userType: toUserType,
                                        title: nTitle,
                                        type: 'NEW_DISPUTE_MESSAGE',
                                        message: "".concat(nMessage, "  ").concat(sender_1.name),
                                        heading: { name: "".concat(user.name), image: (_d = user.profilePhoto) === null || _d === void 0 ? void 0 : _d.url },
                                        payload: {
                                            entity: conversation_1.id,
                                            entityType: 'conversations',
                                            message: message_1,
                                            event: 'NEW_DISPUTE_MESSAGE',
                                            disputeId: conversation_1.entity,
                                        }
                                    }, { socket: true, push: true, database: true });
                                    _e.label = 14;
                                case 14:
                                    message_1.isOwn = false;
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    logger_1.Logger.error("Error handling NEW_MESSAGE event: ".concat(error_1));
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
});
