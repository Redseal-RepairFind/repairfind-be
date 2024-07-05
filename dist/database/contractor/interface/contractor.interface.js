"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPANY_STATUS = exports.CONTRACTOR_TYPES = exports.GST_STATUS = exports.CONTRACTOR_BADGE = exports.CONTRACTOR_STATUS = void 0;
var CONTRACTOR_STATUS;
(function (CONTRACTOR_STATUS) {
    CONTRACTOR_STATUS["APPROVED"] = "APPROVED";
    CONTRACTOR_STATUS["PENDING"] = "PENDING";
    CONTRACTOR_STATUS["REVIEWING"] = "REVIEWING";
    CONTRACTOR_STATUS["REJECTED"] = "REJECTED";
    CONTRACTOR_STATUS["SUSPENDED"] = "SUSPENDED";
    CONTRACTOR_STATUS["BLACKLISTED"] = "BLACKLISTED";
})(CONTRACTOR_STATUS || (exports.CONTRACTOR_STATUS = CONTRACTOR_STATUS = {}));
var CONTRACTOR_BADGE;
(function (CONTRACTOR_BADGE) {
    CONTRACTOR_BADGE["PROSPECT"] = "PROSPECT";
    CONTRACTOR_BADGE["TRAINING"] = "TRAINING";
    CONTRACTOR_BADGE["VERIFIED"] = "VERIFIED";
    CONTRACTOR_BADGE["EXPERIENCED"] = "EXPERIENCED";
    CONTRACTOR_BADGE["TOP_RATED"] = "TOP RATED";
    CONTRACTOR_BADGE["SPECIALIST"] = "SPECIALIST";
})(CONTRACTOR_BADGE || (exports.CONTRACTOR_BADGE = CONTRACTOR_BADGE = {}));
var GST_STATUS;
(function (GST_STATUS) {
    GST_STATUS["PENDING"] = "PENDING";
    GST_STATUS["REVIEWING"] = "REVIEWING";
    GST_STATUS["APPROVED"] = "APPROVED";
    GST_STATUS["DECLINED"] = "DECLINED";
})(GST_STATUS || (exports.GST_STATUS = GST_STATUS = {}));
var CONTRACTOR_TYPES;
(function (CONTRACTOR_TYPES) {
    CONTRACTOR_TYPES["Individual"] = "Individual";
    CONTRACTOR_TYPES["Company"] = "Company";
    CONTRACTOR_TYPES["Employee"] = "Employee";
})(CONTRACTOR_TYPES || (exports.CONTRACTOR_TYPES = CONTRACTOR_TYPES = {}));
var COMPANY_STATUS;
(function (COMPANY_STATUS) {
    COMPANY_STATUS["PENDING"] = "PENDING";
    COMPANY_STATUS["REVIEWING"] = "REVIEWING";
    COMPANY_STATUS["APPROVED"] = "APPROVED";
    COMPANY_STATUS["DECLINED"] = "DECLINED";
})(COMPANY_STATUS || (exports.COMPANY_STATUS = COMPANY_STATUS = {}));
