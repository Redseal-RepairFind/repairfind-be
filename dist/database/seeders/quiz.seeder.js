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
exports.QuizSeeder = void 0;
var quiz_model_1 = __importDefault(require("../admin/models/quiz.model"));
var question_model_1 = __importDefault(require("../admin/models/question.model"));
var QuizSeeder = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, quizzes_1, quizData, video_url, questions, existingQuiz, newQuiz, createdQuestionRefs, _a, questions_1, questionData, question, options_1, answer, newQuestion, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                _i = 0, quizzes_1 = quizzes;
                _b.label = 1;
            case 1:
                if (!(_i < quizzes_1.length)) return [3 /*break*/, 10];
                quizData = quizzes_1[_i];
                video_url = quizData.video_url, questions = quizData.questions;
                return [4 /*yield*/, quiz_model_1.default.findOne({ video_url: video_url })];
            case 2:
                existingQuiz = _b.sent();
                if (existingQuiz)
                    return [3 /*break*/, 9]; // Skip if the quiz already exists
                return [4 /*yield*/, quiz_model_1.default.create({
                        video_url: video_url,
                        questions: [], // Initially empty, we'll fill this in later
                    })];
            case 3:
                newQuiz = _b.sent();
                createdQuestionRefs = [];
                _a = 0, questions_1 = questions;
                _b.label = 4;
            case 4:
                if (!(_a < questions_1.length)) return [3 /*break*/, 7];
                questionData = questions_1[_a];
                question = questionData.question, options_1 = questionData.options, answer = questionData.answer;
                return [4 /*yield*/, question_model_1.default.create({
                        quiz: newQuiz._id,
                        question: question,
                        options: options_1,
                        answer: answer,
                    })];
            case 5:
                newQuestion = _b.sent();
                // Store the reference to the created question
                createdQuestionRefs.push(newQuestion._id);
                _b.label = 6;
            case 6:
                _a++;
                return [3 /*break*/, 4];
            case 7: 
            // Update the quiz with the references to the created questions
            return [4 /*yield*/, quiz_model_1.default.findByIdAndUpdate(newQuiz._id, { questions: createdQuestionRefs }, { new: true })];
            case 8:
                // Update the quiz with the references to the created questions
                _b.sent();
                console.log("Quiz for video ".concat(video_url, " and its questions successfully seeded"));
                _b.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 1];
            case 10: return [3 /*break*/, 12];
            case 11:
                error_1 = _b.sent();
                console.log("Error seeding quizzes:", error_1);
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.QuizSeeder = QuizSeeder;
var quizzes = [{
        "video_url": "https://contractorapp.s3.eu-west-3.amazonaws.com/y2mate.com+-+RepairFind_480dp.mp4",
        "questions": [
            {
                "question": "What are the five chapters of basic customer service mentioned in the video?",
                "options": ["The Beginning, Kindness, Positivity, Honesty, Communication", "The First Impression, Courtesy, A Positive Attitude, Ethical Behavior, Effective Communication", "Introduction, Respect, Optimism, Integrity, Dialogue"],
                "answer": ["The First Impression, Courtesy, A Positive Attitude, Ethical Behavior, Effective Communication"]
            },
            {
                "question": "According to the video, how does it characterize customers in terms of marketing?",
                "options": ["Passive Observers", "Valuable Assets", "Unimportant Entities"],
                "answer": ["Valuable Assets"]
            },
            {
                "question": "Why does the video emphasize the significance of leaving a positive impression?",
                "options": ["It's Politically Correct", "It Leads to Referrals and More Jobs", "It's a Trendy Concept"],
                "answer": ["It Leads to Referrals and More Jobs"]
            },
            {
                "question": "How does the video describe the negative impact of poor communication on a service provider's expertise?",
                "options": ["It Enhances Expertise", "It Highlights Expertise", "It Overshadows Expertise"],
                "answer": ["It Overshadows Expertise"]
            },
            {
                "question": "How does the video introduce the character who is new compared to David?",
                "options": ["As Arrogant", "As Late Arriving", "As Fairly New, Arriving Early, Polite, and Respectful"],
                "answer": ["As Fairly New, Arriving Early, Polite, and Respectful"]
            },
            {
                "question": "What qualities does the video consider as exemplary professionalism, especially in the context of Repair Find?",
                "options": ["Punctuality and Disregard for Cleanliness", "Arriving Early, Politeness, Respect, and Thoughtfulness", "Lack of Respect and Thoughtfulness"],
                "answer": ["Arriving Early, Politeness, Respect, and Thoughtfulness"]
            },
            {
                "question": "According to the video, why does Repair Find value small but significant gestures in professionalism?",
                "options": ["They Are Insignificant", "They Contribute to the Customer Service Experience", "They Don't Matter"],
                "answer": ["They Contribute to the Customer Service Experience"]
            },
            {
                "question": "According to the video, what are the elements that count in customer service?",
                "options": ["Only Communication", "Appearance, Mannerisms, and Communication", "Appearance Only"],
                "answer": ["Appearance, Mannerisms, and Communication"]
            },
            {
                "question": "How does the video characterize the initial interaction in customer service?",
                "options": ["Unimportant for Relationships", "Only Relevant in Person", "Lays the Groundwork for a Successful Relationship"],
                "answer": ["Lays the Groundwork for a Successful Relationship"]
            },
            {
                "question": "According to the video, how does an excellent first impression impact the dynamics of customer service?",
                "options": ["It Doesn't Matter", "It Leads to Referrals and More Jobs", "It Hinders Customer Relations"],
                "answer": ["It Leads to Referrals and More Jobs"]
            }
        ]
    }];
