"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var configureParsers = function (app) {
    app.use(body_parser_1.default.json({
        verify: function (req, res, buf, encoding) {
            //@ts-ignore
            req.rawBody = buf.toString();
        }
    }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
};
exports.default = configureParsers;
