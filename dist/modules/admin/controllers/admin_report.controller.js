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
exports.AdminReportController = exports.deleteReport = exports.updateReport = exports.getReportById = exports.getAllReports = exports.addReport = void 0;
var express_validator_1 = require("express-validator");
var abuse_reports_model_1 = require("../../../database/common/abuse_reports.model");
var custom_errors_1 = require("../../../utils/custom.errors");
// Add a new report
var addReport = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, reporter, reporterType, reported, reportedType, type, comment, status_1, action, admin, errors, newReport, savedReport, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, reporter = _a.reporter, reporterType = _a.reporterType, reported = _a.reported, reportedType = _a.reportedType, type = _a.type, comment = _a.comment, status_1 = _a.status, action = _a.action, admin = _a.admin;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() })];
                }
                newReport = new abuse_reports_model_1.AbuseReportModel({
                    reporter: reporter,
                    reporterType: reporterType,
                    reported: reported,
                    reportedType: reportedType,
                    type: type,
                    comment: comment,
                    status: status_1,
                    action: action,
                    admin: admin
                });
                return [4 /*yield*/, newReport.save()];
            case 1:
                savedReport = _b.sent();
                return [2 /*return*/, res.status(201).json({ success: true, message: 'Report successfully created', data: savedReport })];
            case 2:
                err_1 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('Error occurred creating report', err_1))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addReport = addReport;
// Get all reports
var getAllReports = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var reports, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, abuse_reports_model_1.AbuseReportModel.find().populate('reporterDetails reportedDetails')];
            case 1:
                reports = _a.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Reports retrieved successfully', data: reports })];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('Error occurred retrieving reports', err_2))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllReports = getAllReports;
// Get a single report by ID
var getReportById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, report, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, abuse_reports_model_1.AbuseReportModel.findById(id).populate('reporterDetails reportedDetails')];
            case 1:
                report = _a.sent();
                if (!report) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Report not found' })];
                }
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Report retrieved successfully', data: report })];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('Error occurred retrieving report', err_3))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getReportById = getReportById;
// Update a report by ID
var updateReport = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, status_2, action, admin, errors, updatedReport, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, status_2 = _a.status, action = _a.action;
                admin = req.admin.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() })];
                }
                return [4 /*yield*/, abuse_reports_model_1.AbuseReportModel.findByIdAndUpdate(id, { status: status_2, action: action, admin: admin }, { new: true, runValidators: true }).populate('reporterDetails reportedDetails')];
            case 1:
                updatedReport = _b.sent();
                if (!updatedReport) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Report not found' })];
                }
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Report successfully updated', data: updatedReport })];
            case 2:
                err_4 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('Error occurred updating report', err_4))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateReport = updateReport;
// Delete a report by ID
var deleteReport = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deletedReport, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, abuse_reports_model_1.AbuseReportModel.findByIdAndDelete(id)];
            case 1:
                deletedReport = _a.sent();
                if (!deletedReport) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Report not found' })];
                }
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Report successfully deleted' })];
            case 2:
                err_5 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('Error occurred deleting report', err_5))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteReport = deleteReport;
// Export controller methods
exports.AdminReportController = {
    addReport: exports.addReport,
    getAllReports: exports.getAllReports,
    getReportById: exports.getReportById,
    updateReport: exports.updateReport,
    deleteReport: exports.deleteReport
};
