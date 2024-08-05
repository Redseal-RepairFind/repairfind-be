import { CertnService, NotificationService } from "../..";
import { IJob, JOB_SCHEDULE_REMINDER, JOB_STATUS, JobModel } from "../../../database/common/job.model";
import { IContractor, IContractorCertnDetails } from "../../../database/contractor/interface/contractor.interface";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { ICustomer } from "../../../database/customer/interface/customer.interface";
import CustomerModel from "../../../database/customer/models/customer.model";
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

                Logger.info(`JobSchedule Reminder: currentDate: ${currentDate} jobStartDate: ${jobStartDate} formattedJobStartDate: ${formattedJobStartDate} daysDifference: ${daysDifference} hourDifference: ${hourDifference}`);

                if (customer && contractor) {

                    
                    if (daysDifference <= -1) {
                        // if (!job.reminders.includes(JOB_SCHEDULE_REMINDER.NOT_STARTED)) {
                        //     sendReminderContractor(customer, contractor, job, `Your job with ${customer.name} scheduled for yesterday: ${formattedJobStartDate} was not started`);
                        //     job.status = JOB_STATUS.NOT_STARTED;
                        //     job.reminders.push(JOB_SCHEDULE_REMINDER.NOT_STARTED);
                        //     await job.save();
                        // }
                        // continue;
                    }



                    if (hourDifference <= 1) {
                        if (!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_1)) {
                            sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for today ${formattedJobStartDate}`);
                            sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for today ${formattedJobStartDate}`);
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_1);
                            await job.save();
                        }
                        continue;
                    }

                    if (hourDifference <= 6) {
                        if (!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_6)) {
                            sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for today ${formattedJobStartDate}`);
                            sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for today ${formattedJobStartDate}`);
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_6);
                            await job.save();
                        }
                        continue;

                    }

                    if (hourDifference <= 12) {
                        if (!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_12)) {
                            sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for today ${formattedJobStartDate}`);
                            sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for today ${formattedJobStartDate}`);
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_12);
                            await job.save();
                        }
                        continue;
                    }

                    if (hourDifference <= 24) {
                        if (!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_24)) {
                            sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for tomorrow ${formattedJobStartDate}`);
                            sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for tomorrow ${formattedJobStartDate}`);
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_24);
                            await job.save();
                        }
                        continue;
                    }

                    if (hourDifference <= 48) {
                        if (!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_48)) {
                            sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for ${formattedJobStartDate}`);
                            sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for ${formattedJobStartDate}`);
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_48);
                            await job.save();
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

function sendReminderContractor(customer: ICustomer, contractor: IContractor, job: IJob, message: string) {
    NotificationService.sendNotification({
        user: contractor.id,
        userType: 'contractors',
        title: 'Job Schedule Reminder',
        type: 'JOB_DAY_REMINDER',
        message: message,
        heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
        payload: {
            entity: job.id,
            entityType: 'jobs',
            message: message,
            contractor: contractor.id,
            event: 'JOB_DAY_REMINDER',
        }
    }, { push: true, socket: true });
}

function sendReminderCustomer(customer: ICustomer, contractor: IContractor, job: IJob, message: string) {
    NotificationService.sendNotification({
        user: customer.id,
        userType: 'customers',
        title: 'Job Schedule Reminder',
        type: 'JOB_DAY_REMINDER',
        message: message,
        heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
        payload: {
            entity: job.id,
            entityType: 'jobs',
            message: message,
            contractor: contractor.id,
            event: 'JOB_DAY_REMINDER',
        }
    }, { push: true, socket: true });
}
