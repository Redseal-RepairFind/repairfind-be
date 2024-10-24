"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = void 0;
var axios_1 = __importDefault(require("axios"));
var config_1 = require("../../config");
var logger_1 = require("../logger");
function translateText(_a) {
    var _b, _c, _d, _e;
    var text = _a.text, targetLang = _a.targetLang, sourceLang = _a.sourceLang, _f = _a.format, format = _f === void 0 ? 'plain' : _f, _g = _a.model, model = _g === void 0 ? 'text' : _g;
    return __awaiter(this, void 0, void 0, function () {
        var url, response, translatedText, error_1;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 2, , 3]);
                    if (!text || !targetLang) {
                        throw new Error('Text, source language, and target language are required');
                    }
                    url = "https://translation.googleapis.com/language/translate/v2?key=".concat(config_1.config.google.apiKey);
                    return [4 /*yield*/, axios_1.default.post(url, {}, {
                            params: {
                                q: text,
                                source: sourceLang || null,
                                target: targetLang,
                                key: config_1.config.google.apiKey,
                                // model: model,
                                format: format,
                            },
                        })];
                case 1:
                    response = _h.sent();
                    translatedText = response.data.data.translations[0].translatedText;
                    // const finalText = restoreExcludedWords(translatedText, wordsToExclude);
                    return [2 /*return*/, translatedText];
                case 2:
                    error_1 = _h.sent();
                    logger_1.Logger.error('Error translating text:', (_b = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _b === void 0 ? void 0 : _b.data);
                    throw new Error((_e = (_d = (_c = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.error) === null || _e === void 0 ? void 0 : _e.message);
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.translateText = translateText;
function excludeWords(text, wordsToExclude) {
    var modifiedText = text;
    wordsToExclude.forEach(function (word) {
        var placeholder = "{{EXCLUDE_".concat(word, "}}"); // Use more unique placeholder format
        modifiedText = modifiedText.replace(new RegExp("\\b".concat(word, "\\b"), 'g'), placeholder);
    });
    return modifiedText;
}
function restoreExcludedWords(translatedText, wordsToExclude) {
    var modifiedText = translatedText;
    wordsToExclude.forEach(function (word) {
        var placeholder = "{{EXCLUDE_".concat(word, "}}");
        modifiedText = modifiedText.replace(new RegExp(placeholder, 'g'), word); // Restore the original word
    });
    return modifiedText;
}
