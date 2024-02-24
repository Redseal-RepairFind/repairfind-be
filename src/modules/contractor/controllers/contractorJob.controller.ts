import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import CustomerRegModel from "../../../database/customer/models/customer.model";
import JobModel from "../../../database/contractor/models/job.model";
import { sendEmail } from "../../../utils/send_email_utility";
import { htmlJobQoutationTemplate } from "../../../templates/customerEmail/jobQoutationTemplate";
import AdminNoficationModel from "../../../database/admin/models/adminNotification.model";


//contractor get job requet sent to him /////////////
export const contractorGetJobRequestContractorController = async (
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
  
      
      const contractor =  req.contractor;
      const contractorId = contractor.id
  
      //get user info from databas
      const contractorExist = await ContractorModel.findOne({_id: contractorId});
  
      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }
  
      const jobRequests = await JobModel.find({contractorId, status: 'sent request'}).sort({ createdAt: -1 })
  
      let jobRequested = []
  
      for (let i = 0; i < jobRequests.length; i++) {
        const jobRequest = jobRequests[i];
        
        const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');
  
        const obj = {
          job: jobRequest,
          customer
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


//contractor send job quatation /////////////
export const contractorSendJobQuatationController = async (
    req: any,
    res: Response,
  ) => {
    
    try {
      const {  
        jobId,
        quatations,
        workmanShip
      } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      
      const contractor =  req.contractor;
      const contractorId = contractor.id
  
      //get user info from databas
      const contractorExist = await ContractorModel.findOne({_id: contractorId});
  
      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }
  
      const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })

      if (!job) {
        return res
          .status(401)
          .json({ message: "job request do not exist" });
      }

      if (quatations.length < 1) {
        return res
          .status(401)
          .json({ message: "invalid quatation format" });
      }

      const customer = await CustomerRegModel.findOne({_id: job.customerId})

      if (!customer) {
        
        return res
        .status(401)
        .json({ message: "invalid customer Id" });
      }

      let totalQuatation = 0
      for (let i = 0; i < quatations.length; i++) {
        const quatation = quatations[i];
        
        totalQuatation = totalQuatation + quatation.amount
      }

      totalQuatation = totalQuatation + workmanShip;

      let companyCharge = 0

      if (totalQuatation <= 1000) {
        companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
      }else if (totalQuatation <=  5000){
        companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
      }else{
        companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
      }

      const gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));

      const totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
      const totalAmountContractorWithdraw = totalQuatation + gst;

      job.quate = quatations
      job.workmanShip = workmanShip
      
      job.gst = gst
      job.totalQuatation = totalQuatation
      job.companyCharge = companyCharge
      job.totalAmountCustomerToPaid =  parseFloat(totalAmountCustomerToPaid.toFixed(2));

      job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2))

      job.status = "sent qoutation";

      await job.save()

      const html = htmlJobQoutationTemplate(customer.fullName, contractorExist.firstName)

      let emailData = {
        emailTo: customer.email,
        subject: "Job qoutetation from artisan",
        html
      };

      await sendEmail(emailData);
    
      res.json({  
        message: "job qoutation sucessfully sent"
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}



//contractor send job quatation two /////////////
export const contractorSendJobQuatationControllerTwo = async (
  req: any,
  res: Response,
) => {
  
  try {
    const {  
      jobId,
      materialDetail,
      totalcostMaterial,
      workmanShip
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    
    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })

    if (!job) {
      return res
        .status(401)
        .json({ message: "job request do not exist" });
    }

    const customer = await CustomerRegModel.findOne({_id: job.customerId})

    if (!customer) {
      
      return res
      .status(401)
      .json({ message: "invalid customer Id" });
    }

    let totalQuatation = totalcostMaterial + workmanShip

    let companyCharge = 0

    if (totalQuatation <= 1000) {
      companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
    }else if (totalQuatation <=  5000){
      companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
    }else{
      companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
    }

    const gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));

    const totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
    const totalAmountContractorWithdraw = totalQuatation + gst;

    const qoute = {
      materialDetail,
      totalcostMaterial,
      workmanShip
    };
   
    job.qoute = qoute,
    job.gst = gst
    job.totalQuatation = totalQuatation
    job.companyCharge = companyCharge
    job.totalAmountCustomerToPaid =  parseFloat(totalAmountCustomerToPaid.toFixed(2));

    job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2))

    job.status = "sent qoutation";

    await job.save()

    const html = htmlJobQoutationTemplate(customer.fullName, contractorExist.firstName)

    let emailData = {
      emailTo: customer.email,
      subject: "Job qoutetation from artisan",
      html
    };

    await sendEmail(emailData);
  
    res.json({  
      message: "job qoutation sucessfully sent"
   });
    
  } catch (err: any) {
    // signup error

    console.log("error", err)
    res.status(500).json({ message: err.message });
    
  }

}


