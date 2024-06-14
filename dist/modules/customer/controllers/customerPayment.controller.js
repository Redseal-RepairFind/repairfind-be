"use strict";
// import { validationResult } from "express-validator";
// import { Request, Response } from "express";
// import { v4 as uuidv4 } from "uuid";
// import { sendEmail } from "../../../utils/send_email_utility";
// import {ContractorModel} from "../../../database/contractor/models/contractor.model";
// import { uploadToS3 } from "../../../utils/upload.utility";
// import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";
// import CustomerRegModel from "../../../database/customer/models/customer.model";
// import JobModel from "../../../database/contractor/models/job.model";
// import stripe from 'stripe';
// import { customerSendJobRequestSendEmailHtmlMailTemplate } from "../../../templates/email/custotomerSendRequestTemplate";
// import { json } from "body-parser";
// import { customerVerififyPaymentWebhook } from "./customerJob.controller";
// import { htmlJobRequestTemplate } from "../../../templates/contractorEmail/jobRequestTemplate";
// import { htmlAdminPaymentTemplate } from "../../../templates/adminEmail/adminPaymentTemplate";
// import AdminModel from "../../../database/admin/models/admin.model";
// import AdminNoficationModel from "../../../database/admin/models/admin_notification.model";
// import TransactionModel from "../../../database/common/transaction.model";
// // pay 50 doller for inspectopn /////////////
// export const customerInpectionMonneyCheckoutContractorController = async (
//     req: any,
//     res: Response,
//   ) => {
//     try {
//       const {  
//         time,
//         description,
//         address,
//         inspection,
//         postalCode,
//         contractorId,
//         jobTitle,
//       } = req.body;
//       const files = req.files;
//       // Check for validation errors
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       const customer =  req.customer;
//       const customerId = customer.id
//       const checkCustomer = await CustomerRegModel.findOne({_id: customerId})
//       if (!checkCustomer) {
//         return res
//           .status(401)
//           .json({ message: "incorrect Customer ID" });
//       }
//       const checkContractor = await ContractorModel.findOne({_id: contractorId})
//       if (!checkContractor) {
//         return res
//           .status(401)
//           .json({ message: "artisan does not exit" });
//       }
//       if (checkContractor.status != 'active' ) {
//         return res
//           .status(401)
//           .json({ message: "artisan is not active or not verified" });
//       }
//       let inspectionVal: boolean;
//       if (typeof inspection === 'boolean') {
//         inspectionVal = inspection
//       }else{
//         inspectionVal = JSON.parse(inspection);
//       }
//       if (inspectionVal === false) {
//         return res
//           .status(401)
//           .json({ message: "inpection must be true" });
//       }
//       if (!time || !description || !address || !postalCode || !jobTitle) {
//         return res
//           .status(401)
//           .json({ message: "all input are required" });
//       }
//       let images = [];
//       if (files.length > 0) {
//         for (let i = 0; i < files.length; i++) {
//             const file = files[i];
//             const fileId = uuidv4();
//             const uploadFile = await uploadToS3(file.buffer, `${fileId}.jpg`)
//             images.push(uploadFile?.Location) 
//         }
//       }
//       let secret = process.env.STRIPE_KEY || "sk_test_51OTMkGIj2KYudFaR1rNIBOPTaBESYoJco6lTCBZw5a0inyttRJOotcds1rXpXCJDSJrpNmIt2FBAaSxdmuma3ZTF00h48RxVny";
//       let stripeInstance;
//       if (!secret) {
//         return res
//           .status(401)
//           .json({ message: "Sripe API Key is missing" });
//       }
//       stripeInstance = new stripe(secret);
//       const inpection = {
//         status: true,
//         confirmPayment: false
//       }
//       const job = new JobModel({
//         customerId,
//         contractorId,
//         time,
//         description,
//         address,
//         image: images,
//         postalCode,
//         jobTitle,
//         inspection: inpection,
//         status: "inspection payment open"
//       })
//       const saveeJob = await job.save();
//       const jobId = JSON.stringify(saveeJob._id)
//       const generateInvoce = new Date().getTime().toString();
//       const invoiceId = generateInvoce.substring(generateInvoce.length - 5)
//       const newTransaction = new TransactionModel({
//         type: 'credit',
//         amount: 50,
//         initiator: customerId,
//         from: 'customer',
//         to: 'admin',
//         fromId: customerId,
//         toId: 'admin',
//         description: 'inspection payment before sending job request to artisan',
//         status: 'pending',
//         form: 'inspection',
//         invoiceId: invoiceId, 
//         jobId: saveeJob._id
//       })
//       const saveTransaction = await newTransaction.save();
//       const transactionId = JSON.stringify(saveTransaction._id)
//       const paymentIntent = await stripeInstance.checkout.sessions.create({
//         mode: 'payment',
//         payment_method_types: ['card'],
//         line_items: [
//             {
//                 price_data: {
//                     currency: 'usd', 
//                     product_data: {
//                         name: 'inspection fees'
//                     },
//                     unit_amount: 5000
//                 },
//                 quantity: 1,
//             },
//           ],
//           metadata: {
//             time,
//             jobTitle,
//             description,
//             address,
//             inspection,
//             postalCode,
//             customerId,
//             jobId,
//             type: "inspect",
//             transactionId
//           },
//           success_url: "https://repairfind.ca/payment-success/",
//           cancel_url: "https://cancel.com",
//           customer_email: checkCustomer.email
//       })
//       res.json({  
//         url: paymentIntent.url,
//         inspectionPaymemtId: paymentIntent.id,
//         jobId: saveeJob._id
//      });
//     } catch (err: any) {
//       // signup error
//       res.status(500).json({ message: err.message });
//     }
// }
// //customer get job inspection payment and open /////////////
// export const customerGetJobInspectionPaymentOpenController = async (
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
//     const customer =  req.customer;
//     const customerId = customer.id
//     const checkCustomer = await CustomerRegModel.findOne({_id: customerId})
//     if (!checkCustomer) {
//       return res
//         .status(401)
//         .json({ message: "incorrect Customer ID" });
//     }
//     const jobRequests = await JobModel.find({customerId, status: 'inspection payment open'}).sort({ createdAt: -1 })
//     let jobRequested = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const jobRequest = jobRequests[i];
//       const contractor = await ContractorModel.findOne({_id: jobRequest.contractorId}).select('-password');
//       const obj = {
//         job: jobRequest,
//         contractor
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
// // comfirm inspection payment money /////////////
// export const customerComfirmInpectionMonneyCheckoutContractorController = async (
//     req: any,
//     res: Response,
//   ) => {
//     try {
//       const {  
//         inspectionPaymemtId,
//         jobId
//       } = req.body;
//       // Check for validation errors
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       const customer =  req.customer;
//       const customerId = customer.id;
//       const checkCustomer = await CustomerRegModel.findOne({_id: customerId})
//       if (!checkCustomer) {
//         return res
//           .status(401)
//           .json({ message: "incorrect Customer ID" });
//       }
//       const job = await JobModel.findOne({_id: jobId, customerId, status: 'inspection payment open'})
//       if (!job) {
//         return res
//           .status(401)
//           .json({ message: "job do not exist or inspection payment has not be initialize" });
//       }
//       const checkContractor = await ContractorModel.findOne({_id: job.contractorId})
//       if (!checkContractor) {
//         return res
//           .status(401)
//           .json({ message: "artisan does not exit" });
//       }
//       let secret = process.env.STRIPE_KEY || "sk_test_51OTMkGIj2KYudFaR1rNIBOPTaBESYoJco6lTCBZw5a0inyttRJOotcds1rXpXCJDSJrpNmIt2FBAaSxdmuma3ZTF00h48RxVny";
//       let stripeInstance;
//       console.log(secret)
//       if (!secret) {
//         return res
//           .status(401)
//           .json({ message: "Sripe API Key is missing" });
//       }
//       stripeInstance = new stripe(secret);
//       const paymentConfirmation = await stripeInstance.checkout.sessions.retrieve(inspectionPaymemtId)
//       if (paymentConfirmation.status !== "complete") {
//         return res
//           .status(401)
//           .json({ message: "no payment or payment url expired" });
//       }
//       if (paymentConfirmation.metadata?.customerId !=  customerId) {
//         return res
//           .status(401)
//           .json({ message: "payment ID in not for this customer" });
//       }
//       job.inspection.confirmPayment = true
//       job.status = "sent request"
//       await job.save()
//       const html = customerSendJobRequestSendEmailHtmlMailTemplate(checkContractor.firstName, checkCustomer?.firstName)
//       let emailData = {
//         emailTo: checkContractor.email,
//         subject: "Job request from customer",
//         html
//       };
//       await sendEmail(emailData);
//       res.json({  
//         message: "job request successfully sent",
//       });
//     } catch (err: any) {
//       // signup error
//       res.status(500).json({ message: err.message });
//     }
// }
// // webhook /////////////
// export const webhook = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const event = req.body;
//     switch (event.type) {
//       case 'checkout.session.async_payment_failed':
//         const checkoutSessionAsyncPaymentFailed = event.data.object;
//         // Then define and call a function to handle the event checkout.session.async_payment_failed
//         console.log("event fail", event)
//         break;
//       case 'checkout.session.async_payment_succeeded':
//         const checkoutSessionAsyncPaymentSucceeded = event.data.object;
//         // Then define and call a function to handle the event checkout.session.async_payment_succeeded
//         console.log("event succed", event)
//         break;
//       case 'checkout.session.completed':
//         const checkoutSessionCompleted = event.data.object;
//         // Then define and call a function to handle the event checkout.session.completed
//         if (checkoutSessionCompleted.metadata?.type == "inspect") {
//           customerComfirmInpection(checkoutSessionCompleted.metadata?.jobId, checkoutSessionCompleted.metadata?.customerId, checkoutSessionCompleted.metadata?.transactionId)
//         }else if (checkoutSessionCompleted.metadata?.type == "payment") {
//           customerVerififyPaymentWebhook(checkoutSessionCompleted.metadata?.jobId, checkoutSessionCompleted.metadata?.customerId, checkoutSessionCompleted.metadata?.transactionId)
//         }else {
//         }
//         console.log("event complet", checkoutSessionCompleted.metadata)
//         break;
//       case 'checkout.session.expired':
//         const checkoutSessionExpired = event.data.object;
//         // Then define and call a function to handle the event checkout.session.expired
//         console.log("event expired", event)
//         break;
//       // ... handle other event types
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// // comfirm inspection payment money webhook /////////////
// const customerComfirmInpection = async (
//   jobId: any,
//   customerId: any,
//   transactionId: any,
// ) => {
//   try {  
//     const checkCustomer = await CustomerRegModel.findOne({_id: customerId})
//     if (!checkCustomer) {
//       return 
//     }
//     const job = await JobModel.findOne({_id: jobId.substring(1, jobId.length - 1), customerId, status: 'inspection payment open'})
//     if (!job) {
//       return 
//     }
//     const checkContractor = await ContractorModel.findOne({_id: job.contractorId})
//     if (!checkContractor) {
//       return 
//     }
//     const transaction = await TransactionModel.findOne({_id: transactionId.substring(1, transactionId.length - 1)});
//     if (!transaction) {
//       return
//     }
//     job.inspection.confirmPayment = true
//     job.status = "sent request"
//     await job.save()
//     transaction.status = 'successful',
//     await transaction.save();
//     const html = htmlJobRequestTemplate(checkContractor.firstName, checkCustomer.firstName, job.time.toString(), job.description)
//     let emailData = {
//       emailTo: checkContractor.email,
//       subject: "Job request from customer",
//       html
//     };
//     await sendEmail(emailData);
//     const admins = await AdminModel.find()
//     const adminPaymentHtml = htmlAdminPaymentTemplate(jobId, checkCustomer._id, '50 for inspection')
//     for (let i = 0; i < admins.length; i++) {
//       const admin = admins[i];
//       let adminEmailData = {
//         emailTo: admin.email,
//         subject: "inspection payment",
//         html: adminPaymentHtml
//       };
//       await sendEmail(adminEmailData);
//     }
//     // admin notification 
//     const adminNoti = new AdminNoficationModel({
//       title: "Job Site Visit Payment",
//       message: `${checkCustomer.firstName} just paid $50 for site inspection.`,
//       status: "unseen"
//     })
//     await adminNoti.save();
//   } catch (err: any) {
//     console.log("error:",  err)
//     // signup error
//   }
// }
