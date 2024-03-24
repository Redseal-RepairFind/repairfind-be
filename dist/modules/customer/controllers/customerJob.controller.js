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
exports.customerGetComplainJobController = exports.customerComplaintedJobJobController = exports.customerGetComfirmJobController = exports.customerComfirmedJobJobController = exports.customerGetComletedByContractorController = exports.customerVerififyPaymentWebhook = exports.customerGetAllSetJobController = exports.customerGetJobRejectedontroller = exports.customerGetJobQoutationPaymentConfirmAndJobInProgressController = exports.customerVerififyPaymentForJobController = exports.customerGetJobQoutationPaymentOpenController = exports.customerAcceptAndPayForJobController = exports.customerGetJobQoutationController = exports.customerJobRequestSentToContractorController = exports.customerSendJobToContractorController = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var upload_utility_1 = require("../../../utils/upload.utility");
var uuid_1 = require("uuid");
var job_model_1 = __importDefault(require("../../../database/contractor/models/job.model"));
var send_email_utility_1 = require("../../../utils/send_email_utility");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var stripe_1 = __importDefault(require("stripe"));
var customerAcceptQuoteTem_1 = require("../../../templates/email/customerAcceptQuoteTem");
var customerPaymoneyForQuateTem_1 = require("../../../templates/email/customerPaymoneyForQuateTem");
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var transaction_model_1 = __importDefault(require("../../../database/admin/models/transaction.model"));
var jobRequestTemplate_1 = require("../../../templates/contractorEmail/jobRequestTemplate");
var adminPaymentTemplate_1 = require("../../../templates/adminEmail/adminPaymentTemplate");
var admin_notification_model_1 = __importDefault(require("../../../database/admin/models/admin_notification.model"));
var payout_model_1 = __importDefault(require("../../../database/admin/models/payout.model"));
var contractorBankDetail_model_1 = __importDefault(require("../../../database/contractor/models/contractorBankDetail.model"));
var contractor_notification_model_1 = __importDefault(require("../../../database/contractor/models/contractor_notification.model"));
var customer_notification_model_1 = __importDefault(require("../../../database/customer/models/customer_notification.model"));
//customer send job request to contractor /////////////
var customerSendJobToContractorController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, time, description, address, inspection, postalCode, contractorId, jobTitle, files, errors, customer, customerId, checkCustomer, checkContractor, inspectionVal, images, i, file, fileId, uploadFile, inpection, job, contractorNotic, customerNotic, html, emailData, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                _a = req.body, time = _a.time, description = _a.description, address = _a.address, inspection = _a.inspection, postalCode = _a.postalCode, contractorId = _a.contractorId, jobTitle = _a.jobTitle;
                files = req.files;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _b.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 2:
                checkContractor = _b.sent();
                if (!checkContractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "artisan does not exit" })];
                }
                if (checkContractor.status != 'active') {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "artisan is not active or not verified" })];
                }
                inspectionVal = void 0;
                if (typeof inspection === 'boolean') {
                    inspectionVal = inspection;
                }
                else {
                    inspectionVal = JSON.parse(inspection);
                }
                if (inspectionVal === true) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "inpection payment is required first" })];
                }
                if (!time || !description || !address || !postalCode || !jobTitle) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "all input are required" })];
                }
                images = [];
                if (!(files.length > 0)) return [3 /*break*/, 6];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < files.length)) return [3 /*break*/, 6];
                file = files[i];
                fileId = (0, uuid_1.v4)();
                return [4 /*yield*/, (0, upload_utility_1.uploadToS3)(file.buffer, "".concat(fileId, ".jpg"))];
            case 4:
                uploadFile = _b.sent();
                images.push(uploadFile === null || uploadFile === void 0 ? void 0 : uploadFile.Location);
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                console.log('images', images);
                inpection = {
                    status: false,
                    confirmPayment: false
                };
                job = new job_model_1.default({
                    customerId: customerId,
                    contractorId: contractorId,
                    time: time,
                    description: description,
                    address: address,
                    image: images,
                    postalCode: postalCode,
                    jobTitle: jobTitle,
                    inspection: inpection,
                    status: "sent request"
                });
                return [4 /*yield*/, job.save()];
            case 7:
                _b.sent();
                contractorNotic = new contractor_notification_model_1.default({
                    contractorId: checkContractor._id,
                    message: "You've been sent a job request from ".concat(checkCustomer.firstName),
                    status: "unseen"
                });
                return [4 /*yield*/, contractorNotic.save()];
            case 8:
                _b.sent();
                customerNotic = new customer_notification_model_1.default({
                    customerId: checkCustomer._id,
                    message: "You've sent a job request to ".concat(checkContractor.firstName),
                    status: "unseen"
                });
                return [4 /*yield*/, customerNotic.save()];
            case 9:
                _b.sent();
                html = (0, jobRequestTemplate_1.htmlJobRequestTemplate)(checkContractor.firstName, checkCustomer.firstName, time, description);
                emailData = {
                    emailTo: checkContractor.email,
                    subject: "Job request from customer",
                    html: html
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(emailData)];
            case 10:
                _b.sent();
                res.json({
                    message: "job request successfully sent",
                });
                return [3 /*break*/, 12];
            case 11:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.customerSendJobToContractorController = customerSendJobToContractorController;
