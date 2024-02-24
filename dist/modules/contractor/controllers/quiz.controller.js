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
exports.QuizController = exports.SubmitQuiz = exports.GetQuizResult = exports.StartQuiz = void 0;
var express_validator_1 = require("express-validator");
var question_model_1 = __importDefault(require("../../../database/admin/models/question.model"));
var quiz_model_1 = __importDefault(require("../../../database/admin/models/quiz.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var contractor_quiz_model_1 = __importDefault(require("../../../database/contractor/models/contractor_quiz.model"));
var StartQuiz = function (_, res) { return __awaiter(void 0, void 0, void 0, function () {
    var randomQuizzes, randomQuiz, randomQuestions, error_1;
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
                    message: 'Quize retrieved',
                    data: randomQuiz,
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(500).json({
                    status: false,
                    message: error_1.message,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.StartQuiz = StartQuiz;
//contractor  get quiz result
var GetQuizResult = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                // const checkTakeTestAlready = await ContractorQuizModel.find({contractorId});  
                // if (checkTakeTestAlready.length < 1) {
                //   return res
                //     .status(401)
                //     .json({ message: "start the quiz first" });
                // }
                // const totalPass = await ContractorQuizModel.countDocuments({contractorId, mark: "pass"})
                // const totalQustion = await ContractorQuizModel.countDocuments({contractorId,})
                res.json({
                // totalPass,
                // totalQustion
                });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                res.status(500).json({ status: false, message: err_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.GetQuizResult = GetQuizResult;
var SubmitQuiz = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quizId, response, errors, contractor, contractorId, contractorExist, quiz, questions_1, quizResults, contractorQuiz, totalQuestions, totalCorrect, totalWrong, totalAnswered, result, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, quizId = _a.quizId, response = _a.response;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid credentials' })];
                }
                return [4 /*yield*/, quiz_model_1.default.findOne({ _id: quizId })];
            case 2:
                quiz = _b.sent();
                if (!quiz) {
                    return [2 /*return*/, res.status(401).json({ message: 'Incorrect quiz ID' })];
                }
                return [4 /*yield*/, question_model_1.default.find({ quiz: quizId })];
            case 3:
                questions_1 = _b.sent();
                quizResults = response.map(function (userReponse) {
                    var question = questions_1.find(function (q) { return q.question === userReponse.question; });
                    if (!question) {
                        return {
                            question: userReponse.question,
                            userAnswer: userReponse.answer,
                            correct: false,
                        };
                    }
                    // Check if user's answer is in the array of correct answers
                    var isCorrect = question.answer.includes(userReponse.answer);
                    return {
                        question: userReponse.question,
                        userAnswer: userReponse.answer,
                        correct: isCorrect,
                    };
                });
                return [4 /*yield*/, contractor_quiz_model_1.default.findOneAndUpdate({ contractor: contractorId, quiz: quizId }, { $set: { response: quizResults } }, { new: true, upsert: true })];
            case 4:
                contractorQuiz = _b.sent();
                // If upsert: true is used, and no document matches the query, findOneAndUpdate will create a new document.
                // If a document matches the query, it will update the existing document and return the updated document.
                if (!contractorQuiz) {
                    // Handle the case where the contractorQuiz is not found or created.
                    return [2 /*return*/, res.status(500).json({ success: false, message: 'Failed to update or create ContractorQuiz' })];
                }
                totalQuestions = quizResults.length;
                totalCorrect = quizResults.filter(function (response) { return response.correct; }).length;
                totalWrong = totalQuestions - totalCorrect;
                totalAnswered = response.length;
                result = {
                    totalQuestions: totalQuestions,
                    totalCorrect: totalCorrect,
                    totalWrong: totalWrong,
                    totalAnswered: totalAnswered
                };
                contractorQuiz.result = result;
                res.json({
                    success: true,
                    message: 'Quiz results submitted successfully',
                    data: contractorQuiz,
                });
                return [3 /*break*/, 6];
            case 5:
                err_2 = _b.sent();
                res.status(500).json({ success: false, message: err_2.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.SubmitQuiz = SubmitQuiz;
exports.QuizController = {
    StartQuiz: exports.StartQuiz,
    SubmitQuiz: exports.SubmitQuiz,
    GetQuizResult: exports.GetQuizResult
};
function areArraysEqualUnordered(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    var countMap = new Map();
    // Count occurrences in arr1
    arr1.forEach(function (item) {
        countMap.set(item, (countMap.get(item) || 0) + 1);
    });
    // Decrement occurrences in arr2
    arr2.forEach(function (item) {
        var count = countMap.get(item);
        if (!count) {
            return false; // item not found in arr1
        }
        if (count === 1) {
            countMap.delete(item);
        }
        else {
            countMap.set(item, count - 1);
        }
    });
    return countMap.size === 0;
}
