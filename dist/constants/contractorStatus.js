"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerStatus = exports.contractorStatus = void 0;
var contractorStatus;
(function (contractorStatus) {
    contractorStatus["SUSPENDED"] = "SUSPENDED";
    contractorStatus["REVIEWING"] = "REVIEWING";
    contractorStatus["DECLINED"] = "DECLINED";
    contractorStatus["ACTIVE"] = "ACTIVE";
    contractorStatus["CLOSED"] = "CLOSED";
})(contractorStatus || (exports.contractorStatus = contractorStatus = {}));
var customerStatus;
(function (customerStatus) {
    customerStatus["SUSPENDED"] = "SUSPENDED";
    customerStatus["REVIEWING"] = "REVIEWING";
    customerStatus["DECLINED"] = "declined";
    customerStatus["ACTIVE"] = "ACTIVE";
    customerStatus["CLOSED"] = "CLOSED";
})(customerStatus || (exports.customerStatus = customerStatus = {}));
