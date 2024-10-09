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
exports.PromotionController = exports.deletePromotion = exports.updatePromotion = exports.addPromotion = exports.getSinglePromotion = exports.getPromotions = void 0;
var express_validator_1 = require("express-validator");
var custom_errors_1 = require("../../../utils/custom.errors");
var promotion_schema_1 = require("../../../database/common/promotion.schema");
var api_feature_1 = require("../../../utils/api.feature");
// retrieve promotions
var getPromotions = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, error, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(promotion_schema_1.PromotionModel.find({}), req.query)];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                return [2 /*return*/, res.json({ success: true, message: "Promotions retrieved successfully.", data: data })];
            case 2:
                err_1 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred while retrieving promotions", err_1))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPromotions = getPromotions;
// Delete a promotion
var getSinglePromotion = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, promotion, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, promotion_schema_1.PromotionModel.findById(id)];
            case 1:
                promotion = _a.sent();
                if (!promotion) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Promotion not found." })];
                }
                //TODO: Prevent deletion if promotion has been used
                return [2 /*return*/, res.json({ success: true, message: "Promotion  retrieved.", data: promotion })];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred while retrieving promotion", err_2))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSinglePromotion = getSinglePromotion;
// Add a new promotion
var addPromotion = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, code, startDate, endDate, target, criteria, value, valueType, description, status_1, errors, newPromotion, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_1 = _a.name, code = _a.code, startDate = _a.startDate, endDate = _a.endDate, target = _a.target, criteria = _a.criteria, value = _a.value, valueType = _a.valueType, description = _a.description, status_1 = _a.status;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() })];
                }
                newPromotion = new promotion_schema_1.PromotionModel({
                    name: name_1,
                    code: code,
                    startDate: startDate,
                    endDate: endDate,
                    target: target,
                    criteria: criteria,
                    value: value,
                    valueType: valueType,
                    description: description,
                    status: status_1,
                });
                return [4 /*yield*/, newPromotion.save()];
            case 1:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, message: "Promotion successfully added.", data: newPromotion })];
            case 2:
                err_3 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred while adding promotion", err_3))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addPromotion = addPromotion;
// Update an existing promotion
var updatePromotion = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name_2, code, startDate, endDate, target, criteria, value, description, status_2, errors, updatedPromotion, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, name_2 = _a.name, code = _a.code, startDate = _a.startDate, endDate = _a.endDate, target = _a.target, criteria = _a.criteria, value = _a.value, description = _a.description, status_2 = _a.status;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() })];
                }
                return [4 /*yield*/, promotion_schema_1.PromotionModel.findByIdAndUpdate(id, { name: name_2, code: code, startDate: startDate, endDate: endDate, target: target, criteria: criteria, value: value, description: description, status: status_2 }, { new: true })];
            case 1:
                updatedPromotion = _b.sent();
                if (!updatedPromotion) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Promotion not found." })];
                }
                return [2 /*return*/, res.json({ success: true, message: "Promotion successfully updated.", data: updatedPromotion })];
            case 2:
                err_4 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred while updating promotion", err_4))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updatePromotion = updatePromotion;
// Delete a promotion
var deletePromotion = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deletedPromotion, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, promotion_schema_1.PromotionModel.findByIdAndDelete(id)];
            case 1:
                deletedPromotion = _a.sent();
                if (!deletedPromotion) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Promotion not found." })];
                }
                //TODO: Prevent deletion if promotion has been used
                return [2 /*return*/, res.json({ success: true, message: "Promotion successfully deleted.", data: deletedPromotion })];
            case 2:
                err_5 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error occurred while deleting promotion", err_5))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deletePromotion = deletePromotion;
exports.PromotionController = {
    addPromotion: exports.addPromotion,
    updatePromotion: exports.updatePromotion,
    deletePromotion: exports.deletePromotion,
    getPromotions: exports.getPromotions,
    getSinglePromotion: exports.getSinglePromotion,
};
