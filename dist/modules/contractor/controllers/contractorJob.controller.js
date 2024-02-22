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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractorGeJobComplainController = exports.contractorGeJobComfirmController = exports.contractorGeJobCompletedController = exports.contractorCompleteJobController = exports.contractorGeJobHistoryController = exports.contractorGeJobRejectedController = exports.contractorRejectJobRequestController = exports.contractorGetQuatationPaymentComfirmAndJobInProgressController = exports.contractorGetQuatationContractorController = exports.contractorSendJobQuatationControllerFour = exports.contractorRemoveobQuatationOneByOneControllerfive = exports.contractorSendJobQuatationControllerThree = exports.contractorSendJobQuatationControllerTwo = exports.contractorSendJobQuatationController = exports.contractorGetJobRequestContractorController = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customerReg_model_1 = __importDefault(require("../../../database/customer/models/customerReg.model"));
var job_model_1 = __importDefault(require("../../../database/contractor/models/job.model"));
var send_email_utility_1 = require("../../../utils/send_email_utility");
var jobQoutationTemplate_1 = require("../../../templates/customerEmail/jobQoutationTemplate");
var adminNotification_model_1 = __importDefault(require("../../../database/admin/models/adminNotification.model"));
//contractor get job requet sent to him /////////////
var contractorGetJobRequestContractorController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, jobRequests, jobRequested, i, jobRequest, customer, obj, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractorId, status: 'sent request' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: jobRequest.customerId }).select('-password')];
            case 4:
                customer = _b.sent();
                obj = {
                    job: jobRequest,
                    customer: customer
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
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.contractorGetJobRequestContractorController = contractorGetJobRequestContractorController;
//contractor send job quatation /////////////
var contractorSendJobQuatationController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, quatations, workmanShip, errors, contractor, contractorId, contractorExist, job, customer, totalQuatation, i, quatation, companyCharge, gst, totalAmountCustomerToPaid, totalAmountContractorWithdraw, html, emailData, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, jobId = _a.jobId, quatations = _a.quatations, workmanShip = _a.workmanShip;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, contractorId: contractorId, status: 'sent request' }).sort({ createdAt: -1 })];
            case 2:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job request do not exist" })];
                }
                if (quatations.length < 1) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid quatation format" })];
                }
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: job.customerId })];
            case 3:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid customer Id" })];
                }
                totalQuatation = 0;
                for (i = 0; i < quatations.length; i++) {
                    quatation = quatations[i];
                    totalQuatation = totalQuatation + quatation.amount;
                }
                totalQuatation = totalQuatation + workmanShip;
                companyCharge = 0;
                if (totalQuatation <= 1000) {
                    companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
                }
                else if (totalQuatation <= 5000) {
                    companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
                }
                else {
                    companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
                }
                gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));
                totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
                totalAmountContractorWithdraw = totalQuatation + gst;
                job.quate = quatations;
                job.workmanShip = workmanShip;
                job.gst = gst;
                job.totalQuatation = totalQuatation;
                job.companyCharge = companyCharge;
                job.totalAmountCustomerToPaid = parseFloat(totalAmountCustomerToPaid.toFixed(2));
                job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2));
                job.status = "sent qoutation";
                return [4 /*yield*/, job.save()];
            case 4:
                _b.sent();
                html = (0, jobQoutationTemplate_1.htmlJobQoutationTemplate)(customer.fullName, contractorExist.firstName);
                emailData = {
                    emailTo: customer.email,
                    subject: "Job qoutetation from artisan",
                    html: html
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(emailData)];
            case 5:
                _b.sent();
                res.json({
                    message: "job qoutation sucessfully sent"
                });
                return [3 /*break*/, 7];
            case 6:
                err_2 = _b.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.contractorSendJobQuatationController = contractorSendJobQuatationController;
