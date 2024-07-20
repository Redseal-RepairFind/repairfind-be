import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AdminRegModel from "../../../database/admin/models/admin.model";
import { OTP_EXPIRY_TIME, generateOTP } from "../../../utils/otpGenerator";
import { htmlMailTemplate } from "../../../templates/sendEmailTemplate";
import { AdminStatus } from "../../../database/admin/interface/admin.interface";
import { EmailService } from "../../../services";
import { InternalServerError } from "../../../utils/custom.errors";


export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

  try {
    const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber
    } = req.body;


    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find user with the same email
    const adminEmailExists = await AdminRegModel.findOne({ email });

    let superAdmin = false;
    let validation = false;

    const checkFirstAdmin = await AdminRegModel.find();


    validation = false;
    superAdmin = false;


    if (checkFirstAdmin.length < 1) {
        superAdmin = true;
        validation = true;
    }

    // only one super admin can register
    if (checkFirstAdmin.length > 0) {
      return res
        .status(401)
        .json({ success: true, message: "Registration is disabled" });
    }
    
     // check if user exists
     if (adminEmailExists) {
      return res
        .status(401)
        .json({success: true, message: "Email exists already" });
    }

    const otp = generateOTP()
        const createdTime = new Date();
        const emailOtp = {
            otp,
            createdTime,
            verified : false
        }

        const html = htmlMailTemplate(otp, firstName, "We have received a request to verify your email");
        EmailService.send(email, "Email verification", html);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new AdminRegModel({
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber,
      superAdmin: superAdmin,
      password: hashedPassword,
      validation: validation,
      status: AdminStatus.ACTIVE,
      emailOtp
    });

    let adminSaved = await admin.save();

    res.json({
      success: true,
      message: "Signup successful",
      admin: {
        id: adminSaved._id,
        firstName: adminSaved.firstName,
        lastName: adminSaved.lastName,
        email: adminSaved.email,  
      },

    });
    
  } catch (error: any) {
    next( new InternalServerError("An error occurred", error) )
  }

}



export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
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
    const admin = await AdminRegModel.findOne({ email });
    
    // check if contractor exists
    if (!admin) {
     return res
       .status(401)
       .json({ message: "invalid email" });
   }

   if (admin.emailOtp.otp != otp) {
       return res
       .status(401)
       .json({ message: "Invalid OTP" });
   }

   if (admin.emailOtp.verified) {
       return res
       .status(401)
       .json({ message: "Email already verified" });
   }

   const timeDiff = new Date().getTime() - admin.emailOtp.createdTime.getTime();
   if (timeDiff > OTP_EXPIRY_TIME) {
       return res.status(400).json({ message: "OTP Expired" });
   }

   admin.emailOtp.verified = true;

   await admin.save();

    
   return res.json({ message: "Email verified successfully" });
    
  } catch (error: any) {
    next( new InternalServerError("An error occurred", error) )
  }

}


export const signIn= async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  
    try {
      const {
        email,
        password,
      } = req.body;

      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({success: false,  errors: errors.array() });
      }
  
      // try find user with the same email
      const admin = await AdminRegModel.findOne({ email });
  
      // check if user exists
      if (!admin) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credential" });
      }
  
      // compare password with hashed password in database
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if (!isPasswordMatch) {
        return res.status(401).json({success: false,  message: "incorrect credential." });
      }
  

      //TODO: check if user has changed default password
      // if (admin.hasWeakPassword) {
      //   return res.status(401).json({success: false,  message: "email not verified." });
      // }

      if (admin.status !== AdminStatus.ACTIVE) {
        if (!admin.superAdmin) {
          return res.status(401).json({success: false,  message: "Your account is not active" });
        }
      }
      
      const profile = await AdminRegModel.findOne({ email }).select('-password');
      const accessToken = jwt.sign(
        { 
          id: admin?._id,
          email: admin.email,
        },
        process.env.JWT_ADMIN_SECRET_KEY!,
        { expiresIn: "24h" }
      );
  
      return res.json({
        success: true, 
        message: "Login successful",
        Token: accessToken,
        profile
      });
  
      
    } catch (error: any) {
      next( new InternalServerError("An error occurred", error) )
    }
  
}


export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
      const {
          email,
      } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({success: false, errors: errors.array() });
      }
  
      const admin = await AdminRegModel.findOne({ email });
  
       if (!admin) {
        return res
          .status(401)
          .json({success: false,  message: "Invalid email" });
      }

      const otp = generateOTP()
      const createdTime = new Date();

      admin.passwordOtp = {
          otp,
          createdTime,
          verified : true
      }

      await admin.save();

      const html = htmlMailTemplate(otp, admin.firstName, "We have received a request to change your password");    
      EmailService.send(email, "Admin Forgot Password",  html);
  
      return res.status(200).json({ success: true, message: "OTP sent successfully to your email." });
  
    } catch (error: any) {
      next( new InternalServerError("An error occurred", error) )
    }
  
}

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
      const {
          email,
          otp,
          password
      } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Validation error occurred",  errors: errors.array() });
      }
  
      const admin = await AdminRegModel.findOne({ email });
  
      if (!admin) {
        return res
          .status(401)
          .json({success: false, message: "Invalid email" });
      }

      const {createdTime, verified} = admin.passwordOtp

      const timeDiff = new Date().getTime() - createdTime.getTime();

      if (!verified || timeDiff > OTP_EXPIRY_TIME || otp !== admin.passwordOtp.otp) {
          return res
          .status(401)
          .json({ message: "unable to reset password" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10); 

      admin.password = hashedPassword;
      admin.passwordOtp.verified = false;

      await admin.save();

      return res.status(200).json({success: true, message: "password successfully change" });
  
    } catch (error: any) {
      next( new InternalServerError("An error occurred", error) )
    }
  
}


export const resendEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
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
      const admin = await AdminRegModel.findOne({ email });

      // check if contractor exists
      if (!admin) {
          return res
              .status(401)
              .json({ message: "invalid email" });
      }

      if (admin.emailOtp.verified) {
          return res
              .status(401)
              .json({ message: "email already verified" });
      }

      const otp = generateOTP()

      const createdTime = new Date();

      admin!.emailOtp = {
          otp,
          createdTime,
          verified: false
      }

      await admin?.save();

      const html = htmlMailTemplate(otp, admin.firstName, "We have received a request to verify your email");

      let emailData = {
          email,
          subject: "email verification",
          html
      };

      EmailService.send( email, "email verification",  html);
      return res.status(200).json({ message: "OTP sent successfully to your email." });

  } catch (error: any) {
      next( new InternalServerError("An error occurred", error) )
    }

}


    
export const AdminAuthController = {
  signUp,
  signIn,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendEmail
}