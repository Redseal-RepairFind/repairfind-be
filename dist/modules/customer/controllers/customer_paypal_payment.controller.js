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
exports.CustomerPaypalPaymentController = exports.payChangeOrderEstimate = exports.payJobEstimate = exports.captureOrderEstimatePaymentCheckout = exports.createOrderEstimatePaymentCheckout = exports.captureCheckoutOrder = exports.createCheckoutOrder = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var job_model_1 = require("../../../database/common/job.model");
var custom_errors_1 = require("../../../utils/custom.errors");
var transaction_model_1 = require("../../../database/common/transaction.model");
var job_quotation_model_1 = require("../../../database/common/job_quotation.model");
var events_1 = require("../../../events");
var payment_schema_1 = require("../../../database/common/payment.schema");
var messages_schema_1 = require("../../../database/common/messages.schema");
var paypal_1 = require("../../../services/paypal");
var conversation_util_1 = require("../../../utils/conversation.util");
var paypal_payment_log_model_1 = require("../../../database/common/paypal_payment_log.model");
var findCustomer = function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
    var customer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                customer = _a.sent();
                if (!customer) {
                    throw new custom_errors_1.BadRequestError('Incorrect Customer ID');
                }
                return [2 /*return*/, customer];
        }
    });
}); };
var findJob = function (jobId) { return __awaiter(void 0, void 0, void 0, function () {
    var job;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId })];
            case 1:
                job = _a.sent();
                if (!job) {
                    throw new custom_errors_1.BadRequestError('Job does not exist');
                }
                return [2 /*return*/, job];
        }
    });
}); };
var findQuotation = function (quotationId) { return __awaiter(void 0, void 0, void 0, function () {
    var quotation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOne({ _id: quotationId })];
            case 1:
                quotation = _a.sent();
                if (!quotation) {
                    throw new custom_errors_1.BadRequestError('Job quotation not found');
                }
                return [2 /*return*/, quotation];
        }
    });
}); };
var findContractor = function (contractorId) { return __awaiter(void 0, void 0, void 0, function () {
    var contractor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractor = _a.sent();
                if (!contractor) {
                    throw new custom_errors_1.BadRequestError('Contractor not found');
                }
                // contractor.onboarding = await contractor.getOnboarding()
                // if (!contractor.onboarding.hasStripeAccount || !(contractor.stripeAccountStatus?.card_payments_enabled && contractor.stripeAccountStatus?.transfers_enabled)) {
                //     throw new BadRequestError('You cannot make payment to this contractor because his/her Stripe connect account is not set up');
                // }
                return [2 /*return*/, contractor];
        }
    });
}); };
var createCheckoutOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, isChangeOrder, jobId, errors, customerId, customer, job, quotation, contractor, contractorId, changeOrderEstimate, paymentType_1, transactionType, charges_1, metadata_1, paypalPaymentLog_1, payload_1, capture_1, paymentType, charges, metadata, paypalPaymentLog, payload, capture, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 13, , 14]);
                _a = req.body, quotationId = _a.quotationId, isChangeOrder = _a.isChangeOrder;
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, findCustomer(customerId)];
            case 1:
                customer = _b.sent();
                return [4 /*yield*/, findJob(jobId)];
            case 2:
                job = _b.sent();
                return [4 /*yield*/, findQuotation(quotationId)];
            case 3:
                quotation = _b.sent();
                return [4 /*yield*/, findContractor(quotation.contractor)];
            case 4:
                contractor = _b.sent();
                contractorId = contractor.id;
                if (!(isChangeOrder === "true")) return [3 /*break*/, 9];
                changeOrderEstimate = quotation.changeOrderEstimate;
                if (!changeOrderEstimate)
                    throw new Error('No  changeOrder estimate for this job');
                if (changeOrderEstimate.isPaid)
                    throw new Error('Extra estimate already paid');
                paymentType_1 = payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT;
                transactionType = transaction_model_1.TRANSACTION_TYPE.CHANGE_ORDER_PAYMENT;
                return [4 /*yield*/, quotation.calculateCharges(paymentType_1)];
            case 5:
                charges_1 = _b.sent();
                metadata_1 = {
                    customerId: customer.id,
                    contractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                    quotationId: quotation.id,
                    jobId: jobId,
                    paymentType: paymentType_1,
                    paymentMethod: 'CAPTURE',
                    email: customer.email,
                    remark: 'change_order_estimate_payment',
                };
                return [4 /*yield*/, paypal_payment_log_model_1.PaypalPaymentLog.create({
                        user: customerId,
                        'userType': 'customers',
                        metadata: metadata_1
                    })];
            case 6:
                paypalPaymentLog_1 = _b.sent();
                payload_1 = {
                    amount: charges_1.customerPayable,
                    intent: "CAPTURE",
                    description: "Job Change Order Payment - ".concat(jobId),
                    metaId: paypalPaymentLog_1.id,
                    returnUrl: "https://repairfind.ca/payment-success",
                    payer: {
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                        email: customer.email
                        // No billing address included because, NO_SHIPPING is configured in application context
                    }
                };
                return [4 /*yield*/, paypal_1.PayPalService.payment.createOrder(payload_1)];
            case 7:
                capture_1 = _b.sent();
                job.isChangeOrder = false;
                return [4 /*yield*/, job.save()];
            case 8:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, message: 'Payment intent created', data: __assign({ capture: capture_1 }, charges_1) })];
            case 9:
                if (job.status === job_model_1.JOB_STATUS.BOOKED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'This job is not pending, so new payment is not possible' })];
                }
                paymentType = payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT;
                if (quotation.type == job_quotation_model_1.JOB_QUOTATION_TYPE.SITE_VISIT)
                    paymentType = payment_schema_1.PAYMENT_TYPE.SITE_VISIT_PAYMENT;
                if (quotation.type == job_quotation_model_1.JOB_QUOTATION_TYPE.JOB_DAY)
                    paymentType = payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT;
                return [4 /*yield*/, quotation.calculateCharges(paymentType)];
            case 10:
                charges = _b.sent();
                metadata = {
                    customerId: customer.id,
                    contractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                    quotationId: quotation.id,
                    paymentType: paymentType,
                    paymentMethod: 'CAPTURE',
                    jobId: jobId,
                    email: customer.email,
                    remark: 'initial_job_payment',
                };
                return [4 /*yield*/, paypal_payment_log_model_1.PaypalPaymentLog.create({
                        user: customerId,
                        'userType': 'customers',
                        metadata: metadata
                    })];
            case 11:
                paypalPaymentLog = _b.sent();
                payload = {
                    amount: charges.customerPayable,
                    intent: "CAPTURE",
                    description: "Job Payment - ".concat(jobId),
                    metaId: paypalPaymentLog.id,
                    returnUrl: "https://repairfind.ca/payment-success",
                    payer: {
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                        email: customer.email
                        // No billing address included because, NO_SHIPPING is configured in application context
                    }
                };
                return [4 /*yield*/, paypal_1.PayPalService.payment.createOrder(payload)];
            case 12:
                capture = _b.sent();
                res.json({ success: true, message: 'Payment intent created', data: __assign({ capture: capture }, charges) });
                return [3 /*break*/, 14];
            case 13:
                err_1 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_1.message, err_1))];
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.createCheckoutOrder = createCheckoutOrder;
var captureCheckoutOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, paymentMethodId, orderId, jobId, customerId, customer, job, quotation, contractor, contractorId, capture, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, quotationId = _a.quotationId, paymentMethodId = _a.paymentMethodId, orderId = _a.orderId;
                jobId = req.params.jobId;
                customerId = req.customer.id;
                return [4 /*yield*/, findCustomer(customerId)];
            case 1:
                customer = _b.sent();
                return [4 /*yield*/, findJob(jobId)];
            case 2:
                job = _b.sent();
                return [4 /*yield*/, findQuotation(quotationId)];
            case 3:
                quotation = _b.sent();
                return [4 /*yield*/, findContractor(quotation.contractor)];
            case 4:
                contractor = _b.sent();
                contractorId = contractor.id;
                return [4 /*yield*/, paypal_1.PayPalService.payment.captureOrder(orderId)];
            case 5:
                capture = _b.sent();
                return [4 /*yield*/, job.save()];
            case 6:
                _b.sent();
                res.json({ success: true, message: 'Payment intent created', data: capture });
                return [3 /*break*/, 8];
            case 7:
                err_2 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_2.message, err_2))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.captureCheckoutOrder = captureCheckoutOrder;
