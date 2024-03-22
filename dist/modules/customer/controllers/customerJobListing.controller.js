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
exports.JobListing = exports.customerListNewJobController = void 0;
var express_validator_1 = require("express-validator");
var customerJobListing_interface_1 = __importDefault(require("../../../database/customer/models/customerJobListing.interface"));
var upload_utility_1 = require("../../../utils/upload.utility");
var uuid_1 = require("uuid");
//customer list new job controller /////////////
var customerListNewJobController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobCategory, jobDescription, jobLocation, date, jobExpiry, contractorType, emergency, skill, files, errors, customer, customerId, voiceDescription, jobImg, i, file, filename, result, filename, result, newJobListing, saveDJobListing, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                _a = req.body, jobCategory = _a.jobCategory, jobDescription = _a.jobDescription, jobLocation = _a.jobLocation, date = _a.date, jobExpiry = _a.jobExpiry, contractorType = _a.contractorType, emergency = _a.emergency;
                skill = req.query.skill;
                files = req.files;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                voiceDescription = '';
                jobImg = '';
                if (!files) {
                    voiceDescription = '';
                    jobImg = '';
                }
                i = 0;
                _b.label = 1;
            case 1:
                if (!(i < files.length)) return [3 /*break*/, 6];
                file = files[i];
                if (!(file.fieldname == 'voiceDescription')) return [3 /*break*/, 3];
                filename = (0, uuid_1.v4)();
                return [4 /*yield*/, (0, upload_utility_1.uploadDifferentTypeToS3)(file.buffer, "".concat(filename, ".mp3"), 'audio/mp3')];
            case 2:
                result = _b.sent();
                voiceDescription = result === null || result === void 0 ? void 0 : result.Location;
                _b.label = 3;
            case 3:
                if (!(file.fieldname == 'jobImg')) return [3 /*break*/, 5];
                filename = (0, uuid_1.v4)();
                return [4 /*yield*/, (0, upload_utility_1.uploadDifferentTypeToS3)(file.buffer, "".concat(filename, ".jpg"), 'image/jpeg')];
            case 4:
                result = _b.sent();
                jobImg = result === null || result === void 0 ? void 0 : result.Location;
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 1];
            case 6:
                newJobListing = new customerJobListing_interface_1.default({
                    customerId: customerId,
                    jobCategory: jobCategory,
                    jobDescription: jobDescription,
                    voiceDescription: voiceDescription,
                    jobLocation: jobLocation,
                    date: date,
                    jobExpiry: jobExpiry,
                    contractorType: contractorType,
                    emergency: emergency,
                    jobImg: jobImg,
                });
                return [4 /*yield*/, newJobListing.save()];
            case 7:
                saveDJobListing = _b.sent();
                res.json({
                    success: true,
                    message: "Job listed successful",
                    data: saveDJobListing
                });
                return [3 /*break*/, 9];
            case 8:
                err_1 = _b.sent();
                // signup error
                console.log("error", err_1);
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.customerListNewJobController = customerListNewJobController;
exports.JobListing = {
    customerListNewJobController: exports.customerListNewJobController,
};
