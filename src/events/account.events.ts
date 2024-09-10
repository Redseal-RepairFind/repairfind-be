import { EventEmitter } from 'events';
import { Logger } from '../services/logger';
import { ICustomer } from '../database/customer/interface/customer.interface';
import { IContractor } from '../database/contractor/interface/contractor.interface';
import { GenericEmailTemplate } from '../templates/common/generic_email';
import { EmailService } from '../services';

export const AccountEvent: EventEmitter = new EventEmitter();


AccountEvent.on('ACCOUNT_DELETED', async function (payload: { user: ICustomer|IContractor }) {
    try {

        Logger.info(`handling ACCOUNT_DELETED event`);
        const user = payload.user

        let emailSubject = 'Account Deleted '
        let emailContent = `
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

