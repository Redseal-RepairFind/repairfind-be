"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ContractorQuizSchema = new mongoose_1.Schema({
    contractorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'ContractorReg',
        required: true,
    },
    questionId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'question',
        required: true,
    },
    answer: {
        type: [String],
        default: [],
    },
    mark: {
        type: String,
        enum: ["pass", "fail"],
        default: "fail",
    },
    answered: {
        type: String,
        enum: ["yes", "no"],
        default: "no",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
var ContractorQuizeModel = (0, mongoose_1.model)("ContractorQuiz", ContractorQuizSchema);
exports.default = ContractorQuizeModel;
