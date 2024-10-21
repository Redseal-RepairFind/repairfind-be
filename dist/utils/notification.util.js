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
exports.NotificationUtil = void 0;
var job_model_1 = require("../database/common/job.model");
var contractorRedAlerts = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var alertConditions, jobs, unseenBookings, disputeAlerts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                alertConditions = {
                    contractor: userId,
                    status: { $in: ['DISPUTED'] },
                    $or: [
                        { bookingViewedByContractor: { $eq: false } },
                        { "contractorAlerts.hasNewDisputeMessage": { $eq: false } }
                    ]
                };
                return [4 /*yield*/, job_model_1.JobModel.find(alertConditions)
                        .select('_id contractor bookingViewedByContractor contractorAlerts')
                        .lean()];
            case 1:
                jobs = _a.sent();
                unseenBookings = jobs.filter(function (job) { return !job.bookingViewedByContractor; }).map(function (job) { return job._id; });
                disputeAlerts = jobs.filter(function (job) { var _a; return ((_a = job.contractorAlerts) === null || _a === void 0 ? void 0 : _a.hasNewDisputeMessage) === false; });
                return [2 /*return*/, { disputeAlerts: disputeAlerts, unseenBookings: unseenBookings }];
        }
    });
}); };
var customerRedAlerts = function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
    var alertConditions, jobs, unseenBookings, disputeAlerts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                alertConditions = {
                    customer: customerId,
                    status: { $in: ['DISPUTED'] },
                    $or: [
                        { "customerAlerts.hasNewDisputeMessage": { $eq: false } }
                    ]
                };
                return [4 /*yield*/, job_model_1.JobModel.find(alertConditions)
                        .select('_id customer customerAlerts')
                        .lean()];
            case 1:
                jobs = _a.sent();
                unseenBookings = [];
                disputeAlerts = jobs.filter(function (job) { var _a; return ((_a = job.contractorAlerts) === null || _a === void 0 ? void 0 : _a.hasNewDisputeMessage) === false; });
                return [2 /*return*/, { disputeAlerts: disputeAlerts, unseenBookings: unseenBookings }];
        }
    });
}); };
// const redAlerts = async (userId: ObjectId) => {
//     // Fetch ticket-type conversations where the user is a member
//     const ticketConversations = await ConversationModel.find({
//         type: CONVERSATION_TYPE.TICKET,
//         members: { $elemMatch: { member: userId } }
//     });
//     // Find ticket conversations with unread messages for the contractor
//     const unreadTickets = await Promise.all(
//         ticketConversations.map(async (conversation) => {
//             const unreadMessagesCount = await MessageModel.countDocuments({
//                 conversation: conversation._id,
//                 readBy: { $ne: userId }
//             });
//             // Return conversation if it has unread messages
//             return unreadMessagesCount > 0 ? conversation : null;
//         })
//     );
//     // Filter out null values and get dispute-related alerts (entities of conversations with unread messages)
//     const disputeAlerts = unreadTickets.filter(conversation => conversation !== null).map(conversation => conversation?.entity);
//     // Fetch job bookings where the contractor hasn't viewed the booking yet
//     const unseenJobIds = await JobModel.find({
//         contractor: userId, 
//         bookingViewedByContractor: { $eq: false }
//     }).select('_id contractor bookingViewedByContractor').lean();
//     // Extract job IDs from unseen bookings
//     const unseenBookings = unseenJobIds.map((job: any) => job._id);
//     // Return both dispute alerts and unseen bookings
//     return { disputeAlerts, unseenBookings };
// };
exports.NotificationUtil = {
    contractorRedAlerts: contractorRedAlerts,
    customerRedAlerts: customerRedAlerts
};
