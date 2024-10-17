"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorUtil = exports.OTP_EXPIRY_TIME = exports.generateOTP = exports.generateReferralCode = exports.generateCouponCode = void 0;
var referral_code_schema_1 = require("../database/common/referral_code.schema");
var generateCouponCode = function (length) {
    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var result = 'RCC'; // Prefix
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
exports.generateCouponCode = generateCouponCode;
var generateReferralCode = function (_a) {
    var length = _a.length, userId = _a.userId, userType = _a.userType;
    return __awaiter(void 0, void 0, void 0, function () {
        var characters, generatedCode, isUnique, i, codeExists;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                    generatedCode = 'RRC';
                    isUnique = false;
                    _b.label = 1;
                case 1:
                    if (!!isUnique) return [3 /*break*/, 3];
                    generatedCode = 'RRC'; // Reset prefix
                    for (i = 0; i < length; i++) {
                        generatedCode += characters.charAt(Math.floor(Math.random() * characters.length));
                    }
                    return [4 /*yield*/, referral_code_schema_1.ReferralCodeModel.exists({ code: generatedCode })];
                case 2:
                    codeExists = _b.sent();
                    if (!codeExists) {
                        isUnique = true; // Exit the loop if no matching code is found
                    }
                    return [3 /*break*/, 1];
                case 3: 
                // Create the referral document with the unique code
                return [4 /*yield*/, referral_code_schema_1.ReferralCodeModel.create({ code: generatedCode, user: userId, userType: userType })];
                case 4:
                    // Create the referral document with the unique code
                    _b.sent();
                    return [2 /*return*/, generatedCode];
            }
        });
    });
};
exports.generateReferralCode = generateReferralCode;
function generateOTP() {
    var otp = "";
    var allowedChars = "123456789";
    for (var i = 0; i < 4; i++) {
        otp += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return otp;
}
exports.generateOTP = generateOTP;
exports.OTP_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds
exports.GeneratorUtil = {
    generateOTP: generateOTP,
    generateCouponCode: exports.generateCouponCode,
    generateReferralCode: exports.generateReferralCode
};
