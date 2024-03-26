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
exports.ContractorJobController = exports.rejectJobRequest = exports.acceptJobRequest = exports.getJobRequests = void 0;
var express_validator_1 = require("express-validator");
var customer_jobrequest_model_1 = __importDefault(require("../../../database/customer/models/customer_jobrequest.model"));
var job_model_1 = require("../../../database/common/job.model");
var getJobRequests = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, customerId, status_1, startDate, endDate, date, contractorId, filter, start, end, selectedDate, startOfDay, endOfDay, jobRequests, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _a = req.query, customerId = _a.customerId, status_1 = _a.status, startDate = _a.startDate, endDate = _a.endDate, date = _a.date;
                contractorId = req.contractor.id;
                filter = {};
                if (customerId) {
                    filter.customer = customerId;
                }
                if (contractorId) {
                    filter.contractor = contractorId;
                }
                if (status_1) {
                    filter.status = status_1.toUpperCase();
                }
                if (startDate && endDate) {
                    start = new Date(startDate);
                    end = new Date(endDate);
                    // Ensure that end date is adjusted to include the entire day
                    end.setDate(end.getDate() + 1);
                    filter.createdAt = { $gte: start, $lt: end };
                }
                if (date) {
                    selectedDate = new Date(date);
                    startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
                    endOfDay = new Date(startOfDay);
                    endOfDay.setDate(startOfDay.getUTCDate() + 1);
                    filter.date = { $gte: startOfDay, $lt: endOfDay };
                }
                return [4 /*yield*/, customer_jobrequest_model_1.default.find(filter).exec()];
            case 1:
                jobRequests = _b.sent();
                res.json({ success: true, message: 'Job requests retrieved', data: jobRequests });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Error retrieving job requests:', error_1);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getJobRequests = getJobRequests;
