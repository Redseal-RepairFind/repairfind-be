import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";
import { SendEmailType } from "../abstracts/types/sendEmail.type";
import { bool } from "aws-sdk/clients/signer";

let transporter: any;

const transporterInit = () => {


    // Define the nodemailer transporter
    transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE == 'true' ? true : false,
        secureConnection: process.env.EMAIL_SECURE == 'true' ? true : false,
        
        auth: process.env.EMAIL_SERVICE ? {
          user: process.env.EMAIL_SMTP_USERNAME,
          pass: process.env.EMAIL_SMTP_PASSWORD
        } : {},
        
        tls: {
            rejectUnauthorized: true,
            ciphers: 'SSLv3'
        } 

    } as SMTPTransport.Options);
};

export const sendEmail = async ({
    emailTo,
    subject,
    html
  }: SendEmailType) => {
    // Init the nodemailer transporter
    transporterInit();
  
    try {
      let response = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: emailTo,
        subject: subject,
        html: html,
      });
      return response;
    } catch (error) {
      console.log("error sending email", error)
      throw error;
    }
  };

