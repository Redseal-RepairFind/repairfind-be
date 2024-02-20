import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import ContractorRegModel from "../../../database/contractor/models/contractor.model";
import { OTP_EXPIRY_TIME, generateOTP } from "../../../utils/otpGenerator";
import { sendEmail } from "../../../utils/send_email_utility";
import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";
import { uploadToS3 } from "../../../utils/aws3.utility";
import { v4 as uuidv4 } from "uuid";
import { htmlMailTemplate } from "../../../templates/sendEmailTemplate";
import { htmlContractorWelcomeTemplate } from "../../../templates/contractorEmail/contractorWelcomeTemplate";
import ContractorAvailabilityModel from "../../../database/contractor/models/contractorAvaliability.model";
import JobModel from "../../../database/contractor/models/job.model";
import AdminNoficationModel from "../../../database/admin/models/adminNotification.model";


//contractor signup /////////////
export const contractorSignUpController = async (
    req: Request,
    res: Response,
) => {

  try {
    const {
      email,
      password,
      firstName,
      dateOfBirth,
      lastName,

    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find user with the same email
    const userEmailExists = await ContractorRegModel.findOne({ email });
    
     // check if user exists
     if (userEmailExists) {
      return res
        .status(401)
        .json({ message: "Email exists already" });
    }

    const otp = generateOTP()

      const createdTime = new Date();

      const emailOtp = {
          otp,
          createdTime,
          verified : false
      }

      const html = htmlMailTemplate(otp, firstName, "We have received a request to verify your email")

      let emailData = {
          emailTo: email,
          subject: "email verification",
          html
      };

      await sendEmail(emailData);

      const welcomeHtml = htmlContractorWelcomeTemplate(firstName)

      let welcomeEmailData = {
        emailTo: email,
        subject: "Welcome",
        html: welcomeHtml
      };

      await sendEmail(welcomeEmailData);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const contractor = new ContractorRegModel({
      email: email,
      firstName: firstName,
      dateOfBirth: dateOfBirth,
      lastName: lastName,
      password: hashedPassword,
      emailOtp
    });
    
    let contractorSaved = await contractor.save();

    // admin notification 
    const adminNoti = new AdminNoficationModel({
      title: "New Account Created",
      message: `A contractor - ${firstName} just created an account.`,
      status: "unseen"
    })

    await adminNoti.save();

    res.json({
      message: "Signup successful",
      user: {
        id: contractorSaved._id,
        firstName: contractorSaved.firstName,
        lastName: contractorSaved.lastName,
        email: contractorSaved.email,
        dateOfbirth: contractorSaved.dateOfBirth,
       
      },

    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//contractor verified email /////////////
export const contractorVerifiedEmailController = async (
    req: Request,
    res: Response,
) => {

  try {
    const {
        email,
        otp
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find contractor with the same email
    const contractor = await ContractorRegModel.findOne({ email });
    
    // check if contractor exists
    if (!contractor) {
     return res
       .status(401)
       .json({ message: "invalid email" });
   }

   if (contractor.emailOtp.otp != otp) {
       return res
       .status(401)
       .json({ message: "invalid otp" });
   }

   if (contractor.emailOtp.verified) {
       return res
       .status(401)
       .json({ message: "email already verified" });
   }

   const timeDiff = new Date().getTime() - contractor.emailOtp.createdTime.getTime();
   if (timeDiff > OTP_EXPIRY_TIME) {
       return res.status(400).json({ message: "otp expired" });
   }

   contractor.emailOtp.verified = true;

   await contractor.save();

    
   return res.json({ message: "email verified successfully" });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//contractor signin /////////////
export const contractorSignInController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      email,
      password,
    } = req.body;
      // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find user with the same email
    const contractor = await ContractorRegModel.findOne({ email });

    // check if user exists
    if (!contractor) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    // compare password with hashed password in database
    const isPasswordMatch = await bcrypt.compare(password, contractor.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "incorrect credential." });
    }

    if (!contractor.emailOtp.verified) {
      return res.status(401).json({ message: "email not verified." });
    }

    const profile = await ContractorRegModel.findOne({ email }).select('-password');
  
    // generate access token
    const accessToken = jwt.sign(
      { 
        id: contractor?._id,
        email: contractor.email,
      },
      process.env.JWT_CONTRACTOR_SECRET_KEY!,
      { expiresIn: "24h" }
    );

    // return access token
    res.json({
      message: "Login successful",
      Token: accessToken,
      profile
    });

    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//contractor detail /////////////
export const contractorDeatilController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    const files = req.files;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorProfile = await ContractorRegModel.findOne({_id: contractorId}).select('-password');

    const contractorDocument = await ContractorDocumentValidateModel.findOne({contractorId: contractorId})

    const avialability = await ContractorAvailabilityModel.find({contractorId})

    // contractor pending job detail
    const totalPendingJob = await JobModel.countDocuments({contractorId, status: "sent qoutation"})

    const pendingJobs = await JobModel.find({contractorId, status: "sent qoutation"})
    let pendingAmount = 0;

    for (let index = 0; index < pendingJobs.length; index++) {
      const pendingJob = pendingJobs[index];

      pendingAmount = pendingAmount + pendingJob.totalAmountContractorWithdraw
      
    }

    // contractor completed job detail
    const totalCompletedJob = await JobModel.countDocuments({contractorId, status: "comfirmed"})

    const completedJobs = await JobModel.find({contractorId, status: "comfirmed"})
    let completedAmount = 0;

    for (let index = 0; index < completedJobs.length; index++) {
      const completedJob = completedJobs[index];

      completedAmount = completedAmount + completedJob.totalAmountContractorWithdraw
      
    }


    // contractor complain job detail
    const totalComplainedJob = await JobModel.countDocuments({contractorId, status: "complain"})

    const complainedJobs = await JobModel.find({contractorId, status: "complain"})
    let complainedAmount = 0;

    for (let index = 0; index < complainedJobs.length; index++) {
      const complainedJob = complainedJobs[index];

      complainedAmount = complainedAmount + complainedJob.totalAmountContractorWithdraw
      
    }


    // contractor negleted job detail
    const totalNegletedJob = await JobModel.countDocuments({contractorId, status: "job reject"})

    const negletedJobs = await JobModel.find({contractorId, status: "job reject"})
    let negletedAmount = 0;

    for (let index = 0; index < negletedJobs.length; index++) {
      const negletedJob = negletedJobs[index];

      negletedAmount = negletedAmount + negletedJob.totalAmountContractorWithdraw
      
    }

  
    res.json({  
      contractorProfile,
      contractorDocument,
      avialability,
      pendingJob: {
        totalPendingJob,
        pendingAmount
      },
      completedJob: {
        totalCompletedJob,
        completedAmount
      },
      complainedJob: {
        totalComplainedJob,
        complainedAmount
      },
      negletedJob: {
        totalNegletedJob,
        negletedAmount
      }
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//contractor update bio /////////////
export const contractorUpdateBioController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      location,
      bio,
    } = req.body;

    const file = req.file;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorProfile = await ContractorRegModel.findOne({_id: contractorId});

    const contractorDocument = await ContractorDocumentValidateModel.findOne({contractorId: contractorId})

    let profileImage;

    if (!file) {
      profileImage = contractorProfile?.profileImage;
    }else{
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      profileImage = result?.Location!;
      
    }

    const updateBioData = await ContractorRegModel.findOneAndUpdate(
      {_id: contractorId},
      {
        location,
        profileImage,
        bio
      },
      {new: true}
    )
    
    res.json({  
      message: "Data successfully updated",
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//contractor resend for verification email /////////////
export const ContractorResendEmailController = async (
  req: Request,
  res: Response,
) => {

try {
  const {
      email,
  } = req.body;
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // try find customer with the same email
  const contractor = await ContractorRegModel.findOne({ email });
  
  // check if contractor exists
  if (!contractor) {
   return res
     .status(401)
     .json({ message: "invalid email" });
  }

  if (contractor.emailOtp.verified) {
    return res
     .status(401)
     .json({ message: "email already verified" });
  }

    const otp = generateOTP()

    const createdTime = new Date();

    contractor!.emailOtp = {
        otp,
        createdTime,
        verified : false
    }

    await contractor?.save();

    const html = htmlMailTemplate(otp, contractor.firstName, "We have received a request to verify your email")

    let emailData = {
        emailTo: email,
        subject: "email verification",
        html
    };

  sendEmail(emailData);

 return res.status(200).json({ message: "OTP sent successfully to your email." });
  
} catch (err: any) {
  // signup error
  res.status(500).json({ message: err.message });
}
}
