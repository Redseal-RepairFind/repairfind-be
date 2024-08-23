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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonController = exports.sendTestNotification = exports.calculateCharges = exports.getOptions = exports.getSkills = exports.getCurrencies = exports.getCountries = exports.getBankList = void 0;
var skill_model_1 = __importDefault(require("../../../database/admin/models/skill.model"));
var custom_errors_1 = require("../../../utils/custom.errors");
var country_schema_1 = require("../../../database/common/country.schema");
var bank_schema_1 = require("../../../database/common/bank.schema");
var payment_util_1 = require("../../../utils/payment.util");
var apn_1 = require("../../../services/notifications/apn");
var getBankList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, bank_schema_1.BankModel.find()];
            case 1:
                data = _a.sent();
                return [2 /*return*/, res.json({ success: true, message: "Banks retrieved successful", data: data })];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({ success: false, message: err_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getBankList = getBankList;
var getCountries = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var countries, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, country_schema_1.CountryModel.find()];
            case 1:
                countries = _a.sent();
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Countries retrieved successful",
                        data: countries
                    })];
            case 2:
                err_2 = _a.sent();
                res.status(500).json({ success: false, message: err_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCountries = getCountries;
var getCurrencies = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.json({
                success: true,
                message: "Currencies retrieved successful",
                data: []
            });
        }
        catch (err) {
            // signup error
            res.status(500).json({ success: false, message: err.message });
        }
        return [2 /*return*/];
    });
}); };
exports.getCurrencies = getCurrencies;
var getSkills = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var skills, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, skill_model_1.default.find().sort('name').select('name -_id')];
            case 1:
                skills = _a.sent();
                res.json({ success: true, message: "Skills retrieved", data: skills });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('Error fetching skills', err_3))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSkills = getSkills;
var getOptions = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var reasons;
    return __generator(this, function (_a) {
        try {
            reasons = [
                'Too expensive',
                'Got another estimate',
                'Not enough information',
            ];
            return [2 /*return*/, res.json({ success: true, message: "Options retrieved", data: { quotationDeclineReasons: reasons } })];
        }
        catch (err) {
            return [2 /*return*/, next(new custom_errors_1.InternalServerError('Error fetching skills', err))];
        }
        return [2 /*return*/];
    });
}); };
exports.getOptions = getOptions;
var calculateCharges = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, charges, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body.amount, amount = _a === void 0 ? 0 : _a;
                return [4 /*yield*/, payment_util_1.PaymentUtil.calculateCharges(Number(amount))];
            case 1:
                charges = _b.sent();
                return [2 /*return*/, res.json({ success: true, message: "Payment charges calculated", data: charges })];
            case 2:
                err_4 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('Error calculating payment charges', err_4))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.calculateCharges = calculateCharges;
var sendTestNotification = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            // sendFCMNotification('dEdej-ewShOgyAYGkT9TfY:APA91bEuSQEpsdhlIxPAVcH0xPIewHm5QofWhAPswQTF_PGSdhFSpvLxFNwzow2JCaCIIj9YX8cfbvD-wrL0NwkHzpU7rjwv06QcqFg_znvyoEAy1NCPRlS9wqhBGlSachsRTKVp-rF4')
            // sendFCMNotification('chsAINgk7k4mqtfzRUWFdd:APA91bF9G6U4R0zu7yMoDe3y4KIsf8Z_ECE3sTTuBNu21k86jrL4MUOc0RmPHphaNaIjxtLeAR6tXtq7-s_CHLXRoI4bG9tTfR4192gAqOX82P8Wr5FNWXXZj-spbyb5Bmj-qOVesmlw')
            // sendAPN2Notification('5c331b83caea396d9cf1e43545276d70791200840ecf126124853b6387630fe2')
            // sendSilentNotification(['5c331b83caea396d9cf1e43545276d70791200840ecf126124853b6387630fe2'])
            // sendAPNNotification('5c331b83caea396d9cf1e43545276d70791200840ecf126124853b6387630fe2')
            (0, apn_1.sendNotification)(['5c331b83caea396d9cf1e43545276d70791200840ecf126124853b6387630fe2'], { title: "Title here", body: "Body here", subtitle: "Subtitle here" }, { sound: "ringtone.wav", badge: 3 });
            // sam Prod iphone
            // 6aeb2d87992687389efde1c99c7a2a76e49b1b69e48dc78d81eb62a9b17486e0
            //5c331b83caea396d9cf1e43545276d70791200840ecf126124853b6387630fe2
            return [2 /*return*/, res.json({ success: true, message: "Notification sent" })];
        }
        catch (err) {
            return [2 /*return*/, next(new custom_errors_1.InternalServerError('Error fetching skills', err))];
        }
        return [2 /*return*/];
    });
}); };
exports.sendTestNotification = sendTestNotification;
exports.CommonController = {
    getBankList: exports.getBankList,
    getSkills: exports.getSkills,
    getCountries: exports.getCountries,
    getOptions: exports.getOptions,
    sendTestNotification: exports.sendTestNotification,
    calculateCharges: exports.calculateCharges
};
