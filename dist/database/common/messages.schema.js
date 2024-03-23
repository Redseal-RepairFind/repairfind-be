"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
// Define schema for messages
var MessageSchema = new mongoose_1.Schema({
    conversation: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'senderType', // Dynamically reference either Customer or Contractor model
        required: true,
    },
    senderType: {
        type: String,
        enum: ['contractors', 'customers'],
        required: false, // false becos we of alert kind of messages
    },
    messageType: {
        type: String,
        enum: ['text', 'alert', 'media'],
        required: true,
    },
    message: {
        type: String,
        trim: true,
        required: true,
    },
    media: [
        {
            type: {
                type: String,
            },
            url: {
                type: String,
            },
            blurHash: {
                type: String,
            },
        },
    ],
    readBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            refPath: 'senderType', // Dynamically reference either Customer or Contractor model
        },
    ],
}, { timestamps: true });
// Create and export the Message model
exports.MessageModel = mongoose_1.default.model('Message', MessageSchema);
