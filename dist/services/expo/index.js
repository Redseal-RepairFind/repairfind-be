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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotifications = void 0;
var expo_server_sdk_1 = require("expo-server-sdk");
var logger_1 = require("../logger");
var expo = new expo_server_sdk_1.Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
function sendPushNotifications(pushTokens, message) {
    return __awaiter(this, void 0, void 0, function () {
        var messages, chunks, tickets, _i, chunks_1, chunk, ticketChunk, error_1, receiptIds, receiptIdChunks, _a, receiptIdChunks_1, chunk, receipts, receiptId, _b, status_1, details, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    messages = pushTokens
                        .filter(function (token) { return expo_server_sdk_1.Expo.isExpoPushToken(token); }) // Filter out invalid tokens
                        .map(function (token) { return (__assign({ to: token }, message)); });
                    logger_1.Logger.info("Push Notifications: Message ".concat(JSON.stringify(message), ", Tokens ").concat(JSON.stringify(pushTokens)));
                    chunks = expo.chunkPushNotifications(messages);
                    tickets = [];
                    _i = 0, chunks_1 = chunks;
                    _c.label = 1;
                case 1:
                    if (!(_i < chunks_1.length)) return [3 /*break*/, 6];
                    chunk = chunks_1[_i];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, expo.sendPushNotificationsAsync(chunk)];
                case 3:
                    ticketChunk = _c.sent();
                    tickets.push.apply(tickets, ticketChunk);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _c.sent();
                    logger_1.Logger.error(error_1);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    receiptIds = tickets
                        .filter(function (ticket) { return ticket.status !== 'error'; })
                        //@ts-ignore
                        .map(function (ticket) { return ticket.id; });
                    receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
                    _a = 0, receiptIdChunks_1 = receiptIdChunks;
                    _c.label = 7;
                case 7:
                    if (!(_a < receiptIdChunks_1.length)) return [3 /*break*/, 12];
                    chunk = receiptIdChunks_1[_a];
                    _c.label = 8;
                case 8:
                    _c.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, expo.getPushNotificationReceiptsAsync(chunk)];
                case 9:
                    receipts = _c.sent();
                    // Process receipt information
                    for (receiptId in receipts) {
                        _b = receipts[receiptId], status_1 = _b.status, details = _b.details;
                        if (status_1 == 'error') {
                            logger_1.Logger.error("There was an error sending a notification: ".concat(message));
                            if (details && details.error) {
                                logger_1.Logger.error("The Nofication error code is ".concat(details.error));
                            }
                        }
                        else {
                            logger_1.Logger.info("Nofication sent ".concat(status_1));
                        }
                    }
                    return [3 /*break*/, 11];
                case 10:
                    error_2 = _c.sent();
                    logger_1.Logger.error(error_2);
                    return [3 /*break*/, 11];
                case 11:
                    _a++;
                    return [3 /*break*/, 7];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.sendPushNotifications = sendPushNotifications;
// @ts-nocheck
// import { Expo, ExpoPushMessage, ExpoPushTicket, ExpoPushReceipt } from 'expo-server-sdk';
// import { Logger } from '../logger';
// const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
// export async function sendPushNotifications(pushTokens: string[], message: any): Promise<void> {
//   // Prepare push notification messages
//   const messages: ExpoPushMessage[] = pushTokens
//     .filter(token => Expo.isExpoPushToken(token)) // Filter out invalid tokens
//     .map(token => ({
//       to: token,
//       sound: 'default',
//       ...message,
//       _displayInForeground: true // Ensures the notification is displayed in foreground
//     }));
//   // Split messages into chunks to send in batches
//   const chunks = expo.chunkPushNotifications(messages);
//   const tickets: ExpoPushTicket[] = [];
//   // Send each chunk of messages
//   for (const chunk of chunks) {
//     try {
//       const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//       tickets.push(...ticketChunk);
//     } catch (error) {
//       Logger.error('Error sending push notifications', error);
//     }
//   }
//   // Extract receipt IDs for successful notifications only
//   const receiptIds: string[] = tickets
//     .filter(ticket => ticket.status === 'ok')
//     .map(ticket => ticket.id);
//   // Split receipt IDs into chunks to retrieve receipt information
//   const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
//   // Retrieve receipt information for each receipt ID chunk
//   for (const chunk of receiptIdChunks) {
//     try {
//       const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
//       // Process receipt information
//       for (const receiptId in receipts) {
//         const { status, details } = receipts[receiptId];
//         if (status === 'error') {
//           Logger.error(`There was an error sending a notification: ${message}`);
//           if (details && details.error) {
//             Logger.error(`The error code is ${details.error}`);
//           }
//         } else {
//           Logger.info(`Notification sent successfully: ${status}`);
//         }
//       }
//     } catch (error) {
//       Logger.error('Error retrieving push notification receipts', error);
//     }
//   }
// }
