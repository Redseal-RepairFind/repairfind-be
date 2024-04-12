import Twilio from 'twilio';
import { config } from '../../config';

class TwilioService {
    private static twilioClient: Twilio.Twilio;

    static initialize() {
        const accountSid = config.twilio.accountSid
        const authToken = config.twilio.authToken
        this.twilioClient = Twilio(accountSid, authToken);
    }

    static async placeCall(to: string, from: string, url: string) {
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
}

export default TwilioService;
