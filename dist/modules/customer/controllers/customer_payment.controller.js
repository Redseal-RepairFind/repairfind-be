"use strict";
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
exports.CustomerPaymentController = exports.captureJobPayment = exports.makeChangeOrderEstimatePayment = exports.makeJobPayment = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var job_model_1 = require("../../../database/common/job.model");
var custom_errors_1 = require("../../../utils/custom.errors");
var transaction_model_1 = __importStar(require("../../../database/common/transaction.model"));
var stripe_1 = require("../../../services/stripe");
var job_quotation_model_1 = require("../../../database/common/job_quotation.model");
var events_1 = require("../../../events");
var payment_schema_1 = require("../../../database/common/payment.schema");
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
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractor = _c.sent();
                if (!contractor) {
                    throw new custom_errors_1.BadRequestError('Contractor not found');
                }
                if (!contractor.onboarding.hasStripeAccount || !(((_a = contractor.stripeAccountStatus) === null || _a === void 0 ? void 0 : _a.card_payments_enabled) && ((_b = contractor.stripeAccountStatus) === null || _b === void 0 ? void 0 : _b.transfers_enabled))) {
                    throw new custom_errors_1.BadRequestError('You cannot make payment to this contractor because his/her Stripe connect account is not set up');
                }
                return [2 /*return*/, contractor];
        }
    });
}); };
var createTransaction = function (customerId, contractorId, jobId, charges, paymentMethod, paymentType, metadata) {
    if (metadata === void 0) { metadata = null; }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, transaction_model_1.default.findByIdAndUpdate({
                        job: jobId,
                        type: paymentType,
                    }, {
                        type: paymentType,
                        amount: charges.totalAmount,
                        currency: 'USD',
                        initiatorUser: customerId,
                        initiatorUserType: 'customers',
                        fromUser: customerId,
                        fromUserType: 'customers',
                        toUser: contractorId,
                        toUserType: 'contractors',
                        description: "Quotation from ".concat(contractorId, " payment"),
                        remark: 'quotation',
                        metadata: metadata,
                        invoice: {
                            items: charges.estimates,
                            charges: charges.charges
                        },
                        paymentMethod: paymentMethod,
                        job: jobId,
                        status: transaction_model_1.TRANSACTION_STATUS.PENDING
                    }, { new: true, upsert: true })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
var prepareStripePayload = function (data) {
    //  Direct CHARGES
    // With Connect, you can make charges directly to the connected account and take fees in the process.
    // To create a direct charge on the connected account, create a PaymentIntent object and add the Stripe-Account header with a value of the connected account ID:
    //  https://docs.stripe.com/connect/charges
    // When using Standard accounts, Stripe recommends that you create direct charges. Though uncommon, there are times when it’s appropriate to use direct charges on Express or Custom accounts.
    // With this charge type:
    // You create a charge on your user’s account so the payment appears as a charge on the connected account, not in your account balance.
    // The connected account’s balance increases with every charge.
    // Funds always settle in the country of the connected account.
    // Your account balance increases with application fees from every charge.
    // The connected account’s balance is debited for refunds and chargebacks.
    //direct charge requires the customer has to exists on the connected account platform -- consider cloning https://docs.stripe.com/connect/cloning-customers-across-accounts
    // we can still take fees back to the platform by specifying application_fee_amount: 123,
    // DESTINATION CHARGES
    // Customers transact with your platform for products or services provided by your connected account.
    // The transaction involves a single user.
    // Stripe fees are debited from your platform account.
    //flow 1
    // here everything is transfered to connected account and then application_fee_amount is wired back to platform
    // application_fee_amount: 123,
    // transfer_data: {
    //     destination: '{{CONNECTED_ACCOUNT_ID}}',
    // },
    //flow 2
    // here only amount specified in transfer_data is transfered to connected account
    // transfer_data: {
    //     amount: 877,
    //     destination: '{{CONNECTED_ACCOUNT_ID}}',
    //   },
    // When you use on_behalf_of:
    // Charges are settled in the connected account’s country and settlement currency.
    // The connected account’s statement descriptor is displayed on the customer’s credit card statement.
    // If the connected account is in a different country than the platform, the connected account’s address and phone number are displayed on the customer’s credit card statement.
    // The number of days that a pending balance is held before being paid out depends on the delay_days setting on the connected account.
    var paymentMethodId = data.paymentMethodId, customer = data.customer, contractor = data.contractor, charges = data.charges, transactionId = data.transactionId, jobId = data.jobId, metadata = data.metadata, manualCapture = data.manualCapture;
    // const repairfindStripeAccount = 'null'
    var payload = {
        payment_method_types: ['card'],
        payment_method: paymentMethodId,
        currency: 'cad',
        amount: Math.ceil(charges.totalAmount * 100),
        // send amount  minus processingFee to contractor
        // application_fee_amount: Math.ceil(charges.processingFee * 100),
        // transfer_data: {
        //     destination: contractor?.stripeAccount.id ?? ''
        // },
        // on_behalf_of: contractor?.stripeAccount.id,
        // send everything to repairfind connected account - serving as escrow
        // transfer_data: {
        //     destination: repairfindStripeAccount
        // },
        // on_behalf_of: repairfindStripeAccount,
        metadata: metadata,
        customer: customer.stripeCustomer.id,
        off_session: true,
        confirm: true,
    };
    if (manualCapture) {
        payload.payment_method_options = { card: { capture_method: 'manual' } };
        payload.capture_method = 'manual';
    }
    return payload;
};
var makeJobPayment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, paymentMethodId_1, jobId, errors, customerId, customer, job, quotation, contractor, paymentMethod, paymentType, charges, metadata, transaction, payload, stripePayment, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
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
                paymentMethod = customer.stripePaymentMethods.find(function (method) { return method.id === paymentMethodId_1; });
                if (!paymentMethod) {
                    paymentMethod = customer.stripePaymentMethods[0];
                }
                if (!paymentMethod)
                    throw new Error('No such payment method');
                if (job.status === job_model_1.JOB_STATUS.BOOKED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'This job is not pending, so new payment is not possible' })];
                }
                paymentType = payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT;
                if (quotation.type == job_quotation_model_1.JOB_QUOTATION_TYPE.SITE_VISIT)
                    paymentType = payment_schema_1.PAYMENT_TYPE.SITE_VISIT_PAYMENT;
                if (quotation.type == job_quotation_model_1.JOB_QUOTATION_TYPE.JOB_DAY)
                    paymentType = payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT;
                return [4 /*yield*/, quotation.calculateCharges(paymentType)];
            case 5:
                charges = _b.sent();
                metadata = {
                    customerId: customer.id,
                    contractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                    quotationId: quotation.id,
                    type: paymentType,
                    jobId: jobId,
                    email: customer.email,
                    remark: 'initial_job_payment',
                };
                return [4 /*yield*/, createTransaction(customerId, contractor.id, jobId, charges, paymentMethod, paymentType)];
            case 6:
                transaction = _b.sent();
                metadata.transactionId = transaction.id;
                payload = prepareStripePayload({ paymentMethodId: paymentMethod.id, customer: customer, contractor: contractor, charges: charges, transactionId: transaction.id, jobId: jobId, metadata: metadata, manualCapture: false });
                return [4 /*yield*/, stripe_1.StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload)];
            case 7:
                stripePayment = _b.sent();
                job.status = job_model_1.JOB_STATUS.BOOKED;
                return [4 /*yield*/, job.save()];
            case 8:
                _b.sent();
                res.json({ success: true, message: 'Payment intent created', data: stripePayment });
                return [3 /*break*/, 10];
            case 9:
                err_1 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_1.message, err_1))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.makeJobPayment = makeJobPayment;