//contractor send job quatation three [one by one] /////////////
export const contractorSendJobQuatationControllerThree = async (
  req: any,
  res: Response,
) => {
  
  try {
    const {  
      jobId,
      material,
      qty,
      rate,
      //tax,
      amount,
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })

    if (!job) {
      return res
        .status(401)
        .json({ message: "job request do not exist" });
    }

    const customer = await CustomerRegModel.findOne({_id: job.customerId})

    if (!customer) {
      
      return res
      .status(401)
      .json({ message: "invalid customer Id" });
    }

    const qouteObj = {
      material,
      qty,
      rate,
      //tax,
      amount,
    }

    const dbQoute = job.quate;

    const newQoute = [...dbQoute, qouteObj]

    job.quate = newQoute;

    await job.save()

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
    
  } catch (err: any) {
    // signup error

    console.log("error", err)
    res.status(500).json({ message: err.message });
    
  }

}



//contractor remove job quatation one by one five [romove one by one] /////////////
export const contractorRemoveobQuatationOneByOneControllerfive = async (
  req: any,
  res: Response,
) => {
  
  try {
    const {  
      jobId,
      material,
      qty,
      rate,
      //tax,
      amount,
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })

    if (!job) {
      return res
        .status(401)
        .json({ message: "job request do not exist" });
    }

    const customer = await CustomerRegModel.findOne({_id: job.customerId})

    if (!customer) {
      
      return res
      .status(401)
      .json({ message: "invalid customer Id" });
    }

    if (job.quate.length < 1) {
      return res
        .status(401)
        .json({ message: "please add atleast one qoutation" });
    }

    const qouteObj = {
      material,
      qty,
      rate,
      //tax,
      amount,
    }

    let newQoute = []
    for (let i = 0; i < job.quate.length; i++) {
      const qoute = job.quate[i];

      const dbQoute = {
        material: qoute.material,
        qty: qoute.qty,
        rate: qoute.rate,
        //tax: qoute.tax,
        amount: qoute.amount,
      }

      const compareQoute = await areObjectsEqual(dbQoute, qouteObj)

      if (compareQoute) continue

      newQoute.push(qoute)
      
    }

    job.quate = newQoute;

    await job.save()
  
    res.json({  
      message: "job qoutation sucessfully remove"
   });
    
  } catch (err: any) {
    // signup error

    console.log("error", err)
    res.status(500).json({ message: err.message });
    
  }

}



