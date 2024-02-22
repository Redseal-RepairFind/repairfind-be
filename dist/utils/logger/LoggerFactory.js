"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerFactory = void 0;
var Log4js_1 = require("./Log4js");
var LoggerFactory = /** @class */ (function () {
    function LoggerFactory(options) {
        this.options = options;
        this.logger = new Log4js_1.Log4js(options);
    }
    LoggerFactory.configure = function (options) {
        return new LoggerFactory(options).logger;
    };
    return LoggerFactory;
}());
exports.LoggerFactory = LoggerFactory;