var createOrderEstimatePaymentCheckout = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, paymentMethodId_1, jobId, errors, customerId, customer, job, quotation, contractor, changeOrderEstimate, paymentMethod, paymentType, transactionType, charges, metadata, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, quotationId = _a.quotationId, paymentMethodId_1 = _a.paymentMethodId;
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, findCustomer(customerId)];
            case 1:
                customer = _b.sent();
                return [4 /*yield*/, findJob(jobId)];
            case 2:
                job = _b.sent();
                return [4 /*yield*/, findQuotation(quotationId)];
            case 3:
                quotation = _b.sent();
                return [4 /*yield*/, findContractor(quotation.contractor)];
            case 4:
                contractor = _b.sent();
                changeOrderEstimate = quotation.changeOrderEstimate;
                if (!changeOrderEstimate)
                    throw new Error('No  changeOrder estimate for this job');
                if (changeOrderEstimate.isPaid)
                    throw new Error('Extra estimate already paid');
                paymentMethod = customer.stripePaymentMethods.find(function (method) { return method.id === paymentMethodId_1; });
                if (!paymentMethod) {
                    paymentMethod = customer.stripePaymentMethods[0];
                }
                if (!paymentMethod)
                    throw new Error('No such payment method');
                paymentType = payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT;
                transactionType = transaction_model_1.TRANSACTION_TYPE.CHANGE_ORDER_PAYMENT;
                return [4 /*yield*/, quotation.calculateCharges(paymentType)];
            case 5:
                charges = _b.sent();
                metadata = {
                    customerId: customer.id,
                    contractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                    quotationId: quotation.id,
                    jobId: jobId,
                    paymentType: paymentType,
                    paymentMethod: paymentMethod.id,
                    email: customer.email,
                    remark: 'change_order_estimate_payment',
                };
                // const transaction = await createTransaction(customerId, contractor.id, jobId, charges, paymentMethod, transactionType, metadata);
                // metadata.transactionId = transaction.id
                // const payload = prepareStripePayload({paymentMethodId: paymentMethod.id, customer, contractor, charges, jobId, metadata, manualCapture:false});
                job.isChangeOrder = false;
                return [4 /*yield*/, job.save()];
            case 6:
                _b.sent();
                events_1.JobEvent.emit('CHANGE_ORDER_ESTIMATE_PAID', { job: job, quotation: quotation, changeOrderEstimate: changeOrderEstimate });
                res.json({ success: true, message: 'Payment intent created', data: "" });
                return [3 /*break*/, 8];
            case 7:
                err_3 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_3.message, err_3))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createOrderEstimatePaymentCheckout = createOrderEstimatePaymentCheckout;
