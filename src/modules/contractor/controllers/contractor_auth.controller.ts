import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { OTP_EXPIRY_TIME, generateOTP } from "../../../utils/otpGenerator";
import { sendEmail } from "../../../utils/send_email_utility";
import { uploadToS3 } from "../../../utils/upload.utility";
import { v4 as uuidv4 } from "uuid";
import { htmlMailTemplate } from "../../../templates/sendEmailTemplate";
import { ContractorWelcomeTemplate } from "../../../templates/contractor/welcome_email";
import { handleAsyncError } from "../../../abstracts/decorators.abstract";
import { Base } from "../../../abstracts/base.abstract";
import { EmailService } from "../../../services";
import { config } from "../../../config";
import { EmailVerificationTemplate } from "../../../templates/common/email_verification";
import TwilioService from "../../../services/twillio";

class AuthHandler extends Base {
    @handleAsyncError()
    public async signUp(): Promise<Response | void> {
        let req = this.req
        let res = this.res
        try {
            const { email, password, firstName, dateOfBirth, lastName, phoneNumber, acceptTerms, accountType, companyName } = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
            }

            const userEmailExists = await ContractorModel.findOne({ email });
            const userPhoneExists = await ContractorModel.findOne({ "phoneNumber.code": phoneNumber.code, "phoneNumber.number": phoneNumber.number });

            if (userEmailExists) {
                return res.status(401).json({ success: false, message: "Email exists already" });
            }

            if (userPhoneExists) {
                return res.status(401).json({ success: false, message: "Phone exists already" });
            }


            const otp = generateOTP();
            const createdTime = new Date();
            const emailOtp = {
                otp,
                createdTime,
                verified: false
            };



            const hashedPassword = await bcrypt.hash(password, 10);

            const contractor = await ContractorModel.create({
                email,
                firstName,
                dateOfBirth,
                lastName,
                password: hashedPassword,
                emailOtp,
                phoneNumber,
                acceptTerms,
                accountType,
                companyName
            });




            const html = EmailVerificationTemplate(otp, firstName ?? companyName);
            await EmailService.send(email, 'Email Verification', html);

            const welcomeHtml = ContractorWelcomeTemplate(firstName ?? companyName);
            await EmailService.send(email, 'Welcome to Repairfind', welcomeHtml);

            // const adminNoti = new AdminNoficationModel({
            //     title: "New Account Created",
            //     message: `A contractor - ${firstName} just created an account.`,
            //     status: "unseen"
            // });

            // await adminNoti.save();

            return res.json({
                success: true,
                message: "Signup successful",
                data: contractor,
            });

        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }


    @handleAsyncError()
    public async verifyEmail(): Promise<Response> {
        let req = this.req
        let res = this.res
        try {
            const {
                email,
                otp
            } = req.body;
            // Check for validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: "validation errors", errors: errors.array() });
            }

            // try find contractor with the same email
            const contractor = await ContractorModel.findOne({ email });

            // check if contractor exists
            if (!contractor) {
                return res
                    .status(401)
                    .json({ success: false, message: "invalid email" });
            }

            if (contractor.emailOtp.otp != otp) {
                return res
                    .status(401)
                    .json({ success: false, message: "invalid otp" });
            }

            if (contractor.emailOtp.verified) {
                return res
                    .status(401)
                    .json({ success: false, message: "email already verified" });
            }

            const timeDiff = new Date().getTime() - contractor.emailOtp.createdTime.getTime();
            if (timeDiff > OTP_EXPIRY_TIME) {
                return res.status(400).json({ success: false, message: "otp expired" });
            }

            contractor.emailOtp.verified = true;

            await contractor.save();

            const accessToken = jwt.sign(
                {
                    id: contractor?._id,
                    email: contractor.email,
                    userType: 'contractors',
                },
                process.env.JWT_SECRET_KEY!,
                { expiresIn: config.jwt.tokenLifetime }
            );

            const quiz = await contractor?.quiz ?? null
            const contractorResponse = {
                //@ts-ignore
                ...contractor.toJSON(), // Convert to plain JSON object
                //@ts-ignore
                quiz,
            };

            // return access token
            return res.json({
                success: true,
                message: "Email verified successful",
                accessToken: accessToken,
                expiresIn: config.jwt.tokenLifetime,
                user: contractorResponse
            });

            // return res.json({
            //     success: true,
            //     message: "email verified successfully",
            // });

        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }

    @handleAsyncError()
    public async sendPhoneOtp(): Promise<Response> {
        let req = <any>this.req
        let res = this.res
        try {
            
            const contractorId = req.contractor.id
            const contractor = await ContractorModel.findById(contractorId);

            // check if contractor exists
            if (!contractor) {
                return res
                    .status(404)
                    .json({ success: false, message: "Account not found" });
            }

            if (contractor.phoneNumber && contractor?.phoneNumber.verifiedAt) {
                return res
                    .status(401)
                    .json({ success: false, message: "Phone already verified" });
            }

            const phoneNumber = `${contractor.phoneNumber.code}${contractor.phoneNumber.number}`
            await TwilioService.sendVerificationCode(phoneNumber)



            return res.status(200).json({ success: true, message: "OTP sent successfully to your phone." });

        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }

    @handleAsyncError()
    public async verifyPhone(): Promise<Response> {
        let req = <any>this.req
        let res = this.res
        try {
            const {
                otp
            } = req.body;
           


            if (!otp) {
                return res.status(400).json({ success: false, message: "Otp is required",  });
            }

            const contractorId = req.contractor.id
            const contractor = await ContractorModel.findById(contractorId);

            if (!contractor) {
                return res
                    .status(404)
                    .json({ success: false, message: "Account not found" });
            }


            const phoneNumber = `${contractor.phoneNumber.code}${contractor.phoneNumber.number}`
            const verified = await TwilioService.verifyCode(phoneNumber, otp)
            if(!verified){
                return res.status(422).json({
                    success: false,
                    message: "Phone verification failed",
                });
            }
            
            if (contractor.phoneNumber) {
                contractor.phoneNumber.verifiedAt = new Date();
            }

            await contractor.save();

            
            return res.json({
                success: true,
                message: "Phone verified successful",
            });

        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }

    @handleAsyncError()
    public async signin(): Promise<Response> {
        let req = this.req
        let res = this.res
        try {
            const {
                email,
                password,
                phoneNumber,
            } = req.body;
            // Check for validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
            }

            // try find user with the same email
            let contractor = await ContractorModel.findOne({ email }).populate('profile');

            // check if user exists
            if (!contractor) {
                return res
                    .status(401)
                    .json({ success: false, message: "invalid credential" });
            }

            // // Check if password is alphanumeric with symbols
            // if (!/^[a-zA-Z0-9!@#$%^&*]+$/.test(password)) {
            //     return res.status(400).json({ success: false, message: "Password must be alphanumeric with symbols." });
            // }

            // compare password with hashed password in database
            const isPasswordMatch = await bcrypt.compare(password, contractor.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ success: false, message: "Incorrect credential." });
            }

            if (!contractor.emailOtp.verified) {
                return res.status(401).json({ success: false, message: "Email not verified." });
            }



            const quiz = await contractor?.quiz ?? null
            contractor.onboarding = await contractor.getOnboarding()
            const contractorResponse = {
                ...contractor.toJSON(), // Convert to plain JSON object
                quiz,
            };


            // generate access token
            const accessToken = jwt.sign(
                {
                    id: contractor?._id,
                    email: contractor.email,
                    userType: 'contractors',
                },
                process.env.JWT_SECRET_KEY!,
                { expiresIn: config.jwt.tokenLifetime }
            );

            // return access token
            return res.json({
                success: true,
                message: "Login successful",
                accessToken: accessToken,
                expiresIn: config.jwt.tokenLifetime,
                user: contractorResponse
            });


        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }

