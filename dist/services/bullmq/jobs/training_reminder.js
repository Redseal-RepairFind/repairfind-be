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
exports.quizReminderCheck = exports.QUIZ_REMINDER = void 0;
var __1 = require("../..");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var contractor_quiz_model_1 = __importDefault(require("../../../database/contractor/models/contractor_quiz.model"));
var logger_1 = require("../../logger");
exports.QUIZ_REMINDER = {
    NOT_TAKEN: 'NOT_TAKEN',
    FAILED: 'FAILED',
    DAYS_1: 'DAYS_1',
    DAYS_3: 'DAYS_3',
    DAYS_7: 'DAYS_7',
};
var quizReminderCheck = function () { return __awaiter(void 0, void 0, void 0, function () {
    var contractors, _i, contractors_1, contractor, latestQuiz, currentDate, quizTakenDate, daysSinceQuizTaken, result, error_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                return [4 /*yield*/, contractor_model_1.ContractorModel.find({})];
            case 1:
                contractors = _a.sent();
                _i = 0, contractors_1 = contractors;
                _a.label = 2;
            case 2:
                if (!(_i < contractors_1.length)) return [3 /*break*/, 8];
                contractor = contractors_1[_i];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 6, , 7]);
                return [4 /*yield*/, contractor_quiz_model_1.default.findOne({ contractor: contractor._id }).sort({ createdAt: -1 })];
            case 4:
                latestQuiz = _a.sent();
                currentDate = new Date();
                quizTakenDate = latestQuiz ? new Date(latestQuiz.createdAt) : null;
                daysSinceQuizTaken = quizTakenDate ? Math.floor((currentDate.getTime() - quizTakenDate.getTime()) / (1000 * 60 * 60 * 24)) : null;
                if (!latestQuiz) {
                    sendReminderContractor(contractor, "You have not taken or passed the mandatory quiz yet. Please complete it as soon as possible.");
                    return [3 /*break*/, 7];
                }
                return [4 /*yield*/, latestQuiz.result
                    // sendReminderContractor(contractor, `It's been 1 day since you took the quiz. Please review and retake if needed.`);
                    // sendReminderContractor(contractor, `You did not pass the quiz. Please retake it as soon as possible.`);
                ];
            case 5:
                result = _a.sent();
                // sendReminderContractor(contractor, `It's been 1 day since you took the quiz. Please review and retake if needed.`);
                // sendReminderContractor(contractor, `You did not pass the quiz. Please retake it as soon as possible.`);
                logger_1.Logger.info("Processed quiz reminder for contractor: ".concat(contractor._id));
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                logger_1.Logger.error("Error sending quiz reminder for contractor ID ".concat(contractor._id, ":"), error_1);
                return [3 /*break*/, 7];
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8: return [3 /*break*/, 10];
            case 9:
                error_2 = _a.sent();
                logger_1.Logger.error('Error fetching contractors for quiz reminders:', error_2);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.quizReminderCheck = quizReminderCheck;
function sendReminderContractor(contractor, message) {
    var _a;
    __1.NotificationService.sendNotification({
        user: contractor._id,
        userType: 'contractors',
        title: 'Quiz Reminder',
        type: 'QUIZ_REMINDER',
        message: message,
        heading: { name: contractor.name, image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
        payload: {
            entity: contractor._id,
            entityType: 'contractors',
            message: message,
            event: 'QUIZ_REMINDER',
        }
    }, { push: true, socket: true });
}
