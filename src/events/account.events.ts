import { EventEmitter } from 'events';
import { Logger } from '../services/logger';
import { ICustomer } from '../database/customer/interface/customer.interface';
import { IContractor } from '../database/contractor/interface/contractor.interface';
import { GenericEmailTemplate } from '../templates/common/generic_email';
import { EmailService } from '../services';
import { IAbuseReport } from '../database/common/abuse_reports.model';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { i18n } from '../i18n';

export const AccountEvent: EventEmitter = new EventEmitter();


AccountEvent.on('ACCOUNT_DELETED', async function (payload: { user: ICustomer|IContractor }) {
    try {

        Logger.info(`handling ACCOUNT_DELETED event`);
        const user = payload.user

        let emailSubject = 'Account Deleted '
        let emailContent = `
                <h2>${emailSubject}</h2>
                <p style="color: #333333;">Your has been deleted successfully, </p>
                <p style="color: #333333;">All pending transactions will be processed and settled in 5 business days</p>
                 <p style="color: #333333;">If you have any enquiry kindly reach via any of our available channels</p>
                <p style="color: #333333;">Thanks for your patronage</p>
                `
        let html = GenericEmailTemplate({ name: user.firstName, subject: emailSubject, content: emailContent })
        EmailService.send(user.email, emailSubject, html)


        // TODO: check all pending transactions and handle appropriately

        
    } catch (error) {
        Logger.error(`Error handling ACCOUNT_DELETED event: ${error}`);
    }
});


AccountEvent.on('ACCOUNT_REPORTED', async function (payload: { report: IAbuseReport }) {
    try {

        Logger.info(`handling ACCOUNT_REPORTED event`);
        const report = payload.report
        const reportedUser = (report.reportedType === 'customers') ? await CustomerModel.findById(report.reported) : await ContractorModel.findById(report.reported)

        if(reportedUser){
            let emailSubject = 'Account Reported '
            let emailContent = `
                    <h2>${emailSubject}</h2>
                    <p>Hello ${reportedUser.firstName},</p>
                    <p style="color: #333333;">Your account was reported for abuse and we are currently investigating your account </p>
                    <p style="color: #333333;">Please note that we operate a three(3) count strike approach, which means that three (3) consecutive reports will lead to your account being temporary suspended</p>
                     <p style="color: #333333;">If you have any enquiry or concerns kindly reach via any of our available channels</p>
                    <p style="color: #333333;">Thanks for your patronage</p>
                    `
            let html = GenericEmailTemplate({ name: reportedUser.firstName, subject: emailSubject, content: emailContent })
            const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: reportedUser.language, saveToFile: false, useGoogle: true, contentType: 'html'}) || html;            
            const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: reportedUser.language}) || emailSubject;
            EmailService.send(reportedUser.email, translatedSubject, translatedHtml)
        }
    
    } catch (error) {
        Logger.error(`Error handling ACCOUNT_REPORTED event: ${error}`);
    }
});

