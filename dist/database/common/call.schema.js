"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallModel = exports.CallSchema = void 0;
var mongoose_1 = __importStar(require("mongoose"));
exports.CallSchema = new mongoose_1.Schema({
    fromUser: { type: String, required: true },
    fromUserType: { type: String, required: true },
    toUser: { type: String, required: true },
    toUserType: { type: String, required: true },
    startTime: { type: Date, required: false },
    endTime: { type: Date, required: false },
    durationSeconds: { type: Number, required: false },
    callStatus: {
        type: String,
        enum: ['answered', 'missed', 'rejected', 'ended'],
        required: false,
    },
    recordingUrl: { type: String },
    // Add any other relevant fields here
}, { timestamps: true });
exports.CallModel = mongoose_1.default.model('calls', exports.CallSchema);
