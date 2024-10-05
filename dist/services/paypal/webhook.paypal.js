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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.orderApproved = exports.paymentCaptureRefunded = exports.paymentCaptureDenied = exports.paymentCaptureCompleted = exports.PayPalWebhookHandler = void 0;
var contractor_model_1 = require("../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../database/customer/models/customer.model"));
var interface_dto_util_1 = require("../../utils/interface_dto.util");
var transaction_model_1 = __importStar(require("../../database/common/transaction.model"));
var logger_1 = require("../logger");
var events_1 = require("../../events");
var payment_schema_1 = require("../../database/common/payment.schema");
var job_model_1 = require("../../database/common/job.model");
var job_quotation_model_1 = require("../../database/common/job_quotation.model");
var paypal_payment_log_model_1 = require("../../database/common/paypal_payment_log.model");
var _1 = require(".");
var messages_schema_1 = require("../../database/common/messages.schema");
var conversation_util_1 = require("../../utils/conversation.util");
var PAYPAL_WEBHOOK_SECRET = process.env.PAYPAL_WEBHOOK_SECRET;
var PayPalWebhookHandler = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var event_1, eventType, resourceType, eventData;
    return __generator(this, function (_a) {
        try {
            event_1 = req.body;
            eventType = event_1.event_type;
            resourceType = event_1.resource_type;
            eventData = event_1.resource;
            switch (eventType) {
                // Payment Events
                case 'PAYMENT.CAPTURE.COMPLETED':
                    (0, exports.paymentCaptureCompleted)(eventData, resourceType);
                    break;
                case 'PAYMENT.CAPTURE.DENIED':
                    (0, exports.paymentCaptureDenied)(eventData, resourceType);
                    break;
                case 'PAYMENT.CAPTURE.REFUNDED':
                    (0, exports.paymentCaptureRefunded)(eventData, resourceType);
                    break;
                // Order Events
                case 'CHECKOUT.ORDER.APPROVED':
                    (0, exports.orderApproved)(eventData, resourceType);
                    break;
                default:
                    logger_1.Logger.info("Unhandled event type: ".concat(eventType, " - ").concat(resourceType), eventData);
                    break;
            }
        }
        catch (error) {
            logger_1.Logger.info(error.message || "Something went wrong inside PayPal webhook handler");
        }
        return [2 /*return*/];
    });
}); };
exports.PayPalWebhookHandler = PayPalWebhookHandler;
var paymentCaptureCompleted = function (payload, resourceType) { return __awaiter(void 0, void 0, void 0, function () {
    var custom_id, amount, value, currency_code, metaId, meta, metadata, user, _a, captureDto, paymentDTO, payment, transaction, jobId, paymentType, quotationId, job, quotation, charges, conversation, newMessage, conversation, newMessage, changeOrderEstimate, conversation, newMessage, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                logger_1.Logger.info('PayPal Event Handler: paymentCaptureCompleted', payload);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 30, , 31]);
                // Ensure the payload is of type capture
                if (resourceType !== 'capture')
                    return [2 /*return*/];
                custom_id = payload.custom_id, amount = payload.amount;
                value = amount.value, currency_code = amount.currency_code;
                metaId = custom_id;
                return [4 /*yield*/, paypal_payment_log_model_1.PaypalPaymentLog.findById(metaId)];
            case 2:
                meta = _c.sent();
                if (!meta || !meta.userType || !meta.user)
                    return [2 /*return*/]; // Ensure userType and userId are valid
                metadata = meta.metadata;
                console.log('meta', meta);
                if (!(meta.userType === 'contractors')) return [3 /*break*/, 4];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(meta.user)];
            case 3:
                _a = _c.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, customer_model_1.default.findById(meta.user)];
            case 5:
                _a = _c.sent();
                _c.label = 6;
            case 6:
                user = _a;
                if (!user)
                    return [2 /*return*/]; // Ensure user exists
                captureDto = (0, interface_dto_util_1.castPayloadToDTO)(payload, payload);
                paymentDTO = __assign(__assign({}, (0, interface_dto_util_1.castPayloadToDTO)(payload, payload)), { capture_id: captureDto.id, paypalCapture: captureDto, type: metadata.paymentType, user: user._id, userType: meta.userType, amount: parseFloat(value), amount_captured: parseFloat(value), currency: currency_code, object: resourceType, channel: 'paypal' });
                return [4 /*yield*/, payment_schema_1.PaymentModel.findOneAndUpdate({ capture_id: paymentDTO.capture_id }, paymentDTO, {
                        new: true, upsert: true
                    })];
            case 7:
                payment = _c.sent();
                if (!payment) return [3 /*break*/, 29];
                transaction = new transaction_model_1.default({
                    type: metadata.paymentType,
                    amount: paymentDTO.amount,
                    currency: paymentDTO.currency,
                    initiatorUser: user.id,
                    initiatorUserType: meta.userType,
                    fromUser: user.id,
                    fromUserType: meta.userType,
                    toUser: metadata.contractorId,
                    toUserType: 'contractors',
                    description: meta.metadata.paymentType.split('_').map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); }).join(' '),
                    payment: payment._id,
                    remark: metadata.remark,
                    metadata: metadata,
                    paymentMethod: meta.metadata.paymentMethod,
                    job: metadata.jobId,
                    status: transaction_model_1.TRANSACTION_STATUS.SUCCESSFUL
                });
                payment.transaction = transaction._id;
                if (!metadata.jobId) return [3 /*break*/, 27];
                jobId = metadata.jobId;
                paymentType = metadata.paymentType;
                quotationId = metadata.quotationId;
                if (!(jobId && paymentType && quotationId)) return [3 /*break*/, 27];
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 8:
                job = _c.sent();
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findById(quotationId)];
            case 9:
                quotation = _c.sent();
                if (!job || !quotation)
                    return [2 /*return*/];
                return [4 /*yield*/, quotation.calculateCharges()];
            case 10:
                charges = _c.sent();
                transaction.invoice = {
                    items: quotation.estimates,
                    charges: charges
                };
                if (!(paymentType == payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT)) return [3 /*break*/, 15];
                job.status = job_model_1.JOB_STATUS.BOOKED;
                job.contract = quotation.id;
                job.contractor = quotation.contractor;
                quotation.isPaid = true;
                quotation.payment = payment.id;
                quotation.status = job_quotation_model_1.JOB_QUOTATION_STATUS.ACCEPTED;
                job.schedule = {
                    startDate: (_b = quotation.startDate) !== null && _b !== void 0 ? _b : job.date,
                    estimatedDuration: quotation.estimatedDuration,
                    type: job_model_1.JOB_SCHEDULE_TYPE.JOB_DAY,
                    remark: 'Initial job schedule'
                };
                job.status = job_model_1.JOB_STATUS.BOOKED;
                job.bookingViewedByContractor = false;
                return [4 /*yield*/, Promise.all([
                        quotation.save(),
                        job.save()
                    ])];
            case 11:
                _c.sent();
                return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(job.customer, 'customers', job.contractor, 'contractors')];
            case 12:
                conversation = _c.sent();
                return [4 /*yield*/, messages_schema_1.MessageModel.create({
                        conversation: conversation._id,
                        sender: job.customer,
                        senderType: 'customers',
                        message: "New Job Payment",
                        messageType: messages_schema_1.MessageType.ALERT,
                        createdAt: new Date(),
                        entity: jobId,
                        entityType: 'jobs'
                    })];
            case 13:
                newMessage = _c.sent();
                conversation.lastMessage = 'New Job Payment';
                conversation.lastMessageAt = new Date();
                return [4 /*yield*/, conversation.save()];
            case 14:
                _c.sent();
                events_1.ConversationEvent.emit('NEW_MESSAGE', { message: newMessage });
                events_1.JobEvent.emit('JOB_BOOKED', { jobId: jobId, contractorId: quotation.contractor, customerId: job.customer, quotationId: quotationId, paymentType: paymentType });
                _c.label = 15;
            case 15:
                if (!(paymentType == payment_schema_1.PAYMENT_TYPE.SITE_VISIT_PAYMENT)) return [3 /*break*/, 20];
                job.status = job_model_1.JOB_STATUS.BOOKED;
                job.contract = quotation.id;
                job.contractor = quotation.contractor;
                job.bookingViewedByContractor = false;
                quotation.siteVisitEstimate.isPaid = true;
                quotation.siteVisitEstimate.payment = payment.id;
                quotation.status = job_quotation_model_1.JOB_QUOTATION_STATUS.ACCEPTED;
                if (quotation.siteVisit instanceof Date) {
                    job.schedule = {
                        startDate: quotation.siteVisit,
                        estimatedDuration: quotation.estimatedDuration,
                        type: job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT,
                        remark: 'Site visit schedule'
                    };
                }
                else {
                    logger_1.Logger.info('quotation.siteVisit.date is not a valid Date object.');
                }
                return [4 /*yield*/, Promise.all([
                        quotation.save(),
                        job.save()
                    ])];
            case 16:
                _c.sent();
                events_1.JobEvent.emit('JOB_BOOKED', { jobId: jobId, contractorId: quotation.contractor, customerId: job.customer, quotationId: quotationId, paymentType: paymentType });
                return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(job.customer, 'customers', job.contractor, 'contractors')];
            case 17:
                conversation = _c.sent();
                return [4 /*yield*/, messages_schema_1.MessageModel.create({
                        conversation: conversation._id,
                        sender: job.customer,
                        senderType: 'customers',
                        message: "New Site Visit Payment",
                        messageType: messages_schema_1.MessageType.ALERT,
                        createdAt: new Date(),
                        entity: jobId,
                        entityType: 'jobs'
                    })];
            case 18:
                newMessage = _c.sent();
                conversation.lastMessage = 'New Site Visit Payment';
                conversation.lastMessageAt = new Date();
                return [4 /*yield*/, conversation.save()];
            case 19:
                _c.sent();
                _c.label = 20;
            case 20:
                if (!(paymentType == payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)) return [3 /*break*/, 24];
                changeOrderEstimate = quotation.changeOrderEstimate;
                if (!changeOrderEstimate)
                    return [2 /*return*/];
                changeOrderEstimate.isPaid = true;
                changeOrderEstimate.payment = payment.id;
                events_1.JobEvent.emit('CHANGE_ORDER_ESTIMATE_PAID', { job: job, quotation: quotation, changeOrderEstimate: changeOrderEstimate });
                events_1.JobEvent.emit('JOB_BOOKED', { jobId: jobId, contractorId: quotation.contractor, customerId: job.customer, quotationId: quotationId, paymentType: paymentType });
                return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(job.customer, 'customers', job.contractor, 'contractors')];
            case 21:
                conversation = _c.sent();
                return [4 /*yield*/, messages_schema_1.MessageModel.create({
                        conversation: conversation._id,
                        sender: job.customer,
                        senderType: 'customers',
                        message: "New Change Order Payment",
                        messageType: messages_schema_1.MessageType.ALERT,
                        createdAt: new Date(),
                        entity: jobId,
                        entityType: 'jobs'
                    })];
            case 22:
                newMessage = _c.sent();
                conversation.lastMessage = 'New Change Order Payment';
                conversation.lastMessageAt = new Date();
                return [4 /*yield*/, conversation.save()];
            case 23:
                _c.sent();
                _c.label = 24;
            case 24:
                if (!job.payments.includes(payment.id))
                    job.payments.push(payment.id);
                // Create Escrow Transaction here
                return [4 /*yield*/, transaction_model_1.default.create({
                        type: transaction_model_1.TRANSACTION_TYPE.ESCROW,
                        amount: charges.contractorPayable,
                        initiatorUser: user.id,
                        initiatorUserType: 'customers',
                        fromUser: job.customer,
                        fromUserType: 'customers',
                        toUser: job.contractor,
                        toUserType: 'contractors',
                        description: "Escrow Transaction for job: ".concat(job === null || job === void 0 ? void 0 : job.title),
                        status: transaction_model_1.TRANSACTION_STATUS.PENDING,
                        remark: 'job_escrow_transaction',
                        invoice: {
                            items: [],
                            charges: quotation.charges
                        },
                        metadata: {
                            paymentType: paymentType,
                            parentTransaction: transaction.id
                        },
                        job: job.id,
                        payment: payment.id,
                    })];
            case 25:
                // Create Escrow Transaction here
                _c.sent();
                return [4 /*yield*/, Promise.all([quotation.save(), job.save()])];
            case 26:
                _c.sent();
                _c.label = 27;
            case 27: return [4 /*yield*/, Promise.all([payment.save(), transaction.save()])];
            case 28:
                _c.sent();
                _c.label = 29;
            case 29: return [3 /*break*/, 31];
            case 30:
                error_1 = _c.sent();
                logger_1.Logger.info('Error handling paymentCaptureCompleted PayPal webhook event', error_1);
                return [3 /*break*/, 31];
            case 31: return [2 /*return*/];
        }
    });
}); };
exports.paymentCaptureCompleted = paymentCaptureCompleted;
var paymentCaptureDenied = function (payload, resourceType) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        logger_1.Logger.info('PayPal Event Handler: paymentCaptureDenied', payload);
        try {
            // Ensure the payload is of type capture
            if (payload.object !== 'capture')
                return [2 /*return*/];
            id = payload.id;
        }
        catch (error) {
            logger_1.Logger.info('Error handling paymentCaptureDenied PayPal webhook event', error);
        }
        return [2 /*return*/];
    });
}); };
exports.paymentCaptureDenied = paymentCaptureDenied;
var paymentCaptureRefunded = function (payload, resourceType) { return __awaiter(void 0, void 0, void 0, function () {
    var id, amount, value, payment, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger_1.Logger.info('PayPal Event Handler: paymentCaptureRefunded', payload);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (payload.object !== 'capture')
                    return [2 /*return*/];
                id = payload.id, amount = payload.amount;
                value = amount.value;
                return [4 /*yield*/, payment_schema_1.PaymentModel.findOne({ capture_id: id })];
            case 2:
                payment = _a.sent();
                if (!payment) return [3 /*break*/, 4];
                payment.amount_refunded = parseFloat(value);
                payment.status = 'REFUNDED';
                return [4 /*yield*/, payment.save()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                logger_1.Logger.info('Error handling paymentCaptureRefunded PayPal webhook event', error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.paymentCaptureRefunded = paymentCaptureRefunded;
var orderApproved = function (payload, resourceType) { return __awaiter(void 0, void 0, void 0, function () {
    var id, purchase_units, _a, orderData, paymentMethod, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                logger_1.Logger.info('PayPal Event Handler: orderApproved', payload);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                id = payload.id, purchase_units = payload.purchase_units;
                // You can process the approved order here
                logger_1.Logger.info("Order ".concat(id, " approved with purchase units:"), purchase_units);
                return [4 /*yield*/, _1.PayPalService.payment.captureOrder(id)];
            case 2:
                _a = _b.sent(), orderData = _a.orderData, paymentMethod = _a.paymentMethod;
                logger_1.Logger.info("Order Captured ".concat(id), [orderData, paymentMethod]);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                logger_1.Logger.info('Error handling orderApproved PayPal webhook event', error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.orderApproved = orderApproved;
// PAYMENT.PAYOUTS-ITEM.UNCLAIMED"
// "1727425397084":{
// "id":"WH-20R39083BF462510V-40S654642A356503H"
// "event_version":"1.0"
// "create_time":"2024-09-27T08:23:06.711Z"
// "resource_type":"payouts_item"
// "event_type":"PAYMENT.PAYOUTS-ITEM.UNCLAIMED"
// "summary":"A payout item is unclaimed"
// "resource":{
// "transaction_id":"5GR74669W57774449"
// "payout_item_fee":{...}
// "transaction_status":"UNCLAIMED"
// "sender_batch_id":"b9dd91f2-8b28-4489-a42c-36f6d6374e57"
// "time_processed":"2024-09-27T08:22:51Z"
// "activity_id":"4XC70420RN5559137"
// "payout_item":{
// "recipient_type":"EMAIL"
// "amount":{...}
// "note":"Payment for your completed job on RepairFind"
// "receiver":"airondev@gmail.com"
// "sender_item_id":"84b0282c-64af-4bbd-8b5e-7542e394ab1f"
// "recipient_wallet":"PAYPAL"
// }
// "links":[...]
// "payout_item_id":"X8CUZMZFAJMB8"
// "payout_batch_id":"ARF4WZLU59N5J"
// "errors":{...}
// }
// "links":[...]
// }
