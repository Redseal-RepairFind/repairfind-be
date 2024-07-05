import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import { Logger } from '../logger';
import { QueueService } from '../bullmq';

export class EmailService {
    protected readonly from: string = <string>process.env.EMAIL_FROM;

    public static createTransport(): Transporter {
        let auth = {};
        if (process.env.EMAIL_SMTP_USERNAME && process.env.EMAIL_SMTP_PASSWORD) {
            auth = {
                user: <string>process.env.EMAIL_SMTP_USERNAME,
                pass: <string>process.env.EMAIL_SMTP_PASSWORD
            };
        }

        return nodemailer.createTransport({
            // @ts-ignore
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE == 'true' ? true : false,
            auth: auth,
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false,
            }
        });
    }

    public static async send(
        recipients: string | string[],
        subject: string,
        html: string,
        cc?: string | string[] | undefined,
    ): Promise<void> {
        try {
            const from: string = <string>process.env.EMAIL_FROM;
            const toAddresses = Array.isArray(recipients) ? recipients : [recipients];
            const ccAddresses = Array.isArray(cc) ? cc : cc ? [cc] : [];

            for (const to of toAddresses) {
                const mailOptions: SendMailOptions = {
                    from,
                    to,
                    cc: ccAddresses,
                    subject,
                    html
                };

                // await this.createTransport().sendMail(mailOptions);

                // Queue the email job
                const jobId = `email-${to}-${subject}-${new Date()}`;
                await QueueService.addJob('sendEmail', mailOptions, { jobId, removeOnComplete: true } );
                console.log(`Email job added to queue for ${to} with CC to ${ccAddresses.join(', ')}`);

                console.log(`Email sent successfully to ${to} with CC to ${ccAddresses.join(', ')} | ${subject}`);
            }
        } catch (error: unknown) {
            console.error(error);
            // add logger to slack channel here
            Logger.error('Send Email API couldn\'t send email to user', error);
            throw error; // Rethrow the error to propagate it up the call stack
        }
    }
}

// Example usage:
// const recipients = ['recipient1@example.com', 'recipient2@example.com'];
// const cc = 'cc@example.com';
// EmailService.send(recipients, 'Test Subject', '<html><body><h1>Hello World!</h1></body></html>', cc)
//     .then(() => console.log('Emails sent successfully with CC'))
//     .catch(error => console.error('Error sending emails:', error));
