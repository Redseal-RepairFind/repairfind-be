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
exports.CustomerPaymentController = exports.getTransactions = exports.captureJobPayment = exports.makeJobPayment = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var job_model_1 = require("../../../database/common/job.model");
var custom_errors_1 = require("../../../utils/custom.errors");
var transaction_model_1 = __importStar(require("../../../database/common/transaction.model"));
var stripe_1 = require("../../../services/stripe");
var job_quotation_model_1 = require("../../../database/common/job_quotation.model");
//customer accept and pay for the work /////////////
var makeJobPayment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, paymentMethodId_1, jobId, errors, customerId, customer, job, quotation, contractor, paymentMethod, generateInvoce, invoiceId, charges, transaction, payload, stripePayment, err_1;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 9, , 10]);
                _a = req.body, quotationId = _a.quotationId, paymentMethodId_1 = _a.paymentMethodId;
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                customer = _e.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId })];
            case 2:
                job = _e.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job do not exist" })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOne({ _id: quotationId })];
            case 3:
                quotation = _e.sent();
                if (!quotation) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ success: false, message: "Job quotation not found" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: quotation.contractor })];
            case 4:
                contractor = _e.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ success: false, message: "Contractor not found" })];
                }
                // Check if contractor has a verified connected account
                if (!contractor.onboarding.hasStripeAccount || !(((_b = contractor.stripeAccountStatus) === null || _b === void 0 ? void 0 : _b.card_payments_enabled) && ((_c = contractor.stripeAccountStatus) === null || _c === void 0 ? void 0 : _c.transfers_enabled))) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "You cannot make payment to this contractor because his/her Stripe connect account is not set up" })];
                }
                paymentMethod = customer.stripePaymentMethods.find(function (method) { return method.id == paymentMethodId_1; });
                if (!paymentMethod) {
                    paymentMethod = customer.stripePaymentMethods[0];
                }
                ;
                if (!paymentMethod)
                    throw new Error("No such payment method");
                generateInvoce = new Date().getTime().toString();
                invoiceId = generateInvoce.substring(generateInvoce.length - 5);
                return [4 /*yield*/, quotation.calculateCharges()];
            case 5:
                charges = _e.sent();
                return [4 /*yield*/, transaction_model_1.default.create({
                        type: transaction_model_1.TRANSACTION_TYPE.JOB_PAYMENT,
                        amount: charges.totalAmount,
                        initiatorUser: customerId,
                        initiatorUserType: 'customers',
                        fromUser: customerId,
                        fromUserType: 'customers',
                        toUser: contractor.id,
                        toUserType: 'contractors',
                        description: "qoutation from ".concat(contractor === null || contractor === void 0 ? void 0 : contractor.firstName, " payment"),
                        status: transaction_model_1.TRANSACTION_STATUS.PENDING,
                        remark: 'qoutation',
                        invoice: {
                            items: quotation.estimates,
                            charges: quotation.charges
                        },
                        job: jobId
                    })
                    // const transactionId = JSON.stringify(saveTransaction._id)
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
                ];
            case 6:
                transaction = _e.sent();
                payload = {
                    payment_method_types: ['card'],
                    payment_method: paymentMethod.id,
                    currency: 'usd',
                    amount: (charges.totalAmount) * 100,
                    application_fee_amount: (charges.processingFee) * 100, // send everthing to connected account and  application_fee_amount will be transfered back
                    transfer_data: {
                        // amount: (charges.contractorAmount) * 100, // transfer to connected account
                        destination: (_d = contractor === null || contractor === void 0 ? void 0 : contractor.stripeAccount.id) !== null && _d !== void 0 ? _d : '' // mostimes only work with same region example us, user
                        // https://docs.stripe.com/connect/destination-charges
                    },
                    on_behalf_of: contractor === null || contractor === void 0 ? void 0 : contractor.stripeAccount.id,
                    metadata: {
                        customerId: customerId,
                        constractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                        quotationId: quotationId,
                        type: "job_booking",
                        jobId: jobId,
                        email: customer.email,
                        transactionId: transaction.id,
                        remark: 'initial_job_payment' // we can have extra_job_payment
                    },
                    customer: customer.stripeCustomer.id,
                    off_session: true,
                    confirm: true,
                };
                return [4 /*yield*/, stripe_1.StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload)];
            case 7:
                stripePayment = _e.sent();
                job.status = job_model_1.JOB_STATUS.BOOKED;
                return [4 /*yield*/, job.save()];
            case 8:
                _e.sent();
                res.json({ success: true, message: 'Payment intent created', data: stripePayment });
                return [3 /*break*/, 10];
            case 9:
                err_1 = _e.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_1.message, err_1))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.makeJobPayment = makeJobPayment;
