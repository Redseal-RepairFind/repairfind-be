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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminStaffController = exports.removePermissionFromStaff = exports.addPermissionToStaff = exports.addStaff = exports.changeStaffStatus = exports.getAdminStaffs = void 0;
var express_validator_1 = require("express-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var otpGenerator_1 = require("../../../utils/otpGenerator");
var admin_interface_1 = require("../../../database/admin/interface/admin.interface");
var permission_model_1 = __importDefault(require("../../../database/admin/models/permission.model"));
var custom_errors_1 = require("../../../utils/custom.errors");
var api_feature_1 = require("../../../utils/api.feature");
var services_1 = require("../../../services");
var generic_email_1 = require("../../../templates/common/generic_email");
var getAdminStaffs = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, admin, adminId, checkAdmin, _b, data, error, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _c.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Only super admin can perform this action" })];
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(admin_model_1.default.find()
                        .select('-password')
                        .populate({ path: 'permissions', model: 'permissions', select: '_id name' }), req.query)];
            case 2:
                _b = _c.sent(), data = _b.data, error = _b.error;
                return [2 /*return*/, res.json({ success: true, data: data })];
            case 3:
                error_1 = _c.sent();
                next(new custom_errors_1.InternalServerError("An error occurred", error_1));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAdminStaffs = getAdminStaffs;
var changeStaffStatus = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, staffId, status_1, errors, admin, adminId, checkAdmin, subAdmin, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, staffId = _a.staffId, status_1 = _a.status;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _b.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "super admin role" })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: staffId })];
            case 2:
                subAdmin = _b.sent();
                if (!subAdmin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "staff does not exist" })];
                }
                subAdmin.status = status_1;
                return [4 /*yield*/, subAdmin.save()];
            case 3:
                _b.sent();
                res.json({
                    message: "staff status change to ".concat(status_1),
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                next(new custom_errors_1.InternalServerError("An error occurred", error_2));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.changeStaffStatus = changeStaffStatus;
var addStaff = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, _b, password, firstName, lastName, phoneNumber, permisions, errors, admin, adminId, checkAdmin, adminEmailExists, superAdmin, validation, otp, createdTime, emailOtp, hashedPassword, emailSubject, emailContent, html, newStaff, staffSaved, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, _b = _a.password, password = _b === void 0 ? (0, otpGenerator_1.generateOTP)() : _b, firstName = _a.firstName, lastName = _a.lastName, phoneNumber = _a.phoneNumber, permisions = _a.permisions;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _c.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "You do not have permission to perform this action" })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ email: email })];
            case 2:
                adminEmailExists = _c.sent();
                superAdmin = false;
                validation = true;
                // check if user exists
                if (adminEmailExists) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Staff with same email already exists" })];
                }
                otp = (0, otpGenerator_1.generateOTP)();
                createdTime = new Date();
                emailOtp = {
                    otp: otp,
                    createdTime: createdTime,
                    verified: true
                };
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 3:
                hashedPassword = _c.sent();
                emailSubject = 'New Staff Account';
                emailContent = "\n                <p style=\"color: #333333;\">A staff account has been provisioned with your email on Repairfind</p>\n                <div style=\"background: whitesmoke;padding: 10px; border-radius: 10px;\">\n                <p style=\"border-bottom: 1px solid lightgray; padding-bottom: 5px;\"><strong>Temporary Password:</strong> ".concat(password, "</p>\n                </div>\n                <p style=\"color: #333333;\">Do well to login and change your password </p>\n                ");
                html = (0, generic_email_1.GenericEmailTemplate)({ name: firstName, subject: emailSubject, content: emailContent });
                services_1.EmailService.send(email, emailSubject, html);
                newStaff = new admin_model_1.default({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    superAdmin: superAdmin,
                    permissions: permisions,
                    status: admin_interface_1.AdminStatus.ACTIVE,
                    password: hashedPassword,
                    hasWeakPassword: true,
                    validation: validation,
                    emailOtp: emailOtp
                });
                return [4 /*yield*/, newStaff.save()];
            case 4:
                staffSaved = _c.sent();
                res.json({ success: true, message: "Admin Staff added successfully" });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _c.sent();
                next(new custom_errors_1.InternalServerError("An error occurred", error_3));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.addStaff = addStaff;
