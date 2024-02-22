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
exports.contractionGetQuizRrsultController = exports.contractionAnwerQuestionController = exports.contractionLoadtQuestionController = exports.contractorStartQuizController = void 0;
var express_validator_1 = require("express-validator");
var question_model_1 = __importDefault(require("../../../database/admin/models/question.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var contractorQuiz_model_1 = __importDefault(require("../../../database/contractor/models/contractorQuiz.model"));
//contractor  start quiz
var contractorStartQuizController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, checkTakeTestAlready, totalQuestion, randomSkip, randomQuestions, i, randomQuestion, newQuiz, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
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
                return [4 /*yield*/, contractorQuiz_model_1.default.find({ contractorId: contractorId })];
            case 2:
                checkTakeTestAlready = _b.sent();
                if (checkTakeTestAlready.length > 0) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "test already taken" })];
                }
                return [4 /*yield*/, question_model_1.default.countDocuments()];
            case 3:
                totalQuestion = _b.sent();
                randomSkip = Math.floor(Math.random() * totalQuestion);
                if (randomSkip > 10) {
                    randomSkip = 10;
                }
                return [4 /*yield*/, question_model_1.default.find().limit(10).skip(randomSkip)];
            case 4:
                randomQuestions = _b.sent();
                i = 0;
                _b.label = 5;
            case 5:
                if (!(i < randomQuestions.length)) return [3 /*break*/, 8];
                randomQuestion = randomQuestions[i];
                newQuiz = new contractorQuiz_model_1.default({
                    contractorId: contractorId,
                    questionId: randomQuestion._id,
                });
                return [4 /*yield*/, newQuiz.save()];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 5];
            case 8:
                res.json({
                    message: "you can proceed to load question"
                });
                return [3 /*break*/, 10];
            case 9:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.contractorStartQuizController = contractorStartQuizController;
//contractor  load question
var contractionLoadtQuestionController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, checkTakeTestAlready, questions, i, test, question, obj, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
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
                return [4 /*yield*/, contractorQuiz_model_1.default.find({ contractorId: contractorId })];
            case 2:
                checkTakeTestAlready = _b.sent();
                if (checkTakeTestAlready.length < 1) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "start the quiz first" })];
                }
                questions = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < checkTakeTestAlready.length)) return [3 /*break*/, 6];
                test = checkTakeTestAlready[i];
                return [4 /*yield*/, question_model_1.default.findOne({ _id: test.questionId })];
            case 4:
                question = _b.sent();
                if (!question)
                    return [3 /*break*/, 5];
                obj = {
                    test: test,
                    question: question,
                };
                questions.push(obj);
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                res.json({
                    questions: questions
                });
                return [3 /*break*/, 8];
            case 7:
                err_2 = _b.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.contractionLoadtQuestionController = contractionLoadtQuestionController;
//contractor  answer question
var contractionAnwerQuestionController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quizId, answer, errors, contractor, contractorId, contractorExist, checkTakeTestAlready, quiz, Question, mark, compareAnswer, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, quizId = _a.quizId, answer = _a.answer;
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
                return [4 /*yield*/, contractorQuiz_model_1.default.find({ contractorId: contractorId })];
            case 2:
                checkTakeTestAlready = _b.sent();
                if (checkTakeTestAlready.length < 1) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "start the quiz first" })];
                }
                return [4 /*yield*/, contractorQuiz_model_1.default.findOne({ _id: quizId })];
            case 3:
                quiz = _b.sent();
                if (!quiz) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect quiz ID" })];
                }
                return [4 /*yield*/, question_model_1.default.findOne({ _id: quiz.questionId })];
            case 4:
                Question = _b.sent();
                if (!Question) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect quiz ID" })];
                }
                mark = 'fail';
                compareAnswer = areArraysEqualUnordered(answer, Question.answer);
                if (compareAnswer) {
                    mark = 'pass';
                }
                quiz.mark = mark;
                quiz.answer = answer;
                quiz.answered = 'yes';
                return [4 /*yield*/, quiz.save()];
            case 5:
                _b.sent();
                res.json({
                    message: 'answer saved'
                });
                return [3 /*break*/, 7];
            case 6:
                err_3 = _b.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.contractionAnwerQuestionController = contractionAnwerQuestionController;
//contractor  get quiz result
var contractionGetQuizRrsultController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, checkTakeTestAlready, totalPass, totalQustion, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
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
                return [4 /*yield*/, contractorQuiz_model_1.default.find({ contractorId: contractorId })];
            case 2:
                checkTakeTestAlready = _b.sent();
                if (checkTakeTestAlready.length < 1) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "start the quiz first" })];
                }
                return [4 /*yield*/, contractorQuiz_model_1.default.countDocuments({ contractorId: contractorId, mark: "pass" })];
            case 3:
                totalPass = _b.sent();
                return [4 /*yield*/, contractorQuiz_model_1.default.countDocuments({ contractorId: contractorId, })];
            case 4:
                totalQustion = _b.sent();
                res.json({
                    totalPass: totalPass,
                    totalQustion: totalQustion
                });
                return [3 /*break*/, 6];
            case 5:
                err_4 = _b.sent();
                // signup error
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.contractionGetQuizRrsultController = contractionGetQuizRrsultController;
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
