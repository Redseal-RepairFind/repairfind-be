import { CertnService, NotificationService } from "../..";
import { IJob, JOB_STATUS, JobModel } from "../../../database/common/job.model";
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

                const customer = await CustomerModel.findById(job.customer)
                const contractor = await ContractorModel.findById(job.contractor)
        
                const currentDate = new Date();
                const jobStartDate = job.schedule.startDate;

                const timeDifference = jobStartDate.getTime() - currentDate.getTime();
                const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

                if(customer && contractor){
                    if (daysDifference <= 5) {
                        // Perform action for being close within 5 days
                        sendReminder(customer, contractor, job, `You have a job schedule for ${jobStartDate}`)
                    }

                    if (daysDifference <= 3) {
                        // Perform action for being close within 3 days
                        sendReminder(customer, contractor, job, `You have a job schedule for ${jobStartDate}`)
                    }

                    if (daysDifference <= 2) {
                        // Perform action for being close within 2 days
                        sendReminder(customer, contractor, job, `You have a job schedule in ${2} days time`)
                    }

                    if (daysDifference <= 1) {
                        // Perform action for being close within 1 day
                        sendReminder(customer, contractor, job, `You have a job scheduled for tommorow ${jobStartDate}`)
                    }
                    if (daysDifference == 0) {
                        // Perform action for being close within 1 day
                        sendReminder(customer, contractor, job, `You have a job scheduled for today ${currentDate}`)
                    }

                    if (daysDifference === -1) {
                        // Perform action for being 1 day after the job's start date
                        // Example: Send a follow-up or feedback request to gather post-job information
                        // const message = `Action needed: Your job with ID ${job.id} was scheduled to start yesterday. Please provide feedback on the completed job.`;
                        // Code to send the follow-up message or trigger the feedback request

                        sendReminder(customer, contractor, job, `Your job scheduled for yesterda: ${jobStartDate} was not started`)

                        // move job status to NOT_STARTED
                        job.status = JOB_STATUS.NOT_STARTED
                        await job.save()
                    }
                }

            } catch (error) {
                Logger.error(`Error sending job day reminder: ${job.id}`, error);
            }
        }
    } catch (error) {
        Logger.error('Error sending job day reminder:', error);
    }
};



function sendReminder(customer:ICustomer, contractor:IContractor, job: IJob, message: any){
    NotificationService.sendNotification({
        user: contractor.id,
        userType: 'contractors',
        title: 'Job Schedule Reminder',
        type: 'JOB_DAY_REMINDER', //
        message: message,
        heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
        payload: {
            entity: job.id,
            entityType: 'jobs',
            message: message,
            contractor: contractor.id,
            event: 'JOB_DAY_REMINDER',
        }
    }, { push: true, socket: true })

    // reminder to customer
    NotificationService.sendNotification({
        user: customer.id,
        userType: 'customers',
        title: 'Job Schedule Reminder',
        type: 'JOB_DAY_REMINDER', //
        message: message,
        heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
        payload: {
            entity: job.id,
            entityType: 'jobs',
            message: message,
            contractor: contractor.id,
            event: 'JOB_DAY_REMINDER',
        }
    }, {  push: true, socket: true })
}

