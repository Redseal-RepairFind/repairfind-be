import { EventEmitter } from 'events';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { EmailService, NotificationService } from '../services';
import { GenericEmailTemplate } from '../templates/common/generic_email';
import { IFeedback } from '../database/common/feedback.model';
import AdminModel from '../database/admin/models/admin.model';


export const AdminEvent: EventEmitter = new EventEmitter();

AdminEvent.on('NEW_FEEDBACK', async function (payload: { feedback: IFeedback, user: any }) {
    try {
        console.log('handling NEW_FEEDBACK event')
        const user = payload.user
        const admin = await AdminModel.findOne({email: 'admin@repairfind.ca'})
        const feedback = payload.feedback

        if(!admin)return
        let emailSubject = 'New Feedback '
        let emailContent = `
            <p style="color: #333333;">There is a new feedback on Repairfind</p>
            <div style="background: whitesmoke;padding: 10px; border-radius: 10px;">
            <p style="border-bottom: 1px solid lightgray; padding-bottom: 5px;"><strong>Name:</strong> ${user.name}</p>
            <p style="border-bottom: 1px solid lightgray; padding-bottom: 5px;"><strong>Email:</strong> ${user.email}</p>
            <p style="border-bottom: 1px solid lightgray; padding-bottom: 5px;"><strong>Feedback:</strong> ${feedback.remark}</p>
            </div>
            <p style="color: #333333;">Do well to check and follow up as soon as possible </p>
            `

        let html = GenericEmailTemplate({ name: admin.name, subject: emailSubject, content: emailContent })
        EmailService.send(admin.email, emailSubject, html)


    } catch (error) {
        console.error(`Error handling NEW_FEEDBACK event: ${error}`);
    }
});
