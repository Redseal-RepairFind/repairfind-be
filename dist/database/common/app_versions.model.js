"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppVersionModel = void 0;
var mongoose_1 = require("mongoose");
var AppVersionSchema = new mongoose_1.Schema({
    version: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    changelogs: {
        type: [
            {
                title: { type: String, required: true },
                description: { type: String, required: true },
            },
        ],
        required: false,
    },
    type: {
        type: String,
        enum: ['IOS', 'ANDROID'],
        required: true,
    },
    status: {
        type: String,
        enum: ['beta', 'stable', 'alpha', 'release-candidate'],
        required: true,
    },
    isCurrent: { type: Boolean, default: false }
});
exports.AppVersionModel = (0, mongoose_1.model)("app_versions", AppVersionSchema);
