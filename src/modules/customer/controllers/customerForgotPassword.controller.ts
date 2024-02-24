import { validationResult } from "express-validator";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import CustomerRegModel from "../../../database/customer/models/customer.model";
import { OTP_EXPIRY_TIME, generateOTP } from "../../../utils/otpGenerator";
import { sendEmail } from "../../../utils/send_email_utility";
import { htmlMailTemplate } from "../../../templates/sendEmailTemplate";



//customer forgot password through email /////////////
export const customerEmailForgotPasswordController = async (
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
        const customer = await CustomerRegModel.findOne({ email });
    
         // check if user exists
         if (!customer) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        customer!.passwordOtp = {
            otp,
            createdTime,
            verified : true
        }

        await customer?.save();

        const html = htmlMailTemplate(otp, customer.firstName, "We have received a request to change your password");

        let emailData = {
            emailTo: email,
            subject: "constractor password change",
            html
        };
      
        sendEmail(emailData);
    
        return res.status(200).json({ message: "OTP sent successfully to your email." });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}


//customer reset password through email /////////////
export const customerEmailResetPasswordController = async (
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
        const customer = await CustomerRegModel.findOne({ email });
    
         // check if contractor exists
        if (!customer) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        const {createdTime, verified} = customer.passwordOtp

        const timeDiff = new Date().getTime() - createdTime.getTime();

        if (!verified || timeDiff > OTP_EXPIRY_TIME || otp !== customer.passwordOtp.otp) {
            return res
            .status(401)
            .json({ message: "unable to reset password" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); 

        customer.password = hashedPassword;
        customer.passwordOtp.verified = false;

        await customer.save();

        return res.status(200).json({ message: "password successfully change" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}

