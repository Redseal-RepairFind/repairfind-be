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
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var custom_errors_1 = require("../../utils/custom.errors");
var contractor_model_1 = require("../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../database/customer/models/customer.model"));
var SocketIOService = /** @class */ (function () {
    function SocketIOService() {
    }
    SocketIOService.initialize = function (io) {
        this.io = io;
        this.initializeSocketEvents();
    };
    SocketIOService.initializeSocketEvents = function () {
        var _this = this;
        this.io.use(function (socket, next) {
            var token = socket.handshake.headers.token;
            if (!token) {
                console.log('Authentication token is missing.');
                return next(new custom_errors_1.BadRequestError("Authentication token is missing."));
            }
            var secret = process.env.JWT_CONTRACTOR_SECRET_KEY;
            jsonwebtoken_1.default.verify(token, secret, function (err, decoded) {
                if (err) {
                    // Authentication failed
                    // console.log('Authentication failed:', err.message);
                    return next(new custom_errors_1.BadRequestError("Authentication error"));
                }
                // Authentication successful, attach user information to the socket
                // console.log('Token decoded successfully:', decoded);
                socket.user = decoded;
                next();
            });
        });
        this.io.on("connection", function (socket) {
            if (socket.user && socket.user.email) {
                socket.join(socket.user.email);
                socket.join('alerts'); // also join alerts channel
                console.log("User ".concat(socket.user.email, " joined channels:"));
                console.log(socket.rooms);
            }
            // Handle notification events from client here
            socket.on("join_channel", function (channel) {
                console.log("user explicitly joined a channel here ".concat(channel));
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
                var toUser, toUserType, user, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log("Jobday contractor location update ", payload);
                            toUser = payload.toUser, toUserType = payload.toUserType;
                            if (!toUserType || !toUser)
                                return [2 /*return*/]; // Ensure userType and userId are valid
                            if (!(toUserType === 'contractors')) return [3 /*break*/, 2];
                            return [4 /*yield*/, contractor_model_1.ContractorModel.findById(toUser)];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, customer_model_1.default.findById(toUser)];
                        case 3:
                            _a = _b.sent();
                            _b.label = 4;
                        case 4:
                            user = _a;
                            if (!user)
                                return [2 /*return*/]; // Ensure user exists
                            this.io.to(socket.user.email).emit('JOB_DAY_UPDATES', payload);
                            this.io.to(user.email).emit('INCOMING_CALL', { name: 'Aaron', image: 'asdasd', channel: '234324234', });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    SocketIOService.sendNotification = function (channels, type, payload) {
        var channelArray = typeof channels === 'string' ? [channels] : channels;
        console.log('sendNotification socket event is fired inside socketio', payload, channels);
        for (var _i = 0, channelArray_1 = channelArray; _i < channelArray_1.length; _i++) {
            var channel = channelArray_1[_i];
            this.io.to(channel).emit(type, { payload: payload });
        }
    };
    SocketIOService.broadcastMessage = function (type, payload) {
        this.io.emit(type, payload);
    };
    // defind broadcast channels = alerts
    SocketIOService.broadcastChannel = function (channel, type, payload) {
        // type example NEW_JOB_LISTING
        // channel example alerts
        console.log(' broadcastChannel socket event is fired inside socketio', payload, channel);
        this.io.to(channel).emit(type, payload);
    };
    return SocketIOService;
}());
exports.default = SocketIOService;
