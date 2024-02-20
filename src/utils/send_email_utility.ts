import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";
import { htmlMailTemplate } from "../templates/sendEmailTemplate";
import { SendEmailType } from "../types/sendEmail.type";
import { bool } from "aws-sdk/clients/signer";

let transporter: any;

let EMAIL_AUTH = {};
if(process.env.EMAIL_SMTP_USERNAME && process.env.EMAIL_SMTP_PASSWORD ){
  EMAIL_AUTH = {
    user: <string>process.env.EMAIL_SMTP_USERNAME,
    pass: <string>process.env.EMAIL_SMTP_PASSWORD
  }
}



const transporterInit = () => {


    // Define the nodemailer transporter
    transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure:  process.env.EMAIL_SECURE == 'true' ? true : false,
        auth: EMAIL_AUTH,
        tls: {
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

