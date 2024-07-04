"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var sendSms = function (_a) {
    var to = _a.to, sms = _a.sms;
    var data = {
        to: to,
        from: "THERASWIFT",
        sms: sms,
        type: "plain",
        api_key: process.env.TERMI_API_KEY,
        channel: "generic",
    };
    console.log(to);
    console.log(sms);
    var options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    (0, node_fetch_1.default)("https://api.ng.termii.com/api/sms/send", options)
        .then(function (response) {
        console.log("sent message ", response.body);
    })
        .catch(function (error) {
        console.error(error);
        throw error;
    });
};
exports.sendSms = sendSms;
