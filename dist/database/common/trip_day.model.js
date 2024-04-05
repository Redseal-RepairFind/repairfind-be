"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripDayModel = exports.TripDayStatus = void 0;
var mongoose_1 = require("mongoose");
var TripDayStatus;
(function (TripDayStatus) {
    TripDayStatus["STARTED"] = "STARTED";
    TripDayStatus["ARRIVED"] = "ARRIVED";
    TripDayStatus["COMFIRMED"] = "COMFIRMED";
})(TripDayStatus || (exports.TripDayStatus = TripDayStatus = {}));
var TripDaySchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'customers',
        required: true,
    },
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractors',
        required: true,
    },
    job: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'jobs',
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(TripDayStatus),
        default: TripDayStatus.STARTED,
    },
    verificationCode: {
        type: Number,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
var TripDayModel = (0, mongoose_1.model)("TripDay", TripDaySchema);
exports.TripDayModel = TripDayModel;
