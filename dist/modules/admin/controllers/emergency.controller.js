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
exports.AdminEmergencyController = exports.resolveEmergency = exports.acceptEmergency = exports.getSingleEmergency = exports.getEmergencies = void 0;
var job_emergency_model_1 = require("../../../database/common/job_emergency.model");
var api_feature_1 = require("../../../utils/api.feature");
var custom_errors_1 = require("../../../utils/custom.errors");
var getEmergencies = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, adminId, filter, _b, data, error, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.query, page = _a.page, limit = _a.limit;
                adminId = req.admin.id;
                filter = {};
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_emergency_model_1.JobEmergencyModel.find(filter), req.query)];
            case 1:
                _b = _c.sent(), data = _b.data, error = _b.error;
                return [2 /*return*/, res.json({ success: true, message: "Job emergencies retrieved", data: data })];
            case 2:
                error_1 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occurred', error_1))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getEmergencies = getEmergencies;
//get single emergency /////////////
var getSingleEmergency = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var emergencyId, admin, adminId, jobEmergency, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                emergencyId = req.params.emergencyId;
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, job_emergency_model_1.JobEmergencyModel.findOne({ _id: emergencyId })
                        .populate([{
                            path: 'customer',
                            select: 'firstName lastName name profilePhoto _id'
                        }, {
                            path: 'contractor',
                            select: 'firstName lastName name profilePhoto _id'
                        }, { path: 'job' }])];
            case 1:
                jobEmergency = _a.sent();
                if (!jobEmergency) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Emergency not found" })];
                }
                return [2 /*return*/, res.json({ success: true, message: "Emergency retrieved", data: jobEmergency })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occurred', error_2))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleEmergency = getSingleEmergency;
//admin accept emergency /////////////
var acceptEmergency = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var emergencyId, adminId, jobEmergency, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                emergencyId = req.params.emergencyId;
                adminId = req.admin.id;
                return [4 /*yield*/, job_emergency_model_1.JobEmergencyModel.findOne({ _id: emergencyId })
                        .populate(['customer', 'contractor'])];
            case 1:
                jobEmergency = _a.sent();
                if (!jobEmergency) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid emergencyId" })];
                }
                if (jobEmergency.status !== job_emergency_model_1.EMERGENCY_STATUS.PENDING) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Job emergency is not pending" })];
                }
                jobEmergency.status = job_emergency_model_1.EMERGENCY_STATUS.IN_PROGRESS;
                jobEmergency.acceptedBy = adminId;
                return [4 /*yield*/, jobEmergency.save()];
            case 2:
                _a.sent();
                res.json({ success: true, message: "Emergency accepted successfully" });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occurred', error_3))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.acceptEmergency = acceptEmergency;
var resolveEmergency = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var emergencyId, resolvedWay, adminId, jobEmergency, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                emergencyId = req.params.emergencyId;
                resolvedWay = req.body.resolvedWay;
                adminId = req.admin.id;
                return [4 /*yield*/, job_emergency_model_1.JobEmergencyModel.findOne({ _id: emergencyId })];
            case 1:
                jobEmergency = _a.sent();
                if (!jobEmergency) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid emergencyId" })];
                }
                if (jobEmergency.status != job_emergency_model_1.EMERGENCY_STATUS.IN_PROGRESS) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Emergency is not pending" })];
                }
                jobEmergency.status = job_emergency_model_1.EMERGENCY_STATUS.RESOLVED;
                jobEmergency.resolvedWay = resolvedWay;
                return [4 /*yield*/, jobEmergency.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.json({ success: true, message: "emergency resolved successfully" })];
            case 3:
                error_4 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occurred', error_4))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.resolveEmergency = resolveEmergency;
exports.AdminEmergencyController = {
    getEmergencies: exports.getEmergencies,
    getSingleEmergency: exports.getSingleEmergency,
    acceptEmergency: exports.acceptEmergency,
    resolveEmergency: exports.resolveEmergency,
};
