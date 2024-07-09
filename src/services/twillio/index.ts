import Twilio from 'twilio';
import { config } from '../../config';
import { Logger } from '../logger';

class TwilioService {
    private static twilioClient: Twilio.Twilio;
    private static verificationServiceSid: string;

    static initialize() {
        const accountSid = config.twilio.accountSid;
        const authToken = config.twilio.authToken;
        this.twilioClient = Twilio(accountSid, authToken);
        this.verificationServiceSid = config.twilio.verificationServiceSid;
    }

    static async placeCall(to: string, from: string, url: string) {
        if (!this.isValidPhoneNumber(to) || !this.isValidPhoneNumber(from)) {
            throw new Error('Invalid phone number format');
        }

        try {
            const call = await this.twilioClient.calls.create({
                twiml: `<Response><Say>Hello!</Say></Response>`, // Example TwiML response
                to,
                from,
                url,
            });

            console.log(`Call placed successfully. Call SID: ${call.sid}`);
            return call.sid;
        } catch (error) {
            console.error('Error placing call:', error);
            throw error;
        }
    }

    static async sendSMS(to: string, from: string, body: string) {
        if (!this.isValidPhoneNumber(to) || !this.isValidPhoneNumber(from)) {
            throw new Error('Invalid phone number format');
        }

        try {
            const message = await this.twilioClient.messages.create({
                to,
                from,
                body,
            });

            console.log(`SMS sent successfully. Message SID: ${message.sid}`);
            return message.sid;
        } catch (error) {
            console.error('Error sending SMS:', error);
            throw error;
        }
    }

    static async sendVerificationCode(to: string) {
        if (!this.isValidPhoneNumber(to)) {
            throw new Error('Invalid phone number format');
        }

        try {
            const verification = await this.twilioClient.verify.v2.services(this.verificationServiceSid)
                .verifications
                .create({ to, channel: 'sms' });

            console.log(`Verification code sent successfully to ${to}. SID: ${verification.sid}`);
            return verification.sid;
        } catch (error) {
            console.error('Error sending verification code:', error);
            throw error;
        }
    }

    static async verifyCode(to: string, code: string) {
        if (!this.isValidPhoneNumber(to)) {
            throw new Error('Invalid phone number format');
        }

        try {
            const verificationCheck = await this.twilioClient.verify.v2.services(this.verificationServiceSid)
                .verificationChecks
                .create({ to, code });

            if (verificationCheck.status === 'approved') {
                Logger.info(`Phone number verified successfully. to: ${to}`);
                return true;
            } else {
                Logger.info(`Verification failed. to: ${to}`);
                return false;
            }
        } catch (error) {
            Logger.error('Error verifying code:', error);
            throw error;
        }
    }

    private static isValidPhoneNumber(phoneNumber: string): boolean {
        const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
        return phoneNumberPattern.test(phoneNumber);
    }
}

export default TwilioService;
