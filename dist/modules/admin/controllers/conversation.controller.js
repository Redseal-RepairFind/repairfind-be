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
exports.AdminConversationController = exports.sendMessage = exports.getConversationMessages = exports.getSingleConversation = exports.getConversations = exports.startConversation = void 0;
var conversations_schema_1 = require("../../../database/common/conversations.schema");
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var mongoose_1 = __importDefault(require("mongoose"));
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var express_validator_1 = require("express-validator");
var messages_schema_1 = require("../../../database/common/messages.schema");
var events_1 = require("../../../events");
var custom_errors_1 = require("../../../utils/custom.errors");
var api_feature_1 = require("../../../utils/api.feature");
var startConversation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, userType, message, errors, admin, adminId, fromUserId, fromUser, user, _b, conversationMembers, conversation, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                _a = req.body, userId = _a.userId, userType = _a.userType, message = _a.message;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                fromUserId = adminId;
                return [4 /*yield*/, admin_model_1.default.findById(fromUserId)];
            case 1:
                fromUser = _c.sent();
                if (!fromUser)
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'From user not found' })];
                if (!mongoose_1.default.Types.ObjectId.isValid(userId))
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid user id provided' })];
                if (!userId || !userType)
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'To user not provided' })];
                if (!(userType === 'contractors')) return [3 /*break*/, 3];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(userId)];
            case 2:
                _b = _c.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, customer_model_1.default.findById(userId)];
            case 4:
                _b = _c.sent();
                _c.label = 5;
            case 5:
                user = _b;
                if (!user)
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'User not found' })]; // Ensure user exists
                conversationMembers = [
                    { memberType: userType, member: userId },
                    { memberType: 'admins', member: fromUserId }
                ];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        $and: [
                            { members: { $elemMatch: { member: fromUserId } } }, // memberType: 'customers'
                            { members: { $elemMatch: { member: userId } } } // memberType: 'contractors'
                        ]
                    }, {
                        members: conversationMembers,
                        lastMessage: message, // Set the last message to the job description
                        lastMessageAt: new Date() // Set the last message timestamp to now
                    }, { new: true, upsert: true })];
            case 6:
                conversation = _c.sent();
                // // Create a message in the conversation
                // const newMessage: IMessage = await MessageModel.create({
                //     conversation: conversation._id,
                //     sender: fromUserId, // Assuming the customer sends the initial message
                //     message: message, // You can customize the message content as needed
                //     messageType: MessageType.TEXT, // You can customize the message content as needed
                //     createdAt: new Date()
                // });
                // ConversationEvent.emit('NEW_MESSAGE', { message: newMessage })
                res.status(200).json({ message: 'Conversation created', data: conversation });
                return [3 /*break*/, 8];
            case 7:
                err_1 = _c.sent();
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.startConversation = startConversation;
var getConversations = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, startDate, endDate, read, unread, admin, adminId_1, filter, _b, data, error, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.query, startDate = _a.startDate, endDate = _a.endDate, read = _a.read, unread = _a.unread;
                admin = req.admin;
                adminId_1 = admin.id;
                filter = { 'members.member': adminId_1, 'members.memberType': 'admins' };
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
                                    return [4 /*yield*/, conversation.getHeading(adminId_1)];
                                case 1:
                                    _a.heading = _c.sent();
                                    if (!(conversation.entityType == 'jobs')) return [3 /*break*/, 3];
                                    _b = conversation.entity;
                                    return [4 /*yield*/, conversation.entity.getMyQuotation(conversation.entity.id, adminId_1)];
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
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occured ', error_1))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getConversations = getConversations;
var getSingleConversation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var conversationId, admin, adminId, query, conversation, _a, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                conversationId = req.params.conversationId;
                admin = req.admin;
                adminId = admin.id;
                query = { 'members.member': adminId, _id: conversationId };
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOne(query).populate(['entity', 'members']).exec()];
            case 1:
                conversation = _b.sent();
                if (!conversation)
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Conversation not found" })];
                if (!conversation) return [3 /*break*/, 3];
                _a = conversation;
                return [4 /*yield*/, conversation.getHeading(adminId)];
            case 2:
                _a.heading = _b.sent();
                _b.label = 3;
            case 3:
                res.status(200).json({ success: true, message: "Conversation retrieved", data: conversation });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occurred ', error_2))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getSingleConversation = getSingleConversation;
var getConversationMessages = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var conversationId, admin, adminId_2, conversation, _a, data, error, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                conversationId = req.params.conversationId;
                admin = req.admin;
                adminId_2 = admin.id;
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOne({ _id: conversationId })
                        .populate('members')];
            case 1:
                conversation = _b.sent();
                // Check if the conversation exists
                if (!conversation) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Conversation not found' })];
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
                                    return [4 /*yield*/, message.getIsOwn(adminId_2)];
                                case 1:
                                    _a.isOwn = _c.sent();
                                    _b = message;
                                    return [4 /*yield*/, message.getHeading(adminId_2)];
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
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occured ', error_3))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getConversationMessages = getConversationMessages;
var sendMessage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, conversationId, _a, message, media, type, admin, adminId, conversation, newMessage, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                conversationId = req.params.conversationId;
                _a = req.body, message = _a.message, media = _a.media, type = _a.type;
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findById(conversationId)];
            case 1:
                conversation = _b.sent();
                // Check if the conversation exists
                if (!conversation) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Conversation not found' })];
                }
                return [4 /*yield*/, messages_schema_1.MessageModel.create({
                        conversation: conversationId,
                        sender: adminId, // Assuming the customer sends the message
                        senderType: 'admins', // Type of the sender
                        message: message, // Message content from the request body
                        messageType: type,
                        media: media,
                        createdAt: new Date()
                    })];
            case 2:
                newMessage = _b.sent();
                if (!newMessage) return [3 /*break*/, 5];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.updateOne({ _id: conversationId }, // Filter criteria to find the conversation document
                    {
                        $set: {
                            lastMessage: newMessage.message,
                            lastMessageAt: newMessage.createdAt,
                        }
                    })];
            case 3:
                _b.sent();
                newMessage.readBy.push(adminId);
                return [4 /*yield*/, newMessage.save()];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                events_1.ConversationEvent.emit('NEW_MESSAGE', { message: newMessage });
                res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
                return [3 /*break*/, 7];
            case 6:
                error_4 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('Error sending message', error_4))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.sendMessage = sendMessage;
exports.AdminConversationController = {
    startConversation: exports.startConversation,
    getConversations: exports.getConversations,
    getSingleConversation: exports.getSingleConversation,
    sendMessage: exports.sendMessage,
    getConversationMessages: exports.getConversationMessages,
};
