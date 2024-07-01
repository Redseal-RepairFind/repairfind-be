"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = exports.REVIEW_TYPE = void 0;
var mongoose_1 = require("mongoose");
var REVIEW_TYPE;
(function (REVIEW_TYPE) {
    REVIEW_TYPE["JOB_COMPLETION"] = "JOB_COMPLETION";
    REVIEW_TYPE["JOB_CANCELATION"] = "JOB_CANCELATION";
    REVIEW_TYPE["TRAINING_COMPLETION"] = "TRAINING_COMPLETION";
})(REVIEW_TYPE || (exports.REVIEW_TYPE = REVIEW_TYPE = {}));
var ReviewSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    averageRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // Adjust based on your rating scale
    },
    ratings: {
        type: [{ item: String, rating: Number }],
    },
    comment: {
        type: String,
    },
    job: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    type: {
        type: String,
        enum: Object.values(REVIEW_TYPE),
        default: REVIEW_TYPE.JOB_COMPLETION
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.ReviewModel = (0, mongoose_1.model)("reviews", ReviewSchema);