var captureOrderEstimatePaymentCheckout = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, paymentMethodId_2, jobId, errors, customerId, customer, job, quotation, contractor, changeOrderEstimate, paymentMethod, paymentType, transactionType, charges, metadata, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, quotationId = _a.quotationId, paymentMethodId_2 = _a.paymentMethodId;
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, findCustomer(customerId)];
            case 1:
                customer = _b.sent();
                return [4 /*yield*/, findJob(jobId)];
            case 2:
                job = _b.sent();
                return [4 /*yield*/, findQuotation(quotationId)];
            case 3:
                quotation = _b.sent();
                return [4 /*yield*/, findContractor(quotation.contractor)];
            case 4:
                contractor = _b.sent();
                changeOrderEstimate = quotation.changeOrderEstimate;
                if (!changeOrderEstimate)
                    throw new Error('No  changeOrder estimate for this job');
                if (changeOrderEstimate.isPaid)
                    throw new Error('Extra estimate already paid');
                paymentMethod = customer.stripePaymentMethods.find(function (method) { return method.id === paymentMethodId_2; });
                if (!paymentMethod) {
                    paymentMethod = customer.stripePaymentMethods[0];
                }
                if (!paymentMethod)
                    throw new Error('No such payment method');
                paymentType = payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT;
                transactionType = transaction_model_1.TRANSACTION_TYPE.CHANGE_ORDER_PAYMENT;
                return [4 /*yield*/, quotation.calculateCharges(paymentType)];
            case 5:
                charges = _b.sent();
                metadata = {
                    customerId: customer.id,
                    contractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                    quotationId: quotation.id,
                    jobId: jobId,
                    paymentType: paymentType,
                    paymentMethod: paymentMethod.id,
                    email: customer.email,
                    remark: 'change_order_estimate_payment',
                };
                // const transaction = await createTransaction(customerId, contractor.id, jobId, charges, paymentMethod, transactionType, metadata);
                // metadata.transactionId = transaction.id
                job.isChangeOrder = false;
                return [4 /*yield*/, job.save()];
            case 6:
                _b.sent();
                events_1.JobEvent.emit('CHANGE_ORDER_ESTIMATE_PAID', { job: job, quotation: quotation, changeOrderEstimate: changeOrderEstimate });
                res.json({ success: true, message: 'Payment intent created', data: "" });
                return [3 /*break*/, 8];
            case 7:
                err_4 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_4.message, err_4))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.captureOrderEstimatePaymentCheckout = captureOrderEstimatePaymentCheckout;