var addPermissionToStaff = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, staffId, permissions, errors, admin, adminId, checkAdmin, subAdmin, validPermissions, validPermissionIds_1, invalidPermissions, existingPermissions, newPermissions, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, staffId = _a.staffId, permissions = _a.permissions;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _b.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "You do not have permission to perform this action" })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: staffId })];
            case 2:
                subAdmin = _b.sent();
                if (!subAdmin) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ message: "staff does not exist" })];
                }
                return [4 /*yield*/, permission_model_1.default.find({ _id: { $in: permissions } })];
            case 3:
                validPermissions = _b.sent();
                if (!(validPermissions.length === 0)) return [3 /*break*/, 5];
                subAdmin.permissions = [];
                return [4 /*yield*/, subAdmin.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, res
                        .json({ message: "All permissions are invalid. Staff's permissions cleared.", addedPermissions: [], invalidPermissions: permissions })];
            case 5:
                validPermissionIds_1 = validPermissions.map(function (permission) { return permission._id.toString(); });
                invalidPermissions = permissions.filter(function (permission) { return !validPermissionIds_1.includes(permission); });
                existingPermissions = subAdmin.permissions.map(function (permission) { return permission.toString(); });
                newPermissions = Array.from(new Set(__spreadArray(__spreadArray([], existingPermissions, true), validPermissionIds_1, true)));
                // Check if the permission have changed
                if (existingPermissions.length === newPermissions.length) {
                    return [2 /*return*/, res.json({
                            success: true,
                            message: "No new persmissions added.",
                            addedPermissions: [],
                            invalidPermissions: invalidPermissions
                        })];
                }
                subAdmin.permissions = newPermissions;
                return [4 /*yield*/, subAdmin.save()];
            case 6:
                _b.sent();
                res.json({
                    message: "Permissions added successfully",
                    addedPermissions: validPermissions,
                    invalidPermissions: invalidPermissions
                });
                return [3 /*break*/, 8];
            case 7:
                error_4 = _b.sent();
                next(new custom_errors_1.InternalServerError("An error occurred", error_4));
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.addPermissionToStaff = addPermissionToStaff;
var removePermissionFromStaff = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, staffId, permision_1, errors, admin, adminId, checkAdmin, subAdmin, checkPermission, remainPermission, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, staffId = _a.staffId, permision_1 = _a.permision;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _b.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "You do not have permission to perform this action" })];
                }
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: staffId })];
            case 2:
                subAdmin = _b.sent();
                if (!subAdmin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Staff does not exist" })];
                }
                return [4 /*yield*/, permission_model_1.default.findOne({ _id: permision_1 })];
            case 3:
                checkPermission = _b.sent();
                if (!checkPermission) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid permission" })];
                }
                remainPermission = subAdmin.permissions.filter(function (availabePermission) {
                    return availabePermission != permision_1;
                });
                subAdmin.permissions = remainPermission;
                return [4 /*yield*/, subAdmin.save()];
            case 4:
                _b.sent();
                res.json({ success: true, message: "permission removed successfully" });
                return [3 /*break*/, 6];
            case 5:
                error_5 = _b.sent();
                next(new custom_errors_1.InternalServerError("An error occurred", error_5));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.removePermissionFromStaff = removePermissionFromStaff;
exports.AdminStaffController = {
    getAdminStaffs: exports.getAdminStaffs,
    changeStaffStatus: exports.changeStaffStatus,
    addStaff: exports.addStaff,
    addPermissionToStaff: exports.addPermissionToStaff,
    removePermissionFromStaff: exports.removePermissionFromStaff
};
