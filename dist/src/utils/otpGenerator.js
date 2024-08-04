"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP_EXPIRY_TIME = exports.generateOTP = void 0;
// Generate a new OTP
function generateOTP() {
    var otp = "";
    //const allowedChars =
    //  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    var allowedChars = "123456789";
    for (var i = 0; i < 4; i++) {
        otp += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return otp;
}
exports.generateOTP = generateOTP;
exports.OTP_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds
