"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractorStatus = void 0;
var contractorStatus;
(function (contractorStatus) {
    contractorStatus["SUSPENDED"] = "suspend";
    contractorStatus["REVIEWING"] = "in-review";
    contractorStatus["DECLINED"] = "declined";
    contractorStatus["ACTIVE"] = "active";
    contractorStatus["CLOSED"] = "closed";
})(contractorStatus || (exports.contractorStatus = contractorStatus = {}));
