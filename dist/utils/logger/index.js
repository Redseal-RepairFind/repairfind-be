"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var constants_1 = require("../../constants");
var LoggerFactory_1 = require("./LoggerFactory");
var Logger = LoggerFactory_1.LoggerFactory.configure({
    id: constants_1.APP_NAME,
    level: 'all'
});
exports.Logger = Logger;
