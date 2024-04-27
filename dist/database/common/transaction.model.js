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
exports.TRANSACTION_TYPE = exports.TRANSACTION_STATUS = void 0;
var mongoose_1 = require("mongoose");
var TRANSACTION_STATUS;
(function (TRANSACTION_STATUS) {
    TRANSACTION_STATUS["PENDING"] = "PENDING";
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
    TRANSACTION_TYPE["PAYOUT"] = "PAYOUT";
    TRANSACTION_TYPE["INSPECTION_PAYMENT"] = "INSPECTION_PAYMENT";
})(TRANSACTION_TYPE || (exports.TRANSACTION_TYPE = TRANSACTION_TYPE = {}));
var CaptureDetailsShema = new mongoose_1.Schema({
    payment: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    payment_method: { type: String, required: true },
    payment_intent: { type: String, required: true },
    amount_authorized: { type: Number, required: true },
    currency: { type: String, required: true },
    brand: { type: String },
    capture_before: { type: Number },
    country: { type: String },
    exp_month: { type: Number },
    exp_year: { type: Number },
    extended_authorization: {
        status: { type: String }
    },
    fingerprint: { type: String },
    funding: { type: String },
    incremental_authorization: {
        status: { type: String }
    },
    installments: { type: Number },
    last4: { type: String },
    mandate: { type: mongoose_1.Schema.Types.Mixed },
    multicapture: {
        status: { type: String }
    },
    network: { type: String },
    network_token: {
        used: { type: Boolean }
    },
    overcapture: {
        maximum_amount_capturable: { type: Number },
        status: { type: String }
    },
    three_d_secure: { type: String },
    wallet: { type: mongoose_1.Schema.Types.Mixed },
    status: { type: String, required: true },
    captured: { type: Boolean, required: true },
    canceled_at: { type: String },
    captured_at: { type: String },
    cancellation_reason: { type: String },
    capture_method: { type: String }
}, {
    timestamps: true,
});
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
    job: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: null,
    },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    captureDetails: CaptureDetailsShema,
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, this.toUser == userId];
        });
    });
};
var TransactionModel = (0, mongoose_1.model)("Transaction", TransactionSchema);
exports.default = TransactionModel;
