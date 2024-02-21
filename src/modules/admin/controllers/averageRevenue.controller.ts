import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import JobModel from "../../../database/contractor/models/job.model";
import CustomerRegModel from "../../../database/customer/models/customerReg.model";
import TransactionModel from "../../../database/admin/models/transaction.model";
import * as nodemailer from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";



//get revenue every day /////////////
export const AdminGetRevenueAnalysisControlleer = async (
    req: any,
    res: Response,
  ) => {
    try {
      let {  
        year,
        month
      } = req.query;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id
        
        const startDate = new Date(`${year}-${month}-01`)
        const endDate = new Date(`${year}-${parseInt(month) + 1}-01`)

        const transactions = await TransactionModel.find({
            createdAt: {
            $gte: startDate,
            $lte: endDate,
            },
        });

        let revenueJob = []

        for (let a = 1; a < 32; a++) {
            const element = a;

            const date  = new Date(`${year}-${month}-${element}`);

            const day = date.getDate()

            let revenue = 0;
            let job = 0;
            
            for (let i = 0; i < transactions.length; i++) {
                const transction = transactions[i];

                const dayCreated = transction.createdAt.getDate()

                if (day == dayCreated) {
                    
                    if (transction.form == "qoutation") {
                        job = job + 1
                    }

                    if (transction.type == "credit") {
                        revenue = revenue + transction.amount
                    }
                }

            }

            let obj = {
                day: element,
                revenue,
                job
            }

            revenueJob.push(obj) 
        }

        res.json({  
            revenueJob
        });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//send Email/////////////
export const AdminsendEmailsControlleer = async (
    req: any,
    res: Response,
  ) => {
   
      let {  
       
      } = req.query;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            secureConnection: false,
            port: 587,
            auth: {
              user: 'admin@repairfind.ca',
              pass: 'extraneousroot_',
            },
            tls: {
                //rejectUnauthorized: true,
               ciphers: 'SSLv3',
               rejectUnauthorized: false,
            }
          }as SMTPTransport.Options);
          
          // Email options
          const mailOptions: nodemailer.SendMailOptions = {
            from: 'admin@repairfind.ca',
            to: 'akinyemisaheedwale@gmail.com',
            subject: 'Test Email',
            text: 'Hello, this is a test email from Node.js!',
          };
          
          // Send email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error:', error);
              return console.error('Error:', error);
            }
            console.log('Email sent:', info.response);
          });

        res.json({  
            message: "ok"
        });
      
   
  
}