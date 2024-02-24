import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import { uploadToS3 } from "../../../utils/upload.utility";
import { v4 as uuidv4 } from "uuid";
import JobModel from "../../../database/contractor/models/job.model";
import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";
import ContractorAvailabilityModel from "../../../database/contractor/models/contractorAvaliability.model";
import { sendEmail } from "../../../utils/send_email_utility";
import CustomerRegModel from "../../../database/customer/models/customer.model";
import stripe from 'stripe';
import { customerAcceptQouteAndPaySendEmailHtmlMailTemplate } from "../../../templates/email/customerAcceptQuoteTem";
import { customerToAdminAfterPaymentSendEmailHtmlMailTemplate } from "../../../templates/email/customerPaymoneyForQuateTem";
import AdminRegModel from "../../../database/admin/models/adminReg.model";
import TransactionModel from "../../../database/admin/models/transaction.model";
import { htmlJobRequestTemplate } from "../../../templates/contractorEmail/jobRequestTemplate";
import { htmlAdminPaymentTemplate } from "../../../templates/adminEmail/adminPaymentTemplate";
import ContractorNotificationModel from "../../../database/contractor/models/contractorNotification.model";
import CustomerNotificationModel from "../../../database/customer/models/customerNotification.model";
import AdminNoficationModel from "../../../database/admin/models/adminNotification.model";
import PayoutModel from "../../../database/admin/models/payout.model";
import ContractorBankModel from "../../../database/contractor/models/contractorBankDetail.model";



