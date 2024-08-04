"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerStatus = exports.contractorStatus = void 0;
var contractorStatus;
(function (contractorStatus) {
    contractorStatus["SUSPENDED"] = "suspend";
    contractorStatus["REVIEWING"] = "in-review";
    contractorStatus["DECLINED"] = "declined";
    contractorStatus["ACTIVE"] = "active";
    contractorStatus["CLOSED"] = "closed";
})(contractorStatus || (exports.contractorStatus = contractorStatus = {}));
var customerStatus;
(function (customerStatus) {
    customerStatus["SUSPENDED"] = "suspend";
    customerStatus["REVIEWING"] = "in-review";
    customerStatus["DECLINED"] = "declined";
    customerStatus["ACTIVE"] = "active";
    customerStatus["CLOSED"] = "closed";
})(customerStatus || (exports.customerStatus = customerStatus = {}));
