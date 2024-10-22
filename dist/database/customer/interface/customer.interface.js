"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUSTOMER_STATUS = exports.CustomerAuthProviders = void 0;
var CustomerAuthProviders;
(function (CustomerAuthProviders) {
    CustomerAuthProviders["PASSWORD"] = "PASSWORD";
    CustomerAuthProviders["GOOGLE"] = "GOOGLE";
    CustomerAuthProviders["FACEBOOK"] = "FACEBOOK";
    CustomerAuthProviders["APPLE"] = "APPLE";
})(CustomerAuthProviders || (exports.CustomerAuthProviders = CustomerAuthProviders = {}));
var CUSTOMER_STATUS;
(function (CUSTOMER_STATUS) {
    CUSTOMER_STATUS["APPROVED"] = "APPROVED";
    CUSTOMER_STATUS["PENDING"] = "PENDING";
    CUSTOMER_STATUS["REVIEWING"] = "REVIEWING";
    CUSTOMER_STATUS["REJECTED"] = "REJECTED";
    CUSTOMER_STATUS["SUSPENDED"] = "SUSPENDED";
    CUSTOMER_STATUS["BLACKLISTED"] = "BLACKLISTED";
})(CUSTOMER_STATUS || (exports.CUSTOMER_STATUS = CUSTOMER_STATUS = {}));
