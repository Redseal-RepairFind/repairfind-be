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
exports.ConversationUtil = void 0;
var conversations_schema_1 = require("../database/common/conversations.schema");
var messages_schema_1 = require("../database/common/messages.schema");
var events_1 = require("../events");
// Function to check if the message contains phone numbers, email addresses, contact addresses, or specific keywords
var containsRestrictedMessageContent = function (message) {
    // Enhanced regex for matching various phone number formats
    var phoneRegex = /\b(?:\+?(\d{1,3}))?[-.\s]?((\d{3})|(\(\d{3}\)))[-.\s]?(\d{3})[-.\s]?(\d{4})\b/g;
    var emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/; // Regex for email addresses
    var addressRegex = /\b\d{1,5}\s\w+(\s\w+){1,5}\b/; // Simple regex for street addresses (may need to be adjusted)
    // Keywords to check for
    var restrictedKeywords = ["phone", "email", "phone number"];
    // Check if message contains any restricted keywords (case-insensitive)
    var containsKeywords = restrictedKeywords.some(function (keyword) {
        return message.toLowerCase().includes(keyword.toLowerCase());
    });
    if (phoneRegex.test(message)) {
        return { isRestricted: true, errorMessage: 'Message contains a phone number' };
    }
    else if (emailRegex.test(message)) {
        return { isRestricted: true, errorMessage: 'Message contains an email address' };
    }
    else if (addressRegex.test(message)) {
        return { isRestricted: true, errorMessage: 'Message contains a contact address' };
    }
    else if (containsKeywords) {
        return { isRestricted: true, errorMessage: 'Message contains restricted keywords (phone, email, phone number)' };
    }
    return { isRestricted: false };
};
var updateOrCreateConversation = function (userOne, userOneType, userTwo, userTwoType) { return __awaiter(void 0, void 0, void 0, function () {
    var conversationMembers, conversation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                conversationMembers = [
                    { memberType: userOneType, member: userOne },
                    { memberType: userTwoType, member: userTwo }
                ];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        $and: [
                            { members: { $elemMatch: { member: userOne } } },
                            { members: { $elemMatch: { member: userTwo } } }
                        ]
                    }, {
                        members: conversationMembers,
                    }, { new: true, upsert: true })];
            case 1:
                conversation = _a.sent();
                return [2 /*return*/, conversation];
        }
    });
}); };
var updateOrCreateDisputeConversations = function (dispute) { return __awaiter(void 0, void 0, void 0, function () {
    var arbitratorCustomerConversation, arbitratorContractorConversation, _a, message, _b, customerContractorConversation;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                arbitratorCustomerConversation = null;
                arbitratorContractorConversation = null;
                if (!dispute.arbitrator) return [3 /*break*/, 7];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        entity: dispute.id,
                        entityType: 'job_disputes',
                        $and: [
                            { members: { $elemMatch: { member: dispute.customer } } },
                            { members: { $elemMatch: { member: dispute.arbitrator } } }
                        ]
                    }, {
                        type: conversations_schema_1.CONVERSATION_TYPE.TICKET,
                        entity: dispute.id,
                        entityType: 'job_disputes',
                        members: [{ memberType: 'customers', member: dispute.customer }, { memberType: 'admins', member: dispute.arbitrator }],
                    }, { new: true, upsert: true })];
            case 1:
                arbitratorCustomerConversation = _c.sent();
                _a = arbitratorCustomerConversation;
                return [4 /*yield*/, arbitratorCustomerConversation.getHeading(dispute.arbitrator)
                    // Send a message
                ];
            case 2:
                _a.heading = _c.sent();
                message = new messages_schema_1.MessageModel({
                    conversation: arbitratorCustomerConversation === null || arbitratorCustomerConversation === void 0 ? void 0 : arbitratorCustomerConversation._id,
                    sender: dispute.arbitrator,
                    senderType: 'admins',
                    receiver: dispute.arbitrator,
                    message: dispute.description,
                    messageType: messages_schema_1.MessageType.ALERT,
                    entity: dispute.id,
                    entityType: 'job_disputes'
                });
                events_1.ConversationEvent.emit('NEW_MESSAGE', { message: message });
                return [4 /*yield*/, message.save()];
            case 3:
                _c.sent();
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        entity: dispute.id,
                        entityType: 'job_disputes',
                        $and: [
                            { members: { $elemMatch: { member: dispute.contractor } } },
                            { members: { $elemMatch: { member: dispute.arbitrator } } }
                        ]
                    }, {
                        type: conversations_schema_1.CONVERSATION_TYPE.TICKET,
                        entity: dispute.id,
                        entityType: 'job_disputes',
                        members: [{ memberType: 'contractors', member: dispute.contractor }, { memberType: 'admins', member: dispute.arbitrator }],
                    }, { new: true, upsert: true })];
            case 4:
                arbitratorContractorConversation = _c.sent();
                _b = arbitratorContractorConversation;
                return [4 /*yield*/, arbitratorContractorConversation.getHeading(dispute.arbitrator)
                    // Send a message
                ];
            case 5:
                _b.heading = _c.sent();
                // Send a message
                message = new messages_schema_1.MessageModel({
                    conversation: arbitratorContractorConversation === null || arbitratorContractorConversation === void 0 ? void 0 : arbitratorContractorConversation._id,
                    sender: dispute.arbitrator,
                    senderType: 'admins',
                    receiver: dispute.contractor,
                    message: dispute.description,
                    messageType: messages_schema_1.MessageType.ALERT,
                    entity: dispute.id,
                    entityType: 'job_disputes'
                });
                events_1.ConversationEvent.emit('NEW_MESSAGE', { message: message });
                return [4 /*yield*/, message.save()];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7: return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                    $and: [
                        { members: { $elemMatch: { member: dispute.contractor } } },
                        { members: { $elemMatch: { member: dispute.customer } } }
                    ]
                }, {
                    members: [{ memberType: 'customers', member: dispute.customer }, { memberType: 'contractors', member: dispute.contractor }],
                }, { new: true, upsert: true })];
            case 8:
                customerContractorConversation = _c.sent();
                return [2 /*return*/, { customerContractor: customerContractorConversation, arbitratorContractor: arbitratorContractorConversation, arbitratorCustomer: arbitratorCustomerConversation }];
        }
    });
}); };
exports.ConversationUtil = {
    containsRestrictedMessageContent: containsRestrictedMessageContent,
    updateOrCreateConversation: updateOrCreateConversation,
    updateOrCreateDisputeConversations: updateOrCreateDisputeConversations
};
