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
exports.AdminCustomerController = exports.getSingleCustomer = exports.getCustomers = exports.issueCoupon = exports.AdminChangeCustomerAccountStatusController = exports.AdminGetSingleCustomerJobDetailController = void 0;
var express_validator_1 = require("express-validator");
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var job_model_1 = require("../../../database/common/job.model");
var invoices_shema_1 = require("../../../database/common/invoices.shema");
var promotion_schema_1 = require("../../../database/common/promotion.schema");
var coupon_schema_1 = require("../../../database/common/coupon.schema");
var couponCodeGenerator_1 = require("../../../utils/couponCodeGenerator");
var custom_errors_1 = require("../../../utils/custom.errors");
var api_feature_1 = require("../../../utils/api.feature");
//get single customer job detail /////////////
var AdminGetSingleCustomerJobDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, page, limit, errors, admin, adminId, customer, skip, jobsDetails, totalJob, jobs, i, jobsDetail, invoice, obj, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                customerId = req.params.customerId;
                _a = req.query, page = _a.page, limit = _a.limit;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                page = page || 1;
                limit = limit || 50;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })
                        .select('-password')];
            case 1:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid customer ID" })];
                }
                skip = (page - 1) * limit;
                return [4 /*yield*/, job_model_1.JobModel.find({ customer: customerId })
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate(['customer', 'contractor', 'quotation'])];
            case 2:
                jobsDetails = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments({ customer: customerId })];
            case 3:
                totalJob = _b.sent();
                jobs = [];
                i = 0;
                _b.label = 4;
            case 4:
                if (!(i < jobsDetails.length)) return [3 /*break*/, 7];
                jobsDetail = jobsDetails[i];
                return [4 /*yield*/, invoices_shema_1.InvoiceModel.findOne({ jobId: jobsDetail._id })];
            case 5:
                invoice = _b.sent();
                if (!invoice)
                    return [3 /*break*/, 6];
                obj = {
                    jobsDetail: jobsDetail,
                    invoice: invoice
                };
                jobs.push(obj);
                _b.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 4];
            case 7:
                res.json({
                    currentPage: page,
                    totalJob: totalJob,
                    totalPages: Math.ceil(totalJob / limit),
                    jobs: jobsDetails
                });
                return [3 /*break*/, 9];
            case 8:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetSingleCustomerJobDetailController = AdminGetSingleCustomerJobDetailController;
//admin change customer account status  /////////////
var AdminChangeCustomerAccountStatusController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, status_1, customerId, errors, adminId, admin, customer, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, status_1 = _a.status, customerId = _a.customerId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                adminId = req.admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                admin = _b.sent();
                if (!admin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Invalid admin ID" })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 2:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Invalid customer ID" })];
                }
                customer.status = status_1;
                return [4 /*yield*/, customer.save()];
            case 3:
                _b.sent();
                res.json({
                    message: "Customer account status successfully change to ".concat(status_1)
                });
                return [3 /*break*/, 5];
            case 4:
                err_2 = _b.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.AdminChangeCustomerAccountStatusController = AdminChangeCustomerAccountStatusController;
var issueCoupon = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var promotionId, customerId, promotion, newUserCoupon, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                promotionId = req.body.promotionId;
                customerId = req.params.customerId;
                return [4 /*yield*/, promotion_schema_1.PromotionModel.findById(promotionId)];
            case 1:
                promotion = _a.sent();
                if (!promotion) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Promotion not found' })];
                }
                // Check if the promotion is active
                if (promotion.status !== promotion_schema_1.PROMOTION_STATUS.ACTIVE) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Promotion is not active' })];
                }
                newUserCoupon = new coupon_schema_1.CouponModel({
                    promotion: promotion._id, // Attach promotion ID
                    name: promotion.name,
                    code: (0, couponCodeGenerator_1.generateCouponCode)(7), // generate coupon code here
                    user: customerId,
                    userType: 'customers',
                    valueType: promotion.valueType,
                    value: promotion.value,
                    applicableAtCheckout: true,
                    expiryDate: promotion.endDate,
                    status: 'active'
                });
                // Save the new coupon
                return [4 /*yield*/, newUserCoupon.save()];
            case 2:
                // Save the new coupon
                _a.sent();
                // Respond with success message
                return [2 /*return*/, res.json({ success: true, message: 'Promotion attached to user as coupon', data: newUserCoupon })];
            case 3:
                error_1 = _a.sent();
                // Handle any errors that occur
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error attaching promotion to user coupon: ".concat(error_1.message), error_1))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.issueCoupon = issueCoupon;
var getCustomers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, filter, customersWithBooking, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(customer_model_1.default.find(), req.query)];
            case 1:
                _a = _b.sent(), data = _a.data, filter = _a.filter;
                return [4 /*yield*/, job_model_1.JobModel.distinct('customer', __assign(__assign({}, filter), { customer: { $ne: null } }))];
            case 2:
                customersWithBooking = (_b.sent()).length;
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Customer stats retrieved",
                        data: __assign(__assign({}, data), { stats: {
                                customersWithBooking: customersWithBooking
                            } }),
                    })];
            case 3:
                err_3 = _b.sent();
                return [2 /*return*/, res.status(500).json({ success: false, message: err_3.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCustomers = getCustomers;
var getSingleCustomer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, customer, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                customerId = req.params.customerId;
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 1:
                customer = _a.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ success: false, message: "invalid customer ID" })];
                }
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Customer retrieved",
                        data: customer
                    })];
            case 2:
                err_4 = _a.sent();
                return [2 /*return*/, res.status(500).json({ success: false, message: err_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleCustomer = getSingleCustomer;
exports.AdminCustomerController = {
    AdminGetSingleCustomerJobDetailController: exports.AdminGetSingleCustomerJobDetailController,
    AdminChangeCustomerAccountStatusController: exports.AdminChangeCustomerAccountStatusController,
    issueCoupon: exports.issueCoupon,
    getCustomers: exports.getCustomers,
    getSingleCustomer: exports.getSingleCustomer
};
