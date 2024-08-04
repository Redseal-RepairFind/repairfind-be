"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var corsMiddleware = function (app) {
    app.use((0, cors_1.default)({ origin: '*' }));
};
exports.default = corsMiddleware;
