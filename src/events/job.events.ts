import {EventEmitter} from 'events';
import { EmailService, NotificationService } from '../services';
import { htmlJobRequestTemplate } from '../templates/contractorEmail/jobRequestTemplate';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { IJob, JobModel } from '../database/common/job.model';
import { ConversationModel } from '../database/common/conversations.schema';
import { SocketService } from '../services/socket';
import { IContractor } from '../database/contractor/interface/contractor.interface';
import { ICustomer } from '../database/customer/interface/customer.interface';
import { NewJobAssignedEmailTemplate } from '../templates/contractorEmail/job_assigned.template';
import { JobCanceledEmailTemplate } from '../templates/common/job_canceled.template';
import { IJobDay } from '../database/common/job_day.model';
import { IJobEmergency } from '../database/common/job_emergency.model';
import { JobEmergencyEmailTemplate } from '../templates/common/job_emergency_email';

export const JobEvent: EventEmitter = new EventEmitter();

JobEvent.on('NEW_JOB_REQUEST', async function (payload) {
    try {
        console.log('handling NEW_JOB_REQUEST event')
        
        const customer = await CustomerModel.findById(payload.customerId)
        const contractor = await ContractorModel.findById(payload.contractorId)
        const job = await JobModel.findById(payload.jobId)
        const conversation = await ConversationModel.findById(payload.conversationId)

        if(job && contractor && customer){
            
            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: 'New Job Request',
                type: 'Notification', //
                message: `You've received a job request from ${customer.firstName}`,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `You've received a job request from ${customer.firstName}`,
                    contractor: contractor.id,
                    event: 'NEW_JOB_REQUEST',
                }
            }, { database: true, push: true, socket: true })

            NotificationService.sendNotification({
                user: customer.id,
                userType: 'customers',
                title: 'New Job Request',
                type: 'Notification', // Conversation, Conversation_Notification
                //@ts-ignore
                message: `You've  sent a job request to ${contractor.name}`,
                //@ts-ignore
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    //@ts-ignore
                    message: `You've sent a job request to ${contractor.name}`,
                    customer: customer.id,
                    event: 'NEW_JOB_REQUEST',
                }
            }, { database: true, push: true, socket:true})

         }


    } catch (error) {
        console.error(`Error handling NEW_JOB_REQUEST event: ${error}`);
    }
});


JobEvent.on('NEW_JOB_LISTING', async function (payload) {
    try {
        console.log('handling alert NEW_JOB_LISTING event')
        const job = await JobModel.findById(payload.jobId)

        if(job){

            SocketService.broadcastChannel('alerts', 'NEW_JOB_LISTING', {
                type: 'NEW_JOB_LISTING', 
                message: 'A new Job listing has been added', 
                data: job
            });
          
         }


    } catch (error) {
        console.error(`Error handling NEW_JOB_REQUEST event: ${error}`);
    }
});

JobEvent.on('JOB_CANCELED', async function (payload: {job: IJob, canceledBy: string}) {
    try {
        console.log('handling alert JOB_CANCELED event')
        const customer = await CustomerModel.findById(payload.job.customer) as ICustomer
        const contractor = await ContractorModel.findById(payload.job.contractor) as IContractor
        
        if(payload.canceledBy == 'contractor'){
            console.log('job cancelled by contractor')

            if(customer){
                //send email to customer 
                const html = JobCanceledEmailTemplate({name: customer.name,   canceledBy: 'contractor',   job:payload.job})
                EmailService.send(customer.email, "Job Canceled", html)
            }
          

        }
        if(payload.canceledBy == 'customer'){
            console.log('job cancelled by customer')
            
            if(contractor){
                //send email to customer 
                const html = JobCanceledEmailTemplate({name: contractor.name,   canceledBy: 'customer',   job:payload.job})
                EmailService.send(contractor.email, "Job Canceled", html)
            }
        }

    } catch (error) {
        console.error(`Error handling JOB_CANCELED event: ${error}`);
    }
});

JobEvent.on('JOB_DAY_EMERGENCY', async function (payload: {jobEmergency: IJobEmergency}) {
    try {
        console.log('handling alert JOB_DAY_EMERGENCY event')

        // const [customer, contractor, job] = await Promise.all([
        //     CustomerModel.findById(payload.jobEmergency.customer).exec(),
        //     ContractorModel.findById(payload.jobEmergency.contractor).exec(),
        //     JobModel.findById(payload.jobEmergency.job).exec()
        // ])

        const customer = await CustomerModel.findById(payload.jobEmergency.customer) as ICustomer
        const contractor = await ContractorModel.findById(payload.jobEmergency.contractor) as IContractor
        const job = await JobModel.findById(payload.jobEmergency.job) as IJob


        if(job){
            if(payload.jobEmergency.triggeredBy == 'contractor'){
            console.log('job emergency triggered by contractor')
            if(customer){
                const html = JobEmergencyEmailTemplate({name: customer.name,  emergency: payload.jobEmergency, job})
                EmailService.send(customer.email, "Job Emergency", html)
            }
        }
        if(payload.jobEmergency.triggeredBy == 'customer'){
            console.log('job emergency triggered by customer')
            if(contractor){
                const html = JobEmergencyEmailTemplate({name: contractor.name,   emergency:payload.jobEmergency, job})
                EmailService.send(contractor.email, "Job Emergency", html)
            }
        }
        }
        

    } catch (error) {
        console.error(`Error handling JOB_DAY_EMERGENCY event: ${error}`);
    }
});