var acceptJobRequest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, jobId, contractorId, jobRequest, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, contractor: contractorId, type: job_model_1.JobType.REQUEST })];
            case 1:
                jobRequest = _a.sent();
                // Check if the job request exists
                if (!jobRequest) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job request not found' })];
                }
                // Check if the job request belongs to the contractor
                if (jobRequest.contractor !== contractorId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to accept this job request' })];
                }
                // Check if the job request is pending
                if (jobRequest.status !== job_model_1.JobStatus.PENDING) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Job request is not pending' })];
                }
                // Update the status of the job request to "Accepted"
                jobRequest.status = job_model_1.JobStatus.ACCEPTED;
                return [4 /*yield*/, jobRequest.save()];
            case 2:
                _a.sent();
                // Return success response
                res.json({ success: true, message: 'Job request accepted successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Error accepting job request:', error_2);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.acceptJobRequest = acceptJobRequest;
var rejectJobRequest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, jobId, rejectionReason, contractorId, jobRequest, rejectionEvent, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                jobId = req.params.jobId;
                rejectionReason = req.body.rejectionReason;
                contractorId = req.contractor.id;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, contractor: contractorId, type: job_model_1.JobType.REQUEST })];
            case 1:
                jobRequest = _a.sent();
                // Check if the job request exists
                if (!jobRequest) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job request not found' })];
                }
                // Check if the job request belongs to the contractor
                if (jobRequest.contractor !== contractorId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to reject this job request' })];
                }
                // Check if the job request is pending
                if (jobRequest.status !== job_model_1.JobStatus.PENDING) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Job request is not pending' })];
                }
                // Update the status of the job request to "Rejected" and set the rejection reason
                jobRequest.status = job_model_1.JobStatus.DECLINED;
                rejectionEvent = {
                    eventType: 'REJECTION',
                    timestamp: new Date(),
                    details: { reason: rejectionReason }, // Store the rejection reason
                };
                // Push the rejection event to the job history array
                jobRequest.jobHistory.push(rejectionEvent);
                return [4 /*yield*/, jobRequest.save()];
            case 2:
                _a.sent();
                // Return success response
                res.json({ success: true, message: 'Job request rejected successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Error rejecting job request:', error_3);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.rejectJobRequest = rejectJobRequest;
// //contractor send job quatation /////////////
// export const contractorSendJobQuatationController = async (
//     req: any,
//     res: Response,
//   ) => {
//     try {
//       const {  
//         jobId,
//         quatations,
//         workmanShip
//       } = req.body;
//       // Check for validation errors
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       const contractor =  req.contractor;
//       const contractorId = contractor.id
//       //get user info from databas
//       const contractorExist = await ContractorModel.findOne({_id: contractorId});
//       if (!contractorExist) {
//         return res
//           .status(401)
//           .json({ message: "invalid credential" });
//       }
//       const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })
//       if (!job) {
//         return res
//           .status(401)
//           .json({ message: "job request do not exist" });
//       }
//       if (quatations.length < 1) {
//         return res
//           .status(401)
//           .json({ message: "invalid quatation format" });
//       }
//       const customer = await CustomerRegModel.findOne({_id: job.customerId})
//       if (!customer) {
//         return res
//         .status(401)
//         .json({ message: "invalid customer Id" });
//       }
//       let totalQuatation = 0
//       for (let i = 0; i < quatations.length; i++) {
//         const quatation = quatations[i];
//         totalQuatation = totalQuatation + quatation.amount
//       }
//       totalQuatation = totalQuatation + workmanShip;
//       let companyCharge = 0
//       if (totalQuatation <= 1000) {
//         companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
//       }else if (totalQuatation <=  5000){
//         companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
//       }else{
//         companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
//       }
//       const gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));
//       const totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
//       const totalAmountContractorWithdraw = totalQuatation + gst;
//       job.quate = quatations
//       job.workmanShip = workmanShip
//       job.gst = gst
//       job.totalQuatation = totalQuatation
//       job.companyCharge = companyCharge
//       job.totalAmountCustomerToPaid =  parseFloat(totalAmountCustomerToPaid.toFixed(2));
//       job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2))
//       job.status = "sent qoutation";
//       await job.save()
//       const html = htmlJobQoutationTemplate(customer.firstName, contractorExist.firstName)
//       let emailData = {
//         emailTo: customer.email,
//         subject: "Job qoutetation from artisan",
//         html
//       };
//       await sendEmail(emailData);
//       res.json({  
//         message: "job qoutation sucessfully sent"
//      });
//     } catch (err: any) {
//       // signup error
//       res.status(500).json({ message: err.message });
//     }
// }
// //contractor send job quatation two /////////////
// export const contractorSendJobQuatationControllerTwo = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//       jobId,
//       materialDetail,
//       totalcostMaterial,
//       workmanShip
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })
//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }
//     const customer = await CustomerRegModel.findOne({_id: job.customerId})
//     if (!customer) {
//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }
//     let totalQuatation = totalcostMaterial + workmanShip
//     let companyCharge = 0
//     if (totalQuatation <= 1000) {
//       companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
//     }else if (totalQuatation <=  5000){
//       companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
//     }else{
//       companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
//     }
//     const gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));
//     const totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
//     const totalAmountContractorWithdraw = totalQuatation + gst;
//     const qoute = {
//       materialDetail,
//       totalcostMaterial,
//       workmanShip
//     };
//     job.qoute = qoute,
//     job.gst = gst
//     job.totalQuatation = totalQuatation
//     job.companyCharge = companyCharge
//     job.totalAmountCustomerToPaid =  parseFloat(totalAmountCustomerToPaid.toFixed(2));
//     job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2))
//     job.status = "sent qoutation";
//     await job.save()
//     const html = htmlJobQoutationTemplate(customer.firstName, contractorExist.firstName)
//     let emailData = {
//       emailTo: customer.email,
//       subject: "Job qoutetation from artisan",
//       html
//     };
//     await sendEmail(emailData);
//     res.json({  
//       message: "job qoutation sucessfully sent"
//    });
//   } catch (err: any) {
//     // signup error
//     console.log("error", err)
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor send job quatation three [one by one] /////////////
// export const contractorSendJobQuatationControllerThree = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//       jobId,
//       material,
//       qty,
//       rate,
//       //tax,
//       amount,
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })
//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }
//     const customer = await CustomerRegModel.findOne({_id: job.customerId})
//     if (!customer) {
//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }
//     const qouteObj = {
//       material,
//       qty,
//       rate,
//       //tax,
//       amount,
//     }
//     const dbQoute = job.quate;
//     const newQoute = [...dbQoute, qouteObj]
//     job.quate = newQoute;
//     await job.save()
//     // const html = htmlJobQoutationTemplate(customer.fullName, contractorExist.firstName)
//     // let emailData = {
//     //   emailTo: customer.email,
//     //   subject: "Job qoutetation from artisan",
//     //   html
//     // };
//     // await sendEmail(emailData);
//     res.json({  
//       message: "job qoutation sucessfully enter"
//    });
//   } catch (err: any) {
//     // signup error
//     console.log("error", err)
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor remove job quatation one by one five [romove one by one] /////////////
// export const contractorRemoveobQuatationOneByOneControllerfive = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//       jobId,
//       material,
//       qty,
//       rate,
//       //tax,
//       amount,
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })
//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }
//     const customer = await CustomerRegModel.findOne({_id: job.customerId})
//     if (!customer) {
//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }
//     if (job.quate.length < 1) {
//       return res
//         .status(401)
//         .json({ message: "please add atleast one qoutation" });
//     }
//     const qouteObj = {
//       material,
//       qty,
//       rate,
//       //tax,
//       amount,
//     }
//     let newQoute = []
//     for (let i = 0; i < job.quate.length; i++) {
//       const qoute = job.quate[i];
//       const dbQoute = {
//         material: qoute.material,
//         qty: qoute.qty,
//         rate: qoute.rate,
//         //tax: qoute.tax,
//         amount: qoute.amount,
//       }
//       const compareQoute = await areObjectsEqual(dbQoute, qouteObj)
//       if (compareQoute) continue
//       newQoute.push(qoute)
//     }
//     job.quate = newQoute;
//     await job.save()
//     res.json({  
//       message: "job qoutation sucessfully remove"
//    });
//   } catch (err: any) {
//     // signup error
//     console.log("error", err)
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor send job quatation four [complete] /////////////
// export const contractorSendJobQuatationControllerFour = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//       jobId,
//       workmanShip
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     console.log(1);
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     console.log(2);
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })
//     console.log(3);
//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }
//     console.log(4);
//     const customer = await CustomerRegModel.findOne({_id: job.customerId})
//     if (!customer) {
//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }
//     if (job.quate.length < 1) {
//       return res
//         .status(401)
//         .json({ message: "please add atleast one qoutation" });
//     }
//     console.log(5);
//     let totalQuatation = 0
//     for (let i = 0; i < job.quate.length; i++) {
//       const quatation = job.quate[i];
//       totalQuatation = totalQuatation + quatation.amount
//     }
//     totalQuatation = totalQuatation + workmanShip;
//     let companyCharge = 0
//     if (totalQuatation <= 1000) {
//       companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
//     }else if (totalQuatation <=  5000){
//       companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
//     }else{
//       companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
//     }
//     const gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));
//     const totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
//     const totalAmountContractorWithdraw = totalQuatation + gst;
//     console.log(6);
//     job.workmanShip = workmanShip
//     job.gst = gst
//     job.totalQuatation = totalQuatation
//     job.companyCharge = companyCharge
//     job.totalAmountCustomerToPaid =  parseFloat(totalAmountCustomerToPaid.toFixed(2));
//     job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2))
//     job.status = "sent qoutation";
//     await job.save()
//     console.log(7);
//     const html = htmlJobQoutationTemplate(customer.firstName, contractorExist.firstName)
//     let emailData = {
//       emailTo: customer.email,
//       subject: "Job qoutetation from artisan",
//       html
//     };
//     console.log(8);
//     //await sendEmail(emailData);
//     console.log(9);
//     res.json({  
//       message: "job qoutation sucessfully sent"
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor get job qoutation sent to artisan  /////////////
// export const contractorGetQuatationContractorController = async (
//     req: any,
//     res: Response,
//   ) => {
//     try {
//       const {  
//       } = req.body;
//       // Check for validation errors
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       const contractor =  req.contractor;
//       const contractorId = contractor.id
//       //get user info from databas
//       const contractorExist = await ContractorModel.findOne({_id: contractorId});
//       if (!contractorExist) {
//         return res
//           .status(401)
//           .json({ message: "invalid credential" });
//       }
//       const jobRequests = await JobModel.find({contractorId, status: 'sent qoutation'}).sort({ createdAt: -1 })
//       let jobRequested = []
//       for (let i = 0; i < jobRequests.length; i++) {
//         const jobRequest = jobRequests[i];
//         const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');
//         const obj = {
//           job: jobRequest,
//           customer
//         }
//         jobRequested.push(obj)
//       }
//       res.json({  
//         jobRequested
//      });
//     } catch (err: any) {
//       // signup error
//       res.status(500).json({ message: err.message });
//     }
// }
// //contractor get job qoutation payment comfirm and job in progress /////////////
// export const contractorGetQuatationPaymentComfirmAndJobInProgressController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const jobRequests = await JobModel.find({contractorId, status: 'qoutation payment confirm and job in progress'}).sort({ createdAt: -1 })
//     let jobRequested = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];
//       const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');
//       const obj = {
//         job: jobRequest,
//         customer
//       }
//       jobRequested.push(obj)
//     }
//     res.json({  
//       jobRequested
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor reject job Request /////////////
// export const contractorRejectJobRequestController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//       jobId,
//       rejectedReason,
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })
//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }
//     const customer = await CustomerRegModel.findOne({_id: job.customerId})
//     if (!customer) {
//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }
//     job.rejected = true;
//     job.rejectedReason = rejectedReason;
//     job.status = "job reject";
//     await job.save()
//     // const html = contractorSendJobQuatationSendEmailHtmlMailTemplate(contractorExist.firstName, customer.fullName)
//     // let emailData = {
//     //   emailTo: customer.email,
//     //   subject: "Job qoutetation from artisan",
//     //   html
//     // };
//     // await sendEmail(emailData);
//     res.json({  
//       message: "you sucessfully rejected job request"
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor get job he rejected /////////////
// export const contractorGeJobRejectedController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const jobRequests = await JobModel.find({contractorId, status: 'job reject'}).sort({ createdAt: -1 })
//     let jobRequested = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];
//       const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');
//       const obj = {
//         job: jobRequest,
//         customer
//       }
//       jobRequested.push(obj)
//     }
//     res.json({  
//       jobRequested
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor get job history /////////////
// export const contractorGeJobHistoryController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const jobRequests = await JobModel.find({contractorId,}).sort({ createdAt: -1 })
//     let jobHistory = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];
//       const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');
//       const obj = {
//         job: jobRequest,
//         customer
//       }
//       jobHistory.push(obj)
//     }
//     res.json({  
//       jobHistory
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor complete job /////////////
// export const contractorCompleteJobController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//       jobId,
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const job = await JobModel.findOne({_id: jobId,contractorId, status: 'qoutation payment confirm and job in progress'}).sort({ createdAt: -1 })
//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }
//     const customer = await CustomerRegModel.findOne({_id: job.customerId})
//     if (!customer) {
//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }
//     // check the time of job is reach
//     const currentTime = new Date().getTime()
//     const jobTime = job.time.getTime()
//    if (currentTime > jobTime) {
//        return res.status(400).json({ message: "Not yet job day" });
//    }
//     job.status = "completed";
//     await job.save()
//     //admin notification
//     const adminNotic = new AdminNoficationModel({
//       title: "Contractor Job Completed",
//       message: `${job._id} - ${contractorExist.firstName} has updated this job to completed.`,
//       status: "unseen"
//     })
//       await adminNotic.save();
//     res.json({  
//       message: "you sucessfully complete this job, wait for comfirmation from customer"
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor get job completed /////////////
// export const contractorGeJobCompletedController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const jobRequests = await JobModel.find({contractorId, status: 'completed'}).sort({ createdAt: -1 })
//     let jobRequested = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];
//       const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');
//       const obj = {
//         job: jobRequest,
//         customer
//       }
//       jobRequested.push(obj)
//     }
//     res.json({  
//       jobRequested
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor get job completed and comfirm by customer /////////////
// export const contractorGeJobComfirmController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const jobRequests = await JobModel.find({contractorId, status: 'comfirmed'}).sort({ createdAt: -1 })
//     let jobRequested = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];
//       const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');
//       const obj = {
//         job: jobRequest,
//         customer
//       }
//       jobRequested.push(obj)
//     }
//     res.json({  
//       jobRequested
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor get job completed and complain by customer /////////////
// export const contractorGeJobComplainController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const jobRequests = await JobModel.find({contractorId, status: 'complain'}).sort({ createdAt: -1 })
//     let jobRequested = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];
//       const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');
//       const obj = {
//         job: jobRequest,
//         customer
//       }
//       jobRequested.push(obj)
//     }
//     res.json({  
//       jobRequested
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// const areObjectsEqual = async (obj1: any, obj2: any): Promise<boolean> => {
//   const keys1 = Object.keys(obj1).sort();
//   const keys2 = Object.keys(obj2).sort();
//   if (keys1.length !== keys2.length) {
//     return false;
//   }
//   for (const key of keys1) {
//     if (obj1[key] !== obj2[key]) {
//       return false;
//     }
//   }
//   return true;
// }
exports.ContractorJobController = {
    getJobRequests: exports.getJobRequests
};
