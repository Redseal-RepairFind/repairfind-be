import { CertnService, NotificationService } from "../..";
import { IJob, JOB_SCHEDULE_REMINDER, JOB_STATUS, JobModel } from "../../../database/common/job.model";
import { IContractor, IContractorCertnDetails } from "../../../database/contractor/interface/contractor.interface";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { ICustomer } from "../../../database/customer/interface/customer.interface";
import CustomerModel from "../../../database/customer/models/customer.model";
import { Logger } from "../../logger";

export const jobNotStartedScheduleCheck = async () => {
    try {
        const jobs = await JobModel.find({
            status: { $in: ['BOOKED'] },
            revisitEnabled: false, // this is important so has not to move a disputed job with revisit enabled to not started
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
                        if (!job.reminders.includes(JOB_SCHEDULE_REMINDER.NOT_STARTED)) {
                            sendReminderContractor(customer, contractor, job, `Your job with ${customer.name} scheduled for yesterday: ${formattedJobStartDate} was not started`);
                            job.status = JOB_STATUS.NOT_STARTED;
                            job.reminders.push(JOB_SCHEDULE_REMINDER.NOT_STARTED);
                            await job.save();
                        }
                        continue;
                    }
                }

                Logger.info(`Processed job not started reminder: daysDifference: ${daysDifference} - JobId: ${job.id}`);
            } catch (error) {
                Logger.error(`Error sending job not started reminder for job ID ${job.id}:`, error);
            }
        }
    } catch (error) {
        Logger.error('Error fetching jobs for job day not started reminder:', error);
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