"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPANY_STATUS = exports.CONTRACTOR_TYPES = exports.GST_STATUS = void 0;
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
