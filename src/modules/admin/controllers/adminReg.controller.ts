import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AdminRegModel from "../../../database/admin/models/adminReg.model";
import { OTP_EXPIRY_TIME, generateOTP } from "../../../utils/otpGenerator";
import { sendEmail } from "../../../utils/send_email_utility";
import { htmlMailTemplate } from "../../../templates/sendEmailTemplate";
import { uploadToS3 } from "../../../utils/upload.utility";
import { v4 as uuidv4 } from "uuid";



//admin signup /////////////
export const adminSignUpController = async (
    req: Request,
    res: Response,
) => {

  try {
    const {
        email,
        password,
        firstName,
        lastName,
       
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

    // we need a better way validate and manage admins, probably from cli or something
    // or better way to define superadmin who can then
    validation = true;
    superAdmin = true;
    if (checkFirstAdmin.length < 1) {
        superAdmin = true;
        validation = true;
    }
    
     // check if user exists
     if (adminEmailExists) {
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

        const html = htmlMailTemplate(otp, firstName, "We have received a request to verify your email");

        let emailData = {
            emailTo: email,
            subject: "email verification",
            html
        };

        sendEmail(emailData);



    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    const admin = new AdminRegModel({
      email: email,
      firstName: firstName,
      lastName: lastName,
      superAdmin: superAdmin,
      password: hashedPassword,
      validation: validation,
      emailOtp
    });

    let adminSaved = await admin.save();

    res.json({
      message: "Signup successful",
      admin: {
        id: adminSaved._id,
        firstName: adminSaved.firstName,
        lastName: adminSaved.lastName,
        email: adminSaved.email,  
      },

    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//admin verified email /////////////
export const adminVerifiedEmailController = async (
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
       .json({ message: "invalid otp" });
   }

   if (admin.emailOtp.verified) {
       return res
       .status(401)
       .json({ message: "email already verified" });
   }

   const timeDiff = new Date().getTime() - admin.emailOtp.createdTime.getTime();
   if (timeDiff > OTP_EXPIRY_TIME) {
       return res.status(400).json({ message: "otp expired" });
   }

   admin.emailOtp.verified = true;

   await admin.save();

    
   return res.json({ message: "email verified successfully" });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//admin signin /////////////
export const AdminSignInController = async (
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
      const admin = await AdminRegModel.findOne({ email });
  
      // check if user exists
      if (!admin) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }
  
      // compare password with hashed password in database
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "incorrect credential." });
      }
  
      if (!admin.emailOtp.verified) {
        return res.status(401).json({ message: "email not verified." });
      }

      if (!admin.validation) {
        return res.status(401).json({ message: "unvalidated admin." });
      }
      
      const profile = await AdminRegModel.findOne({ email }).select('-password');
    
      // generate access token
      const accessToken = jwt.sign(
        { 
          id: admin?._id,
          email: admin.email,
        },
        process.env.JWT_ADMIN_SECRET_KEY!,
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


//super admin get all admin /////////////
export const SuperAdminGetAllAdminController = async (
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

    const admin =  req.admin;
    const adminId = admin.id

    const checkAdmin = await AdminRegModel.findOne({_id: adminId});

    if (!checkAdmin?.superAdmin) {
      return res
      .status(401)
      .json({ message: "super admin role" });
    }

    const admins = await AdminRegModel.find().select('-password')

    
    res.json({
      admins
    });

    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//super admin validate other admin /////////////
export const SuperAdminValidateOtherAdminController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
     subAdminId
    } = req.body;
      // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const admin =  req.admin;
    const adminId = admin.id

    const checkAdmin = await AdminRegModel.findOne({_id: adminId});

    if (!checkAdmin?.superAdmin) {
      return res
      .status(401)
      .json({ message: "super admin role" });
    }

    const subAdmin = await AdminRegModel.findOne({_id: subAdminId})

    if (!subAdmin) {
      return res
      .status(401)
      .json({ message: "sub admin does not exist" });
    }

    if (!subAdmin.emailOtp.verified) {
      return res
      .status(401)
      .json({ message: "sub admin email not verified" });
    }

    if (subAdmin.validation) {
      return res
      .status(401)
      .json({ message: "sub admin already validated" });
    }

    subAdmin.validation = true;
     
    await subAdmin.save()
 
    res.json({
      message: "sub admin successfully validate",
    });

    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//admin resend for verification email /////////////
export const adminResendEmailController = async (
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
        verified : false
    }

    await admin?.save();

    const html = htmlMailTemplate(otp, admin.firstName, "We have received a request to verify your email");

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



//admin update bio /////////////
export const adminUpdateBioController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
        email,
        password,
        firstName,
        lastName,
      
    } = req.body;

    const file = req.file;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const admin =  req.admin;
    const adminId = admin.id

    // try find user with the same email
    const adminExists = await AdminRegModel.findOne({ _id: adminId });
    
    // check if user exists
    if (!adminExists) {
      return res
        .status(401)
        .json({ message: "incorrect admin ID" });
    }

    if (!email || email == '' || !firstName || firstName == '' || !lastName || lastName == '' || !password || password == '') {
      return res
        .status(401)
        .json({ message: "fill in the missing input" });
    }

    let profileImage;

    if (!file) {
      profileImage = adminExists.image
    }else{
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      profileImage = result?.Location!;
      
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    adminExists.firstName = firstName;
    adminExists.lastName = lastName;
    adminExists.email = email;
    adminExists.image = profileImage;
    adminExists.password = hashedPassword;

    await adminExists.save()

    res.json({
      message: "profile successfully updated",
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}




    
