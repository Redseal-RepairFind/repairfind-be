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
exports.CustomerController = exports.updateOrCreateDevice = exports.myDevices = exports.changePassword = exports.getAccount = exports.updateAccount = void 0;
var express_validator_1 = require("express-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var customer_devices_model_1 = __importDefault(require("../../../database/customer/models/customer_devices.model"));
var updateAccount = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, lastName, location_1, phoneNumber, profilePhoto, errors, customerId, customer, updatedCustomer, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, location_1 = _a.location, phoneNumber = _a.phoneNumber, profilePhoto = _a.profilePhoto;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Account not found" })];
                }
                return [4 /*yield*/, customer_model_1.default.findOneAndUpdate({ _id: customerId }, {
                        firstName: firstName,
                        lastName: lastName,
                        phoneNumber: phoneNumber,
                        location: location_1,
                        profilePhoto: profilePhoto
                    }, { new: true })];
            case 2:
                updatedCustomer = _b.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: "Customer account successfully updated", data: updatedCustomer })];
            case 3:
                err_1 = _b.sent();
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateAccount = updateAccount;
var getAccount = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, includeStripeIdentity, includeStripeCustomer, includeStripePaymentMethods, includedFields, customer, customerResponse, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                customerId = req.customer.id;
                includeStripeIdentity = false;
                includeStripeCustomer = false;
                includeStripePaymentMethods = false;
                // Parse the query parameter "include" to determine which fields to include
                if (req.query.include) {
                    includedFields = req.query.include.split(',');
                    includeStripeIdentity = includedFields.includes('stripeIdentity');
                    includeStripeCustomer = includedFields.includes('stripeCustomer');
                    includeStripePaymentMethods = includedFields.includes('stripePaymentMethods');
                }
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 1:
                customer = _a.sent();
                // Check if the customer exists
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Customer account not found' })];
                }
                customerResponse = customer.toJSON({ includeStripeIdentity: true, includeStripeCustomer: true, includeStripePaymentMethods: true });
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Customer account retrieved successfully', data: customerResponse })];
            case 2:
                err_2 = _a.sent();
                // Handle errors
                console.error('Error fetching customer account:', err_2);
                return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal Server Error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAccount = getAccount;
var changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, currentPassword, newPassword, customerId, customer, isPasswordValid, hashedPassword, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 1:
                customer = _b.sent();
                // Check if the user exists
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'User not found' })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(currentPassword, customer.password)];
            case 2:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'Current password is incorrect' })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
            case 3:
                hashedPassword = _b.sent();
                // Update the user's password
                customer.password = hashedPassword;
                return [4 /*yield*/, customer.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, message: 'Password changed successfully' })];
            case 5:
                error_1 = _b.sent();
                console.error('Error changing password:', error_1);
                return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal Server Error' })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.changePassword = changePassword;
var myDevices = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, customer, devices, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 1:
                customer = _c.sent();
                // Check if the user exists
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Customer not found' })];
                }
                return [4 /*yield*/, customer_devices_model_1.default.find({ customer: customerId })];
            case 2:
                devices = _c.sent();
                return [2 /*return*/, res.json({ success: true, message: 'Customer devices retrieved', data: devices })];
            case 3:
                error_2 = _c.sent();
                console.error('Error retrieving contractor devices:', error_2);
                return [2 /*return*/, res.status((_a = error_2.code) !== null && _a !== void 0 ? _a : 500).json({ success: false, message: (_b = error_2.message) !== null && _b !== void 0 ? _b : 'Internal Server Error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.myDevices = myDevices;
var updateOrCreateDevice = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, deviceId, deviceType, deviceToken, customerId, customer, device, customerDevice, error_3;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _a = req.body, deviceId = _a.deviceId, deviceType = _a.deviceType, deviceToken = _a.deviceToken;
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 1:
                customer = _d.sent();
                // Check if the user exists
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Customer not found' })];
                }
                return [4 /*yield*/, customer_devices_model_1.default.find({ deviceId: deviceId, deviceToken: deviceToken })];
            case 2:
                device = _d.sent();
                if (device) {
                    //return res.status(404).json({ success: false, message: 'Device already exits' });
                }
                return [4 /*yield*/, customer_devices_model_1.default.findOneAndUpdate({ customer: customerId, deviceId: deviceId }, { $set: { deviceToken: deviceToken, deviceId: deviceId, deviceType: deviceType, } }, { new: true, upsert: true })];
            case 3:
                customerDevice = _d.sent();
                return [2 /*return*/, res.json({ success: true, message: 'Customer device updated', data: customerDevice })];
            case 4:
                error_3 = _d.sent();
                console.error('Error creating or updating customer device:', error_3);
                return [2 /*return*/, res.status((_b = error_3.code) !== null && _b !== void 0 ? _b : 500).json({ success: false, message: (_c = error_3.message) !== null && _c !== void 0 ? _c : 'Internal Server Error' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateOrCreateDevice = updateOrCreateDevice;
exports.CustomerController = {
    changePassword: exports.changePassword,
    updateAccount: exports.updateAccount,
    getAccount: exports.getAccount,
    updateOrCreateDevice: exports.updateOrCreateDevice,
    myDevices: exports.myDevices,
};
