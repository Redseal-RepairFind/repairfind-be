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
exports.Permission = exports.EditPermissionController = exports.GetPermissionController = exports.PermissionCreationController = void 0;
var express_validator_1 = require("express-validator");
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var permission_model_1 = __importDefault(require("../../../database/admin/models/permission.model"));
//super create permision /////////////
var PermissionCreationController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, errors, admin, adminId, checkAdmin, checkPermission, newPermission, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                name_1 = req.body.name;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                checkAdmin = _a.sent();
                if (!(checkAdmin === null || checkAdmin === void 0 ? void 0 : checkAdmin.superAdmin)) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "super admin role" })];
                }
                return [4 /*yield*/, permission_model_1.default.findOne({ name: name_1 })];
            case 2:
                checkPermission = _a.sent();
                if (checkPermission) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "permission already created" })];
                }
                newPermission = new permission_model_1.default({ name: name_1 });
                return [4 /*yield*/, newPermission.save()];
            case 3:
                _a.sent();
                res.json({
                    message: "permission created Successfully"
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.PermissionCreationController = PermissionCreationController;
//super get  permision /////////////
var GetPermissionController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, admin, adminId, checkAdmin, permissions, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body;
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
                return [4 /*yield*/, permission_model_1.default.find()];
            case 2:
                permissions = _b.sent();
                res.json({
                    permissions: permissions
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.GetPermissionController = GetPermissionController;
//super edit  permision /////////////
var EditPermissionController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_2, permissionId, errors, admin, adminId, checkAdmin, permission, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, name_2 = _a.name, permissionId = _a.permissionId;
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
                return [4 /*yield*/, permission_model_1.default.findOne({ _id: permissionId })];
            case 2:
                permission = _b.sent();
                if (!permission) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect permission ID" })];
                }
                permission.name = name_2;
                return [4 /*yield*/, permission.save()];
            case 3:
                _b.sent();
                res.json({
                    message: "permission updated successfully"
                });
                return [3 /*break*/, 5];
            case 4:
                err_3 = _b.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.EditPermissionController = EditPermissionController;
exports.Permission = {
    PermissionCreationController: exports.PermissionCreationController,
    GetPermissionController: exports.GetPermissionController,
    EditPermissionController: exports.EditPermissionController
};
