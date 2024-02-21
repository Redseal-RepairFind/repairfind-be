import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import CustomerRegModel from "../../../database/customer/models/customerReg.model";
import { OTP_EXPIRY_TIME, generateOTP } from "../../../utils/otpGenerator";
import { sendEmail } from "../../../utils/send_email_utility";
import { htmlMailTemplate } from "../../../templates/sendEmailTemplate";
import { uploadToS3 } from "../../../utils/upload.utility";
import { v4 as uuidv4 } from "uuid";
import { htmlcustomerWelcomTemplate } from "../../../templates/customerEmail/customerWelcomTemplate";
import AdminNoficationModel from "../../../database/admin/models/adminNotification.model";

//customer signup /////////////
export const customerSignUpController = async (
    req: Request,
    res: Response,
) => {

  try {
    const {
      email,
      password,
      fullName,
      phonenumber,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find user with the same email
    const userEmailExists = await CustomerRegModel.findOne({ email });
    
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

        const html = htmlMailTemplate(otp, fullName, "We have received a request to verify your email");

        const welcomeHtml = htmlcustomerWelcomTemplate(fullName)

        const welcomeEmailData = {
          emailTo: email,
          subject: "welcome",
          html: welcomeHtml
        }

        let emailData = {
            emailTo: email,
            subject: "email verification",
            html
        };

        sendEmail(welcomeEmailData)

        sendEmail(emailData);



    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    const customer = new CustomerRegModel({
      email: email,
      fullName: fullName,
      phoneNumber: phonenumber,
      password: hashedPassword,
      emailOtp
    });
    
    let customerSaved = await customer.save();

    // admin notification 
    const adminNoti = new AdminNoficationModel({
      title: "New Account Created",
      message: `A customer - ${fullName}  just created an account.`,
      status: "unseen"
    })

    await adminNoti.save();

    res.json({
      message: "Signup successful",
      user: {
        id: customerSaved._id,
        fullName: customerSaved.fullName,
        phoneNumber: customerSaved.phoneNumber,
        email: customerSaved.email,  
      },

    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//customer verified email /////////////
export const customerVerifiedEmailController = async (
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

    // try find customer with the same email
    const customer = await CustomerRegModel.findOne({ email });
    
    // check if contractor exists
    if (!customer) {
     return res
       .status(401)
       .json({ message: "invalid email" });
   }

   if (customer.emailOtp.otp != otp) {
       return res
       .status(401)
       .json({ message: "invalid otp" });
   }

   if (customer.emailOtp.verified) {
       return res
       .status(401)
       .json({ message: "email already verified" });
   }

   const timeDiff = new Date().getTime() - customer.emailOtp.createdTime.getTime();
   if (timeDiff > OTP_EXPIRY_TIME) {
       return res.status(400).json({ message: "otp expired" });
   }

   customer.emailOtp.verified = true;

   await customer.save();

    
   return res.json({ message: "email verified successfully" });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//customer signin /////////////
export const customerSignInController = async (
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
      const customer = await CustomerRegModel.findOne({ email });
  
      // check if user exists
      if (!customer) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }
  
      // compare password with hashed password in database
      const isPasswordMatch = await bcrypt.compare(password, customer.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "incorrect credential." });
      }
  
      if (!customer.emailOtp.verified) {
        return res.status(401).json({ message: "email not verified." });
      }

      const profile = await CustomerRegModel.findOne({ email }).select('-password');
  
    
      // generate access token
      const accessToken = jwt.sign(
        { 
          id: customer?._id,
          email: customer.email,
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


//customer resend for verification email /////////////
export const CustomerResendEmailController = async (
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
  const customer = await CustomerRegModel.findOne({ email });
  
  // check if contractor exists
  if (!customer) {
   return res
     .status(401)
     .json({ message: "invalid email" });
  }

  if (customer.emailOtp.verified) {
    return res
     .status(401)
     .json({ message: "email already verified" });
  }

    const otp = generateOTP()

    const createdTime = new Date();

    customer!.emailOtp = {
        otp,
        createdTime,
        verified : false
    }

    await customer?.save();

    const html = htmlMailTemplate(otp, customer.fullName, "We have received a request to verify your email");


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



//customer customer update profile /////////////
export const CustomerUpdateProfileController = async (
  req: any,
  res: Response,
) => {

try {
  const {
      fullName,
      location,
      phoneNumber
  } = req.body;
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const customer =  req.customer;
  const customerId = customer.id

  const file = req.file;

  // try find customer with the same email
  const customerDb = await CustomerRegModel.findOne({ _id: customerId });
  
  // check if customer exists
  if (!customerDb) {
   return res
     .status(401)
     .json({ message: "incorrect Id" });
  }

  let profileImage;

  if (!file) {
    profileImage = customerDb.profileImg;
  }else{
    const filename = uuidv4();
    const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
    profileImage = result?.Location!;
    
  }

  const updateBioData = await CustomerRegModel.findOneAndUpdate(
    {_id: customerId},
    {
      fullName: fullName,
      phoneNumber: phoneNumber,
      location: location,
      profileImg: profileImage
    },
    {new: true}
  )

  
 return res.status(200).json({ message: "data successfully updated" });
  
} catch (err: any) {
  // signup error
  res.status(500).json({ message: err.message });
}
}

  
  
