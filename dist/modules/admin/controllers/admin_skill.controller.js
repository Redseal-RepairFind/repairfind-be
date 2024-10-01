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
exports.AdminSkillController = exports.GetSkills = exports.AddMultipleSkills = exports.AddNew = void 0;
var express_validator_1 = require("express-validator");
var skill_model_1 = __importDefault(require("../../../database/admin/models/skill.model"));
var custom_errors_1 = require("../../../utils/custom.errors");
var AddNew = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, errors, checkSkill, newSkill, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                name_1 = req.body.name;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() })];
                }
                return [4 /*yield*/, skill_model_1.default.findOne({ name: name_1 })];
            case 1:
                checkSkill = _a.sent();
                if (checkSkill) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "skill already exist" })];
                }
                newSkill = new skill_model_1.default({ name: name_1 });
                return [4 /*yield*/, newSkill.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.json({ success: true, message: "skill successfully added." })];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred adding skill", err_1))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AddNew = AddNew;
var AddMultipleSkills = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var skills, existingSkills, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                skills = req.body.skills;
                if (!Array.isArray(skills) && skills.length <= 0) {
                    return [2 /*return*/, res.json({ success: false, message: "Array is empty" })];
                }
                skills.forEach(function (skill) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, skill_model_1.default.findOneAndUpdate({ name: skill }, { name: skill }, { new: true, upsert: true })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, skill_model_1.default.find({})];
            case 1:
                existingSkills = _a.sent();
                return [2 /*return*/, res.json({ success: true, message: "skill successfully added.", data: existingSkills })];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred adding skill", err_2))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.AddMultipleSkills = AddMultipleSkills;
var GetSkills = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, skills, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, skill_model_1.default.find()];
            case 1:
                skills = _b.sent();
                res.json({ success: true, message: "Skills retrieved successfully", data: skills });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred adding skill", err_3))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.GetSkills = GetSkills;
exports.AdminSkillController = {
    AddNew: exports.AddNew,
    GetSkills: exports.GetSkills,
    AddMultipleSkills: exports.AddMultipleSkills
};