//customer get job that he sent request /////////////
var customerJobRequestSentToContractorController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, customer, customerId, checkCustomer, jobRequests, jobRequested, i, jobRequest, contractor, obj, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _b.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ customerId: customerId, status: 'sent request' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password')];
            case 4:
                contractor = _b.sent();
                obj = {
                    job: jobRequest,
                    contractor: contractor
                };
                jobRequested.push(obj);
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                res.json({
                    jobRequested: jobRequested
                });
                return [3 /*break*/, 8];
            case 7:
                err_2 = _b.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerJobRequestSentToContractorController = customerJobRequestSentToContractorController;
//customer get job with sent qoutation /////////////
var customerGetJobQoutationController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, customer, customerId, checkCustomer, jobRequests, jobRequested, i, jobRequest, contractor, obj, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _b.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ customerId: customerId, status: 'sent qoutation' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password')];
            case 4:
                contractor = _b.sent();
                obj = {
                    job: jobRequest,
                    contractor: contractor
                };
                jobRequested.push(obj);
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                res.json({
                    jobRequested: jobRequested
                });
                return [3 /*break*/, 8];
            case 7:
                err_3 = _b.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerGetJobQoutationController = customerGetJobQoutationController;
//customer accept and pay for the work /////////////
var customerAcceptAndPayForJobController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, errors, customer, customerId, checkCustomer, job, contractor, secret, stripeInstance, generateInvoce, invoiceId, newTransaction, saveTransaction, transactionId, paymentIntent, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                jobId = req.body.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _a.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({
                        $and: [
                            { _id: jobId },
                            { customerId: customerId },
                            {
                                $or: [
                                    { status: 'sent qoutation' },
                                    { status: 'qoutation payment open' }
                                ]
                            }
                        ]
                    })];
            case 2:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job do not exist or qoutation have not be sent" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: job.contractorId }).select('-password')];
            case 3:
                contractor = _a.sent();
                secret = process.env.STRIPE_KEY || "sk_test_51OTMkGIj2KYudFaR1rNIBOPTaBESYoJco6lTCBZw5a0inyttRJOotcds1rXpXCJDSJrpNmIt2FBAaSxdmuma3ZTF00h48RxVny";
                stripeInstance = void 0;
                if (!secret) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Sripe API Key is missing" })];
                }
                stripeInstance = new stripe_1.default(secret);
                generateInvoce = new Date().getTime().toString();
                invoiceId = generateInvoce.substring(generateInvoce.length - 5);
                newTransaction = new transaction_model_1.default({
                    type: 'credit',
                    amount: parseFloat(job.totalAmountCustomerToPaid.toFixed(2)),
                    initiator: customerId,
                    from: 'customer',
                    to: 'admin',
                    fromId: customerId,
                    toId: 'admin',
                    description: "qoutation from ".concat(contractor === null || contractor === void 0 ? void 0 : contractor.firstName, " payment"),
                    status: 'pending',
                    form: 'qoutation',
                    invoiceId: invoiceId,
                    jobId: jobId
                });
                return [4 /*yield*/, newTransaction.save()];
            case 4:
                saveTransaction = _a.sent();
                transactionId = JSON.stringify(saveTransaction._id);
                return [4 /*yield*/, stripeInstance.checkout.sessions.create({
                        mode: 'payment',
                        payment_method_types: ['card'],
                        line_items: [
                            {
                                price_data: {
                                    currency: 'usd',
                                    product_data: {
                                        name: "qoutation payment from ".concat(contractor === null || contractor === void 0 ? void 0 : contractor.firstName)
                                    },
                                    unit_amount: parseFloat(job.totalAmountCustomerToPaid.toFixed(2)) * 100,
                                },
                                quantity: 1,
                            },
                        ],
                        metadata: {
                            customerId: customerId,
                            type: "payment",
                            jobId: jobId,
                            transactionId: transactionId
                        },
                        success_url: "https://repairfind.ca/payment-success/",
                        cancel_url: "https://cancel.com",
                        customer_email: checkCustomer.email
                    })];
            case 5:
                paymentIntent = _a.sent();
                job.status = "qoutation payment open";
                return [4 /*yield*/, job.save()];
            case 6:
                _a.sent();
                res.json({
                    jobId: jobId,
                    url: paymentIntent.url,
                    paymentId: paymentIntent.id
                });
                return [3 /*break*/, 8];
            case 7:
                err_4 = _a.sent();
                // signup error
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerAcceptAndPayForJobController = customerAcceptAndPayForJobController;
//customer get job qoutation payment and open /////////////
var customerGetJobQoutationPaymentOpenController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, customer, customerId, checkCustomer, jobRequests, jobRequested, i, jobRequest, contractor, obj, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _b.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ customerId: customerId, status: 'qoutation payment open' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password')];
            case 4:
                contractor = _b.sent();
                obj = {
                    job: jobRequest,
                    contractor: contractor
                };
                jobRequested.push(obj);
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                res.json({
                    jobRequested: jobRequested
                });
                return [3 /*break*/, 8];
            case 7:
                err_5 = _b.sent();
                // signup error
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerGetJobQoutationPaymentOpenController = customerGetJobQoutationPaymentOpenController;
//customer confirm or verified payment /////////////
var customerVerififyPaymentForJobController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, paymentId, errors, customer, customerId, checkCustomer, job, contractor, secret, stripeInstance, paymentConfirmation, html, emailData, admins, i, admin, html_1, emailData_1, err_6;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 12, , 13]);
                _a = req.body, jobId = _a.jobId, paymentId = _a.paymentId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _c.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, customerId: customerId, status: 'qoutation payment open' })];
            case 2:
                job = _c.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job do not exist or payment has not be initialize" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: job.contractorId }).select('-password')];
            case 3:
                contractor = _c.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect contractor Id" })];
                }
                secret = process.env.STRIPE_KEY || "sk_test_51OTMkGIj2KYudFaR1rNIBOPTaBESYoJco6lTCBZw5a0inyttRJOotcds1rXpXCJDSJrpNmIt2FBAaSxdmuma3ZTF00h48RxVny";
                stripeInstance = void 0;
                console.log(secret);
                if (!secret) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Sripe API Key is missing" })];
                }
                stripeInstance = new stripe_1.default(secret);
                return [4 /*yield*/, stripeInstance.checkout.sessions.retrieve(paymentId)];
            case 4:
                paymentConfirmation = _c.sent();
                if (paymentConfirmation.status !== "complete") {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "no payment or payment url expired" })];
                }
                if (((_b = paymentConfirmation.metadata) === null || _b === void 0 ? void 0 : _b.customerId) != customerId) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "payment ID in not for this customer" })];
                }
                job.status = "qoutation payment confirm and job in progress";
                return [4 /*yield*/, job.save()];
            case 5:
                _c.sent();
                html = (0, customerAcceptQuoteTem_1.customerAcceptQouteAndPaySendEmailHtmlMailTemplate)(contractor === null || contractor === void 0 ? void 0 : contractor.firstName, checkCustomer.firstName);
                emailData = {
                    emailTo: contractor.email,
                    subject: "Artisan payment for the job",
                    html: html
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(emailData)];
            case 6:
                _c.sent();
                return [4 /*yield*/, admin_model_1.default.find()];
            case 7:
                admins = _c.sent();
                i = 0;
                _c.label = 8;
            case 8:
                if (!(i < admins.length)) return [3 /*break*/, 11];
                admin = admins[i];
                html_1 = (0, customerPaymoneyForQuateTem_1.customerToAdminAfterPaymentSendEmailHtmlMailTemplate)(contractor.firstName, checkCustomer.firstName);
                emailData_1 = {
                    emailTo: admin.email,
                    subject: "Artisan payment for the job",
                    html: html_1
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(emailData_1)];
            case 9:
                _c.sent();
                _c.label = 10;
            case 10:
                i++;
                return [3 /*break*/, 8];
            case 11:
                res.json({
                    message: "payment successfully comfirm",
                });
                return [3 /*break*/, 13];
            case 12:
                err_6 = _c.sent();
                // signup error
                res.status(500).json({ message: err_6.message });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.customerVerififyPaymentForJobController = customerVerififyPaymentForJobController;
