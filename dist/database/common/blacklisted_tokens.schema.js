"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var BlacklistedTokenSchema = new mongoose_1.default.Schema({
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '1d' } // Tokens will expire after 1 day
});
var BlacklistedToken = mongoose_1.default.model('blacklisted_tokens', BlacklistedTokenSchema);
exports.default = BlacklistedToken;
