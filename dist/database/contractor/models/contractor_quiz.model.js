"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var QuestionResultSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
    },
    userAnswer: {
        type: String,
    },
    correct: {
        type: Boolean,
        default: false,
    },
}, { _id: false } // Disable _id for subdocuments
);
var ContractorQuizSchema = new mongoose_1.Schema({
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractors',
        required: true,
    },
    quiz: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'quizzes',
        required: true,
    },
    response: {
        type: [QuestionResultSchema],
        default: [],
    },
    result: {
        type: Object
    }
}, {
    timestamps: true,
});
var ContractorQuizModel = (0, mongoose_1.model)('contractor_quizzes', ContractorQuizSchema);
exports.default = ContractorQuizModel;