//customer send job request to contractor /////////////
export const customerSendJobToContractorController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        time,
        description,
        address,
        inspection,
        postalCode,
        contractorId,
        jobTitle,
      } = req.body;

      const files = req.files;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const customer =  req.customer;
      const customerId = customer.id

      const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

      if (!checkCustomer) {
        return res
          .status(401)
          .json({ message: "incorrect Customer ID" });
      }

      const checkContractor = await ContractorModel.findOne({_id: contractorId})

      if (!checkContractor) {
        return res
          .status(401)
          .json({ message: "artisan does not exit" });
      }

      if (checkContractor.status != 'active' ) {
        return res
          .status(401)
          .json({ message: "artisan is not active or not verified" });
      }

      let inspectionVal: boolean;

      if (typeof inspection === 'boolean') {
        inspectionVal = inspection
      }else{
        inspectionVal = JSON.parse(inspection);
      }

      if (inspectionVal === true) {
        return res
          .status(401)
          .json({ message: "inpection payment is required first" });
      }


      if (!time || !description || !address || !postalCode || !jobTitle) {
        return res
          .status(401)
          .json({ message: "all input are required" });
      }

      let images = [];

      if (files.length > 0) {

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            const fileId = uuidv4();

            const uploadFile = await uploadToS3(file.buffer, `${fileId}.jpg`)

            images.push(uploadFile?.Location) 
        }
        
      }

      console.log('images', images)

      const inpection = {
        status: false,
        confirmPayment: false
      }

      const job = new JobModel({
        customerId,
        contractorId,

        time,
        description,
        address,
        image: images,
        postalCode,
        jobTitle,

        inspection: inpection,

        status: "sent request"
      })

      await job.save();

      //contractor notification
      const contractorNotic = new ContractorNotificationModel({
        contractorId: checkContractor._id,
        message: `You've been sent a job request from ${checkCustomer.fullName}`,
        status: "unseen"
      });

      await contractorNotic.save();

      //customer notification
      const customerNotic = new CustomerNotificationModel({
        customerId: checkCustomer._id,
        message: `You've sent a job request to ${checkContractor.firstName}`,
        status: "unseen"
      })

      await customerNotic.save();




      const html = htmlJobRequestTemplate(checkContractor.firstName, checkCustomer.fullName, time, description)

      let emailData = {
        emailTo: checkContractor.email,
        subject: "Job request from customer",
        html
      };

      await sendEmail(emailData);
    
      res.json({  
        message: "job request successfully sent",
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}



//customer get job that he sent request /////////////
export const customerJobRequestSentToContractorController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return res
        .status(401)
        .json({ message: "incorrect Customer ID" });
    }

    const jobRequests = await JobModel.find({customerId, status: 'sent request'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const contractor = await ContractorModel.findOne({_id: jobRequest.contractorId}).select('-password');

      const obj = {
        job: jobRequest,
        contractor
      }

      jobRequested.push(obj)
      
    }
  
    res.json({  
      jobRequested
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//customer get job with sent qoutation /////////////
export const customerGetJobQoutationController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return res
        .status(401)
        .json({ message: "incorrect Customer ID" });
    }

    const jobRequests = await JobModel.find({customerId, status: 'sent qoutation'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const contractor = await ContractorModel.findOne({_id: jobRequest.contractorId}).select('-password');

      const obj = {
        job: jobRequest,
        contractor
      }

      jobRequested.push(obj)
      
    }
  
    res.json({  
      jobRequested
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//customer accept and pay for the work /////////////
export const customerAcceptAndPayForJobController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      jobId
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return res
        .status(401)
        .json({ message: "incorrect Customer ID" });
    }

    //const job = await JobModel.findOne({_id: jobId, customerId, status: 'sent qoutation'})
    const job = await JobModel.findOne({
      $and: [
        { _id: jobId },
        { customerId },
        {
          $or: [
            { status: 'sent qoutation' },
            { status: 'qoutation payment open' }
          ]
        }
      ]
    });

    if (!job) {
      return res
        .status(401)
        .json({ message: "job do not exist or qoutation have not be sent" });
    }

    const contractor = await ContractorModel.findOne({_id: job.contractorId}).select('-password');

    let secret = process.env.STRIPE_KEY || "sk_test_51OTMkGIj2KYudFaR1rNIBOPTaBESYoJco6lTCBZw5a0inyttRJOotcds1rXpXCJDSJrpNmIt2FBAaSxdmuma3ZTF00h48RxVny";

    let stripeInstance;

    if (!secret) {
      return res
        .status(401)
        .json({ message: "Sripe API Key is missing" });
    }

    stripeInstance = new stripe(secret);

    const generateInvoce = new Date().getTime().toString()

    const invoiceId = generateInvoce.substring(generateInvoce.length - 5)

    const newTransaction = new TransactionModel({
      type: 'credit',
      amount: parseFloat(job.totalAmountCustomerToPaid.toFixed(2)),
      initiator: customerId,
      from: 'customer',
      to: 'admin',
      fromId: customerId,
      toId: 'admin',
      description: `qoutation from ${contractor?.firstName} payment`,
      status: 'pending',
      form: 'qoutation',
      invoiceId: invoiceId, 
      jobId: jobId
    })

    const saveTransaction = await newTransaction.save();

    const transactionId = JSON.stringify(saveTransaction._id)

    const paymentIntent = await stripeInstance.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
          {
              price_data: {
                  currency: 'usd', 
                  product_data: {
                      name: `qoutation payment from ${contractor?.firstName}`
                  },
                  unit_amount:  parseFloat(job.totalAmountCustomerToPaid.toFixed(2)) * 100,
              },
              quantity: 1,
            
          },
        ],
        metadata: {
          customerId,
          type: "payment",
          jobId,
          transactionId
        },

        success_url: "https://repairfind.ca/payment-success/",
        cancel_url: "https://cancel.com",
        customer_email: checkCustomer.email
    })

    job.status = "qoutation payment open";

    await job.save()
  
    res.json({  
      jobId,
      url: paymentIntent.url,
      paymentId: paymentIntent.id
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//customer get job qoutation payment and open /////////////
export const customerGetJobQoutationPaymentOpenController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return res
        .status(401)
        .json({ message: "incorrect Customer ID" });
    }

    const jobRequests = await JobModel.find({customerId, status: 'qoutation payment open'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const contractor = await ContractorModel.findOne({_id: jobRequest.contractorId}).select('-password');

      const obj = {
        job: jobRequest,
        contractor
      }

      jobRequested.push(obj)
      
    }
  
    res.json({  
      jobRequested
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//customer confirm or verified payment /////////////
export const customerVerififyPaymentForJobController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      jobId,
      paymentId,
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return res
        .status(401)
        .json({ message: "incorrect Customer ID" });
    }

    const job = await JobModel.findOne({_id: jobId, customerId, status: 'qoutation payment open'})

    if (!job) {
      return res
        .status(401)
        .json({ message: "job do not exist or payment has not be initialize" });
    }

    const contractor = await ContractorModel.findOne({_id: job.contractorId}).select('-password');

    if (!contractor) {
      return res
        .status(401)
        .json({ message: "incorrect contractor Id" });
    }

    let secret = process.env.STRIPE_KEY || "sk_test_51OTMkGIj2KYudFaR1rNIBOPTaBESYoJco6lTCBZw5a0inyttRJOotcds1rXpXCJDSJrpNmIt2FBAaSxdmuma3ZTF00h48RxVny";

    let stripeInstance;

    console.log(secret)

    if (!secret) {
      return res
        .status(401)
        .json({ message: "Sripe API Key is missing" });
    }

    stripeInstance = new stripe(secret);

    const paymentConfirmation = await stripeInstance.checkout.sessions.retrieve(paymentId)

    if (paymentConfirmation.status !== "complete") {
      return res
        .status(401)
        .json({ message: "no payment or payment url expired" });
    }

    if (paymentConfirmation.metadata?.customerId !=  customerId) {
      return res
        .status(401)
        .json({ message: "payment ID in not for this customer" });
    }

    job.status = "qoutation payment confirm and job in progress";

    await job.save()

    const html = customerAcceptQouteAndPaySendEmailHtmlMailTemplate(contractor?.firstName, checkCustomer.fullName);

    let emailData = {
      emailTo: contractor.email,
      subject: "Artisan payment for the job",
      html
    };

    await sendEmail(emailData);

    const admins = await AdminRegModel.find();

    for (let i = 0; i < admins.length; i++) {
      const admin = admins[i];

      const html = customerToAdminAfterPaymentSendEmailHtmlMailTemplate(contractor.firstName, checkCustomer.fullName);

      let emailData = {
        emailTo: admin.email,
        subject: "Artisan payment for the job",
        html
      };
  
      await sendEmail(emailData);
      
    }
  
    res.json({  
      message: "payment successfully comfirm",
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//customer get job qoutation payment confirm and job in progres /////////////
export const customerGetJobQoutationPaymentConfirmAndJobInProgressController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return res
        .status(401)
        .json({ message: "incorrect Customer ID" });
    }

    const jobRequests = await JobModel.find({customerId, status: 'qoutation payment confirm and job in progress'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const contractor = await ContractorModel.findOne({_id: jobRequest.contractorId}).select('-password');

      const obj = {
        job: jobRequest,
        contractor
      }

      jobRequested.push(obj)
      
    }
  
    res.json({  
      jobRequested
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//customer get job request rejected /////////////
export const customerGetJobRejectedontroller = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return res
        .status(401)
        .json({ message: "incorrect Customer ID" });
    }

    const jobRequests = await JobModel.find({customerId, status: 'job reject'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const contractor = await ContractorModel.findOne({_id: jobRequest.contractorId}).select('-password');

      const obj = {
        job: jobRequest,
        contractor
      }

      jobRequested.push(obj)
      
    }
  
    res.json({  
      jobRequested
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//get all job history/////////////
export const customerGetAllSetJobController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        page,
        limit
      } = req.query;

      
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const customer =  req.customer;
      const customerId = customer.id

      page = page || 1;
      limit = limit || 50;
      const skip = (page - 1) * limit;

      const jobs = await JobModel.find({customerId})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

      const jobHistory = [];

      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];

        const contractorProfile = await ContractorModel.findOne({_id: job.contractorId}).select('-password')
        //const contractorDocument = await ContractorDocumentValidateModel.findOne({contractorId: job.contractorId});

        const obj = {
            job,
            contractorProfile,
            //contractorDocument
        }

        jobHistory.push(obj);
        
      }

      res.json({  
        jobHistory
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
  }


//customer confirm or verified payment web hook/////////////
export const customerVerififyPaymentWebhook = async (
  jobId: any,
  customerId: any,
  transactionId: any
) => {

  try {

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return
    }

    const job = await JobModel.findOne({_id: jobId, customerId, status: 'qoutation payment open'})

    if (!job) {
      return
    }

    const contractor = await ContractorModel.findOne({_id: job.contractorId}).select('-password');

    if (!contractor) {
      return 
    }

    const transaction = await TransactionModel.findOne({_id: transactionId.substring(1, transactionId.length - 1)});

    if (!transaction) {
      return
    }

    job.status = "qoutation payment confirm and job in progress";
    await job.save()

    transaction.status = 'successful',
    await transaction.save();

    const html = customerAcceptQouteAndPaySendEmailHtmlMailTemplate(contractor?.firstName, checkCustomer.fullName);

    let emailData = {
      emailTo: contractor.email,
      subject: "Artisan payment for the job",
      html
    };

    await sendEmail(emailData);

    const admins = await AdminRegModel.find();

    const adminPaymentHtml = htmlAdminPaymentTemplate(jobId, checkCustomer._id, `${job.totalAmountCustomerToPaid} for job qoutation`)

    for (let i = 0; i < admins.length; i++) {
      const admin = admins[i];

      let adminEmailData = {
        emailTo: admin.email,
        subject: "qoutation payment",
        html: adminPaymentHtml
      };

      await sendEmail(adminEmailData);

      //admin notification
      const adminNotic = new AdminNoficationModel({
        title: "Job Booked",
        message: `${job._id} - ${checkCustomer.fullName} booked a job for $${job.totalAmountCustomerToPaid}.`,
        status: "unseen"
      })

      await adminNotic.save();
      
    }

    //contractor notification
    const contractorNotic = new ContractorNotificationModel({
      contractorId: contractor._id,
      message: `You've been booked for a job from ${checkCustomer.fullName} for ${job.time}`,
      status: "unseen"
    });

    await contractorNotic.save();

    //customer notification
    const customerNotic = new CustomerNotificationModel({
      customerId: checkCustomer._id,
      message: `You've booked a job with ${contractor.firstName} for ${job.jobTitle}`,
      status: "unseen"
    })

    await customerNotic.save();

    //customer notification two
    const customerNoticTwo = new CustomerNotificationModel({
      customerId: checkCustomer._id,
      message: `You've just sent a payment for this job - ${job.jobTitle}, Thank you.`,
      status: "unseen"
    })

    await customerNoticTwo.save();
  
  } catch (err: any) {
    // signup error
    console.log("payment Error", "err")
  }

}




//customer get job completed by contractor /////////////
export const customerGetComletedByContractorController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return res
        .status(401)
        .json({ message: "incorrect Customer ID" });
    }

    const jobRequests = await JobModel.find({customerId, status: 'completed'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const contractor = await ContractorModel.findOne({_id: jobRequest.contractorId}).select('-password');

      const obj = {
        job: jobRequest,
        contractor
      }

      jobRequested.push(obj)
      
    }
  
    res.json({  
      jobRequested
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//customer comfirm job completed by Contractor /////////////
export const customerComfirmedJobJobController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      jobId
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return res
        .status(401)
        .json({ message: "incorrect Customer ID" });
    }

    const job = await JobModel.findOne({_id: jobId, customerId, status: 'completed'})
    if (!job) {
      return res
        .status(401)
        .json({ message: "job do not exist or has not been completed by artisan" });
    }

    const contractor = await ContractorModel.findOne({_id: job.contractorId}).select('-password');
    if (!contractor) {
      return res
      .status(401)
      .json({ message: "incorrect contractor id" });
    }

    const contractorBank = await ContractorBankModel.findOne({contractorId: contractor._id})
    if (!contractorBank) {
      return res
      .status(401)
      .json({ message: "contractor has not enter his bank detail" });
    }

    const newPayout = new PayoutModel({
      amount: job.totalAmountContractorWithdraw,
      accountName: `${contractor.firstName} ${contractor.lastName}`,
      accountNumber: contractorBank.accountNumber,
      bankName: contractorBank.financialInstitution,
      recieverId: contractor._id,
      jobId,
      status: "pending"
    })

    await newPayout.save()

    job.status = "comfirmed";
    await job.save()

    //admin notification 
    const adminNotic = new AdminNoficationModel({
      title: "Customer Confirmed Job Completed",
      message: `${jobId} - ${checkCustomer.fullName} has updated this job to completed and comfirm`,
      status: "unseen"
    })

    await adminNotic.save();
  
    res.json({  
      message: "you successfully comfirm this job completed by artisan" 
   });
    
  } catch (err: any) {
    console.log("error",  err)
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//customer get you comfirm  job/////////////
export const customerGetComfirmJobController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return res
        .status(401)
        .json({ message: "incorrect Customer ID" });
    }

    const jobRequests = await JobModel.find({customerId, status: 'comfirmed'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const contractor = await ContractorModel.findOne({_id: jobRequest.contractorId}).select('-password');

      const obj = {
        job: jobRequest,
        contractor
      }

      jobRequested.push(obj)
      
    }
  
    res.json({  
      jobRequested
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}





//customer complaint job completed by Contractor /////////////
export const customerComplaintedJobJobController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      jobId
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return res
        .status(401)
        .json({ message: "incorrect Customer ID" });
    }

    const job = await JobModel.findOne({_id: jobId, customerId, status: 'completed'})

    if (!job) {
      return res
        .status(401)
        .json({ message: "job do not exist or has not been completed by artisan" });
    }

    const contractor = await ContractorModel.findOne({_id: job.contractorId}).select('-password');

    job.status = "complain";

    await job.save()

     //admin notification 
     const adminNotic = new AdminNoficationModel({
      title: "Customer Disagreed on Job Completion",
      message: `${job} - ${checkCustomer.fullName} disagreed that this job has been completed by this contractor ${contractor?.firstName}.`,
      status: "unseen"
    })

    await adminNotic.save();
  
    res.json({  
      message: "you successfully complained about this job completed by artisan" 
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}




//customer get job he  complain about /////////////
export const customerGetComplainJobController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer =  req.customer;
    const customerId = customer.id

    const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

    if (!checkCustomer) {
      return res
        .status(401)
        .json({ message: "incorrect Customer ID" });
    }

    const jobRequests = await JobModel.find({customerId, status: 'complain'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const contractor = await ContractorModel.findOne({_id: jobRequest.contractorId}).select('-password');

      const obj = {
        job: jobRequest,
        contractor
      }

      jobRequested.push(obj)
      
    }
  
    res.json({  
      jobRequested
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}

  


