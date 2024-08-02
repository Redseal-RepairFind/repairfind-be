"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonHttpRequest = exports.clearSessionParams = void 0;
var express_validator_1 = require("express-validator");
exports.clearSessionParams = [
    (0, express_validator_1.body)("accessToken").notEmpty(),
    (0, express_validator_1.body)("userId").notEmpty(),
    (0, express_validator_1.body)("userType").notEmpty(),
    (0, express_validator_1.body)("deviceToken").notEmpty(),
];
exports.CommonHttpRequest = {
    clearSessionParams: exports.clearSessionParams,
};
