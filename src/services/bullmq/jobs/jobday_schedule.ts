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

                const customer = await CustomerModel.findById(job.customer)
                const contractor = await ContractorModel.findById(job.contractor)

                const currentDate = new Date();
                const jobStartDate = new Date(job.schedule.startDate);

                const timeDifference = jobStartDate.getTime() - currentDate.getTime();
                const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                const hourDifference = Math.ceil(timeDifference / (1000 * 60 * 60));
                const minuteDifference = Math.ceil(timeDifference / (1000 * 60));


                // Determine whether the job start time is in AM or PM format
                // Function to get the 12-hour formatted time with AM/PM
                const get12HourFormat = (jobStartDate:any) => {
                    const hours = jobStartDate.getHours();
                    const period = hours >= 12 ? 'PM' : 'AM';
                    const formattedHours = hours % 12 || 12;
                    const minutes = String(jobStartDate.getMinutes()).padStart(2, '0');
                    return `${formattedHours}:${minutes} ${period}`;
                };
                // Get the job start date in the desired format
                const formattedJobStartDate = `${jobStartDate.toDateString()} at ${get12HourFormat(jobStartDate)}`;



                console.log(`${0} jobStartDate you have a bla bla: ${formattedJobStartDate}`,  daysDifference, hourDifference, currentDate, jobStartDate )



                if (customer && contractor) {

                    if (daysDifference === -1) {
                        if(!job.reminders.includes(JOB_SCHEDULE_REMINDER.NOT_STARTED)){
                            sendReminderContractor(customer, contractor, job, `Your job with ${customer.name} scheduled for yesterday: ${jobStartDate} was not started`)
                            job.status = JOB_STATUS.NOT_STARTED
                            job.reminders.push(JOB_SCHEDULE_REMINDER.NOT_STARTED) 
                            // job.save()
                        }
                    }
                    

                    //
                    if (hourDifference <= 1 ) {
                        if(!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_1)){
                             sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for today ${formattedJobStartDate}`)
                             sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for today ${formattedJobStartDate}`)
                             job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_1) 
                            // job.save() 
                            continue
                        }
                     }

                     

                    if (hourDifference <= 6 ) {
                       if(!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_6)){
                            sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for today ${formattedJobStartDate}`)
                            sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for today ${formattedJobStartDate}`)
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_6) 
                            // job.save() 
                            continue
                       }
                    }

                    if (hourDifference <= 12) {
                        if(!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_12)){
                            sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for today ${formattedJobStartDate}`)
                            sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for today ${formattedJobStartDate}`)
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_12) 
                            // job.save() 
                            continue
                       }
                    }

                    if (hourDifference <= 24) {
                        if(!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_24)){
                            sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for tomorrow ${jobStartDate.toDateString()}`)
                            sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for tomorrow ${jobStartDate.toDateString()}`)
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_24) 
                            // job.save() 
                            continue
                        }
                        
                    }

                    if (daysDifference <= 48) {
                        if(!job.reminders.includes(JOB_SCHEDULE_REMINDER.HOURS_48)){
                            sendReminderContractor(customer, contractor, job, `You have a job with ${customer.name} scheduled for ${jobStartDate.toDateString()}`)
                            sendReminderCustomer(customer, contractor, job, `You have a job with ${contractor.name} scheduled for  ${formattedJobStartDate}`) 
                            job.reminders.push(JOB_SCHEDULE_REMINDER.HOURS_48) 
                            // job.save() 
                            continue
                        }                       
                    }
                    
                }

                await job.save()

            } catch (error) {
                Logger.error(`Error sending job day reminder: ${job.id}`, error);
            }
        }
    } catch (error) {
        Logger.error('Error sending job day reminder:', error);
    }
};



function sendReminderContractor(customer: ICustomer, contractor: IContractor, job: IJob, message: any) {
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
}


function sendReminderCustomer(customer: ICustomer, contractor: IContractor, job: IJob, message: any) {
    
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
    }, { push: true, socket: true })
}

