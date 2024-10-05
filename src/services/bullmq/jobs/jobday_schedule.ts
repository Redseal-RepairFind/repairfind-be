import { CertnService, NotificationService } from "../..";
import { IJob, JOB_SCHEDULE_REMINDER, JOB_STATUS, JobModel } from "../../../database/common/job.model";
import { IContractor, IContractorCertnDetails } from "../../../database/contractor/interface/contractor.interface";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { ICustomer } from "../../../database/customer/interface/customer.interface";
import CustomerModel from "../../../database/customer/models/customer.model";
import { i18n } from "../../../i18n";
import { Logger } from "../../logger";

export const jobDayScheduleCheck = async () => {
    try {
        const jobs = await JobModel.find({
            status: { $in: ['BOOKED'] },
            'schedule.startDate': { $exists: true }
        }) as IJob[];

        for (const job of jobs) {
            try {
                const customer = await CustomerModel.findById(job.customer);
                const contractor = await ContractorModel.findById(job.contractor);

                const currentDate = new Date();
                const jobStartDate = new Date(job.schedule.startDate);

                const timeDifference = jobStartDate.getTime() - currentDate.getTime();
                const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hourDifference = Math.floor(timeDifference / (1000 * 60 * 60));
                const minuteDifference = Math.floor(timeDifference / (1000 * 60));


            
                const formattedJobStartDate = `${jobStartDate.toDateString()} at ${get12HourFormat(jobStartDate)}`;
               
                if (customer && contractor) {

                    const formattedJobStartDateContractorTz = new Intl.DateTimeFormat('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                        timeZone: contractor?.currentTimezone,
                        timeZoneName: 'long'
                    }).format(new Date(jobStartDate));

                    const formattedJobStartDateCustomerTz = new Intl.DateTimeFormat('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                        timeZone: customer?.currentTimezone,
                        timeZoneName: 'long'
                    }).format(new Date(jobStartDate));


                    Logger.info(`JobSchedule Reminder`, {
                        formattedJobStartDateContractorTz: `${formattedJobStartDateContractorTz}`,
                        formattedJobStartDateCustomerTz: `${formattedJobStartDateCustomerTz}`,
                        currentDate: `${currentDate} `,
                        jobStartDate: `${jobStartDate} `,
                        formattedJobStartDate: `${formattedJobStartDate} `,
                        daysDifference: `${daysDifference} `,
                        hourDifference: `${hourDifference}`,
                    });

                  
                    if (hourDifference <= 1) {
                        if (!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_1)) {
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_1);
                            await Promise.all([
                                sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for today ${formattedJobStartDateContractorTz}`),
                                sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for today ${formattedJobStartDateCustomerTz}`),
                                job.save()
                            ])
                        }
                        continue;
                    }

                    if (hourDifference <= 6) {
                        if (!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_6)) {
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_6);
                            await Promise.all([
                                sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for today ${formattedJobStartDateContractorTz}`),
                                sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for today ${formattedJobStartDateCustomerTz}`),
                                await job.save()
                            ])
                        }
                        continue;

                    }

                    if (hourDifference <= 12) {
                        if (!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_12)) {
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_12);
                            await job.save();
                            await Promise.all([
                                sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for today ${formattedJobStartDateContractorTz}`),
                                sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for today ${formattedJobStartDateCustomerTz}`),
                                await job.save()
                            ])

                        }
                        continue;
                    }

                    if (hourDifference <= 24) {
                        if (!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_24)) {
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_24);
                            await Promise.all([
                                sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for tomorrow ${formattedJobStartDateContractorTz}`),
                                sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for tomorrow ${formattedJobStartDateCustomerTz}`),
                                await job.save()
                            ])
                        }
                        continue;
                    }

                    if (hourDifference <= 48) {
                        if (!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_48)) {
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_48);
                            await Promise.all([
                                sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for ${formattedJobStartDateContractorTz}`),
                                sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for ${formattedJobStartDateCustomerTz}`),
                                await job.save()
                            ])
                        }
                        continue;
                    }
                }

                Logger.info(`Processed job day reminder: daysDifference: ${daysDifference} - JobId: ${job.id}`);
            } catch (error) {
                Logger.error(`Error sending job day reminder for job ID ${job.id}:`, error);
            }
        }
    } catch (error) {
        Logger.error('Error fetching jobs for day reminder:', error);
    }
};

function get12HourFormat(date: Date) {
    const hours = date.getHours();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${formattedHours}:${minutes} ${period}`;
}

async function sendReminderContractor(customer: ICustomer, contractor: IContractor, job: IJob, message: string) {
    
    const contractorLang = contractor.language;
    let nTitle = await i18n.getTranslation({
        phraseOrSlug: 'Job Schedule Reminder',
        targetLang: contractorLang
    });
    let nMessage = await i18n.getTranslation({
        phraseOrSlug: message,
        targetLang: contractorLang
    });
    

    NotificationService.sendNotification({
        user: contractor.id,
        userType: 'contractors',
        title: nTitle,
        type: 'JOB_DAY_REMINDER',
        message: nMessage,
        heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
        payload: {
            entity: job.id,
            entityType: 'jobs',
            message: nMessage,
            contractor: contractor.id,
            event: 'JOB_DAY_REMINDER',
        }
    }, { push: true, socket: true });



}

async function sendReminderCustomer(customer: ICustomer, contractor: IContractor, job: IJob, message: string) {
    
    
    const customerLang = customer.language;
    let nTitle = await i18n.getTranslation({
        phraseOrSlug: 'Job Schedule Reminder',
        targetLang: customerLang
    });
    let nMessage = await i18n.getTranslation({
        phraseOrSlug: message,
        targetLang: customerLang
    });
    
    NotificationService.sendNotification({
        user: customer.id,
        userType: 'customers',
        title: nTitle,
        type: 'JOB_DAY_REMINDER',
        message: message,
        heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
        payload: {
            entity: job.id,
            entityType: 'jobs',
            message: nMessage,
            contractor: contractor.id,
            event: 'JOB_DAY_REMINDER',
        }
    }, { push: true, socket: true });


}
