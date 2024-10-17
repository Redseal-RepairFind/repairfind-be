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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppVersionController = exports.deleteAppVersion = exports.updateAppVersion = exports.getAppVersionById = exports.getAppVersions = exports.addAppVersion = void 0;
var express_validator_1 = require("express-validator");
var custom_errors_1 = require("../../../utils/custom.errors");
var app_versions_model_1 = require("../../../database/common/app_versions.model");
var addAppVersion = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, version, changelogs, type, status_1, isCurrent, app, errors, newAppVersion, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, version = _a.version, changelogs = _a.changelogs, type = _a.type, status_1 = _a.status, isCurrent = _a.isCurrent, app = _a.app;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() })];
                }
                if (!isCurrent) return [3 /*break*/, 2];
                return [4 /*yield*/, app_versions_model_1.AppVersionModel.updateMany({ isCurrent: true }, { $set: { isCurrent: false } })];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2: return [4 /*yield*/, app_versions_model_1.AppVersionModel.findOneAndUpdate({ version: version, type: type, app: app }, { version: version, changelogs: changelogs, type: type, status: status_1, isCurrent: isCurrent, app: app }, { upsert: true, new: true })];
            case 3:
                newAppVersion = _b.sent();
                return [2 /*return*/, res.json({ success: true, message: "App version successfully added or updated.", data: { newAppVersion: newAppVersion } })];
            case 4:
                err_1 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred while adding or updating app version", err_1))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addAppVersion = addAppVersion;
var getAppVersions = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, appVersions, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, app_versions_model_1.AppVersionModel.find()];
            case 1:
                appVersions = _a.sent();
                res.json({ success: true, message: "App versions retrieved successfully", data: appVersions });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred while retrieving app versions", err_2))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAppVersions = getAppVersions;
var getAppVersionById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, errors, appVersion, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, app_versions_model_1.AppVersionModel.findById(id)];
            case 1:
                appVersion = _a.sent();
                if (!appVersion) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "App version not found" })];
                }
                res.json({ success: true, message: "App version retrieved successfully", data: appVersion });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred while retrieving app version", err_3))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAppVersionById = getAppVersionById;
var updateAppVersion = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, version, changelogs, type, status_2, isCurrent, app, errors, updatedAppVersion, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                id = req.params.id;
                _a = req.body, version = _a.version, changelogs = _a.changelogs, type = _a.type, status_2 = _a.status, isCurrent = _a.isCurrent, app = _a.app;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                if (!isCurrent) return [3 /*break*/, 2];
                return [4 /*yield*/, app_versions_model_1.AppVersionModel.updateMany({ isCurrent: true }, { $set: { isCurrent: false } })];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2: return [4 /*yield*/, app_versions_model_1.AppVersionModel.findByIdAndUpdate(id, { version: version, changelogs: changelogs, type: type, status: status_2, isCurrent: isCurrent, app: app }, { new: true })];
            case 3:
                updatedAppVersion = _b.sent();
                if (!updatedAppVersion) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "App version not found" })];
                }
                res.json({ success: true, message: "App version updated successfully", data: updatedAppVersion });
                return [3 /*break*/, 5];
            case 4:
                err_4 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred while updating app version", err_4))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateAppVersion = updateAppVersion;
var deleteAppVersion = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, errors, deletedAppVersion, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, app_versions_model_1.AppVersionModel.findByIdAndDelete(id)];
            case 1:
                deletedAppVersion = _a.sent();
                if (!deletedAppVersion) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "App version not found" })];
                }
                res.json({ success: true, message: "App version deleted successfully" });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred while deleting app version", err_5))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteAppVersion = deleteAppVersion;
exports.AppVersionController = {
    addAppVersion: exports.addAppVersion,
    getAppVersions: exports.getAppVersions,
    getAppVersionById: exports.getAppVersionById,
    updateAppVersion: exports.updateAppVersion,
    deleteAppVersion: exports.deleteAppVersion,
};
