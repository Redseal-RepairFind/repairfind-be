"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.Logger = void 0;
var constants_1 = require("../../constants");
var LoggerFactory_1 = require("./LoggerFactory");
var winston_1 = require("./winston");
Object.defineProperty(exports, "Log", { enumerable: true, get: function () { return winston_1.Log; } });
var Logger = LoggerFactory_1.LoggerFactory.configure({
    id: constants_1.APP_NAME,
    level: 'all'
});
exports.Logger = Logger;
