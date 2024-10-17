"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedUserModel = exports.BLOCK_USER_REASON = void 0;
var mongoose_1 = require("mongoose");
var BLOCK_USER_REASON;
(function (BLOCK_USER_REASON) {
    BLOCK_USER_REASON["HARASSMENT"] = "HARASSMENT";
    BLOCK_USER_REASON["FRAUD"] = "FRAUD";
    BLOCK_USER_REASON["ABUSE"] = "ABUSE";
    BLOCK_USER_REASON["OTHER"] = "OTHER";
})(BLOCK_USER_REASON || (exports.BLOCK_USER_REASON = BLOCK_USER_REASON = {}));
var BlockedUserSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'customers',
        required: true
    },
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractors',
        required: true
    },
    blockedBy: {
        type: String,
        enum: ['customer', 'contractor'],
        required: true
    },
    reason: {
        type: String,
        enum: Object.values(BLOCK_USER_REASON),
        required: true
    },
    comment: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
BlockedUserSchema.set('toObject', { virtuals: true });
BlockedUserSchema.set('toJSON', { virtuals: true });
exports.BlockedUserModel = (0, mongoose_1.model)("blocked_users", BlockedUserSchema);