var payJobEstimate = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, paymentToken_1, jobId, errors, customerId, customer, job, quotation, contractor, contractorId, paymentMethod, paymentType, transactionType, charges, metadata, paypalPaymentLog, capture, conversation, newMessage, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                _a = req.body, quotationId = _a.quotationId, paymentToken_1 = _a.paymentToken;
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, findCustomer(customerId)];
            case 1:
                customer = _b.sent();
                return [4 /*yield*/, findJob(jobId)];
            case 2:
                job = _b.sent();
                return [4 /*yield*/, findQuotation(quotationId)];
            case 3:
                quotation = _b.sent();
                return [4 /*yield*/, findContractor(quotation.contractor)];
            case 4:
                contractor = _b.sent();
                contractorId = contractor.id;
                paymentMethod = customer.paypalPaymentMethods.find(function (method) { return method.vault_id === paymentToken_1; });
                if (!paymentMethod) {
                    paymentMethod = customer.paypalPaymentMethods[0];
                }
                if (!paymentMethod)
                    throw new Error('No such payment method');
                if (job.status === job_model_1.JOB_STATUS.BOOKED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'This job is not pending, so new payment is not possible' })];
                }
                paymentType = payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT;
                transactionType = quotation.type;
                if (transactionType == job_quotation_model_1.JOB_QUOTATION_TYPE.SITE_VISIT)
                    paymentType = payment_schema_1.PAYMENT_TYPE.SITE_VISIT_PAYMENT;
                if (transactionType == job_quotation_model_1.JOB_QUOTATION_TYPE.JOB_DAY)
                    paymentType = payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT;
                return [4 /*yield*/, quotation.calculateCharges(paymentType)];
            case 5:
                charges = _b.sent();
                metadata = {
                    customerId: customer.id,
                    contractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                    quotationId: quotation.id,
                    paymentType: paymentType,
                    paymentMethod: paymentMethod.id,
                    jobId: jobId,
                    email: customer.email,
                    remark: 'initial_job_payment',
                };
                return [4 /*yield*/, paypal_payment_log_model_1.PaypalPaymentLog.create({
                        user: customerId,
                        'userType': 'customers',
                        metadata: metadata
                    })];
            case 6:
                paypalPaymentLog = _b.sent();
                return [4 /*yield*/, paypal_1.PayPalService.payment.chargeSavedCard({ paymentToken: paymentToken_1, amount: charges.customerPayable, metaId: paypalPaymentLog === null || paypalPaymentLog === void 0 ? void 0 : paypalPaymentLog.id })
                    // job.status = JOB_STATUS.BOOKED; // mark as booked from webhook event
                ];
            case 7:
                capture = _b.sent();
                // job.status = JOB_STATUS.BOOKED; // mark as booked from webhook event
                job.bookingViewedByContractor = false;
                return [4 /*yield*/, job.save()];
            case 8:
                _b.sent();
                return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(customerId, 'customers', contractorId, 'contractors')];
            case 9:
                conversation = _b.sent();
                return [4 /*yield*/, messages_schema_1.MessageModel.create({
                        conversation: conversation._id,
                        sender: customerId,
                        senderType: 'customers',
                        message: "New Job Payment",
                        messageType: messages_schema_1.MessageType.ALERT,
                        createdAt: new Date(),
                        entity: jobId,
                        entityType: 'jobs'
                    })];
            case 10:
                newMessage = _b.sent();
                events_1.ConversationEvent.emit('NEW_MESSAGE', { message: newMessage });
                // JobEvent.emit('JOB_BOOKED', { jobId, contractorId, customerId, quotationId, paymentType })
                res.json({ success: true, message: 'Payment created', data: capture });
                return [3 /*break*/, 12];
            case 11:
                err_5 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_5.message, err_5.err))];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.payJobEstimate = payJobEstimate;
