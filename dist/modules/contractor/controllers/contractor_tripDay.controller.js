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
exports.ContractorTripDayController = exports.contractorArrivedSiteController = exports.contractorStartTripController = void 0;
var trip_day_model_1 = require("../../../database/common/trip_day.model");
var express_validator_1 = require("express-validator");
var job_model_1 = require("../../../database/common/job.model");
var otpGenerator_1 = require("../../../utils/otpGenerator");
var index_1 = require("../../../services/notifications/index");
//contractor start trip /////////////
var contractorStartTripController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, errors, contractorId, jobRequest, checkSiteVisited, newTripDay, saveNewTripDay, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractorId = req.contractor.id;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, contractor: contractorId, status: job_model_1.JobStatus.ACCEPTED })];
            case 1:
                jobRequest = _a.sent();
                // Check if the job request exists
                if (!jobRequest) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Job request not found' })];
                }
                return [4 /*yield*/, trip_day_model_1.TripDayModel.findOne({ job: jobId, verified: true })];
            case 2:
                checkSiteVisited = _a.sent();
                if (checkSiteVisited) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'site already visited' })];
                }
                newTripDay = new trip_day_model_1.TripDayModel({
                    customer: jobRequest.customer,
                    contractor: contractorId,
                    job: jobId,
                    status: trip_day_model_1.TripDayStatus.STARTED
                });
                return [4 /*yield*/, newTripDay.save()
                    // send notification to  contractor
                ];
            case 3:
                saveNewTripDay = _a.sent();
                // send notification to  contractor
                index_1.NotificationService.sendNotification({
                    user: contractorId,
                    userType: 'contractor',
                    title: 'tripDay',
                    heading: {},
                    type: 'tripDayStart',
                    message: 'trip successfully started',
                    payload: { tripId: saveNewTripDay._id }
                }, {
                    push: true,
                    socket: true,
                    database: true
                });
                // send notification to  customer
                index_1.NotificationService.sendNotification({
                    user: JSON.stringify(jobRequest.customer),
                    userType: 'customer',
                    title: 'tripDay',
                    heading: {},
                    type: 'tripDayStart',
                    message: 'Contractor starts trip to your site.',
                    payload: { tripId: saveNewTripDay._id }
                }, {
                    push: true,
                    socket: true,
                    database: true
                });
                res.json({
                    success: true,
                    message: "trip successfully started",
                    data: { jobLocation: jobRequest.location, trip: saveNewTripDay }
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.log("error", err_1);
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.contractorStartTripController = contractorStartTripController;
//contractor arrived site /////////////
var contractorArrivedSiteController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tripDayId, errors, contractorId, tripDay, verificationCode, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                tripDayId = req.params.tripDayId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractorId = req.contractor.id;
                return [4 /*yield*/, trip_day_model_1.TripDayModel.findOne({ _id: tripDayId })];
            case 1:
                tripDay = _a.sent();
                if (!tripDay) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'trip not found' })];
                }
                if (tripDay.status != trip_day_model_1.TripDayStatus.STARTED) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'trip not started yet' })];
                }
                if (tripDay.verified) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'site already visited' })];
                }
                verificationCode = (0, otpGenerator_1.generateOTP)();
                tripDay.verificationCode = parseInt(verificationCode);
                tripDay.status = trip_day_model_1.TripDayStatus.ARRIVED;
                return [4 /*yield*/, tripDay.save()
                    // send notification to  contractor
                ];
            case 2:
                _a.sent();
                // send notification to  contractor
                index_1.NotificationService.sendNotification({
                    user: contractorId,
                    userType: 'contractor',
                    title: 'tripDay',
                    heading: {},
                    type: 'tripDayarrived',
                    message: 'you successfully arrrived at site, wait for comfirmation from customer.',
                    payload: { tripId: tripDayId, verificationCode: verificationCode }
                }, {
                    push: true,
                    socket: true,
                    database: true
                });
                // send notification to  customer
                index_1.NotificationService.sendNotification({
                    user: JSON.stringify(tripDay.customer),
                    userType: 'customer',
                    title: 'tripDay',
                    heading: {},
                    type: 'tripDayarrived',
                    message: 'Contractor is at your site.',
                    payload: { tripId: tripDayId, verificationCode: verificationCode }
                }, {
                    push: true,
                    socket: true,
                    database: true
                });
                res.json({
                    success: true,
                    message: "you successfully arrrived at site, wait for comfirmation from customer",
                    data: verificationCode
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log("error", err_2);
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.contractorArrivedSiteController = contractorArrivedSiteController;
exports.ContractorTripDayController = {
    contractorStartTripController: exports.contractorStartTripController,
    contractorArrivedSiteController: exports.contractorArrivedSiteController
};
