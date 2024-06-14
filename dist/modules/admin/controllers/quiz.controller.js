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
exports.AdminQuizController = exports.DeleteQuestion = exports.EditQuestion = exports.GetSingleQuestion = exports.GetAllQuestions = exports.AddQuestion = exports.getRandomQuiz = exports.getAllQuizzes = exports.CreateQuiz = void 0;
var express_validator_1 = require("express-validator");
var question_model_1 = __importDefault(require("../../../database/admin/models/question.model"));
var quiz_model_1 = __importDefault(require("../../../database/admin/models/quiz.model"));
//admin create quiz /////////////
var CreateQuiz = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, video_url, questions, errors, admin, adminId, newQuiz, createdQuestionRefs, _i, questions_1, questionData, question, options, answer, newQuestion, quiz, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, video_url = _a.video_url, questions = _a.questions;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, quiz_model_1.default.create({
                        video_url: video_url,
                        questions: [], // Initially empty, we'll fill this in later
                    })];
            case 1:
                newQuiz = _b.sent();
                createdQuestionRefs = [];
                _i = 0, questions_1 = questions;
                _b.label = 2;
            case 2:
                if (!(_i < questions_1.length)) return [3 /*break*/, 5];
                questionData = questions_1[_i];
                question = questionData.question, options = questionData.options, answer = questionData.answer;
                return [4 /*yield*/, question_model_1.default.create({
                        quiz: newQuiz._id,
                        question: question,
                        options: options,
                        answer: answer,
                    })];
            case 3:
                newQuestion = _b.sent();
                // Store the reference to the created question
                createdQuestionRefs.push(newQuestion._id);
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [4 /*yield*/, quiz_model_1.default.findByIdAndUpdate(newQuiz._id, { questions: createdQuestionRefs })];
            case 6:
                quiz = _b.sent();
                res.json({
                    status: true,
                    message: 'Quiz and questions successfully entered',
                    data: quiz
                });
                return [3 /*break*/, 8];
            case 7:
                err_1 = _b.sent();
                // Error handling
                res.status(500).json({ status: false, message: err_1.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.CreateQuiz = CreateQuiz;
var getAllQuizzes = function (_, res) { return __awaiter(void 0, void 0, void 0, function () {
    var quizzes, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, quiz_model_1.default.find().exec()];
            case 1:
                quizzes = _a.sent();
                res.json({
                    status: true,
                    message: 'Quizzes retrieved',
                    data: quizzes,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({
                    status: false,
                    message: error_1.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllQuizzes = getAllQuizzes;
var getRandomQuiz = function (_, res) { return __awaiter(void 0, void 0, void 0, function () {
    var randomQuizzes, randomQuiz, randomQuestions, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, quiz_model_1.default.aggregate([{ $sample: { size: 1 } }])];
            case 1:
                randomQuizzes = _a.sent();
                randomQuiz = randomQuizzes[0];
                if (!randomQuiz) {
                    return [2 /*return*/, res.status(404).json({
                            status: false,
                            message: 'No quizzes found',
                        })];
                }
                return [4 /*yield*/, question_model_1.default.aggregate([
                        { $match: { quiz: randomQuiz._id } },
                        { $sample: { size: 10 } },
                    ])];
            case 2:
                randomQuestions = _a.sent();
                randomQuiz.questions = randomQuestions;
                res.json({
                    status: true,
                    message: 'Random quize retreived',
                    data: randomQuiz,
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(500).json({
                    status: false,
                    message: error_2.message,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getRandomQuiz = getRandomQuiz;
//admin add question /////////////
var AddQuestion = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, question, options, answer, errors, admin, adminId, newQuestion, err_2;
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
                err_2 = _b.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.AddQuestion = AddQuestion;
//admin get all question /////////////
var GetAllQuestions = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId, skip, questions, totalQuestion, err_3;
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
                err_3 = _b.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.GetAllQuestions = GetAllQuestions;
//admin get single question /////////////
var GetSingleQuestion = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var questionId, errors, admin, adminId, question, err_4;
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
                err_4 = _a.sent();
                // signup error
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.GetSingleQuestion = GetSingleQuestion;
//admin edit question /////////////
var EditQuestion = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, question, options, answer, questionId, errors, admin, adminId, questionDb, err_5;
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
                err_5 = _b.sent();
                // signup error
                console.log("error", err_5);
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.EditQuestion = EditQuestion;
//admin Delete question /////////////
var DeleteQuestion = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var questionId, errors, admin, adminId, deleteQuestion, err_6;
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
                err_6 = _a.sent();
                // signup error
                res.status(500).json({ message: err_6.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.DeleteQuestion = DeleteQuestion;
exports.AdminQuizController = {
    DeleteQuestion: exports.DeleteQuestion,
    EditQuestion: exports.EditQuestion,
    GetSingleQuestion: exports.GetSingleQuestion,
    GetAllQuestions: exports.GetAllQuestions,
    AddQuestion: exports.AddQuestion,
    CreateQuiz: exports.CreateQuiz,
    getAllQuizzes: exports.getAllQuizzes,
    getRandomQuiz: exports.getRandomQuiz
};
