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
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var socket_io_1 = require("socket.io");
var custom_errors_1 = require("../../utils/custom.errors");
var contractor_model_1 = require("../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../database/customer/models/customer.model"));
var job_day_model_1 = require("../../database/common/job_day.model");
var job_model_1 = require("../../database/common/job.model");
var logger_1 = require("../logger");
var messages_schema_1 = require("../../database/common/messages.schema");
var conversations_schema_1 = require("../../database/common/conversations.schema");
var mongoose_1 = require("mongoose");
var notifications_1 = require("../notifications");
var admin_model_1 = __importDefault(require("../../database/admin/models/admin.model"));
var SocketIOService = /** @class */ (function () {
    function SocketIOService() {
    }
    SocketIOService.initialize = function (server) {
        var io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
            },
        });
        this.io = io;
        this.initializeSocketEvents();
    };
    SocketIOService.initializeSocketEvents = function () {
        var _this = this;
        this.io.use(function (socket, next) {
            var token = socket.handshake.headers.token;
            if (!token) {
                logger_1.Logger.info('Authentication token is missing.');
                return next(new custom_errors_1.BadRequestError("Authentication token is missing."));
            }
            var secret = process.env.JWT_SECRET_KEY;
            jsonwebtoken_1.default.verify(token, secret, function (err, decoded) {
                if (err) {
                    // Authentication failed
                    console.log('err', err);
                    return next(new custom_errors_1.BadRequestError("Authentication error"));
                }
                // Authentication successful, attach user information to the socket
                socket.user = decoded;
                next();
            });
        });
        this.io.on("connection", function (socket) {
            if (socket.user && socket.user.email) {
                socket.join(socket.user.email);
                socket.join('alerts'); // also join alerts channel
                var channels_1 = [];
                socket.rooms.forEach(function (cha) {
                    channels_1.push(cha);
                });
                logger_1.Logger.info("User ".concat(socket.user.email, " joined channels: ").concat(channels_1));
                // setInterval(()=>{
                //     console.log(`Send red alerts to user  ${socket.user.email} every 5 secs`);
                // }, 2000)
            }
            // Handle notification events from client here
            socket.on("join_channel", function (channel) {
                logger_1.Logger.info("user explicitly joined a channel here ".concat(channel));
                socket.join(channel); // Join a room based on user email to enable private notifications
            });
            // Handle notification events from client here
            socket.on("start_call", function (payload) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            }); });
            // Handle notification events from client here
            socket.on("send_jobday_contractor_location", function (payload) { return __awaiter(_this, void 0, void 0, function () {
                var toUser, toUserType, jobdayId, jobday, customer, contractor, job, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger_1.Logger.info("Jobday contractor location update ", payload);
                            toUser = payload.toUser, toUserType = payload.toUserType, jobdayId = payload.jobdayId;
                            return [4 /*yield*/, job_day_model_1.JobDayModel.findById(payload.jobdayId)];
                        case 1:
                            jobday = _a.sent();
                            if (!jobday)
                                return [2 /*return*/];
                            return [4 /*yield*/, customer_model_1.default.findById(jobday.customer)];
                        case 2:
                            customer = _a.sent();
                            return [4 /*yield*/, contractor_model_1.ContractorModel.findById(jobday.contractor)];
                        case 3:
                            contractor = _a.sent();
                            return [4 /*yield*/, job_model_1.JobModel.findById(jobday.job)];
                        case 4:
                            job = _a.sent();
                            if (!customer || !contractor)
                                return [2 /*return*/];
                            data = __assign(__assign({}, payload), { name: contractor.name, profilePhoto: contractor.profilePhoto });
                            this.sendNotification(customer.email, 'JOB_DAY_CONTRACTOR_LOCATION', data);
                            if (!(job && job.isAssigned)) return [3 /*break*/, 6];
                            return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                        case 5:
                            contractor = _a.sent();
                            if (!contractor)
                                return [2 /*return*/];
                            this.sendNotification(contractor.email, 'JOB_DAY_CONTRACTOR_LOCATION', data);
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            // Handle conversation marked as read
            socket.on("send_mark_conversation_as_read", function (payload) { return __awaiter(_this, void 0, void 0, function () {
                var conversationId, loggedInUserId_1, loggedInUserType_1, conversation_1, members, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            logger_1.Logger.info("Marking conversation as read via socket ", payload);
                            conversationId = payload.conversationId;
                            loggedInUserId_1 = socket.user.id;
                            loggedInUserType_1 = socket.user.userType;
                            if (!(0, mongoose_1.isValidObjectId)(conversationId)) {
                                logger_1.Logger.error("conversationId was not passed");
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, conversations_schema_1.ConversationModel.findById(conversationId)];
                        case 1:
                            conversation_1 = _a.sent();
                            if (!conversation_1) {
                                logger_1.Logger.error("Conversation not found");
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, messages_schema_1.MessageModel.updateMany({ conversation: conversationId, readBy: { $ne: loggedInUserId_1 } }, { $addToSet: { readBy: loggedInUserId_1 } })];
                        case 2:
                            _a.sent();
                            members = conversation_1 === null || conversation_1 === void 0 ? void 0 : conversation_1.members;
                            if (!conversation_1 || !members)
                                return [2 /*return*/];
                            members.forEach(function (member) { return __awaiter(_this, void 0, void 0, function () {
                                var user, toUserId, toUserType;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            console.log(' member.memberType', member.memberType);
                                            return [4 /*yield*/, contractor_model_1.ContractorModel.findById(member.member)];
                                        case 1:
                                            user = _b.sent();
                                            if (!(member.memberType === 'contractors')) return [3 /*break*/, 3];
                                            return [4 /*yield*/, contractor_model_1.ContractorModel.findById(member.member)];
                                        case 2:
                                            user = _b.sent();
                                            _b.label = 3;
                                        case 3:
                                            if (!(member.memberType === 'customers')) return [3 /*break*/, 5];
                                            return [4 /*yield*/, customer_model_1.default.findById(member.member)];
                                        case 4:
                                            user = _b.sent();
                                            _b.label = 5;
                                        case 5:
                                            if (!(member.memberType === 'admins')) return [3 /*break*/, 7];
                                            return [4 /*yield*/, admin_model_1.default.findById(member.member)];
                                        case 6:
                                            user = _b.sent();
                                            _b.label = 7;
                                        case 7:
                                            if (!user)
                                                return [2 /*return*/];
                                            toUserId = member.member;
                                            toUserType = member.memberType;
                                            if (toUserId == loggedInUserId_1)
                                                return [2 /*return*/];
                                            notifications_1.NotificationService.sendNotification({
                                                user: toUserId,
                                                userType: toUserType,
                                                title: 'Conversation read',
                                                type: 'CONVERSATION_READ',
                                                message: "Conversation messages marked as read",
                                                heading: { name: "".concat(user.name), image: (_a = user.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                                                payload: {
                                                    entity: conversation_1.id,
                                                    entityType: 'conversations',
                                                    message: 'Conversation messages marked as read',
                                                    readBy: loggedInUserId_1,
                                                    readByType: loggedInUserType_1,
                                                    event: 'CONVERSATION_READ',
                                                }
                                            }, { socket: true });
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            logger_1.Logger.error("Error marking conversation as read via socket ", payload);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    SocketIOService.sendNotification = function (channels, type, payload) {
        var channelArray = typeof channels === 'string' ? [channels] : channels;
        logger_1.Logger.info("sendNotification socket event is fired inside socketio", { payload: JSON.stringify(payload), channels: channels, type: type });
        for (var _i = 0, channelArray_1 = channelArray; _i < channelArray_1.length; _i++) {
            var channel = channelArray_1[_i];
            this.io.to(channel).emit(type, { payload: payload });
        }
    };
    SocketIOService.broadcastMessage = function (type, payload) {
        this.io.emit(type, payload);
    };
    // defined broadcast channels = alerts
    SocketIOService.broadcastChannel = function (channel, type, payload) {
        logger_1.Logger.info(' broadcastChannel socket event is fired inside socketio', { payload: JSON.stringify(payload), channel: channel });
        this.io.to(channel).emit(type, payload);
    };
    return SocketIOService;
}());
exports.default = SocketIOService;
