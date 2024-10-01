"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.i18n = exports.freeCloudTranslate = void 0;
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var logger_1 = require("../services/logger");
var google_1 = require("../services/google");
var config_1 = require("../config");
//@ts-ignore
var translate_1 = require("translate");
// Load a JSON file and parse it
function loadTranslations(filePath) {
    var jsonData = (0, fs_1.readFileSync)(filePath, 'utf8');
    return JSON.parse(jsonData);
}
// Define the path to the general.json file
var generalTranslationsPath = path_1.default.join(__dirname, '..', '..', 'locale', 'general.json');
// Load all translations from different files
var translations = __assign(__assign(__assign(__assign({}, loadTranslations(generalTranslationsPath)), loadTranslations(path_1.default.join(__dirname, '..', '..', 'locale', 'notifications.json'))), loadTranslations(path_1.default.join(__dirname, '..', '..', 'locale', 'api_response.json'))), loadTranslations(path_1.default.join(__dirname, '..', '..', 'locale', 'email.json')));
// Slugify function to convert plain English text to a slug
function slugify(text) {
    return text
        .toString()
        .normalize("NFD") // Normalize the string (decomposing accents)
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
        .trim() // Remove leading/trailing whitespace
        .replace(/[^a-zA-Z0-9]+/g, "_") // Replace any sequence of non-alphanumeric characters with underscores
        .replace(/_{2,}/g, "_") // Replace consecutive underscores with a single underscore
        .replace(/^_+|_+$/g, "") // Remove leading or trailing underscores
        .toLowerCase(); // Convert the string to lowercase
}
// Function to save new translations to general.json
function saveTranslationToFile(slug, lang, translatedText) {
    var currentTranslations = loadTranslations(generalTranslationsPath);
    // Update the translation object
    if (!currentTranslations[slug]) {
        currentTranslations[slug] = {};
    }
    // Add the translated text for the target language
    currentTranslations[slug][lang] = translatedText;
    // Write the updated translations back to the general.json file
    (0, fs_1.writeFileSync)(generalTranslationsPath, JSON.stringify(currentTranslations, null, 2), 'utf8');
    logger_1.Logger.info("New translation saved for '".concat(slug, "' in language '").concat(lang, "' to general.json."));
}
// Updated function to get translation with fallback to Google Translate API
function getTranslation(_a) {
    var phraseOrSlug = _a.phraseOrSlug, _b = _a.lang, lang = _b === void 0 ? 'en' : _b, _c = _a.saveToFile, saveToFile = _c === void 0 ? true : _c, _d = _a.contentType, contentType = _d === void 0 ? 'text' : _d, _e = _a.useGoogle, useGoogle = _e === void 0 ? false : _e;
    return __awaiter(this, void 0, void 0, function () {
        var slug, translatedText, error_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 5, , 6]);
                    // Check if the provided input is already a valid slug
                    if (translations[phraseOrSlug] && translations[phraseOrSlug][lang]) {
                        return [2 /*return*/, translations[phraseOrSlug][lang]];
                    }
                    slug = slugify(phraseOrSlug);
                    if (translations[slug] && translations[slug][lang]) {
                        return [2 /*return*/, translations[slug][lang]];
                    }
                    // If no translation is found, fall back to Google Translate API
                    logger_1.Logger.info("No local translation found for '".concat(phraseOrSlug, "', using Google Translate..."));
                    translatedText = phraseOrSlug;
                    if (!useGoogle) return [3 /*break*/, 2];
                    return [4 /*yield*/, google_1.GoogleServiceProvider.translate.translateText({ text: phraseOrSlug, targetLang: lang, format: contentType })];
                case 1:
                    translatedText = _f.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, freeCloudTranslate(phraseOrSlug, lang)];
                case 3:
                    translatedText = _f.sent();
                    _f.label = 4;
                case 4:
                    // translatedText = await GoogleServiceProvider.translate.translateText({text: phraseOrSlug, targetLang: lang, format: contentType });
                    // Save the new translation to general.json for future use
                    if (saveToFile) {
                        saveTranslationToFile(slug, lang, translatedText);
                    }
                    return [2 /*return*/, translatedText];
                case 5:
                    error_1 = _f.sent();
                    logger_1.Logger.error('Error getting translation:', error_1);
                    return [2 /*return*/, phraseOrSlug];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function freeCloudTranslate(text, targetLang, sourceLang) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var translate, translatedText, error_2;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    if (!text || !targetLang) {
                        throw new Error('Text, source language, and target language are required');
                    }
                    translate = (0, translate_1.Translate)({ engine: config_1.config.i18n.engine, key: config_1.config.i18n.key });
                    return [4 /*yield*/, translate(text, targetLang)];
                case 1:
                    translatedText = _e.sent();
                    return [2 /*return*/, translatedText];
                case 2:
                    error_2 = _e.sent();
                    logger_1.Logger.error('Error translating text:', (_a = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _a === void 0 ? void 0 : _a.data);
                    throw new Error((_d = (_c = (_b = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.message);
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.freeCloudTranslate = freeCloudTranslate;
exports.i18n = {
    getTranslation: getTranslation,
    freeCloudTranslate: freeCloudTranslate
};
