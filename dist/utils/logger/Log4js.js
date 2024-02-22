"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log4js = void 0;
var log4js_1 = __importDefault(require("log4js"));
var Log4js = /** @class */ (function () {
    function Log4js(options) {
        var _a;
        log4js_1.default.configure({
            appenders: (_a = {}, _a[options.id] = { type: 'console', layout: { type: 'basic' } }, _a),
            categories: { default: { appenders: [options.id], level: options.level || 'error' } }
        });
        this.logger = log4js_1.default.getLogger(options.id);
    }
    Log4js.prototype.Info = function () {
        var info = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            info[_i] = arguments[_i];
        }
        this.logger.info(this.SerializeMessage(info));
    };
    Log4js.prototype.Error = function () {
        var error = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            error[_i] = arguments[_i];
        }
        this.logger.error(this.SerializeMessage(error));
    };
    Log4js.prototype.Warn = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.logger.warn(this.SerializeMessage(message));
    };
    Log4js.prototype.SerializeMessage = function (message) {
        return message.map(function (m) { return typeof m === 'object' ? JSON.stringify(m) : m; }).join(' ');
    };
    return Log4js;
}());
exports.Log4js = Log4js;