var makeChangeOrderEstimatePayment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, paymentMethodId_2, jobId, errors, customerId, customer, job, quotation, contractor, changeOrderEstimate, paymentMethod, paymentType, charges, metadata, transaction, payload, stripePayment, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
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
                return [4 /*yield*/, quotation.calculateCharges(paymentType)];
            case 5:
                charges = _b.sent();
                metadata = {
                    customerId: customer.id,
                    contractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                    quotationId: quotation.id,
                    jobId: jobId,
                    type: paymentType,
                    email: customer.email,
                    remark: 'change_order_estimate_payment',
                };
                return [4 /*yield*/, createTransaction(customerId, contractor.id, jobId, charges, paymentMethod, paymentType, metadata)];
            case 6:
                transaction = _b.sent();
                metadata.transactionId = transaction.id;
                payload = prepareStripePayload({ paymentMethodId: paymentMethod.id, customer: customer, contractor: contractor, charges: charges, transactionId: transaction.id, jobId: jobId, metadata: metadata, manualCapture: false });
                return [4 /*yield*/, stripe_1.StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload)];
            case 7:
                stripePayment = _b.sent();
                job.isChangeOrder = false;
                return [4 /*yield*/, job.save()];
            case 8:
                _b.sent();
                events_1.JobEvent.emit('CHANGE_ORDER_ESTIMATE_PAID', { job: job, quotation: quotation, changeOrderEstimate: changeOrderEstimate });
                res.json({ success: true, message: 'Payment intent created', data: stripePayment });
                return [3 /*break*/, 10];
            case 9:
                err_2 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_2.message, err_2))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.makeChangeOrderEstimatePayment = makeChangeOrderEstimatePayment;
