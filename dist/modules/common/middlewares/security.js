"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var helmet_1 = __importDefault(require("helmet"));
var securityMiddleware = function (app) {
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false, // Disable CSP
        expectCt: { enforce: true, maxAge: 30 },
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }));
};
exports.default = securityMiddleware;
