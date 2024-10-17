"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.TrainingController = exports.submitQuiz = exports.getQuiz = void 0;
var quiz_model_1 = __importDefault(require("../../../database/admin/models/quiz.model"));
var question_model_1 = __importDefault(require("../../../database/admin/models/question.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var contractor_quiz_model_1 = __importDefault(require("../../../database/contractor/models/contractor_quiz.model"));
var review_model_1 = require("../../../database/common/review.model");
var contractor_interface_1 = require("../../../database/contractor/interface/contractor.interface");
var services_1 = require("../../../services");
var getQuiz = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session, randomQuizzes, randomQuiz, randomQuestions, quizSession, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                session = req.query.session;
                if (!session) {
                    return [2 /*return*/, res.status(404).json({
                            status: false,
                            message: 'Session does not exists',
                        })];
                }
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
                quizSession = encodeURI("https://contractorapp.netlify.app/training?session=".concat(session));
                randomQuiz.session = quizSession;
                res.json({
                    status: true,
                    message: 'Quiz retrieved',
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
exports.getQuiz = getQuiz;
var submitQuiz = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, session, _a, contractorId, quizId, contractor, quiz, questions_1, quizResults, contractorQuiz, result, onboarding, ratings, review, existingReview, totalRatings, totalReviewScore, averageRating, newReview_1, foundIndex, err_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 11, , 12]);
                response = req.body.response;
                session = req.query.session;
                if (!session) {
                    return [2 /*return*/, res.status(404).json({
                            status: false,
                            message: 'Session does not exists',
                        })];
                }
                _a = session.split('%'), contractorId = _a[0], quizId = _a[1];
                console.log(contractorId, quizId);
                if (!response) {
                    return [2 /*return*/, res.status(404).json({
                            status: false,
                            message: 'Quiz response is required',
                        })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractor = _c.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(401).json({ message: 'Contractor not found' })];
                }
                return [4 /*yield*/, quiz_model_1.default.findOne({ _id: quizId })];
            case 2:
                quiz = _c.sent();
                if (!quiz) {
                    return [2 /*return*/, res.status(401).json({ message: 'Incorrect quiz ID' })];
                }
                return [4 /*yield*/, question_model_1.default.find({ quiz: quizId })];
            case 3:
                questions_1 = _c.sent();
                quizResults = response.map(function (userResponse) {
                    var question = questions_1.find(function (q) { return q.question === userResponse.question; });
                    if (!question) {
                        return {
                            question: userResponse.question,
                            userAnswer: userResponse.answer,
                            correct: false,
                        };
                    }
                    // Check if user's answer is in the array of correct answers
                    var isCorrect = question.answer.includes(userResponse.answer);
                    return {
                        question: userResponse.question,
                        userAnswer: userResponse.answer,
                        correct: isCorrect,
                    };
                });
                return [4 /*yield*/, contractor_quiz_model_1.default.findOneAndUpdate({ contractor: contractorId, quiz: quizId }, { $set: { response: quizResults } }, { new: true, upsert: true })];
            case 4:
                contractorQuiz = _c.sent();
                if (!contractorQuiz) {
                    return [2 /*return*/, res.status(500).json({ success: false, message: 'Failed to update or create ContractorQuiz' })];
                }
                return [4 /*yield*/, contractorQuiz.result];
            case 5:
                result = _c.sent();
                return [4 /*yield*/, contractor.getOnboarding()];
            case 6:
                onboarding = _c.sent();
                contractor.onboarding = onboarding;
                if (!onboarding.hasPassedQuiz) return [3 /*break*/, 10];
                ratings = [
                    { item: "Cleanliness", rating: 5 },
                    { item: "Skill", rating: 5 },
                    { item: "Communication", rating: 5 },
                    { item: "Timeliness", rating: 5 }
                ];
                review = 'Contractor has completed the basic customer service training with Repairfind and has attained a verification badge';
                return [4 /*yield*/, review_model_1.ReviewModel.findOne({ contractor: contractorId, type: review_model_1.REVIEW_TYPE.TRAINING_COMPLETION })];
            case 7:
                existingReview = _c.sent();
                if (!!existingReview) return [3 /*break*/, 10];
                totalRatings = ratings === null || ratings === void 0 ? void 0 : ratings.length;
                totalReviewScore = totalRatings ? ratings.reduce(function (a, b) { return a + b.rating; }, 0) : 0;
                averageRating = (totalRatings && totalReviewScore) > 0 ? totalReviewScore / totalRatings : 0;
                return [4 /*yield*/, review_model_1.ReviewModel.findOneAndUpdate({ contractor: contractorId, type: review_model_1.REVIEW_TYPE.TRAINING_COMPLETION }, {
                        averageRating: averageRating,
                        ratings: ratings,
                        // customer: job.customer,
                        contractor: contractorId,
                        comment: review,
                        type: review_model_1.REVIEW_TYPE.TRAINING_COMPLETION,
                        createdAt: new Date(),
                    }, { new: true, upsert: true })];
            case 8:
                newReview_1 = _c.sent();
                foundIndex = contractor.reviews.findIndex(function (review) { return review.review == newReview_1.id; });
                if (foundIndex !== -1) {
                    contractor.reviews[foundIndex] = { review: newReview_1.id, averageRating: averageRating };
                }
                else {
                    contractor.reviews.push({ review: newReview_1.id, averageRating: averageRating });
                }
                contractor.badge = { label: contractor_interface_1.CONTRACTOR_BADGE.TRAINING };
                return [4 /*yield*/, contractor.save()];
            case 9:
                _c.sent();
                _c.label = 10;
            case 10:
                services_1.NotificationService.sendNotification({
                    user: contractor.id,
                    userType: 'contractors',
                    title: 'Quiz Submitted',
                    type: 'QUIZ_SUBMITTED',
                    message: "You have completed repairfind basic training quiz",
                    heading: { name: "".concat(contractor.firstName, " ").concat(contractor.lastName), image: (_b = contractor.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                    payload: {
                        entity: contractor.id,
                        entityType: 'contractors',
                        message: "You have completed repairfind basic training quiz",
                        contractor: contractor.id,
                        event: 'QUIZ_SUBMITTED',
                    }
                }, { push: true, socket: true });
                res.json({
                    success: true,
                    message: 'Quiz submitted successfully',
                    data: __assign(__assign({}, contractorQuiz.toJSON()), { result: result, contractor: contractor }),
                });
                return [3 /*break*/, 12];
            case 11:
                err_1 = _c.sent();
                res.status(500).json({ success: false, message: err_1.message });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.submitQuiz = submitQuiz;
exports.TrainingController = {
    getQuiz: exports.getQuiz,
    submitQuiz: exports.submitQuiz
};
