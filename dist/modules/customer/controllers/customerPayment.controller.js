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
exports.webhook = exports.customerComfirmInpectionMonneyCheckoutContractorController = exports.customerGetJobInspectionPaymentOpenController = exports.customerInpectionMonneyCheckoutContractorController = void 0;
var express_validator_1 = require("express-validator");
var uuid_1 = require("uuid");
var send_email_utility_1 = require("../../../utils/send_email_utility");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var upload_utility_1 = require("../../../utils/upload.utility");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var job_model_1 = __importDefault(require("../../../database/contractor/models/job.model"));
var stripe_1 = __importDefault(require("stripe"));
var custotomerSendRequestTemplate_1 = require("../../../templates/email/custotomerSendRequestTemplate");
var customerJob_controller_1 = require("./customerJob.controller");
var jobRequestTemplate_1 = require("../../../templates/contractorEmail/jobRequestTemplate");
var adminPaymentTemplate_1 = require("../../../templates/adminEmail/adminPaymentTemplate");
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var admin_notification_model_1 = __importDefault(require("../../../database/admin/models/admin_notification.model"));
var transaction_model_1 = __importDefault(require("../../../database/common/transaction.model"));
// pay 50 doller for inspectopn /////////////
var customerInpectionMonneyCheckoutContractorController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, time, description, address, inspection, postalCode, contractorId, jobTitle, files, errors, customer, customerId, checkCustomer, checkContractor, inspectionVal, images, i, file, fileId, uploadFile, secret, stripeInstance, inpection, job, saveeJob, jobId, generateInvoce, invoiceId, newTransaction, saveTransaction, transactionId, paymentIntent, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
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
                if (inspectionVal === false) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "inpection must be true" })];
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
                secret = process.env.STRIPE_KEY || "sk_test_51OTMkGIj2KYudFaR1rNIBOPTaBESYoJco6lTCBZw5a0inyttRJOotcds1rXpXCJDSJrpNmIt2FBAaSxdmuma3ZTF00h48RxVny";
                stripeInstance = void 0;
                if (!secret) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Sripe API Key is missing" })];
                }
                stripeInstance = new stripe_1.default(secret);
                inpection = {
                    status: true,
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
                    status: "inspection payment open"
                });
                return [4 /*yield*/, job.save()];
            case 7:
                saveeJob = _b.sent();
                jobId = JSON.stringify(saveeJob._id);
                generateInvoce = new Date().getTime().toString();
                invoiceId = generateInvoce.substring(generateInvoce.length - 5);
                newTransaction = new transaction_model_1.default({
                    type: 'credit',
                    amount: 50,
                    initiator: customerId,
                    from: 'customer',
                    to: 'admin',
                    fromId: customerId,
                    toId: 'admin',
                    description: 'inspection payment before sending job request to artisan',
                    status: 'pending',
                    form: 'inspection',
                    invoiceId: invoiceId,
                    jobId: saveeJob._id
                });
                return [4 /*yield*/, newTransaction.save()];
            case 8:
                saveTransaction = _b.sent();
                transactionId = JSON.stringify(saveTransaction._id);
                return [4 /*yield*/, stripeInstance.checkout.sessions.create({
                        mode: 'payment',
                        payment_method_types: ['card'],
                        line_items: [
                            {
                                price_data: {
                                    currency: 'usd',
                                    product_data: {
                                        name: 'inspection fees'
                                    },
                                    unit_amount: 5000
                                },
                                quantity: 1,
                            },
                        ],
                        metadata: {
                            time: time,
                            jobTitle: jobTitle,
                            description: description,
                            address: address,
                            inspection: inspection,
                            postalCode: postalCode,
                            customerId: customerId,
                            jobId: jobId,
                            type: "inspect",
                            transactionId: transactionId
                        },
                        success_url: "https://repairfind.ca/payment-success/",
                        cancel_url: "https://cancel.com",
                        customer_email: checkCustomer.email
                    })];
            case 9:
                paymentIntent = _b.sent();
                res.json({
                    url: paymentIntent.url,
                    inspectionPaymemtId: paymentIntent.id,
                    jobId: saveeJob._id
                });
                return [3 /*break*/, 11];
            case 10:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.customerInpectionMonneyCheckoutContractorController = customerInpectionMonneyCheckoutContractorController;
//customer get job inspection payment and open /////////////
var customerGetJobInspectionPaymentOpenController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
                return [4 /*yield*/, job_model_1.default.find({ customerId: customerId, status: 'inspection payment open' }).sort({ createdAt: -1 })];
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
exports.customerGetJobInspectionPaymentOpenController = customerGetJobInspectionPaymentOpenController;
// comfirm inspection payment money /////////////
var customerComfirmInpectionMonneyCheckoutContractorController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, inspectionPaymemtId, jobId, errors, customer, customerId, checkCustomer, job, checkContractor, secret, stripeInstance, paymentConfirmation, html, emailData, err_3;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                _a = req.body, inspectionPaymemtId = _a.inspectionPaymemtId, jobId = _a.jobId;
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
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, customerId: customerId, status: 'inspection payment open' })];
            case 2:
                job = _c.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job do not exist or inspection payment has not be initialize" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: job.contractorId })];
            case 3:
                checkContractor = _c.sent();
                if (!checkContractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "artisan does not exit" })];
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
                return [4 /*yield*/, stripeInstance.checkout.sessions.retrieve(inspectionPaymemtId)];
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
                job.inspection.confirmPayment = true;
                job.status = "sent request";
                return [4 /*yield*/, job.save()];
            case 5:
                _c.sent();
                html = (0, custotomerSendRequestTemplate_1.customerSendJobRequestSendEmailHtmlMailTemplate)(checkContractor.firstName, checkCustomer === null || checkCustomer === void 0 ? void 0 : checkCustomer.firstName);
                emailData = {
                    emailTo: checkContractor.email,
                    subject: "Job request from customer",
                    html: html
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(emailData)];
            case 6:
                _c.sent();
                res.json({
                    message: "job request successfully sent",
                });
                return [3 /*break*/, 8];
            case 7:
                err_3 = _c.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.customerComfirmInpectionMonneyCheckoutContractorController = customerComfirmInpectionMonneyCheckoutContractorController;