//customer get job qoutation payment confirm and job in progres /////////////
var customerGetJobQoutationPaymentConfirmAndJobInProgressController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, customer, customerId, checkCustomer, jobRequests, jobRequested, i, jobRequest, contractor, obj, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _b.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ customerId: customerId, status: 'qoutation payment confirm and job in progress' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password')];
            case 4:
                contractor = _b.sent();
                obj = {
                    job: jobRequest,
                    contractor: contractor
                };
                jobRequested.push(obj);
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                res.json({
                    jobRequested: jobRequested
                });
                return [3 /*break*/, 8];
            case 7:
                err_7 = _b.sent();
                // signup error
                res.status(500).json({ message: err_7.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerGetJobQoutationPaymentConfirmAndJobInProgressController = customerGetJobQoutationPaymentConfirmAndJobInProgressController;
//customer get job request rejected /////////////
var customerGetJobRejectedontroller = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, customer, customerId, checkCustomer, jobRequests, jobRequested, i, jobRequest, contractor, obj, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _b.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ customerId: customerId, status: 'job reject' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password')];
            case 4:
                contractor = _b.sent();
                obj = {
                    job: jobRequest,
                    contractor: contractor
                };
                jobRequested.push(obj);
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                res.json({
                    jobRequested: jobRequested
                });
                return [3 /*break*/, 8];
            case 7:
                err_8 = _b.sent();
                // signup error
                res.status(500).json({ message: err_8.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerGetJobRejectedontroller = customerGetJobRejectedontroller;
//get all job history/////////////
var customerGetAllSetJobController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, customer, customerId, skip, jobs, jobHistory, i, job, contractorProfile, obj, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.query, page = _a.page, limit = _a.limit;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                page = page || 1;
                limit = limit || 50;
                skip = (page - 1) * limit;
                return [4 /*yield*/, job_model_1.default.find({ customerId: customerId })
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)];
            case 1:
                jobs = _b.sent();
                jobHistory = [];
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < jobs.length)) return [3 /*break*/, 5];
                job = jobs[i];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: job.contractorId }).select('-password')
                    //const contractorDocument = await ContractorDocumentValidateModel.findOne({contractorId: job.contractorId});
                ];
            case 3:
                contractorProfile = _b.sent();
                obj = {
                    job: job,
                    contractorProfile: contractorProfile,
                    //contractorDocument
                };
                jobHistory.push(obj);
                _b.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                res.json({
                    jobHistory: jobHistory
                });
                return [3 /*break*/, 7];
            case 6:
                err_9 = _b.sent();
                // signup error
                res.status(500).json({ message: err_9.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.customerGetAllSetJobController = customerGetAllSetJobController;
//customer confirm or verified payment web hook/////////////
var customerVerififyPaymentWebhook = function (jobId, customerId, transactionId) { return __awaiter(void 0, void 0, void 0, function () {
    var checkCustomer, job, contractor, transaction, html, emailData, admins, adminPaymentHtml, i, admin, adminEmailData, adminNotic, contractorNotic, customerNotic, customerNoticTwo, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 17, , 18]);
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _a.sent();
                if (!checkCustomer) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, customerId: customerId, status: 'qoutation payment open' })];
            case 2:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: job.contractorId }).select('-password')];
            case 3:
                contractor = _a.sent();
                if (!contractor) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, transaction_model_1.default.findOne({ _id: transactionId.substring(1, transactionId.length - 1) })];
            case 4:
                transaction = _a.sent();
                if (!transaction) {
                    return [2 /*return*/];
                }
                job.status = "qoutation payment confirm and job in progress";
                return [4 /*yield*/, job.save()];
            case 5:
                _a.sent();
                transaction.status = 'successful';
                return [4 /*yield*/, transaction.save()];
            case 6:
                _a.sent();
                html = (0, customerAcceptQuoteTem_1.customerAcceptQouteAndPaySendEmailHtmlMailTemplate)(contractor === null || contractor === void 0 ? void 0 : contractor.firstName, checkCustomer.firstName);
                emailData = {
                    emailTo: contractor.email,
                    subject: "Artisan payment for the job",
                    html: html
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(emailData)];
            case 7:
                _a.sent();
                return [4 /*yield*/, admin_model_1.default.find()];
            case 8:
                admins = _a.sent();
                adminPaymentHtml = (0, adminPaymentTemplate_1.htmlAdminPaymentTemplate)(jobId, checkCustomer._id, "".concat(job.totalAmountCustomerToPaid, " for job qoutation"));
                i = 0;
                _a.label = 9;
            case 9:
                if (!(i < admins.length)) return [3 /*break*/, 13];
                admin = admins[i];
                adminEmailData = {
                    emailTo: admin.email,
                    subject: "qoutation payment",
                    html: adminPaymentHtml
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(adminEmailData)];
            case 10:
                _a.sent();
                adminNotic = new admin_notification_model_1.default({
                    title: "Job Booked",
                    message: "".concat(job._id, " - ").concat(checkCustomer.firstName, " booked a job for $").concat(job.totalAmountCustomerToPaid, "."),
                    status: "unseen"
                });
                return [4 /*yield*/, adminNotic.save()];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12:
                i++;
                return [3 /*break*/, 9];
            case 13:
                contractorNotic = new contractor_notification_model_1.default({
                    contractorId: contractor._id,
                    message: "You've been booked for a job from ".concat(checkCustomer.firstName, " for ").concat(job.time),
                    status: "unseen"
                });
                return [4 /*yield*/, contractorNotic.save()];
            case 14:
                _a.sent();
                customerNotic = new customer_notification_model_1.default({
                    customerId: checkCustomer._id,
                    message: "You've booked a job with ".concat(contractor.firstName, " for ").concat(job.jobTitle),
                    status: "unseen"
                });
                return [4 /*yield*/, customerNotic.save()];
            case 15:
                _a.sent();
                customerNoticTwo = new customer_notification_model_1.default({
                    customerId: checkCustomer._id,
                    message: "You've just sent a payment for this job - ".concat(job.jobTitle, ", Thank you."),
                    status: "unseen"
                });
                return [4 /*yield*/, customerNoticTwo.save()];
            case 16:
                _a.sent();
                return [3 /*break*/, 18];
            case 17:
                err_10 = _a.sent();
                // signup error
                console.log("payment Error", "err");
                return [3 /*break*/, 18];
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.customerVerififyPaymentWebhook = customerVerififyPaymentWebhook;
//customer get job completed by contractor /////////////
var customerGetComletedByContractorController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, customer, customerId, checkCustomer, jobRequests, jobRequested, i, jobRequest, contractor, obj, err_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _b.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ customerId: customerId, status: 'completed' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password')];
            case 4:
                contractor = _b.sent();
                obj = {
                    job: jobRequest,
                    contractor: contractor
                };
                jobRequested.push(obj);
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                res.json({
                    jobRequested: jobRequested
                });
                return [3 /*break*/, 8];
            case 7:
                err_11 = _b.sent();
                // signup error
                res.status(500).json({ message: err_11.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerGetComletedByContractorController = customerGetComletedByContractorController;
//customer comfirm job completed by Contractor /////////////
var customerComfirmedJobJobController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, errors, customer, customerId, checkCustomer, job, contractor, contractorBank, newPayout, adminNotic, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                jobId = req.body.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _a.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, customerId: customerId, status: 'completed' })];
            case 2:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job do not exist or has not been completed by artisan" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: job.contractorId }).select('-password')];
            case 3:
                contractor = _a.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect contractor id" })];
                }
                return [4 /*yield*/, contractorBankDetail_model_1.default.findOne({ contractorId: contractor._id })];
            case 4:
                contractorBank = _a.sent();
                if (!contractorBank) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "contractor has not enter his bank detail" })];
                }
                newPayout = new payout_model_1.default({
                    amount: job.totalAmountContractorWithdraw,
                    accountName: "".concat(contractor.firstName, " ").concat(contractor.lastName),
                    accountNumber: contractorBank.accountNumber,
                    bankName: contractorBank.financialInstitution,
                    recieverId: contractor._id,
                    jobId: jobId,
                    status: "pending"
                });
                return [4 /*yield*/, newPayout.save()];
            case 5:
                _a.sent();
                job.status = "comfirmed";
                return [4 /*yield*/, job.save()
                    //admin notification 
                ];
            case 6:
                _a.sent();
                adminNotic = new admin_notification_model_1.default({
                    title: "Customer Confirmed Job Completed",
                    message: "".concat(jobId, " - ").concat(checkCustomer.firstName, " has updated this job to completed and comfirm"),
                    status: "unseen"
                });
                return [4 /*yield*/, adminNotic.save()];
            case 7:
                _a.sent();
                res.json({
                    message: "you successfully comfirm this job completed by artisan"
                });
                return [3 /*break*/, 9];
            case 8:
                err_12 = _a.sent();
                console.log("error", err_12);
                // signup error
                res.status(500).json({ message: err_12.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.customerComfirmedJobJobController = customerComfirmedJobJobController;
//customer get you comfirm  job/////////////
var customerGetComfirmJobController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, customer, customerId, checkCustomer, jobRequests, jobRequested, i, jobRequest, contractor, obj, err_13;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _b.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ customerId: customerId, status: 'comfirmed' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password')];
            case 4:
                contractor = _b.sent();
                obj = {
                    job: jobRequest,
                    contractor: contractor
                };
                jobRequested.push(obj);
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                res.json({
                    jobRequested: jobRequested
                });
                return [3 /*break*/, 8];
            case 7:
                err_13 = _b.sent();
                // signup error
                res.status(500).json({ message: err_13.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerGetComfirmJobController = customerGetComfirmJobController;
//customer complaint job completed by Contractor /////////////
var customerComplaintedJobJobController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, errors, customer, customerId, checkCustomer, job, contractor, adminNotic, err_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                jobId = req.body.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _a.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, customerId: customerId, status: 'completed' })];
            case 2:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job do not exist or has not been completed by artisan" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: job.contractorId }).select('-password')];
            case 3:
                contractor = _a.sent();
                job.status = "complain";
                return [4 /*yield*/, job.save()
                    //admin notification 
                ];
            case 4:
                _a.sent();
                adminNotic = new admin_notification_model_1.default({
                    title: "Customer Disagreed on Job Completion",
                    message: "".concat(job, " - ").concat(checkCustomer.firstName, " disagreed that this job has been completed by this contractor ").concat(contractor === null || contractor === void 0 ? void 0 : contractor.firstName, "."),
                    status: "unseen"
                });
                return [4 /*yield*/, adminNotic.save()];
            case 5:
                _a.sent();
                res.json({
                    message: "you successfully complained about this job completed by artisan"
                });
                return [3 /*break*/, 7];
            case 6:
                err_14 = _a.sent();
                // signup error
                res.status(500).json({ message: err_14.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.customerComplaintedJobJobController = customerComplaintedJobJobController;
//customer get job he  complain about /////////////
var customerGetComplainJobController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, customer, customerId, checkCustomer, jobRequests, jobRequested, i, jobRequest, contractor, obj, err_15;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _b.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ customerId: customerId, status: 'complain' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password')];
            case 4:
                contractor = _b.sent();
                obj = {
                    job: jobRequest,
                    contractor: contractor
                };
                jobRequested.push(obj);
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                res.json({
                    jobRequested: jobRequested
                });
                return [3 /*break*/, 8];
            case 7:
                err_15 = _b.sent();
                // signup error
                res.status(500).json({ message: err_15.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerGetComplainJobController = customerGetComplainJobController;
