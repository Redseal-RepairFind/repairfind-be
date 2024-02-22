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
exports.AdminDeleteQuestionlController = exports.AdminEditQuestionlController = exports.AdminGetSingleQuestionController = exports.AdminGetAllQuestionController = exports.AdminAddQuestionlController = void 0;
var express_validator_1 = require("express-validator");
var question_model_1 = __importDefault(require("../../../database/admin/models/question.model"));
//admin add question /////////////
var AdminAddQuestionlController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, question, options, answer, errors, admin, adminId, newQuestion, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, question = _a.question, options = _a.options, answer = _a.answer;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                newQuestion = new question_model_1.default({
                    question: question,
                    options: options,
                    answer: answer
                });
                return [4 /*yield*/, newQuestion.save()];
            case 1:
                _b.sent();
                res.json({
                    message: "question successfully enterd"
                });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.AdminAddQuestionlController = AdminAddQuestionlController;
//admin get all question /////////////
var AdminGetAllQuestionController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId, skip, questions, totalQuestion, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, page = _a.page, limit = _a.limit;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                page = page || 1;
                limit = limit || 50;
                skip = (page - 1) * limit;
                return [4 /*yield*/, question_model_1.default.find()
                        .skip(skip)
                        .limit(limit)];
            case 1:
                questions = _b.sent();
                return [4 /*yield*/, question_model_1.default.countDocuments()];
            case 2:
                totalQuestion = _b.sent();
                res.json({
                    questions: questions,
                    totalQuestion: totalQuestion
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetAllQuestionController = AdminGetAllQuestionController;
//admin get single question /////////////
var AdminGetSingleQuestionController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var questionId, errors, admin, adminId, question, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                questionId = req.query.questionId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, question_model_1.default.findOne({ _id: questionId })];
            case 1:
                question = _a.sent();
                if (!question) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid question ID" })];
                }
                res.json({
                    question: question
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetSingleQuestionController = AdminGetSingleQuestionController;
//admin edit question /////////////
var AdminEditQuestionlController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, question, options, answer, questionId, errors, admin, adminId, questionDb, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, question = _a.question, options = _a.options, answer = _a.answer, questionId = _a.questionId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, question_model_1.default.findOne({ _id: questionId })];
            case 1:
                questionDb = _b.sent();
                if (!questionDb) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid question ID" })];
                }
                questionDb.question = question;
                questionDb.options = options;
                questionDb.answer = answer;
                return [4 /*yield*/, questionDb.save()];
            case 2:
                _b.sent();
                res.json({
                    message: "question successfully updated"
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                // signup error
                console.log("error", err_4);
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminEditQuestionlController = AdminEditQuestionlController;
//admin Delete question /////////////
var AdminDeleteQuestionlController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var questionId, errors, admin, adminId, deleteQuestion, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                questionId = req.body.questionId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, question_model_1.default.findOneAndDelete({ _id: questionId }, { new: true })];
            case 1:
                deleteQuestion = _a.sent();
                if (!deleteQuestion) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid question ID" })];
                }
                res.json({
                    message: "question successfully deleted"
                });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                // signup error
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.AdminDeleteQuestionlController = AdminDeleteQuestionlController;