    @handleAsyncError()
    public async signinWithPhone(): Promise<Response> {
        let req = this.req
        let res = this.res
        try {
            const {
                password,
                number,
                code,
            } = req.body;
            // Check for validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
            }

            // try find user with the same email
            const contractor = await ContractorModel.findOne({ 'phoneNumber.number': number, 'phoneNumber.code': code  });


            // check if user exists
            if (!contractor) {
                return res
                    .status(401)
                    .json({ success: false, message: "Invalid credential" });
            }

            // // Check if password is alphanumeric with symbols
            // if (!/^[a-zA-Z0-9!@#$%^&*]+$/.test(password)) {
            //     return res.status(400).json({ success: false, message: "Password must be alphanumeric with symbols." });
            // }

            // compare password with hashed password in database
            const isPasswordMatch = await bcrypt.compare(password, contractor.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ success: false, message: "Incorrect credential." });
            }

            if (!contractor.emailOtp.verified) {
                return res.status(401).json({ success: false, message: "Email not verified." });
            }



            const quiz = await contractor?.quiz ?? null
            contractor.onboarding = await contractor.getOnboarding()
            const contractorResponse = {
                ...contractor.toJSON(), // Convert to plain JSON object
                quiz,
            };


            // generate access token
            const accessToken = jwt.sign(
                {
                    id: contractor?._id,
                    email: contractor.email,
                    userType: 'contractors',
                },
                process.env.JWT_SECRET_KEY!,
                { expiresIn: config.jwt.tokenLifetime }
            );

            // return access token
            return res.json({
                success: true,
                message: "Login successful",
                accessToken: accessToken,
                expiresIn: config.jwt.tokenLifetime,
                user: contractorResponse
            });


        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }

    @handleAsyncError()
    public async resendEmail(): Promise<Response> {
        let req = this.req
        let res = this.res
        try {
            const {
                email,
            } = req.body;
            // Check for validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
            }

            // try find customer with the same email
            const contractor = await ContractorModel.findOne({ email });

            // check if contractor exists
            if (!contractor) {
                return res
                    .status(401)
                    .json({ success: false, message: "invalid email" });
            }

            if (contractor.emailOtp.verified) {
                return res
                    .status(401)
                    .json({ success: false, message: "email already verified" });
            }

            const otp = generateOTP()

            const createdTime = new Date();

            contractor!.emailOtp = {
                otp,
                createdTime,
                verified: false
            }

            await contractor?.save();

            const html = htmlMailTemplate(otp, contractor.firstName, "We have received a request to verify your email")
            EmailService.send(email, "Email Verification", html)

            return res.status(200).json({ success: true, message: "OTP sent successfully to your email." });

        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }

    @handleAsyncError()
    public async forgotPassword(): Promise<Response> {
        let req = this.req
        let res = this.res
        try {
            const {
                email,
            } = req.body;
            // Check for validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: 'validation errors', errors: errors.array() });
            }

            // try find user with the same email
            const contractor = await ContractorModel.findOne({ email });

            // check if user exists
            if (!contractor) {
                return res
                    .status(401)
                    .json({ success: false, message: "invalid email" });
            }

            const otp = generateOTP()

            const createdTime = new Date();

            contractor!.passwordOtp = {
                otp,
                createdTime,
                verified: true
            }

            await contractor?.save();
            const html = htmlMailTemplate(otp, contractor.firstName, "We have received a request to change your password")

            let emailData = {
                emailTo: email,
                subject: "Contractor password change",
                html
            };

            sendEmail(emailData);

            return res.status(200).json({ success: true, message: "OTP sent successfully to your email." });

        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }
    @handleAsyncError()
    public async resetPassword(): Promise<Response> {
        let req = this.req
        let res = this.res
        try {
            const {
                email,
                otp,
                password
            } = req.body;
            // Check for validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
            }

            // try find contractor with the same email
            const contractor = await ContractorModel.findOne({ email });

            // check if contractor exists
            if (!contractor) {
                return res
                    .status(401)
                    .json({ success: false, message: "invalid email" });
            }

            const { createdTime, verified } = contractor.passwordOtp

            const timeDiff = new Date().getTime() - createdTime.getTime();

            if (!verified || timeDiff > OTP_EXPIRY_TIME || otp !== contractor.passwordOtp.otp) {
                return res
                    .status(401)
                    .json({ sucess: false, message: "unable to reset password" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            contractor.password = hashedPassword;
            contractor.passwordOtp.verified = false;

            await contractor.save();

            return res.status(200).json({ success: true, message: "password successfully change" });

        } catch (err: any) {
            // signup error
            return res.status(500).json({ success: false, message: err.message });
        }
    }


    @handleAsyncError()
    public async verifyResetPasswordOtp(): Promise<Response> {
        let req = this.req
        let res = this.res
        try {
            const {
                email,
                otp,
            } = req.body;
            // Check for validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
            }

            // try find contractor with the same email
            const contractor = await ContractorModel.findOne({ email });

            // check if contractor exists
            if (!contractor) {
                return res
                    .status(401)
                    .json({ success: false, message: "invalid email" });
            }

            const { createdTime } = contractor.passwordOtp
            const timeDiff = new Date().getTime() - createdTime.getTime();

            if (otp !== contractor.passwordOtp.otp) {
                return res
                    .status(401)
                    .json({ sucess: false, message: "invalid password reset otp" });
            }

            if (timeDiff > OTP_EXPIRY_TIME) {
                return res
                    .status(401)
                    .json({ sucess: false, message: "reset password otp has expired" });
            }


            return res.status(200).json({ success: true, message: "password reset otp verified" });

        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }
}


export const AuthController = (...args: [Request, Response, NextFunction]) =>
    new AuthHandler(...args);