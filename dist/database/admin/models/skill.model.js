"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var SkillRegSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
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
var SkillRegrModel = (0, mongoose_1.model)("SkillReg", SkillRegSchema);
exports.default = SkillRegrModel;
