"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSACTION_TYPE = exports.TRANSACTION_STATUS = void 0;
var mongoose_1 = require("mongoose");
var TRANSACTION_STATUS;
(function (TRANSACTION_STATUS) {
    TRANSACTION_STATUS["PENDING"] = "PENDING";
    TRANSACTION_STATUS["APPROVED"] = "APPROVED";
    TRANSACTION_STATUS["SUCCESSFUL"] = "SUCCESSFUL";
    TRANSACTION_STATUS["FAILED"] = "FAILED";
    TRANSACTION_STATUS["REFUNDED"] = "REFUNDED";
    TRANSACTION_STATUS["REQUIRES_CAPTURE"] = "REQUIRES_CAPTURE";
    TRANSACTION_STATUS["CANCELLED"] = "CANCELLED";
})(TRANSACTION_STATUS || (exports.TRANSACTION_STATUS = TRANSACTION_STATUS = {}));
var TRANSACTION_TYPE;
(function (TRANSACTION_TYPE) {
    TRANSACTION_TYPE["TRANSFER"] = "TRANSFER";
    TRANSACTION_TYPE["JOB_PAYMENT"] = "JOB_PAYMENT";
    TRANSACTION_TYPE["REFUND"] = "REFUND";
    // PAYOUT = "PAYOUT",
    TRANSACTION_TYPE["SITE_VISIT"] = "SITE_VISIT";
    TRANSACTION_TYPE["JOB_DAY"] = "JOB_DAY";
    TRANSACTION_TYPE["CHANGE_ORDER"] = "CHANGE_ORDER";
})(TRANSACTION_TYPE || (exports.TRANSACTION_TYPE = TRANSACTION_TYPE = {}));
var TransactionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: Object.values(TRANSACTION_TYPE), // Use enum values for type field
        required: true,
    },
    amount: {
        type: Number,
    },
    initiatorUser: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'initiatorUserType',
    },
    initiatorUserType: {
        type: String,
    },
    fromUser: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'fromUserType',
        required: true,
    },
    fromUserType: {
        type: String,
        required: true,
    },
    toUser: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'toUserType',
        required: true,
    },
    toUserType: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: Object.values(TRANSACTION_STATUS), // Use enum values for status
        default: TRANSACTION_STATUS.PENDING,
    },
    remark: {
        type: String,
    },
    invoice: {
        type: {
            items: [],
            charges: mongoose_1.Schema.Types.Mixed,
            id: mongoose_1.Schema.Types.ObjectId,
        },
        default: null,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed
    },
    job: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: null,
    },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
});
TransactionSchema.methods.getIsCredit = function (userId) {
    return this.toUser == userId;
};
var TransactionModel = (0, mongoose_1.model)("Transaction", TransactionSchema);
exports.default = TransactionModel;
