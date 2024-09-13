"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbuseReportModel = exports.ABUSE_REPORT_STATUS = exports.ABUSE_REPORT_TYPE = void 0;
var mongoose_1 = require("mongoose");
var ABUSE_REPORT_TYPE;
(function (ABUSE_REPORT_TYPE) {
    ABUSE_REPORT_TYPE["HARASSMENT"] = "HARASSMENT";
    ABUSE_REPORT_TYPE["FRAUD"] = "FRAUD";
    ABUSE_REPORT_TYPE["ABUSE"] = "ABUSE";
    ABUSE_REPORT_TYPE["OTHER"] = "OTHER";
})(ABUSE_REPORT_TYPE || (exports.ABUSE_REPORT_TYPE = ABUSE_REPORT_TYPE = {}));
var ABUSE_REPORT_STATUS;
(function (ABUSE_REPORT_STATUS) {
    ABUSE_REPORT_STATUS["PENDING"] = "PENDING";
    ABUSE_REPORT_STATUS["REVIEWED"] = "REVIEWED";
    ABUSE_REPORT_STATUS["RESOLVED"] = "RESOLVED";
    ABUSE_REPORT_STATUS["REJECTED"] = "REJECTED";
})(ABUSE_REPORT_STATUS || (exports.ABUSE_REPORT_STATUS = ABUSE_REPORT_STATUS = {}));
var AbuseReportSchema = new mongoose_1.Schema({
    reporter: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'reporterType',
        required: true
    },
    reported: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'reportedType',
        required: true
    },
    reporterType: {
        type: String,
        enum: ['customers', 'contractors'],
        required: true
    },
    reportedType: {
        type: String,
        enum: ['customers', 'contractors'],
        required: true
    },
    type: {
        type: String,
        enum: Object.values(ABUSE_REPORT_TYPE),
        required: true
    },
    comment: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(ABUSE_REPORT_STATUS),
        default: ABUSE_REPORT_STATUS.PENDING,
        required: true
    },
    action: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    admin: {
        type: mongoose_1.Schema.Types.ObjectId, // Updated to ObjectId
        ref: 'admins'
    }
});
// Virtual field to get reporter details
AbuseReportSchema.virtual('reporterDetails', {
    refPath: 'reporterType',
    localField: 'reporter',
    foreignField: '_id',
    justOne: true
});
// Virtual field to get reported user details
AbuseReportSchema.virtual('reportedDetails', {
    refPath: 'reportedType',
    localField: 'reported',
    foreignField: '_id',
    justOne: true
});
AbuseReportSchema.set('toObject', { virtuals: true });
AbuseReportSchema.set('toJSON', { virtuals: true });
exports.AbuseReportModel = (0, mongoose_1.model)("reports", AbuseReportSchema);
