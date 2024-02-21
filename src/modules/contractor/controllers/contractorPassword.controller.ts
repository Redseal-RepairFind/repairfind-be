import { validationResult } from "express-validator";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import { OTP_EXPIRY_TIME, generateOTP } from "../../../utils/otpGenerator";
import { sendEmail } from "../../../utils/send_email_utility";
import { htmlMailTemplate } from "../../../templates/sendEmailTemplate";


//contractor forgot password through email /////////////
export const contractorEmailForgotPasswordController = async (
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
        const contractor = await ContractorModel.findOne({ email });
    
         // check if user exists
         if (!contractor) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        contractor!.passwordOtp = {
            otp,
            createdTime,
            verified : true
        }

        await contractor?.save();
        const html = htmlMailTemplate(otp, contractor.firstName, "We have received a request to change your password")

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


//contractor reset password through email /////////////
export const contractorEmailResetPasswordController = async (
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
    
        // try find contractor with the same email
        const contractor = await ContractorModel.findOne({ email });
    
         // check if contractor exists
        if (!contractor) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        const {createdTime, verified} = contractor.passwordOtp

        const timeDiff = new Date().getTime() - createdTime.getTime();

        if (!verified || timeDiff > OTP_EXPIRY_TIME || otp !== contractor.passwordOtp.otp) {
            return res
            .status(401)
            .json({ message: "unable to reset password" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); 

        contractor.password = hashedPassword;
        contractor.passwordOtp.verified = false;

        await contractor.save();

        return res.status(200).json({ message: "password successfully change" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}