var payChangeOrderEstimate = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, paymentToken_2, jobId, errors, customerId, customer, job, quotation, contractor, changeOrderEstimate, paymentMethod, paymentType, transactionType, charges, metadata, paypalPaymentLog, capture, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                _a = req.body, quotationId = _a.quotationId, paymentToken_2 = _a.paymentToken;
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, findCustomer(customerId)];
            case 1:
                customer = _b.sent();
                return [4 /*yield*/, findJob(jobId)];
            case 2:
                job = _b.sent();
                return [4 /*yield*/, findQuotation(quotationId)];
            case 3:
                quotation = _b.sent();
                return [4 /*yield*/, findContractor(quotation.contractor)];
            case 4:
                contractor = _b.sent();
                changeOrderEstimate = quotation.changeOrderEstimate;
                if (!changeOrderEstimate)
                    throw new Error('No  changeOrder estimate for this job');
                if (changeOrderEstimate.isPaid)
                    throw new Error('Extra estimate already paid');
                paymentMethod = customer.paypalPaymentMethods.find(function (method) { return method.vault_id === paymentToken_2; });
                if (!paymentMethod) {
                    paymentMethod = customer.paypalPaymentMethods[0];
                }
                if (!paymentMethod)
                    throw new Error('No such payment method');
                paymentType = payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT;
                transactionType = transaction_model_1.TRANSACTION_TYPE.CHANGE_ORDER_PAYMENT;
                return [4 /*yield*/, quotation.calculateCharges(paymentType)];
            case 5:
                charges = _b.sent();
                metadata = {
                    customerId: customer.id,
                    contractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                    quotationId: quotation.id,
                    jobId: jobId,
                    paymentType: paymentType,
                    paymentMethod: paymentMethod.id,
                    email: customer.email,
                    remark: 'change_order_estimate_payment',
                };
                return [4 /*yield*/, paypal_payment_log_model_1.PaypalPaymentLog.create({
                        user: customerId,
                        'userType': 'customers',
                        metadata: metadata
                    })];
            case 6:
                paypalPaymentLog = _b.sent();
                return [4 /*yield*/, paypal_1.PayPalService.payment.chargeSavedCard({ paymentToken: paymentToken_2, amount: charges.customerPayable, metaId: paypalPaymentLog === null || paypalPaymentLog === void 0 ? void 0 : paypalPaymentLog.id })];
            case 7:
                capture = _b.sent();
                job.isChangeOrder = false;
                job.bookingViewedByContractor = false;
                return [4 /*yield*/, job.save()];
            case 8:
                _b.sent();
                events_1.JobEvent.emit('CHANGE_ORDER_ESTIMATE_PAID', { job: job, quotation: quotation, changeOrderEstimate: changeOrderEstimate });
                res.json({ success: true, message: 'Payment intent created', data: capture });
                return [3 /*break*/, 10];
            case 9:
                err_6 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_6.message, err_6))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.payChangeOrderEstimate = payChangeOrderEstimate;
exports.CustomerPaypalPaymentController = {
    captureCheckoutOrder: exports.captureCheckoutOrder,
    createCheckoutOrder: exports.createCheckoutOrder,
    createOrderEstimatePaymentCheckout: exports.createOrderEstimatePaymentCheckout,
    captureOrderEstimatePaymentCheckout: exports.captureOrderEstimatePaymentCheckout,
    payChangeOrderEstimate: exports.payChangeOrderEstimate,
    payJobEstimate: exports.payJobEstimate,
};
