import {EventEmitter} from 'events';
import { EmailService, NotificationService } from '../services';
import { htmlJobRequestTemplate } from '../templates/contractorEmail/jobRequestTemplate';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { JobModel } from '../database/common/job.model';
import { ConversationModel } from '../database/common/conversations.schema';
import { SocketService } from '../services/socket';

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