// webhook /////////////
var webhook = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var event_1, checkoutSessionAsyncPaymentFailed, checkoutSessionAsyncPaymentSucceeded, checkoutSessionCompleted, checkoutSessionExpired;
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        try {
            event_1 = req.body;
            switch (event_1.type) {
                case 'checkout.session.async_payment_failed':
                    checkoutSessionAsyncPaymentFailed = event_1.data.object;
                    // Then define and call a function to handle the event checkout.session.async_payment_failed
                    console.log("event fail", event_1);
                    break;
                case 'checkout.session.async_payment_succeeded':
                    checkoutSessionAsyncPaymentSucceeded = event_1.data.object;
                    // Then define and call a function to handle the event checkout.session.async_payment_succeeded
                    console.log("event succed", event_1);
                    break;
                case 'checkout.session.completed':
                    checkoutSessionCompleted = event_1.data.object;
                    // Then define and call a function to handle the event checkout.session.completed
                    if (((_a = checkoutSessionCompleted.metadata) === null || _a === void 0 ? void 0 : _a.type) == "inspect") {
                        customerComfirmInpection((_b = checkoutSessionCompleted.metadata) === null || _b === void 0 ? void 0 : _b.jobId, (_c = checkoutSessionCompleted.metadata) === null || _c === void 0 ? void 0 : _c.customerId, (_d = checkoutSessionCompleted.metadata) === null || _d === void 0 ? void 0 : _d.transactionId);
                    }
                    else if (((_e = checkoutSessionCompleted.metadata) === null || _e === void 0 ? void 0 : _e.type) == "payment") {
                        (0, customerJob_controller_1.customerVerififyPaymentWebhook)((_f = checkoutSessionCompleted.metadata) === null || _f === void 0 ? void 0 : _f.jobId, (_g = checkoutSessionCompleted.metadata) === null || _g === void 0 ? void 0 : _g.customerId, (_h = checkoutSessionCompleted.metadata) === null || _h === void 0 ? void 0 : _h.transactionId);
                    }
                    else {
                    }
                    console.log("event complet", checkoutSessionCompleted.metadata);
                    break;
                case 'checkout.session.expired':
                    checkoutSessionExpired = event_1.data.object;
                    // Then define and call a function to handle the event checkout.session.expired
                    console.log("event expired", event_1);
                    break;
                // ... handle other event types
                default:
                    console.log("Unhandled event type ".concat(event_1.type));
            }
        }
        catch (err) {
            // signup error
            res.status(500).json({ message: err.message });
        }
        return [2 /*return*/];
    });
}); };
exports.webhook = webhook;
// comfirm inspection payment money webhook /////////////
var customerComfirmInpection = function (jobId, customerId, transactionId) { return __awaiter(void 0, void 0, void 0, function () {
    var checkCustomer, job, checkContractor, transaction, html, emailData, admins, adminPaymentHtml, i, admin, adminEmailData, adminNoti, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 14, , 15]);
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _a.sent();
                if (!checkCustomer) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId.substring(1, jobId.length - 1), customerId: customerId, status: 'inspection payment open' })];
            case 2:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: job.contractorId })];
            case 3:
                checkContractor = _a.sent();
                if (!checkContractor) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, transaction_model_1.default.findOne({ _id: transactionId.substring(1, transactionId.length - 1) })];
            case 4:
                transaction = _a.sent();
                if (!transaction) {
                    return [2 /*return*/];
                }
                job.inspection.confirmPayment = true;
                job.status = "sent request";
                return [4 /*yield*/, job.save()];
            case 5:
                _a.sent();
                transaction.status = 'successful';
                return [4 /*yield*/, transaction.save()];
            case 6:
                _a.sent();
                html = (0, jobRequestTemplate_1.htmlJobRequestTemplate)(checkContractor.firstName, checkCustomer.firstName, job.time.toString(), job.description);
                emailData = {
                    emailTo: checkContractor.email,
                    subject: "Job request from customer",
                    html: html
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(emailData)];
            case 7:
                _a.sent();
                return [4 /*yield*/, admin_model_1.default.find()];
            case 8:
                admins = _a.sent();
                adminPaymentHtml = (0, adminPaymentTemplate_1.htmlAdminPaymentTemplate)(jobId, checkCustomer._id, '50 for inspection');
                i = 0;
                _a.label = 9;
            case 9:
                if (!(i < admins.length)) return [3 /*break*/, 12];
                admin = admins[i];
                adminEmailData = {
                    emailTo: admin.email,
                    subject: "inspection payment",
                    html: adminPaymentHtml
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(adminEmailData)];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11:
                i++;
                return [3 /*break*/, 9];
            case 12:
                adminNoti = new admin_notification_model_1.default({
                    title: "Job Site Visit Payment",
                    message: "".concat(checkCustomer.firstName, " just paid $50 for site inspection."),
                    status: "unseen"
                });
                return [4 /*yield*/, adminNoti.save()];
            case 13:
                _a.sent();
                return [3 /*break*/, 15];
            case 14:
                err_4 = _a.sent();
                console.log("error:", err_4);
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); };