var captureJobPayment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, paymentMethodId_2, jobId, errors, customerId, customer, job, quotation, paymentMethod, contractor, charges, transaction, payload, stripePayment, err_2;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 9, , 10]);
                _a = req.body, quotationId = _a.quotationId, paymentMethodId_2 = _a.paymentMethodId;
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                customer = _e.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId })];
            case 2:
                job = _e.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "job do not exist" })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOne({ _id: quotationId })];
            case 3:
                quotation = _e.sent();
                if (!quotation) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Job quotation not found" })];
                }
                paymentMethod = customer.stripePaymentMethods.find(function (method) { return method.id == paymentMethodId_2; });
                if (!paymentMethod) {
                    paymentMethod = customer.stripePaymentMethods[0];
                }
                ;
                if (!paymentMethod)
                    throw new Error("No such payment method");
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: quotation.contractor })];
            case 4:
                contractor = _e.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ success: false, message: "Contractor not found" })];
                }
                // Check if contractor has a verified connected account
                if (!contractor.onboarding.hasStripeAccount || !(((_b = contractor.stripeAccountStatus) === null || _b === void 0 ? void 0 : _b.card_payments_enabled) && ((_c = contractor.stripeAccountStatus) === null || _c === void 0 ? void 0 : _c.transfers_enabled))) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "You cannot make payment to this contractor because his/her Stripe connect account is not set up" })];
                }
                //check if job is already booked
                if (job.status == job_model_1.JOB_STATUS.BOOKED) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ success: false, message: "This job is not pending, so new payment is not possible" })];
                }
                return [4 /*yield*/, quotation.calculateCharges()];
            case 5:
                charges = _e.sent();
                return [4 /*yield*/, transaction_model_1.default.create({
                        type: transaction_model_1.TRANSACTION_TYPE.JOB_PAYMENT,
                        amount: charges.totalAmount,
                        initiatorUser: customerId,
                        initiatorUserType: 'customers',
                        fromUser: customerId,
                        fromUserType: 'customers',
                        toUser: contractor.id,
                        toUserType: 'contractors',
                        description: "qoutation from ".concat(contractor === null || contractor === void 0 ? void 0 : contractor.firstName, " payment"),
                        status: transaction_model_1.TRANSACTION_STATUS.PENDING,
                        remark: 'qoutation',
                        invoice: {
                            items: quotation.estimates,
                            charges: quotation.charges
                        },
                        paymentMethod: paymentMethod,
                        job: jobId
                    })
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
                ];
            case 6:
                transaction = _e.sent();
                payload = {
                    payment_method_types: ['card'],
                    payment_method_options: {
                        card: {
                            capture_method: 'manual', // request_extended_authorization: 'if_available', // 30 days
                        },
                    },
                    expand: ['latest_charge'],
                    payment_method: paymentMethod.id,
                    currency: 'usd',
                    amount: (charges.totalAmount) * 100,
                    application_fee_amount: (charges.processingFee) * 100, // send everthing to connected account and  application_fee_amount will be transfered back
                    transfer_data: {
                        // amount: (charges.contractorAmount) * 100, // transfer to connected account
                        destination: (_d = contractor === null || contractor === void 0 ? void 0 : contractor.stripeAccount.id) !== null && _d !== void 0 ? _d : '' // mostimes only work with same region example us, user // https://docs.stripe.com/connect/destination-charges
                    },
                    on_behalf_of: contractor === null || contractor === void 0 ? void 0 : contractor.stripeAccount.id,
                    metadata: {
                        customerId: customerId,
                        constractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                        quotationId: quotationId,
                        type: "job_payment",
                        jobId: jobId,
                        email: customer.email,
                        transactionId: transaction.id,
                        remark: 'initial_job_payment' // we can have extra_job_payment
                    },
                    customer: customer.stripeCustomer.id,
                    off_session: true,
                    confirm: true,
                    capture_method: 'manual'
                };
                return [4 /*yield*/, stripe_1.StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload)];
            case 7:
                stripePayment = _e.sent();
                job.status = job_model_1.JOB_STATUS.BOOKED;
                return [4 /*yield*/, job.save()];
            case 8:
                _e.sent();
                res.json({ success: true, message: 'Payment intent created', data: stripePayment });
                return [3 /*break*/, 10];
            case 9:
                err_2 = _e.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_2.message, err_2))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.captureJobPayment = captureJobPayment;