var captureJobPayment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, paymentMethodId_3, jobId, errors, customerId, customer, job, quotation, contractor, paymentMethod, paymentType, charges, metadata, transaction, payload, stripePayment, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                _a = req.body, quotationId = _a.quotationId, paymentMethodId_3 = _a.paymentMethodId;
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
                paymentMethod = customer.stripePaymentMethods.find(function (method) { return method.id === paymentMethodId_3; });
                if (!paymentMethod) {
                    paymentMethod = customer.stripePaymentMethods[0];
                }
                if (!paymentMethod)
                    throw new Error('No such payment method');
                if (job.status === job_model_1.JOB_STATUS.BOOKED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'This job is not pending, so new payment is not possible' })];
                }
                paymentType = payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT;
                if (quotation.type == job_quotation_model_1.JOB_QUOTATION_TYPE.SITE_VISIT)
                    paymentType = payment_schema_1.PAYMENT_TYPE.SITE_VISIT_PAYMENT;
                if (quotation.type == job_quotation_model_1.JOB_QUOTATION_TYPE.JOB_DAY)
                    paymentType = payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT;
                return [4 /*yield*/, quotation.calculateCharges(paymentType)];
            case 5:
                charges = _b.sent();
                metadata = {
                    customerId: customer.id,
                    contractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                    quotationId: quotation.id,
                    type: paymentType,
                    jobId: jobId,
                    paymentType: paymentType,
                    email: customer.email,
                    remark: 'initial_job_payment',
                };
                return [4 /*yield*/, createTransaction(customerId, contractor.id, jobId, charges, paymentMethod, paymentType)];
            case 6:
                transaction = _b.sent();
                metadata.transactionId = transaction.id;
                payload = prepareStripePayload({ paymentMethodId: paymentMethod.id, customer: customer, contractor: contractor, charges: charges, transactionId: transaction.id, jobId: jobId, metadata: metadata, manualCapture: true });
                return [4 /*yield*/, stripe_1.StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload)];
            case 7:
                stripePayment = _b.sent();
                job.status = job_model_1.JOB_STATUS.BOOKED;
                return [4 /*yield*/, job.save()];
            case 8:
                _b.sent();
                res.json({ success: true, message: 'Payment intent created', data: stripePayment });
                return [3 /*break*/, 10];
            case 9:
                err_3 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_3.message, err_3))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.captureJobPayment = captureJobPayment;
exports.CustomerPaymentController = {
    makeJobPayment: exports.makeJobPayment,
    captureJobPayment: exports.captureJobPayment,
    makeChangeOrderEstimatePayment: exports.makeChangeOrderEstimatePayment
};
