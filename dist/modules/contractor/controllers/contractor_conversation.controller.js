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
exports.ContractorConversationController = exports.sendMessage = exports.getConversationMessages = exports.getSingleConversation = exports.getConversations = void 0;
var api_feature_1 = require("../../../utils/api.feature");
var conversations_schema_1 = require("../../../database/common/conversations.schema");
var messages_schema_1 = require("../../../database/common/messages.schema");
var events_1 = require("../../../events");
var notifications_1 = require("../../../services/notifications");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var getConversations = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, startDate, endDate, read, unread, contractorId_1, filter, _b, data, error, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.query, startDate = _a.startDate, endDate = _a.endDate, read = _a.read, unread = _a.unread;
                contractorId_1 = req.contractor.id;
                filter = { 'members.member': contractorId_1, 'members.memberType': 'contractors' };
                // Filtering by startDate and endDate
                if (startDate && endDate) {
                    filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(conversations_schema_1.ConversationModel.find(filter).populate('entity'), req.query)];
            case 1:
                _b = _c.sent(), data = _b.data, error = _b.error;
                if (!data) return [3 /*break*/, 3];
                // Map through each conversation and fetch heading info
                return [4 /*yield*/, Promise.all(data.data.map(function (conversation) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = conversation;
                                    return [4 /*yield*/, conversation.getHeading(contractorId_1)];
                                case 1:
                                    _a.heading = _c.sent();
                                    if (!(conversation.entityType == 'jobs')) return [3 /*break*/, 3];
                                    _b = conversation.entity;
                                    return [4 /*yield*/, conversation.entity.getMyQoutation(conversation.entity.id, contractorId_1)];
                                case 2:
                                    _b.myQuotation = _c.sent();
                                    _c.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 2:
                // Map through each conversation and fetch heading info
                _c.sent();
                _c.label = 3;
            case 3:
                res.status(200).json({
                    success: true, message: "Conversations retrieved",
                    data: data
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _c.sent();
                console.error("Error fetching conversations:", error_1);
                res.status(500).json({ success: false, message: "Server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getConversations = getConversations;
var getSingleConversation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var conversationId, contractorId, query, conversation, _a, _b, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                conversationId = req.params.conversationId;
                contractorId = req.contractor.id;
                query = { 'members.member': contractorId, _id: conversationId };
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOne(query).populate(['entity', 'members']).exec()];
            case 1:
                conversation = _c.sent();
                if (!conversation) return [3 /*break*/, 4];
                _a = conversation;
                return [4 /*yield*/, conversation.getHeading(contractorId)];
            case 2:
                _a.heading = _c.sent();
                if (!(conversation.entityType == 'jobs')) return [3 /*break*/, 4];
                //@ts-ignore
                _b = conversation.entity;
                return [4 /*yield*/, conversation.entity.getMyQoutation(conversation.entity.id, contractorId)];
            case 3:
                //@ts-ignore
                _b.myQuotation = _c.sent();
                _c.label = 4;
            case 4:
                res.status(200).json({ success: true, message: "Conversation retrieved", data: conversation });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _c.sent();
                console.error("Error fetching conversation:", error_2);
                res.status(500).json({ success: false, message: "Server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getSingleConversation = getSingleConversation;
var getConversationMessages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var conversationId, contractorId_2, conversation, contractorIsMember, _a, data, error, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                conversationId = req.params.conversationId;
                contractorId_2 = req.contractor.id;
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOne({ _id: conversationId })
                        .populate('members')];
            case 1:
                conversation = _b.sent();
                // Check if the conversation exists
                if (!conversation) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Conversation not found' })];
                }
                contractorIsMember = conversation.members.some(function (member) { return member.member.toString() === contractorId_2; });
                if (!contractorIsMember) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Unauthorized: You do not have access to this conversation' })];
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(messages_schema_1.MessageModel.find({ conversation: conversationId }), req.query)];
            case 2:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (!data) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all(data.data.map(function (message) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = message;
                                    return [4 /*yield*/, message.getIsOwn(contractorId_2)];
                                case 1:
                                    _a.isOwn = _c.sent();
                                    _b = message;
                                    return [4 /*yield*/, message.getHeading(contractorId_2)];
                                case 2:
                                    _b.heading = _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                res.status(200).json({ success: true, message: 'Conversation messages retrieved', data: data });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _b.sent();
                console.error('Error fetching conversation messages:', error_3);
                res.status(500).json({ success: false, message: 'Server error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getConversationMessages = getConversationMessages;
var sendMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var conversationId, _a, message_1, media, type, contractorId_3, conversation_1, customerIsMember, newMessage, members, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                conversationId = req.params.conversationId;
                _a = req.body, message_1 = _a.message, media = _a.media, type = _a.type;
                contractorId_3 = req.contractor.id;
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findById(conversationId)];
            case 1:
                conversation_1 = _b.sent();
                // Check if the conversation exists
                if (!conversation_1) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Conversation not found' })];
                }
                customerIsMember = conversation_1.members.some(function (member) { return member.member.toString() === contractorId_3; });
                if (!customerIsMember) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Unauthorized: You do not have access to this conversation' })];
                }
                return [4 /*yield*/, messages_schema_1.MessageModel.create({
                        conversation: conversationId,
                        sender: contractorId_3, // Assuming the customer sends the message
                        senderType: 'contractors', // Type of the sender
                        message: message_1, // Message content from the request body
                        messageType: messages_schema_1.MessageType.TEXT, // Assuming message type is text, adjust as needed
                        createdAt: new Date()
                    })];
            case 2:
                newMessage = _b.sent();
                events_1.ConversationEvent.emit('NEW_MESSAGE', { message: newMessage });
                console.log("Notifications sent to participants of challenge");
                members = conversation_1 === null || conversation_1 === void 0 ? void 0 : conversation_1.members;
                console.log(members);
                if (!conversation_1 || !members)
                    return [2 /*return*/];
                members.forEach(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                    var user, _a, _b;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(member.memberType === 'contractors')) return [3 /*break*/, 2];
                                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(member.member)];
                            case 1:
                                _a = _d.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, customer_model_1.default.findById(member.member)];
                            case 3:
                                _a = _d.sent();
                                _d.label = 4;
                            case 4:
                                user = _a;
                                if (!user)
                                    return [2 /*return*/];
                                _b = message_1;
                                return [4 /*yield*/, message_1.getIsOwn(message_1.sender)];
                            case 5:
                                _b.isOwn = _d.sent();
                                notifications_1.NotificationService.sendNotification({
                                    user: user.id.toString(),
                                    userType: member.memberType,
                                    title: 'New Job Request',
                                    type: 'Conversation', // Conversation, Conversation_Notification
                                    message: "You have a new message",
                                    //@ts-ignore
                                    heading: { name: "".concat(user.name), image: (_c = user.profilePhoto) === null || _c === void 0 ? void 0 : _c.url },
                                    payload: {
                                        entity: conversation_1.id,
                                        entityType: 'conversations',
                                        message: message_1,
                                        event: 'NEW_MESSAGE',
                                    }
                                }, { socket: true });
                                return [2 /*return*/];
                        }
                    });
                }); });
                res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.error('Error sending message:', error_4);
                res.status(500).json({ success: false, message: 'Server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendMessage = sendMessage;
exports.ContractorConversationController = {
    getConversations: exports.getConversations,
    getSingleConversation: exports.getSingleConversation,
    getConversationMessages: exports.getConversationMessages,
    sendMessage: exports.sendMessage
};