//contractor send job quatation two /////////////
var contractorSendJobQuatationControllerTwo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, materialDetail, totalcostMaterial, workmanShip, errors, contractor, contractorId, contractorExist, job, customer, totalQuatation, companyCharge, gst, totalAmountCustomerToPaid, totalAmountContractorWithdraw, qoute, html, emailData, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, jobId = _a.jobId, materialDetail = _a.materialDetail, totalcostMaterial = _a.totalcostMaterial, workmanShip = _a.workmanShip;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, contractorId: contractorId, status: 'sent request' }).sort({ createdAt: -1 })];
            case 2:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job request do not exist" })];
                }
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: job.customerId })];
            case 3:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid customer Id" })];
                }
                totalQuatation = totalcostMaterial + workmanShip;
                companyCharge = 0;
                if (totalQuatation <= 1000) {
                    companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
                }
                else if (totalQuatation <= 5000) {
                    companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
                }
                else {
                    companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
                }
                gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));
                totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
                totalAmountContractorWithdraw = totalQuatation + gst;
                qoute = {
                    materialDetail: materialDetail,
                    totalcostMaterial: totalcostMaterial,
                    workmanShip: workmanShip
                };
                job.qoute = qoute,
                    job.gst = gst;
                job.totalQuatation = totalQuatation;
                job.companyCharge = companyCharge;
                job.totalAmountCustomerToPaid = parseFloat(totalAmountCustomerToPaid.toFixed(2));
                job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2));
                job.status = "sent qoutation";
                return [4 /*yield*/, job.save()];
            case 4:
                _b.sent();
                html = (0, jobQoutationTemplate_1.htmlJobQoutationTemplate)(customer.fullName, contractorExist.firstName);
                emailData = {
                    emailTo: customer.email,
                    subject: "Job qoutetation from artisan",
                    html: html
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(emailData)];
            case 5:
                _b.sent();
                res.json({
                    message: "job qoutation sucessfully sent"
                });
                return [3 /*break*/, 7];
            case 6:
                err_3 = _b.sent();
                // signup error
                console.log("error", err_3);
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.contractorSendJobQuatationControllerTwo = contractorSendJobQuatationControllerTwo;
//contractor send job quatation three [one by one] /////////////
var contractorSendJobQuatationControllerThree = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, material, qty, rate, 
    //tax,
    amount, errors, contractor, contractorId, contractorExist, job, customer, qouteObj, dbQoute, newQoute, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, jobId = _a.jobId, material = _a.material, qty = _a.qty, rate = _a.rate, amount = _a.amount;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, contractorId: contractorId, status: 'sent request' }).sort({ createdAt: -1 })];
            case 2:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job request do not exist" })];
                }
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: job.customerId })];
            case 3:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid customer Id" })];
                }
                qouteObj = {
                    material: material,
                    qty: qty,
                    rate: rate,
                    //tax,
                    amount: amount,
                };
                dbQoute = job.quate;
                newQoute = __spreadArray(__spreadArray([], dbQoute, true), [qouteObj], false);
                job.quate = newQoute;
                return [4 /*yield*/, job.save()
                    // const html = htmlJobQoutationTemplate(customer.fullName, contractorExist.firstName)
                    // let emailData = {
                    //   emailTo: customer.email,
                    //   subject: "Job qoutetation from artisan",
                    //   html
                    // };
                    // await sendEmail(emailData);
                ];
            case 4:
                _b.sent();
                // const html = htmlJobQoutationTemplate(customer.fullName, contractorExist.firstName)
                // let emailData = {
                //   emailTo: customer.email,
                //   subject: "Job qoutetation from artisan",
                //   html
                // };
                // await sendEmail(emailData);
                res.json({
                    message: "job qoutation sucessfully enter"
                });
                return [3 /*break*/, 6];
            case 5:
                err_4 = _b.sent();
                // signup error
                console.log("error", err_4);
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.contractorSendJobQuatationControllerThree = contractorSendJobQuatationControllerThree;
//contractor remove job quatation one by one five [romove one by one] /////////////
var contractorRemoveobQuatationOneByOneControllerfive = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, material, qty, rate, 
    //tax,
    amount, errors, contractor, contractorId, contractorExist, job, customer, qouteObj, newQoute, i, qoute, dbQoute, compareQoute, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                _a = req.body, jobId = _a.jobId, material = _a.material, qty = _a.qty, rate = _a.rate, amount = _a.amount;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, contractorId: contractorId, status: 'sent request' }).sort({ createdAt: -1 })];
            case 2:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job request do not exist" })];
                }
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: job.customerId })];
            case 3:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid customer Id" })];
                }
                if (job.quate.length < 1) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "please add atleast one qoutation" })];
                }
                qouteObj = {
                    material: material,
                    qty: qty,
                    rate: rate,
                    //tax,
                    amount: amount,
                };
                newQoute = [];
                i = 0;
                _b.label = 4;
            case 4:
                if (!(i < job.quate.length)) return [3 /*break*/, 7];
                qoute = job.quate[i];
                dbQoute = {
                    material: qoute.material,
                    qty: qoute.qty,
                    rate: qoute.rate,
                    //tax: qoute.tax,
                    amount: qoute.amount,
                };
                return [4 /*yield*/, areObjectsEqual(dbQoute, qouteObj)];
            case 5:
                compareQoute = _b.sent();
                if (compareQoute)
                    return [3 /*break*/, 6];
                newQoute.push(qoute);
                _b.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 4];
            case 7:
                job.quate = newQoute;
                return [4 /*yield*/, job.save()];
            case 8:
                _b.sent();
                res.json({
                    message: "job qoutation sucessfully remove"
                });
                return [3 /*break*/, 10];
            case 9:
                err_5 = _b.sent();
                // signup error
                console.log("error", err_5);
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.contractorRemoveobQuatationOneByOneControllerfive = contractorRemoveobQuatationOneByOneControllerfive;
//contractor send job quatation four [complete] /////////////
var contractorSendJobQuatationControllerFour = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, workmanShip, errors, contractor, contractorId, contractorExist, job, customer, totalQuatation, i, quatation, companyCharge, gst, totalAmountCustomerToPaid, totalAmountContractorWithdraw, html, emailData, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, jobId = _a.jobId, workmanShip = _a.workmanShip;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                console.log(1);
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                console.log(2);
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, contractorId: contractorId, status: 'sent request' }).sort({ createdAt: -1 })];
            case 2:
                job = _b.sent();
                console.log(3);
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job request do not exist" })];
                }
                console.log(4);
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: job.customerId })];
            case 3:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid customer Id" })];
                }
                if (job.quate.length < 1) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "please add atleast one qoutation" })];
                }
                console.log(5);
                totalQuatation = 0;
                for (i = 0; i < job.quate.length; i++) {
                    quatation = job.quate[i];
                    totalQuatation = totalQuatation + quatation.amount;
                }
                totalQuatation = totalQuatation + workmanShip;
                companyCharge = 0;
                if (totalQuatation <= 1000) {
                    companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
                }
                else if (totalQuatation <= 5000) {
                    companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
                }
                else {
                    companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
                }
                gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));
                totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
                totalAmountContractorWithdraw = totalQuatation + gst;
                console.log(6);
                job.workmanShip = workmanShip;
                job.gst = gst;
                job.totalQuatation = totalQuatation;
                job.companyCharge = companyCharge;
                job.totalAmountCustomerToPaid = parseFloat(totalAmountCustomerToPaid.toFixed(2));
                job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2));
                job.status = "sent qoutation";
                return [4 /*yield*/, job.save()];
            case 4:
                _b.sent();
                console.log(7);
                html = (0, jobQoutationTemplate_1.htmlJobQoutationTemplate)(customer.fullName, contractorExist.firstName);
                emailData = {
                    emailTo: customer.email,
                    subject: "Job qoutetation from artisan",
                    html: html
                };
                console.log(8);
                //await sendEmail(emailData);
                console.log(9);
                res.json({
                    message: "job qoutation sucessfully sent"
                });
                return [3 /*break*/, 6];
            case 5:
                err_6 = _b.sent();
                // signup error
                res.status(500).json({ message: err_6.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.contractorSendJobQuatationControllerFour = contractorSendJobQuatationControllerFour;
//contractor get job qoutation sent to artisan  /////////////
var contractorGetQuatationContractorController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, jobRequests, jobRequested, i, jobRequest, customer, obj, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractorId, status: 'sent qoutation' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: jobRequest.customerId }).select('-password')];
            case 4:
                customer = _b.sent();
                obj = {
                    job: jobRequest,
                    customer: customer
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
exports.contractorGetQuatationContractorController = contractorGetQuatationContractorController;
//contractor get job qoutation payment comfirm and job in progress /////////////
var contractorGetQuatationPaymentComfirmAndJobInProgressController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, jobRequests, jobRequested, i, jobRequest, customer, obj, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractorId, status: 'qoutation payment confirm and job in progress' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: jobRequest.customerId }).select('-password')];
            case 4:
                customer = _b.sent();
                obj = {
                    job: jobRequest,
                    customer: customer
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
exports.contractorGetQuatationPaymentComfirmAndJobInProgressController = contractorGetQuatationPaymentComfirmAndJobInProgressController;
//contractor reject job Request /////////////
var contractorRejectJobRequestController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, rejectedReason, errors, contractor, contractorId, contractorExist, job, customer, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, jobId = _a.jobId, rejectedReason = _a.rejectedReason;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, contractorId: contractorId, status: 'sent request' }).sort({ createdAt: -1 })];
            case 2:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job request do not exist" })];
                }
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: job.customerId })];
            case 3:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid customer Id" })];
                }
                job.rejected = true;
                job.rejectedReason = rejectedReason;
                job.status = "job reject";
                return [4 /*yield*/, job.save()
                    // const html = contractorSendJobQuatationSendEmailHtmlMailTemplate(contractorExist.firstName, customer.fullName)
                    // let emailData = {
                    //   emailTo: customer.email,
                    //   subject: "Job qoutetation from artisan",
                    //   html
                    // };
                    // await sendEmail(emailData);
                ];
            case 4:
                _b.sent();
                // const html = contractorSendJobQuatationSendEmailHtmlMailTemplate(contractorExist.firstName, customer.fullName)
                // let emailData = {
                //   emailTo: customer.email,
                //   subject: "Job qoutetation from artisan",
                //   html
                // };
                // await sendEmail(emailData);
                res.json({
                    message: "you sucessfully rejected job request"
                });
                return [3 /*break*/, 6];
            case 5:
                err_9 = _b.sent();
                // signup error
                res.status(500).json({ message: err_9.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.contractorRejectJobRequestController = contractorRejectJobRequestController;
//contractor get job he rejected /////////////
var contractorGeJobRejectedController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, jobRequests, jobRequested, i, jobRequest, customer, obj, err_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractorId, status: 'job reject' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: jobRequest.customerId }).select('-password')];
            case 4:
                customer = _b.sent();
                obj = {
                    job: jobRequest,
                    customer: customer
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
                err_10 = _b.sent();
                // signup error
                res.status(500).json({ message: err_10.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.contractorGeJobRejectedController = contractorGeJobRejectedController;
//contractor get job history /////////////
var contractorGeJobHistoryController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, jobRequests, jobHistory, i, jobRequest, customer, obj, err_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractorId, }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobHistory = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: jobRequest.customerId }).select('-password')];
            case 4:
                customer = _b.sent();
                obj = {
                    job: jobRequest,
                    customer: customer
                };
                jobHistory.push(obj);
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                res.json({
                    jobHistory: jobHistory
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
exports.contractorGeJobHistoryController = contractorGeJobHistoryController;
//contractor complete job /////////////
var contractorCompleteJobController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, errors, contractor, contractorId, contractorExist, job, customer, currentTime, jobTime, adminNotic, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                jobId = req.body.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _a.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, contractorId: contractorId, status: 'qoutation payment confirm and job in progress' }).sort({ createdAt: -1 })];
            case 2:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job request do not exist" })];
                }
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: job.customerId })];
            case 3:
                customer = _a.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid customer Id" })];
                }
                currentTime = new Date().getTime();
                jobTime = job.time.getTime();
                if (currentTime > jobTime) {
                    return [2 /*return*/, res.status(400).json({ message: "Not yet job day" })];
                }
                job.status = "completed";
                return [4 /*yield*/, job.save()
                    //admin notification
                ];
            case 4:
                _a.sent();
                adminNotic = new adminNotification_model_1.default({
                    title: "Contractor Job Completed",
                    message: "".concat(job._id, " - ").concat(contractorExist.firstName, " has updated this job to completed."),
                    status: "unseen"
                });
                return [4 /*yield*/, adminNotic.save()];
            case 5:
                _a.sent();
                res.json({
                    message: "you sucessfully complete this job, wait for comfirmation from customer"
                });
                return [3 /*break*/, 7];
            case 6:
                err_12 = _a.sent();
                // signup error
                res.status(500).json({ message: err_12.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.contractorCompleteJobController = contractorCompleteJobController;
//contractor get job completed /////////////
var contractorGeJobCompletedController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, jobRequests, jobRequested, i, jobRequest, customer, obj, err_13;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractorId, status: 'completed' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: jobRequest.customerId }).select('-password')];
            case 4:
                customer = _b.sent();
                obj = {
                    job: jobRequest,
                    customer: customer
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
exports.contractorGeJobCompletedController = contractorGeJobCompletedController;
//contractor get job completed and comfirm by customer /////////////
var contractorGeJobComfirmController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, jobRequests, jobRequested, i, jobRequest, customer, obj, err_14;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractorId, status: 'comfirmed' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: jobRequest.customerId }).select('-password')];
            case 4:
                customer = _b.sent();
                obj = {
                    job: jobRequest,
                    customer: customer
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
                err_14 = _b.sent();
                // signup error
                res.status(500).json({ message: err_14.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.contractorGeJobComfirmController = contractorGeJobComfirmController;
//contractor get job completed and complain by customer /////////////
var contractorGeJobComplainController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, jobRequests, jobRequested, i, jobRequest, customer, obj, err_15;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractorId, status: 'complain' }).sort({ createdAt: -1 })];
            case 2:
                jobRequests = _b.sent();
                jobRequested = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < jobRequests.length)) return [3 /*break*/, 6];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: jobRequest.customerId }).select('-password')];
            case 4:
                customer = _b.sent();
                obj = {
                    job: jobRequest,
                    customer: customer
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
exports.contractorGeJobComplainController = contractorGeJobComplainController;
var areObjectsEqual = function (obj1, obj2) { return __awaiter(void 0, void 0, void 0, function () {
    var keys1, keys2, _i, keys1_1, key;
    return __generator(this, function (_a) {
        keys1 = Object.keys(obj1).sort();
        keys2 = Object.keys(obj2).sort();
        if (keys1.length !== keys2.length) {
            return [2 /*return*/, false];
        }
        for (_i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
            key = keys1_1[_i];
            if (obj1[key] !== obj2[key]) {
                return [2 /*return*/, false];
            }
        }
        return [2 /*return*/, true];
    });
}); };
