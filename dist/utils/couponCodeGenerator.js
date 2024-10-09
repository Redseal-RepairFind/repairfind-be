"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCouponCode = void 0;
var generateCouponCode = function (length) {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = 'RPC'; // Prefix
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
exports.generateCouponCode = generateCouponCode;
