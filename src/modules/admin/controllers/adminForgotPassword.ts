import { validationResult } from "express-validator";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import AdminRegModel from "../../../database/admin/models/admin.model";
import { OTP_EXPIRY_TIME, generateOTP } from "../../../utils/otpGenerator";
import { sendEmail } from "../../../utils/send_email_utility";
import { htmlMailTemplate } from "../../../templates/sendEmailTemplate";


//admin forgot password through email /////////////
export const AdminEmailForgotPasswordController = async (
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
    
        // try find user with the same email
        const admin = await AdminRegModel.findOne({ email });
    
         // check if user exists
         if (!admin) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        admin!.passwordOtp = {
            otp,
            createdTime,
            verified : true
        }

        await admin?.save();

        const html = htmlMailTemplate(otp, admin.firstName, "We have received a request to change your password");

        let emailData = {
            emailTo: email,
            subject: "admin password change",
            html
        };
      
        sendEmail(emailData);
    
        return res.status(200).json({ message: "OTP sent successfully to your email." });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}

//admin reset password through email /////////////
export const AdminEmailResetPasswordController = async (
    req: Request,
    res: Response,
) => {

    try {
        const {
            email,
            otp,
            password
        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        // try find customerr with the same email
        const admin = await AdminRegModel.findOne({ email });
    
         // check if contractor exists
        if (!admin) {
          return res
            .status(401)
            .json({ message: "invalid email" });
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

        return res.status(200).json({ message: "password successfully change" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}