var getTransactions = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
        }
        catch (err) {
            return [2 /*return*/, next(new custom_errors_1.BadRequestError(err.message, err))];
        }
        return [2 /*return*/];
    });
}); };
exports.getTransactions = getTransactions;
// //customer get job qoutation payment and open /////////////
// export const customerGetJobQoutationPaymentOpenController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const jobRequests = await JobModel.find({ customerId, status: 'qoutation payment open' }).sort({ createdAt: -1 })
//         let jobRequested = []
//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];
//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');
//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }
//             jobRequested.push(obj)
//         }
//         res.json({
//             jobRequested
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer confirm or verified payment /////////////
// export const customerVerififyPaymentForJobController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//             jobId,
//             paymentId,
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const job = await JobModel.findOne({ _id: jobId, customerId, status: 'qoutation payment open' })
//         if (!job) {
//             return res
//                 .status(401)
//                 .json({ message: "job do not exist or payment has not be initialize" });
//         }
//         const contractor = await ContractorModel.findOne({ _id: job.contractorId }).select('-password');
//         if (!contractor) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect contractor Id" });
//         }
//         let secret = process.env.STRIPE_KEY || "sk_test_51OTMkGIj2KYudFaR1rNIBOPTaBESYoJco6lTCBZw5a0inyttRJOotcds1rXpXCJDSJrpNmIt2FBAaSxdmuma3ZTF00h48RxVny";
//         let stripeInstance;
//         console.log(secret)
//         if (!secret) {
//             return res
//                 .status(401)
//                 .json({ message: "Sripe API Key is missing" });
//         }
//         stripeInstance = new stripe(secret);
//         const paymentConfirmation = await stripeInstance.checkout.sessions.retrieve(paymentId)
//         if (paymentConfirmation.status !== "complete") {
//             return res
//                 .status(401)
//                 .json({ message: "no payment or payment url expired" });
//         }
//         if (paymentConfirmation.metadata?.customerId != customerId) {
//             return res
//                 .status(401)
//                 .json({ message: "payment ID in not for this customer" });
//         }
//         job.status = "qoutation payment confirm and job in progress";
//         await job.save()
//         const html = customerAcceptQouteAndPaySendEmailHtmlMailTemplate(contractor?.firstName, checkCustomer.firstName);
//         let emailData = {
//             emailTo: contractor.email,
//             subject: "Artisan payment for the job",
//             html
//         };
//         await sendEmail(emailData);
//         const admins = await AdminRegModel.find();
//         for (let i = 0; i < admins.length; i++) {
//             const admin = admins[i];
//             const html = customerToAdminAfterPaymentSendEmailHtmlMailTemplate(contractor.firstName, checkCustomer.firstName);
//             let emailData = {
//                 emailTo: admin.email,
//                 subject: "Artisan payment for the job",
//                 html
//             };
//             await sendEmail(emailData);
//         }
//         res.json({
//             message: "payment successfully comfirm",
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer get job qoutation payment confirm and job in progres /////////////
// export const customerGetJobQoutationPaymentConfirmAndJobInProgressController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const jobRequests = await JobModel.find({ customerId, status: 'qoutation payment confirm and job in progress' }).sort({ createdAt: -1 })
//         let jobRequested = []
//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];
//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');
//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }
//             jobRequested.push(obj)
//         }
//         res.json({
//             jobRequested
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer get job request rejected /////////////
// export const customerGetJobRejectedontroller = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const jobRequests = await JobModel.find({ customerId, status: 'job reject' }).sort({ createdAt: -1 })
//         let jobRequested = []
//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];
//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');
//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }
//             jobRequested.push(obj)
//         }
//         res.json({
//             jobRequested
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //get all job history/////////////
// export const customerGetAllSetJobController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         let {
//             page,
//             limit
//         } = req.query;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         page = page || 1;
//         limit = limit || 50;
//         const skip = (page - 1) * limit;
//         const jobs = await JobModel.find({ customerId })
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);
//         const jobHistory = [];
//         for (let i = 0; i < jobs.length; i++) {
//             const job = jobs[i];
//             const contractorProfile = await ContractorModel.findOne({ _id: job.contractorId }).select('-password')
//             //const contractorDocument = await ContractorDocumentValidateModel.findOne({contractorId: job.contractorId});
//             const obj = {
//                 job,
//                 contractorProfile,
//                 //contractorDocument
//             }
//             jobHistory.push(obj);
//         }
//         res.json({
//             jobHistory
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer confirm or verified payment web hook/////////////
// export const customerVerififyPaymentWebhook = async (
//     jobId: any,
//     customerId: any,
//     transactionId: any
// ) => {
//     try {
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return
//         }
//         const job = await JobModel.findOne({ _id: jobId, customerId, status: 'qoutation payment open' })
//         if (!job) {
//             return
//         }
//         const contractor = await ContractorModel.findOne({ _id: job.contractorId }).select('-password');
//         if (!contractor) {
//             return
//         }
//         const transaction = await TransactionModel.findOne({ _id: transactionId.substring(1, transactionId.length - 1) });
//         if (!transaction) {
//             return
//         }
//         job.status = "qoutation payment confirm and job in progress";
//         await job.save()
//         transaction.status = 'successful',
//             await transaction.save();
//         const html = customerAcceptQouteAndPaySendEmailHtmlMailTemplate(contractor?.firstName, checkCustomer.firstName);
//         let emailData = {
//             emailTo: contractor.email,
//             subject: "Artisan payment for the job",
//             html
//         };
//         await sendEmail(emailData);
//         const admins = await AdminRegModel.find();
//         const adminPaymentHtml = htmlAdminPaymentTemplate(jobId, checkCustomer._id, `${job.totalAmountCustomerToPaid} for job qoutation`)
//         for (let i = 0; i < admins.length; i++) {
//             const admin = admins[i];
//             let adminEmailData = {
//                 emailTo: admin.email,
//                 subject: "qoutation payment",
//                 html: adminPaymentHtml
//             };
//             await sendEmail(adminEmailData);
//             //admin notification
//             const adminNotic = new AdminNoficationModel({
//                 title: "Job Booked",
//                 message: `${job._id} - ${checkCustomer.firstName} booked a job for $${job.totalAmountCustomerToPaid}.`,
//                 status: "unseen"
//             })
//             await adminNotic.save();
//         }
//         //contractor notification
//         const contractorNotic = new ContractorNotificationModel({
//             contractorId: contractor._id,
//             message: `You've been booked for a job from ${checkCustomer.firstName} for ${job.time}`,
//             status: "unseen"
//         });
//         await contractorNotic.save();
//         //customer notification
//         const customerNotic = new CustomerNotificationModel({
//             customerId: checkCustomer._id,
//             message: `You've booked a job with ${contractor.firstName} for ${job.jobTitle}`,
//             status: "unseen"
//         })
//         await customerNotic.save();
//         //customer notification two
//         const customerNoticTwo = new CustomerNotificationModel({
//             customerId: checkCustomer._id,
//             message: `You've just sent a payment for this job - ${job.jobTitle}, Thank you.`,
//             status: "unseen"
//         })
//         await customerNoticTwo.save();
//     } catch (err: any) {
//         // signup error
//         console.log("payment Error", "err")
//     }
// }
// //customer get job completed by contractor /////////////
// export const customerGetComletedByContractorController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const jobRequests = await JobModel.find({ customerId, status: 'completed' }).sort({ createdAt: -1 })
//         let jobRequested = []
//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];
//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');
//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }
//             jobRequested.push(obj)
//         }
//         res.json({
//             jobRequested
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer comfirm job completed by Contractor /////////////
// export const customerComfirmedJobJobController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//             jobId
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const job = await JobModel.findOne({ _id: jobId, customerId, status: 'completed' })
//         if (!job) {
//             return res
//                 .status(401)
//                 .json({ message: "job do not exist or has not been completed by artisan" });
//         }
//         const contractor = await ContractorModel.findOne({ _id: job.contractorId }).select('-password');
//         if (!contractor) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect contractor id" });
//         }
//         const contractorBank = await ContractorBankModel.findOne({ contractorId: contractor._id })
//         if (!contractorBank) {
//             return res
//                 .status(401)
//                 .json({ message: "contractor has not enter his bank detail" });
//         }
//         const newPayout = new PayoutModel({
//             amount: job.totalAmountContractorWithdraw,
//             accountName: `${contractor.firstName} ${contractor.lastName}`,
//             accountNumber: contractorBank.accountNumber,
//             bankName: contractorBank.financialInstitution,
//             recieverId: contractor._id,
//             jobId,
//             status: "pending"
//         })
//         await newPayout.save()
//         job.status = "comfirmed";
//         await job.save()
//         //admin notification 
//         const adminNotic = new AdminNoficationModel({
//             title: "Customer Confirmed Job Completed",
//             message: `${jobId} - ${checkCustomer.firstName} has updated this job to completed and comfirm`,
//             status: "unseen"
//         })
//         await adminNotic.save();
//         res.json({
//             message: "you successfully comfirm this job completed by artisan"
//         });
//     } catch (err: any) {
//         console.log("error", err)
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer get you comfirm  job/////////////
// export const customerGetComfirmJobController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const jobRequests = await JobModel.find({ customerId, status: 'comfirmed' }).sort({ createdAt: -1 })
//         let jobRequested = []
//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];
//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');
//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }
//             jobRequested.push(obj)
//         }
//         res.json({
//             jobRequested
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer complaint job completed by Contractor /////////////
// export const customerComplaintedJobJobController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//             jobId
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const job = await JobModel.findOne({ _id: jobId, customerId, status: 'completed' })
//         if (!job) {
//             return res
//                 .status(401)
//                 .json({ message: "job do not exist or has not been completed by artisan" });
//         }
//         const contractor = await ContractorModel.findOne({ _id: job.contractorId }).select('-password');
//         job.status = "complain";
//         await job.save()
//         //admin notification 
//         const adminNotic = new AdminNoficationModel({
//             title: "Customer Disagreed on Job Completion",
//             message: `${job} - ${checkCustomer.firstName} disagreed that this job has been completed by this contractor ${contractor?.firstName}.`,
//             status: "unseen"
//         })
//         await adminNotic.save();
//         res.json({
//             message: "you successfully complained about this job completed by artisan"
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer get job he  complain about /////////////
// export const customerGetComplainJobController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const jobRequests = await JobModel.find({ customerId, status: 'complain' }).sort({ createdAt: -1 })
//         let jobRequested = []
//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];
//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');
//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }
//             jobRequested.push(obj)
//         }
//         res.json({
//             jobRequested
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
exports.CustomerPaymentController = {
    makeJobPayment: exports.makeJobPayment,
    captureJobPayment: exports.captureJobPayment,
};
