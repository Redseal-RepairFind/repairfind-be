import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { OTP_EXPIRY_TIME, generateOTP } from "../../../utils/otpGenerator";
import { OtpEmailTemplate } from "../../../templates/common/OtpEmailTemplate";
import { ContractorWelcomeTemplate } from "../../../templates/contractor/welcome_email";
import { handleAsyncError } from "../../../abstracts/decorators.abstract";
import { Base } from "../../../abstracts/base.abstract";
import { EmailService } from "../../../services";
import { config } from "../../../config";
import TwilioService from "../../../services/twillio";
import { i18n } from "../../../i18n";

class AuthHandler extends Base {
    @handleAsyncError()
    public async signUp(): Promise<Response | void> {
        let req = this.req
        let res = this.res
        try {
            const { email, password, firstName, dateOfBirth, lastName, phoneNumber, acceptTerms, accountType, companyName, language } = req.body;
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
                companyName,
                language
            });



            const html = OtpEmailTemplate(otp, firstName ?? companyName, "We have received a request to verify your email");
            let translatedHtml = await i18n.getTranslation({
                phraseOrSlug: html,
                lang: contractor.language,
                saveToFile: false,
                useGoogle: true
            }) || html ;            
            
            let translatedSubject = await i18n.getTranslation({
                phraseOrSlug: "Email Verification",
                lang: contractor.language
            }) || 'Email Verification';
            await EmailService.send(email, translatedSubject, translatedHtml);