//contractor send job quatation four [complete] /////////////
export const contractorSendJobQuatationControllerFour = async (
  req: any,
  res: Response,
) => {
  
  try {
    const {  
      jobId,
      workmanShip
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(1);

    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    console.log(2);

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })

    console.log(3);

    if (!job) {
      return res
        .status(401)
        .json({ message: "job request do not exist" });
    }

    console.log(4);

    const customer = await CustomerRegModel.findOne({_id: job.customerId})

    if (!customer) {
      
      return res
      .status(401)
      .json({ message: "invalid customer Id" });
    }


    if (job.quate.length < 1) {
      return res
        .status(401)
        .json({ message: "please add atleast one qoutation" });
    }

    console.log(5);

    let totalQuatation = 0
    for (let i = 0; i < job.quate.length; i++) {
      const quatation = job.quate[i];
      
      totalQuatation = totalQuatation + quatation.amount
    }

    totalQuatation = totalQuatation + workmanShip;

    let companyCharge = 0

    if (totalQuatation <= 1000) {
      companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
    }else if (totalQuatation <=  5000){
      companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
    }else{
      companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
    }

    const gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));

    const totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
    const totalAmountContractorWithdraw = totalQuatation + gst;

    console.log(6);
    
    job.workmanShip = workmanShip
    
    job.gst = gst
    job.totalQuatation = totalQuatation
    job.companyCharge = companyCharge
    job.totalAmountCustomerToPaid =  parseFloat(totalAmountCustomerToPaid.toFixed(2));

    job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2))

    job.status = "sent qoutation";

    await job.save()

    console.log(7);

    const html = htmlJobQoutationTemplate(customer.fullName, contractorExist.firstName)

    let emailData = {
      emailTo: customer.email,
      subject: "Job qoutetation from artisan",
      html
    };

    console.log(8);

    //await sendEmail(emailData);

    console.log(9);
  
    res.json({  
      message: "job qoutation sucessfully sent"
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}




//contractor get job qoutation sent to artisan  /////////////
export const contractorGetQuatationContractorController = async (
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
  
      
      const contractor =  req.contractor;
      const contractorId = contractor.id
  
      //get user info from databas
      const contractorExist = await ContractorModel.findOne({_id: contractorId});
  
      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }
  
      const jobRequests = await JobModel.find({contractorId, status: 'sent qoutation'}).sort({ createdAt: -1 })
  
      let jobRequested = []
  
      for (let i = 0; i < jobRequests.length; i++) {
        const jobRequest = jobRequests[i];
        
        const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');
  
        const obj = {
          job: jobRequest,
          customer
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



//contractor get job qoutation payment comfirm and job in progress /////////////
export const contractorGetQuatationPaymentComfirmAndJobInProgressController = async (
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

    
    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const jobRequests = await JobModel.find({contractorId, status: 'qoutation payment confirm and job in progress'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

      const obj = {
        job: jobRequest,
        customer
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



//contractor reject job Request /////////////
export const contractorRejectJobRequestController = async (
  req: any,
  res: Response,
) => {
  
  try {
    const {  
      jobId,
      rejectedReason,
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    
    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })

    if (!job) {
      return res
        .status(401)
        .json({ message: "job request do not exist" });
    }

    const customer = await CustomerRegModel.findOne({_id: job.customerId})

    if (!customer) {
      
      return res
      .status(401)
      .json({ message: "invalid customer Id" });
    }

    job.rejected = true;
    job.rejectedReason = rejectedReason;
    job.status = "job reject";

    await job.save()

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
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//contractor get job he rejected /////////////
export const contractorGeJobRejectedController = async (
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

    
    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const jobRequests = await JobModel.find({contractorId, status: 'job reject'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

      const obj = {
        job: jobRequest,
        customer
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


//contractor get job history /////////////
export const contractorGeJobHistoryController = async (
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

    
    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const jobRequests = await JobModel.find({contractorId,}).sort({ createdAt: -1 })

    let jobHistory = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

      const obj = {
        job: jobRequest,
        customer
      }

      jobHistory.push(obj)
      
    }
  
    res.json({  
      jobHistory
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}





//contractor complete job /////////////
export const contractorCompleteJobController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      jobId,
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    
    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const job = await JobModel.findOne({_id: jobId,contractorId, status: 'qoutation payment confirm and job in progress'}).sort({ createdAt: -1 })

    if (!job) {
      return res
        .status(401)
        .json({ message: "job request do not exist" });
    }

    const customer = await CustomerRegModel.findOne({_id: job.customerId})

    if (!customer) {
      
      return res
      .status(401)
      .json({ message: "invalid customer Id" });
    }

    // check the time of job is reach
    const currentTime = new Date().getTime()

    const jobTime = job.time.getTime()

   if (currentTime > jobTime) {
       return res.status(400).json({ message: "Not yet job day" });
   }

    job.status = "completed";
    await job.save()

    //admin notification
    const adminNotic = new AdminNoficationModel({
      title: "Contractor Job Completed",
      message: `${job._id} - ${contractorExist.firstName} has updated this job to completed.`,
      status: "unseen"
    })

      await adminNotic.save();

    res.json({  
      message: "you sucessfully complete this job, wait for comfirmation from customer"
   });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}




//contractor get job completed /////////////
export const contractorGeJobCompletedController = async (
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

    
    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const jobRequests = await JobModel.find({contractorId, status: 'completed'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

      const obj = {
        job: jobRequest,
        customer
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



//contractor get job completed and comfirm by customer /////////////
export const contractorGeJobComfirmController = async (
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

    
    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const jobRequests = await JobModel.find({contractorId, status: 'comfirmed'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

      const obj = {
        job: jobRequest,
        customer
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




//contractor get job completed and complain by customer /////////////
export const contractorGeJobComplainController = async (
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

    
    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const jobRequests = await JobModel.find({contractorId, status: 'complain'}).sort({ createdAt: -1 })

    let jobRequested = []

    for (let i = 0; i < jobRequests.length; i++) {
      const jobRequest = jobRequests[i];
      
      const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');

      const obj = {
        job: jobRequest,
        customer
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


const areObjectsEqual = async (obj1: any, obj2: any): Promise<boolean> => {
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}






  
  