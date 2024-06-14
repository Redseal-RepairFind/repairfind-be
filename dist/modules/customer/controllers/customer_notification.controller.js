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
exports.CustomerNotificationController = exports.markNotificationAsRead = exports.getSingleNotification = exports.getNotifications = void 0;
var api_feature_1 = require("../../../utils/api.feature");
var notification_model_1 = __importDefault(require("../../../database/common/notification.model"));
var getNotifications = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, startDate, endDate, read, unread, customerId, filter, _b, data, error, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.query, startDate = _a.startDate, endDate = _a.endDate, read = _a.read, unread = _a.unread;
                customerId = req.customer.id;
                filter = { user: customerId, userType: 'customers' };
                // Filtering by startDate and endDate
                if (startDate && endDate) {
                    filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
                }
                // Filtering by read or unread status
                if (read === 'true') {
                    filter.readAt = { $ne: null }; // Filter for read notifications
                }
                else if (unread === 'true') {
                    filter.readAt = null; // Filter for unread notifications
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(notification_model_1.default.find(filter), req.query)];
            case 1:
                _b = _c.sent(), data = _b.data, error = _b.error;
                res.status(200).json({
                    success: true, message: "Notifications retrieved",
                    data: data
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.error("Error fetching notifications:", error_1);
                res.status(500).json({ success: false, message: "Server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getNotifications = getNotifications;
var getSingleNotification = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var notificationId, customerId, query, notification, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                notificationId = req.params.notificationId;
                customerId = req.customer.id;
                query = { user: customerId, userType: 'customers', _id: notificationId };
                return [4 /*yield*/, notification_model_1.default.findOne(query).populate('entity')];
            case 1:
                notification = _a.sent();
                res.status(200).json({ success: true, message: "Notification retrieved", data: notification });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching notification:", error_2);
                res.status(500).json({ success: false, message: "Server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleNotification = getSingleNotification;
var markNotificationAsRead = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var notificationId, customerId, notification, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                notificationId = req.params.id;
                customerId = req.customer.id;
                return [4 /*yield*/, notification_model_1.default.findOne({ _id: notificationId, customer: customerId })];
            case 1:
                notification = _a.sent();
                // Check if the notification exists
                if (!notification) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Notification not found" })];
                }
                // Update the readAt field to mark the notification as read
                notification.readAt = new Date();
                return [4 /*yield*/, notification.save()];
            case 2:
                _a.sent();
                res.status(200).json({ success: true, message: "Notification marked as read", data: notification });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Error marking notification as read:", error_3);
                res.status(500).json({ success: false, message: "Server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.markNotificationAsRead = markNotificationAsRead;
exports.CustomerNotificationController = {
    getNotifications: exports.getNotifications,
    getSingleNotification: exports.getSingleNotification,
    markNotificationAsRead: exports.markNotificationAsRead
};