            const welcomeHtml = ContractorWelcomeTemplate(firstName ?? companyName);
             translatedHtml = await i18n.getTranslation({
                phraseOrSlug: welcomeHtml,
                lang: contractor.language,
                saveToFile: false,
                useGoogle: true
            }) || welcomeHtml;            
             translatedSubject = await i18n.getTranslation({
                phraseOrSlug: "Welcome to Repairfind",
                lang: contractor.language
            }) || 'Welcome to Repairfind';
            await EmailService.send(email, translatedSubject!, translatedHtml!);

         
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
                otp,
                currentTimezone
            } = req.body;

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: "validation errors", errors: errors.array() });
            }

            const contractor = await ContractorModel.findOne({ email });

            if (!contractor) {
                return res.status(401).json({ success: false, message: "invalid email" });
            }

            if (contractor.emailOtp.otp != otp) {
                return res.status(401).json({ success: false, message: "invalid otp" });
            }

            if (contractor.emailOtp.verified) {
                return res.status(401).json({ success: false, message: "email already verified" });
            }

            const timeDiff = new Date().getTime() - contractor.emailOtp.createdTime.getTime();
            if (timeDiff > OTP_EXPIRY_TIME) {
                return res.status(400).json({ success: false, message: "otp expired" });
            }

            contractor.emailOtp.verified = true;
            contractor.currentTimezone = currentTimezone
            await contractor.save();

            const accessToken = jwt.sign(
                {id: contractor?._id, email: contractor.email, userType: 'contractors',
                },
                process.env.JWT_SECRET_KEY!,
                { expiresIn: config.jwt.tokenLifetime }
            );

            const quiz = await contractor?.quiz ?? null
            const contractorResponse = {
                ...contractor.toJSON(), 
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

            if (!contractor) {
                return res.status(404).json({ success: false, message: "Account not found" });
            }

            if (contractor.phoneNumber && contractor?.phoneNumber.verifiedAt) {
                return res.status(401).json({ success: false, message: "Phone already verified" });
            }

            const phoneNumber = `${contractor?.phoneNumber?.code}${contractor?.phoneNumber?.number}`
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
                return res.status(400).json({ success: false, message: "Otp is required", });
            }

            const contractorId = req.contractor.id
            const contractor = await ContractorModel.findById(contractorId);

            if (!contractor) {
                return res.status(404).json({ success: false, message: "Account not found" });
            }


            const phoneNumber = `${contractor?.phoneNumber?.code}${contractor?.phoneNumber?.number}`
            const verified = await TwilioService.verifyCode(phoneNumber, otp)
            if (!verified) {
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
            return res.status(500).json({ success: false, message: 'Error verifying phone number' });
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
                currentTimezone,
            } = req.body;

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
            }

            let contractor = await ContractorModel.findOne({ email }).populate('profile');

            if (!contractor) {
                return res.status(401).json({ success: false, message: "invalid credential" });
            }

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
                ...contractor.toJSON(), 
                quiz,
            };


            // generate access token
            const accessToken = jwt.sign(
                {id: contractor?._id, email: contractor.email, userType: 'contractors',
                },
                process.env.JWT_SECRET_KEY!,
                { expiresIn: config.jwt.tokenLifetime }
            );


            contractor.currentTimezone = currentTimezone
            await contractor.save()

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
                currentTimezone
            } = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
            }

            const contractor = await ContractorModel.findOne({ 'phoneNumber.number': number, 'phoneNumber.code': code });


            if (!contractor) {
                return res
                    .status(401)
                    .json({ success: false, message: "Invalid credential" });
            }


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
                ...contractor.toJSON(), 
                quiz,
            };


            // generate access token
            const accessToken = jwt.sign(
                { id: contractor?._id, email: contractor.email, userType: 'contractors',
                },
                process.env.JWT_SECRET_KEY!,
                { expiresIn: config.jwt.tokenLifetime }
            );

            contractor.currentTimezone = currentTimezone
            await contractor.save()

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
            const {email} = req.body;
            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: 'Invalid inputs', errors: errors.array() });
            }

            const contractor = await ContractorModel.findOne({ email });
            if (!contractor) {
                return res.status(401).json({ success: false, message: "Invalid email" });
            }

            if (contractor.emailOtp.verified) {
                // return res.status(401).json({ success: false, message: "Email already verified" });
            }

            const otp = generateOTP()
            const createdTime = new Date();

            contractor!.emailOtp = {otp, createdTime, verified: false}

            await contractor?.save();

            const html = OtpEmailTemplate(otp, contractor.firstName, "We have received a request to verify your email")
            const translatedHtml = await i18n.getTranslation({
                phraseOrSlug: html,
                lang: contractor.language,
                saveToFile: false,
                useGoogle: true
            }) || html;            
            const translatedSubject = await i18n.getTranslation({
                phraseOrSlug: "Email Verification",
                lang: contractor.language
            }) || 'Email Verification';
            
            EmailService.send(email, translatedSubject, translatedHtml)
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


            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: 'Invalid inputs', errors: errors.array() });
            }

            const contractor = await ContractorModel.findOne({ email });

            if (!contractor) {
                return res.status(401).json({ success: false, message: "invalid email" });
            }

            const otp = generateOTP()
            const createdTime = new Date();
            contractor!.passwordOtp = {
                otp,
                createdTime,
                verified: true
            }


            await contractor?.save();
            const html = OtpEmailTemplate(otp, contractor.firstName, "We have received a request to change your password")
            
            const translatedHtml = await i18n.getTranslation({
                phraseOrSlug: html,
                lang: contractor.language,
                saveToFile: false,
                useGoogle: true
            });            
            
            const translatedSubject = await i18n.getTranslation({
                phraseOrSlug: 'Password Change',
                lang: contractor.language
            });

            EmailService.send(contractor.email, translatedSubject!, translatedHtml!)
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
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
            }

            const contractor = await ContractorModel.findOne({ email });

            // check if contractor exists
            if (!contractor) {
                return res.status(401).json({ success: false, message: "Invalid Email" });
            }

            const { createdTime, verified } = contractor.passwordOtp
            const timeDiff = new Date().getTime() - createdTime.getTime();


            if (!verified || timeDiff > OTP_EXPIRY_TIME || otp !== contractor.passwordOtp.otp) {
                return res.status(401).json({success: false, message: "Unable to reset password" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            contractor.password = hashedPassword;
            contractor.passwordOtp.verified = false;

            await contractor.save();

            return res.status(200).json({ success: true, message: "Password successfully changed" });

        } catch (err: any) {
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
                return res.status(401).json({ success: false, message: "Invalid email" });
            }

            const { createdTime } = contractor.passwordOtp
            const timeDiff = new Date().getTime() - createdTime.getTime();

            if (otp !== contractor.passwordOtp.otp) {
                return res.status(401).json({ success: false, message: "Invalid password reset otp" });
            }

            if (timeDiff > OTP_EXPIRY_TIME) {
                return res.status(401).json({ success: false, message: "Reset password otp has expired" });
            }

            return res.status(200).json({ success: true, message: "Password reset otp verified" });

        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }


}


export const AuthController = (...args: [Request, Response, NextFunction]) =>
    new AuthHandler(...args);