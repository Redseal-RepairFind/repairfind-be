import { EventEmitter } from 'events';
import { EmailService, NotificationService } from '../services';
import { htmlJobRequestTemplate } from '../templates/contractor/jobRequestTemplate';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { IJob, JOB_SCHEDULE_TYPE, JOB_STATUS, JobModel } from '../database/common/job.model';
import { ConversationModel } from '../database/common/conversations.schema';
import { SocketService } from '../services/socket';
import { IContractor } from '../database/contractor/interface/contractor.interface';
import { ICustomer } from '../database/customer/interface/customer.interface';
import { NewJobAssignedEmailTemplate } from '../templates/contractor/job_assigned.template';
import { JobCanceledEmailTemplate } from '../templates/common/job_canceled.template';
import { IJobDay, JobDayModel } from '../database/common/job_day.model';
import { IJobEmergency } from '../database/common/job_emergency.model';
import { JobEmergencyEmailTemplate } from '../templates/common/job_emergency_email';
import { GenericEmailTemplate } from '../templates/common/generic_email';
import { IJobDispute } from '../database/common/job_dispute.model';
import { IExtraEstimate, IJobQuotation, JobQuotationModel } from '../database/common/job_quotation.model';
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../database/common/transaction.model';
import { ObjectId } from 'mongoose';
import { sendPushNotifications } from '../services/expo';
import { ContractorProfileModel } from '../database/contractor/models/contractor_profile.model';
import { profile } from 'console';
import ContractorDeviceModel from '../database/contractor/models/contractor_devices.model';
import ContractorSavedJobModel from '../database/contractor/models/contractor_saved_job.model';
import { IJobEnquiry, JobEnquiryModel } from '../database/common/job_enquiry.model';
import { Logger } from '../services/logger';

export const JobEvent: EventEmitter = new EventEmitter();

JobEvent.on('NEW_JOB_REQUEST', async function (payload) {
    try {
        Logger.info('handling NEW_JOB_REQUEST event')

        const customer = await CustomerModel.findById(payload.customerId)
        const contractor = await ContractorModel.findById(payload.contractorId)
        const job = await JobModel.findById(payload.jobId)
        const conversation = await ConversationModel.findById(payload.conversationId)

        if (job && contractor && customer) {

            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: 'New Job Request',
                type: 'NEW_JOB_REQUEST', //
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
                type: 'NEW_JOB_REQUEST', // Conversation, Conversation_Notification
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
            }, { database: true, push: true, socket: true })

        }


    } catch (error) {
        Logger.error(`Error handling NEW_JOB_REQUEST event: ${error}`);
    }
});



JobEvent.on('JOB_REQUEST_ACCEPTED', async function (payload) {
    try {
        Logger.info('handling JOB_REQUEST_ACCEPTED event')

        const customer = await CustomerModel.findById(payload.job.customer)
        const contractor = await ContractorModel.findById(payload.job.contractor)
        const job = payload.job

        if (job && contractor && customer) {

            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: 'New Job Request',
                type: 'JOB_REQUEST_ACCEPTED', //
                message: `You've accepted a job request from ${customer.firstName}`,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `You've accepted a job request from ${customer.firstName}`,
                    contractor: contractor.id,
                    event: 'JOB_REQUEST_ACCEPTED',
                }
            }, { push: true, socket: true })

            NotificationService.sendNotification({
                user: customer.id,
                userType: 'customers',
                title: 'New Job Request',
                type: 'JOB_REQUEST_ACCEPTED',
                message: `Contractor has accepted your job request`,
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `Contractor has accepted your job request`,
                    customer: customer.id,
                    event: 'JOB_REQUEST_ACCEPTED',
                }
            }, { database: true, push: true, socket: true })

        }


    } catch (error) {
        Logger.error(`Error handling JOB_REQUEST_ACCEPTED event: ${error}`);
    }
});


JobEvent.on('JOB_REQUEST_REJECTED', async function (payload) {
    try {
        Logger.info('handling JOB_REQUEST_REJECTED event')

        const customer = await CustomerModel.findById(payload.job.customer)
        const contractor = await ContractorModel.findById(payload.job.contractor)
        const job = payload.job

        if (job && contractor && customer) {

            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: 'New Job Request',
                type: 'JOB_REQUEST_ACCEPTED', //
                message: `You've rejected a job request from ${customer.firstName}`,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `You've rejected a job request from ${customer.firstName}`,
                    contractor: contractor.id,
                    event: 'JOB_REQUEST_ACCEPTED',
                }
            }, { push: true, socket: true })

            NotificationService.sendNotification({
                user: customer.id,
                userType: 'customers',
                title: 'New Job Request',
                type: 'JOB_REQUEST_ACCEPTED',
                message: `Contractor has rejected your job request`,
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `Contractor has rejected your job request`,
                    customer: customer.id,
                    event: 'JOB_REQUEST_ACCEPTED',
                }
            }, { database: true, push: true, socket: true })

        }


    } catch (error) {
        Logger.error(`Error handling JOB_REQUEST_REJECTED event: ${error}`);
    }
});


JobEvent.on('NEW_JOB_LISTING', async function (payload) {
    try {
        Logger.info('handling alert NEW_JOB_LISTING event')
        const job = await JobModel.findById(payload.jobId)

        if (job) {

            SocketService.broadcastChannel('alerts', 'NEW_JOB_LISTING', {
                type: 'NEW_JOB_LISTING',
                message: 'A new Job listing has been added',
                data: job
            });

            // send push to all contractors that match the job ?
            const contractorProfiles = await ContractorProfileModel.find({ skill: job.category });
            const contractorIds = contractorProfiles.map(profile => profile.contractor);

            const devices = await ContractorDeviceModel.find({ contractor: { $in: contractorIds } })
            const deviceTokens = devices.map(device => device.deviceToken);

            sendPushNotifications(deviceTokens, {
                title: 'New job listing',
                type: 'NEW_JOB_LISTING',
                icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                body: 'There is a new job listing  that match your profile',
                data: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `There is a new job listing  that match your profile`,
                    event: 'NEW_JOB_LISTING',
                }
            })

        }


    } catch (error) {
        Logger.error(`Error handling NEW_JOB_REQUEST event: ${error}`);
    }
});



JobEvent.on('JOB_CANCELED', async function (payload: { job: IJob, canceledBy: string }) {
    try {
        Logger.info('handling alert JOB_CANCELED event')
        const customer = await CustomerModel.findById(payload.job.customer) as ICustomer
        const contractor = await ContractorModel.findById(payload.job.contractor) as IContractor
        const job = payload.job

        if (!customer || !contractor || !job || !payload.canceledBy) return

        if (payload.canceledBy == 'contractor') {
            Logger.info('job cancelled by contractor')
            const html = JobCanceledEmailTemplate({ name: customer.name, canceledBy: payload.canceledBy, job: payload.job })
            EmailService.send(customer.email, "Job Canceled", html)
        }
        if (payload.canceledBy == 'customer') {
            Logger.info('job cancelled by customer')
            const html = JobCanceledEmailTemplate({ name: contractor.name, canceledBy: 'customer', job: payload.job })
            EmailService.send(contractor.email, "Job Canceled", html)
           
        }

        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: 'Job Canceled',
            type: 'JOB_CANCELED', //
            message: `Your job on Repairfind has been canceled`,
            heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `Your job on Repairfind has been canceled`,
                customer: customer.id,
                event: 'JOB_CANCELED',
            }
        }, { push: true, socket: true, database: true })


        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: 'Job Canceled',
            type: 'JOB_CANCELED', //
            message: `Your job on Repairfind has been canceled`,
            heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `Your job on Repairfind has been canceled`,
                customer: customer.id,
                event: 'JOB_CANCELED',
            }
        }, { push: true, socket: true, database: true })

    } catch (error) {
        Logger.error(`Error handling JOB_CANCELED event: ${error}`);
    }
});



JobEvent.on('JOB_DISPUTE_REFUND_CREATED', async function (payload: { job: IJob, dispute: IJobDispute }) {
    try {
        Logger.info('handling alert JOB_DISPUTE_REFUND_CREATED event')
        const job = payload.job
        const dispute = payload.dispute
        const customer = await CustomerModel.findById(payload.job.customer) as ICustomer
        const contractor = await ContractorModel.findById(payload.job.contractor) as IContractor


        if (job && contractor && customer) {

            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: 'Job Dispute Refund Created',
                type: 'JOB_DISPUTE_REFUND_CREATED', //
                message: `Full refund of your disputed job has been approved  on Repairfind`,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: dispute.id,
                    entityType: 'job_disputes',
                    message: `Full refund of your disputed job has been approved  on Repairfind`,
                    contractor: contractor.id,
                    event: 'JOB_DISPUTE_REFUND_CREATED',
                }
            }, { push: true, socket: true, database: true })

            NotificationService.sendNotification({
                user: customer.id,
                userType: 'customers',
                title: 'Job Dispute Refund Created',
                type: 'JOB_DISPUTE_REFUND_CREATED',
                message: `Full refund of your disputed job has been approved  on Repairfind`,
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: dispute.id,
                    entityType: 'job_disputes',
                    message: `Full refund of your disputed job has been approved  on Repairfind`,
                    customer: customer.id,
                    event: 'JOB_DISPUTE_REFUND_CREATED',
                }
            }, { database: true, push: true, socket: true })

        }



    } catch (error) {
        Logger.error(`Error handling JOB_DISPUTE_REFUND_CREATED event: ${error}`);
    }
});


JobEvent.on('JOB_QUOTATION_DECLINED', async function (payload: { jobId: ObjectId, contractorId: ObjectId, customerId: ObjectId, reason: string }) {
    try {

        Logger.info('handling alert JOB_QUOTATION_DECLINED event')

        const customer = await CustomerModel.findById(payload.customerId) as ICustomer
        const contractor = await ContractorModel.findById(payload.contractorId) as IContractor
        const job = await JobModel.findById(payload.jobId) as IJob

        if (contractor) {
            let emailSubject = 'Job Quotation Decline'
            let emailContent = `
                <p style="color: #333333;">Your job  quotation for a job  on RepairFind was declined.</p>
                <p>
                    <strong>Job Title:</strong> ${job.title} </br>
                    <strong>Customer:</strong> ${customer.name} </br>
                    <strong>Reason:</strong> ${payload.reason}  </br>
                </p>
              
                <p>Login to our app to follow up </p>
                `
            let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
            EmailService.send(contractor.email, emailSubject, html)


            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: 'Job quotation declined',
                type: 'JOB_QUOTATION_DECLINED', // Conversation, Conversation_Notification
                message: `Your job quotation for a job on RepairFind was declined`,
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `Your job quotation for a job  on RepairFind was declined`,
                    customer: customer.id,
                    event: 'JOB_QUOTATION_DECLINED',
                }
            }, { push: true, socket: true })

        }




    } catch (error) {
        Logger.error(`Error handling JOB_QUOTATION_DECLINED event: ${error}`);
    }
});



JobEvent.on('JOB_QUOTATION_ACCEPTED', async function (payload: { jobId: ObjectId, contractorId: ObjectId, customerId: ObjectId, reason: string }) {
    try {

        Logger.info('handling alert JOB_QUOTATION_ACCEPTED event')

        const customer = await CustomerModel.findById(payload.customerId) as ICustomer
        const contractor = await ContractorModel.findById(payload.contractorId) as IContractor
        const job = await JobModel.findById(payload.jobId) as IJob

        if (contractor) {
            let emailSubject = 'Job Quotation Accepted'
            let emailContent = `
                <p style="color: #333333;">Congratulations! your job quotation for a job  on RepairFind was accepted.</p>
                <p>
                    <strong>Job Title:</strong> ${job.title} </br>
                    <strong>Customer:</strong> ${customer.name} </br>
                </p>
              
                <p>Login to our app to follow up </p>
                `
            // <strong>Job date:</strong> ${new Date(job.date).toDateString()}  </br>

            let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
            EmailService.send(contractor.email, emailSubject, html)


            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: 'Job quotation accepted',
                type: 'JOB_QUOTATION_ACCEPTED', // Conversation, Conversation_Notification
                message: `Your  quotation for a job on RepairFind was accepted`,
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `Your job quotation for a job  on RepairFind was accepted`,
                    customer: customer.id,
                    event: 'JOB_QUOTATION_ACCEPTED',
                }
            }, { push: true, socket: true })

        }

    } catch (error) {
        Logger.error(`Error handling JOB_QUOTATION_ACCEPTED event: ${error}`);
    }
});



JobEvent.on('JOB_DAY_EMERGENCY', async function (payload: { jobEmergency: IJobEmergency }) {
    try {
        Logger.info('handling alert JOB_DAY_EMERGENCY event')
        const customer = await CustomerModel.findById(payload.jobEmergency.customer)
        const contractor = await ContractorModel.findById(payload.jobEmergency.contractor)
        const job = await JobModel.findById(payload.jobEmergency.job) as IJob


        if (job && contractor && customer) {
            if (payload.jobEmergency.triggeredBy == 'contractor') {
                Logger.info('job emergency triggered by contractor')
                // if (customer) {
                //     const html = JobEmergencyEmailTemplate({ name: customer.name, emergency: payload.jobEmergency, job })
                //     EmailService.send(customer.email, "Job Emergency", html)
                // }
            }
            if (payload.jobEmergency.triggeredBy == 'customer') {
                Logger.info('job emergency triggered by customer')
                // if (contractor) {
                //     const html = JobEmergencyEmailTemplate({ name: contractor.name, emergency: payload.jobEmergency, job })
                //     EmailService.send(contractor.email, "Job Emergency", html)
                // }
            }

            // send socket notification to general admins alert channel
            SocketService.broadcastChannel('admin_alerts', 'NEW_JOB_EMERGENCY', {
                type: 'NEW_JOB_EMERGENCY',
                message: 'A new Job emergency has been reported',
                data: { emergency: payload.jobEmergency, job, customer: customer.toJSON(), contractor: contractor.toJSON() }
            });

        }


    } catch (error) {
        Logger.error(`Error handling JOB_DAY_EMERGENCY event: ${error}`);
    }
});


JobEvent.on('JOB_RESCHEDULE_DECLINED_ACCEPTED', async function (payload: { job: IJob, action: string }) {
    try {
        Logger.info('handling alert JOB_RESCHEDULE_DECLINED_ACCEPTED event', payload.action)

        const customer = await CustomerModel.findById(payload.job.customer)
        const contractor = await ContractorModel.findById(payload.job.contractor)
        const job = payload.job
        const event = payload.action == 'accepted' ? 'JOB_RESCHEDULE_ACCEPTED' : 'JOB_RESCHEDULE_DECLINED'

        if (contractor && customer) {
            if (payload.job.reschedule?.createdBy == 'contractor') { // send mail to contractor
                let emailSubject = 'Job Reschedule Request'
                let emailContent = `
                <p style="color: #333333;">Your Job reschedule request on Repairfind has been ${payload.action} by customer</p>
                <p><strong>Job Title:</strong> ${payload.job.description}</p>
                <p><strong>Proposed Date:</strong> ${payload.job.reschedule.date}</p>
                `
                let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
                EmailService.send(contractor.email, emailSubject, html)

                NotificationService.sendNotification({
                    user: customer.id,
                    userType: 'customers',
                    title: `Job Reschedule Request ${payload.action}`,
                    type: event,
                    message: `Your Job reschedule request on Repairfind has been ${payload.action} by customer`,
                    heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                    payload: {
                        entity: job.id,
                        entityType: 'jobs',
                        message: `Your Job reschedule request on Repairfind has been ${payload.action} by customer`,
                        customer: customer.id,
                        contractor: contractor.id,
                        event: event,
                    }
                }, { push: true, socket: true, database: true })


            }
            if (payload.job.reschedule?.createdBy == 'customer') { // send mail to  customer
                let emailSubject = 'Job Reschedule Request'
                let emailContent = `
                <p style="color: #333333;">Your Job reschedule request on Repairfind has been ${payload.action}  by the contractor</p>
                <p><strong>Job Title:</strong> ${payload.job.description}</p>
                <p><strong>Proposed Date:</strong> ${payload.job.reschedule.date}</p>
                `
                let html = GenericEmailTemplate({ name: customer.name, subject: emailSubject, content: emailContent })
                EmailService.send(customer.email, emailSubject, html)


                NotificationService.sendNotification({
                    user: contractor.id,
                    userType: 'contractors',
                    title: `Job Reschedule Request ${payload.action}`,
                    type: event, //
                    message: `Your Job reschedule request on Repairfind has been ${payload.action} by customer`,
                    heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                    payload: {
                        entity: job.id,
                        entityType: 'jobs',
                        message: `Your Job reschedule request on Repairfind has been ${payload.action} by customer`,
                        contractor: contractor.id,
                        customer: customer.id,
                        event: event,
                    }
                }, { push: true, socket: true, database: true })


            }

        }


    } catch (error) {
        Logger.error(`Error handling JOB_RESCHEDULE_DECLINED_ACCEPTED event: ${error}`);
    }
});


JobEvent.on('NEW_JOB_RESCHEDULE_REQUEST', async function (payload: { job: IJob, action: string }) {
    try {
        Logger.info('handling alert NEW_JOB_RESCHEDULE_REQUEST event', payload.action)

        const customer = await CustomerModel.findById(payload.job.customer)
        const contractor = await ContractorModel.findById(payload.job.contractor)
        const job = payload.job

        if (contractor && customer) {
            if (payload.job.reschedule?.createdBy == 'contractor') { // send mail to contractor
                let emailSubject = 'Job Schedule'
                let emailContent = `
                <p style="color: #333333;">Contractor has requested  to reschedule a job on RepairFind</p>
                <p><strong>Job Title:</strong> ${payload.job.description}</p>
                <p><strong>Proposed Date:</strong> ${payload.job.reschedule.date}</p>
                `
                let html = GenericEmailTemplate({ name: customer.name, subject: emailSubject, content: emailContent })
                EmailService.send(customer.email, emailSubject, html)


                NotificationService.sendNotification({
                    user: customer.id,
                    userType: 'customers',
                    title: 'Job Reschedule Request',
                    type: 'NEW_JOB_RESCHEDULE_REQUEST', // Conversation, Conversation_Notification
                    message: `Contractor has requested  to reschedule a job on RepairFind`,
                    heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                    payload: {
                        entity: job.id,
                        entityType: 'jobs',
                        message: `Contractor has requested  to reschedule a job on RepairFind`,
                        customer: customer.id,
                        contractor: contractor.id,
                        event: 'NEW_JOB_RESCHEDULE_REQUEST',
                    }
                }, { push: true, socket: true, database: true })

            }
            if (payload.job.reschedule?.createdBy == 'customer') { // send mail to  customer
                let emailSubject = 'Job Schedule'
                let emailContent = `
                <p style="color: #333333;">Customer has requested  to reschedule a job on RepairFind</p>
                <p><strong>Job Title:</strong> ${payload.job.description}</p>
                <p><strong>Proposed Date:</strong> ${payload.job.reschedule.date}</p>
                `
                let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
                EmailService.send(contractor.email, emailSubject, html)

                NotificationService.sendNotification({
                    user: contractor.id,
                    userType: 'contractors',
                    title: 'Job Booked',
                    type: 'NEW_JOB_RESCHEDULE_REQUEST', //
                    message: `Customer has requested to reschedule your job on RepairFind`,
                    heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                    payload: {
                        entity: job.id,
                        entityType: 'jobs',
                        message: `Customer has requested to reschedule your job on RepairFind`,
                        contractor: contractor.id,
                        customer: customer.id,
                        event: 'NEW_JOB_RESCHEDULE_REQUEST',
                    }
                }, { push: true, socket: true, database: true })

            }

        }


    } catch (error) {
        Logger.error(`Error handling NEW_JOB_RESCHEDULE_REQUEST event: ${error}`);
    }
});


JobEvent.on('JOB_BOOKED', async function (payload: { jobId: ObjectId, contractorId: ObjectId, customerId: ObjectId, quotationId: ObjectId, paymentType: string }) {
    try {
        Logger.info('handling alert JOB_BOOKED event')

        const customer = await CustomerModel.findById(payload.customerId)
        const contractor = await ContractorModel.findById(payload.contractorId)
        const job = await JobModel.findById(payload.jobId)
        const quotation = await JobQuotationModel.findById(payload.quotationId)


        if (job && contractor && customer && quotation) {
            const charges = await quotation.calculateCharges();

            if (contractor) { // send mail to contractor
                let emailSubject = 'Job Payment'
                let emailContent = `
                <p style="color: #333333;">Customer has made payment for your estimate on RepairFind</p>
                <p><strong>Job Title:</strong> ${job.description}</p>
                <p><strong>Proposed Date:</strong> ${job.date}</p>
                <p style="color: #333333;">Kindly open the App for more information</p>
\                `
                let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
                EmailService.send(contractor.email, emailSubject, html)

            }
            if (customer) { // send mail to  customer
                let emailSubject = 'Job Payment'
                let emailContent = `
                <p style="color: #333333;">You have made payment for a job on RepairFind</p>
                <p><strong>Job Title:</strong> ${job.description}</p>
                <p><strong>Proposed Date:</strong> ${job.date}</p>
                <p style="color: #333333;">If you did not initiate this payment, kindly reach out to us via support</p>
                `
                let html = GenericEmailTemplate({ name: customer.name, subject: emailSubject, content: emailContent })
                EmailService.send(customer.email, emailSubject, html)
            }


            NotificationService.sendNotification({
                user: customer.id,
                userType: 'customers',
                title: 'Job Booked',
                type: 'JOB_BOOKED', // Conversation, Conversation_Notification
                message: `You have booked a job on Repairfind`,
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `You have booked a job`,
                    customer: customer.id,
                    contractor: contractor.id,
                    event: 'JOB_BOOKED',
                }
            }, { push: true, socket: true, database: true })


            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: 'Job Booked',
                type: 'JOB_BOOKED', //
                message: `You have a booked job on Repairfind`,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `You have a booked job`,
                    contractor: contractor.id,
                    customer: customer.id,
                    event: 'JOB_BOOKED',
                }
            }, { push: true, socket: true, database: true })

        }


    } catch (error) {
        Logger.error(`Error handling JOB_BOOKED event: ${error}`);
    }
});


JobEvent.on('JOB_DISPUTE_CREATED', async function (payload: { dispute: IJobDispute }) {
    try {
        Logger.info('handling alert JOB_DISPUTE_CREATED event', payload.dispute)

        const dispute = payload.dispute
        const job = await JobModel.findById(dispute.job)
        if (!job) {
            return
        }

        const customer = await CustomerModel.findById(job.customer)
        const contractor = await ContractorModel.findById(job.contractor)

        if (!customer || !contractor) return


        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: 'Job Disputed',
            type: 'JOB_DISPUTED',
            message: `You have an open job dispute`,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `You have an open job dispute`,
                customer: customer.id,
                event: 'JOB_DISPUTED',
            }
        }, { database: true, push: true, socket: true })


        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: 'Job Disputed',
            type: 'JOB_DISPUTED', //
            message: `You have an open job dispute`,
            heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `You have an open job dispute`,
                contractor: contractor.id,
                event: 'JOB_DISPUTED',
            }
        }, { database: true, push: true, socket: true })

        // if (job.isAssigned) {
        //     NotificationService.sendNotification({
        //         user: job.assignment.contractor,
        //         userType: 'contractors',
        //         title: 'Job Disputed',
        //         type: 'JOB_DISPUTED', //
        //         message: `You have an open job dispute`,
        //         heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
        //         payload: {
        //             entity: dispute.id,
        //             entityType: 'job_disputes',
        //             message: `You have an open job dispute`,
        //             contractor: contractor.id,
        //             event: 'JOB_DISPUTED',
        //         }
        //     }, { database: true, push: true, socket: true })
        // }

        // send socket notification to general admins alert channel
        SocketService.broadcastChannel('admin_alerts', 'NEW_DISPUTED_JOB', {
            type: 'NEW_DISPUTED_JOB',
            message: 'A new Job dispute has been reported',
            data: { dispute }
        });



    } catch (error) {
        Logger.error(`Error handling JOB_DISPUTE_CREATED event: ${error}`);
    }
});



JobEvent.on('JOB_MARKED_COMPLETE_BY_CONTRACTOR', async function (payload: { job: IJob }) {
    try {
        Logger.info('handling alert JOB_MARKED_COMPLETE_BY_CONTRACTOR event', payload.job.id)
        const job = await JobModel.findById(payload.job.id)

        if (!job) {
            return
        }


        const customer = await CustomerModel.findById(job.customer)
        const contractor = await ContractorModel.findById(job.contractor)

        if (!customer || !contractor) return


        const event = (job.schedule.type == JOB_SCHEDULE_TYPE.SITE_VISIT) ? 'SITE_VISIT_MARKED_COMPLETE' : 'JOB_MARKED_COMPLETE'

        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: 'Job Marked Complete',
            type: event,
            message: `Contractor has marked job has completed`,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `Contractor has marked job has completed`,
                event: event,
            }
        }, { database: true, push: true, socket: true })

        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: 'Job Marked Complete',
            type: event,
            message: `Job marked as completed`,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `Job marked as completed`,
                event: event,
            }
        }, { database: true, push: true, socket: true })



        if (job.isAssigned) {
            NotificationService.sendNotification({
                user: job.assignment.contractor,
                userType: 'contractors',
                title: 'Job Marked Complete',
                type: event, //
                message: `Job marked as completed`,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `Job marked as completed`,
                    contractor: contractor.id,
                    event: event,
                }
            }, { push: true, socket: true })
        }


    } catch (error) {
        Logger.error(`Error handling JOB_MARKED_COMPLETE_BY_CONTRACTOR event: ${error}`);
    }
});


JobEvent.on('JOB_COMPLETED', async function (payload: { job: IJob }) {
    try {
        Logger.info('handling alert JOB_COMPLETED event', payload.job.id)

        const job = await JobModel.findById(payload.job.id)

        if (!job) {
            return
        }


        const customer = await CustomerModel.findById(job.customer)
        const contractor = await ContractorModel.findById(job.contractor)
        const event = (job.schedule.type == JOB_SCHEDULE_TYPE.SITE_VISIT) ? 'COMPLETED_SITE_VISIT' : 'JOB_COMPLETED'

        if (!customer || !contractor) return

        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: 'Job Completed',
            type: event, //
            message: `Job completion confirmed by customer`,
            heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `Job completion confirmed by customer`,
                contractor: contractor.id,
                event: event,
            }
        }, { push: true, socket: true, database: true })


        // if (job.isAssigned) {
        //     NotificationService.sendNotification({
        //         user: job.assignment.contractor,
        //         userType: 'contractors',
        //         title: 'Job Completed',
        //         type: event,
        //         message: `Job completion confirmed by customer`,
        //         heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
        //         payload: {
        //             entity: job.id,
        //             entityType: 'jobs',
        //             message: `Job completion confirmed by customer`,
        //             contractor: contractor.id,
        //             event: event,
        //         }
        //     }, { push: true, socket: true })
        // }

        //approve payout here - change status to approved and use  cron jobs to schedule the transfer
        const transaction = await TransactionModel.findOne({ job: job.id, type: TRANSACTION_TYPE.ESCROW })
        if (transaction) {
            transaction.status = TRANSACTION_STATUS.APPROVED
            const metadata = transaction.metadata ?? {}
            transaction.metadata = { ...metadata, event }
            transaction.save()
        }

    } catch (error) {
        Logger.error(`Error handling JOB_COMPLETED event: ${error}`);
    }
});


JobEvent.on('JOB_CHANGE_ORDER', async function (payload: { job: IJob }) {
    try {
        Logger.info('handling JOB_CHANGE_ORDER event', payload.job.id)

        const job = await JobModel.findById(payload.job.id)

        if (!job) {
            return
        }

        const jobDay = await JobDayModel.findOne({ job: job.id })
        const customer = await CustomerModel.findById(job.customer)
        const contractor = await ContractorModel.findById(job.contractor)

        if (!customer || !contractor) return

        const state = job.isChangeOrder ? 'enabled' : 'disabled'
        const event = job.isChangeOrder ? 'JOB_CHANGE_ORDER_ENABLED' : 'JOB_CHANGE_ORDER_DISABLED'

        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: 'Job Completed',
            type: event, //
            message: `Change order is ${state} for your job`,
            heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                jobId: job.id,
                jobDayId: jobDay?.id,
                message: `Change order is ${state} for your job`,
                event: event,
            }
        }, { push: true, socket: true, database: true })


        // if (job.isAssigned) {
        //     NotificationService.sendNotification({
        //         user: job.assignment.contractor,
        //         userType: 'contractors',
        //         title: 'Job Completed',
        //         type: event, //
        //         message: `Change order is ${state}`,
        //         heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
        //         payload: {
        //             entity: job.id,
        //             entityType: 'jobs',
        //             message: `Change order is ${state}`,
        //             event: event,
        //         }
        //     }, { push: true, socket: true })
        // }



    } catch (error) {
        Logger.error(`Error handling JOB_CHANGE_ORDER event: ${error}`);
    }
});


JobEvent.on('SITE_VISIT_ESTIMATE_SUBMITTED', async function (payload: { job: IJob, quotation: IJobQuotation }) {
    try {
        Logger.info('handling SITE_VISIT_ESTIMATE_SUBMITTED event', payload.job.id)

        const job = await JobModel.findById(payload.job.id)
        const quotation = payload.quotation
        if (!job) {
            return
        }

        const customer = await CustomerModel.findById(job.customer)
        const contractor = await ContractorModel.findById(job.contractor)

        if (!customer || !contractor) return

        const jobDay = await JobDayModel.findOne({ job: job.id })

        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: 'Job Completed',
            type: 'SITE_VISIT_ESTIMATE_SUBMITTED', //
            message: `Site visit estimate has been submitted`,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `Site visit estimate has been submitted`,
                customer: customer.id,
                event: 'SITE_VISIT_ESTIMATE_SUBMITTED',
                jobDayId: jobDay?.id,
                jobId: job.id,
                quotationId: quotation.id,
            }
        }, { push: true, socket: true, database: true })

        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: 'Job Completed',
            type: 'SITE_VISIT_ESTIMATE_SUBMITTED', //
            message: `Site visit estimate has been submitted`,
            heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `Site visit estimate has been submitted`,
                customer: customer.id,
                event: 'SITE_VISIT_ESTIMATE_SUBMITTED',
                jobDayId: jobDay?.id,
                jobId: job.id,
                quotationId: quotation.id,
            }
        }, { push: true, socket: true, database: true })


    } catch (error) {
        Logger.error(`Error handling SITE_VISIT_ESTIMATE_SUBMITTED event: ${error}`);
    }
});



JobEvent.on('CHANGE_ORDER_ESTIMATE_SUBMITTED', async function (payload: { job: IJob, quotation: IJobQuotation }) {
    try {
        Logger.info('handling CHANGE_ORDER_ESTIMATE_SUBMITTED event', payload.job.id)

        const job = await JobModel.findById(payload.job.id)
        const quotation = payload.quotation

        if (!job) {
            return
        }

        const customer = await CustomerModel.findById(job.customer)
        const contractor = await ContractorModel.findById(job.contractor)

        if (!customer || !contractor) return

        const jobDay = await JobDayModel.findOne({ job: job.id })

        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: 'Change order estimate submitted',
            type: 'CHANGE_ORDER_ESTIMATE_SUBMITTED', //
            message: `Change order estimate has been submitted`,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `Change order estimate has been submitted`,
                customer: customer.id,
                event: 'CHANGE_ORDER_ESTIMATE_SUBMITTED',
                jobDayId: jobDay?.id,
                jobId: job.id,
                quotationId: quotation.id
            }
        }, { push: true, socket: true, database: true })


        // if (job.isAssigned) {
        //     NotificationService.sendNotification({
        //         user: contractor.id,
        //         userType: 'contractors',
        //         title: 'Change order estimate submitted',
        //         type: 'CHANGE_ORDER_ESTIMATE_SUBMITTED', //
        //         message: `Change order estimate has been submitted`,
        //         heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
        //         payload: {
        //             entity: job.id,
        //             entityType: 'jobs',
        //             message: `Change order estimate has been submitted`,
        //             customer: customer.id,
        //             event: 'CHANGE_ORDER_ESTIMATE_SUBMITTED',
        //             jobDayId: jobDay?.id,
        //             jobId: job.id,
        //             extraEstimate: payload.quotation
        //         }
        //     }, { push: true, socket: true })
        // }




    } catch (error) {
        Logger.error(`Error handling CHANGE_ORDER_ESTIMATE_SUBMITTED event: ${error}`);
    }
});



JobEvent.on('NEW_JOB_QUOTATION', async function (payload: { job: IJob, quotation: IJobQuotation }) {
    try {
        Logger.info('handling NEW_JOB_QUOTATION event', payload.job.id)
        const job = payload.job
        const quotation = payload.quotation
        const customer = await CustomerModel.findById(job.customer)
        const contractor = await ContractorModel.findById(quotation.contractor)
        if (!customer || !contractor) return


        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: 'New Job Bid',
            type: 'NEW_JOB_QUOTATION', //
            message: `Your job on Repairfind has received a new bid`,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `Your job on Repairfind has received a new bid`,
                customer: customer.id,
                event: 'NEW_JOB_QUOTATION',
                quotationId: quotation.id,
            }
        }, { push: true, socket: true, database: true })


        // if (job.isAssigned) {
        //     NotificationService.sendNotification({
        //         user: contractor.id,
        //         userType: 'contractors',
        //         title: 'New Job Bid',
        //         type: 'NEW_JOB_QUOTATION', //
        //         message: `You have submitted a bid for a job on Repairfind`,
        //         heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
        //         payload: {
        //             entity: job.id,
        //             entityType: 'jobs',
        //             message: `You have submitted a bid for a job on Repairfind`,
        //             customer: customer.id,
        //             event: 'NEW_JOB_QUOTATION',
        //             quotationId: quotation.id,
        //         }
        //     }, { push: true, socket: true })
        // }


    } catch (error) {
        Logger.error(`Error handling NEW_JOB_QUOTATION event: ${error}`);
    }
});


JobEvent.on('JOB_QUOTATION_EDITED', async function (payload: { job: IJob, quotation: IJobQuotation }) {
    try {
        Logger.info('handling JOB_QUOTATION_EDITED event', payload.job.id)
        const job = payload.job
        const quotation = payload.quotation
        const customer = await CustomerModel.findById(job.customer)
        const contractor = await ContractorModel.findById(quotation.contractor)
        if (!customer || !contractor) return


        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: 'Job Bid Edited',
            type: 'JOB_QUOTATION_EDITED', //
            message: `Job estimate as been edited by contractor`,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `Job estimate as been edited by contractor`,
                customer: customer.id,
                event: 'JOB_QUOTATION_EDITED',
                quotationId: quotation.id,
            }
        }, { push: true, socket: true, database: true })


        // if (job.isAssigned) {
        //     NotificationService.sendNotification({
        //         user: contractor.id,
        //         userType: 'contractors',
        //         title: 'New Job Bid',
        //         type: 'JOB_QUOTATION_EDITED', //
        //         message: `You have edited your bid for a job on Repairfind`,
        //         heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
        //         payload: {
        //             entity: job.id,
        //             entityType: 'jobs',
        //             message: `You have edited a=your bid for a job on Repairfind`,
        //             customer: customer.id,
        //             event: 'JOB_QUOTATION_EDITED',
        //             quotationId: quotation.id,
        //         }
        //     }, { push: true, socket: true, database: true })
        // }


    } catch (error) {
        Logger.error(`Error handling JOB_QUOTATION_EDITED event: ${error}`);
    }
});


JobEvent.on('CHANGE_ORDER_ESTIMATE_PAID', async function (payload: { job: IJob, quotation: IJobQuotation, extraEstimate: IExtraEstimate }) {
    try {
        Logger.info('handling CHANGE_ORDER_ESTIMATE_PAID event', payload.job.id)

        const job = payload.job
        if (!job) return

        const jobDay = await JobDayModel.findOne({ job: job.id })
        const customer = await CustomerModel.findById(job.customer)
        const contractor = await ContractorModel.findById(job.contractor)

        if (!customer || !contractor) return


        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: 'Change Order Estimate Paid',
            type: 'CHANGE_ORDER_ESTIMATE_PAID', //
            message: `Change order estimate has been paid`,
            heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `Change order estimate has been paid`,
                customer: customer.id,
                event: 'CHANGE_ORDER_ESTIMATE_PAID',
                jobId: job.id,
                jobDayId: jobDay?.id
            }
        }, { push: true, socket: true, database: true })


    } catch (error) {
        Logger.error(`Error handling CHANGE_ORDER_ESTIMATE_PAID event: ${error}`);
    }
});


// JOB DAY
JobEvent.on('JOB_DAY_STARTED', async function (payload: { job: IJob, jobDay: IJobDay }) {
    try {
        Logger.info('handling alert JOB_DAY_STARTED event', payload.job.id)

        const job = await payload.job
        const jobDay = await payload.jobDay

        if (!job) {
            return
        }


        const customer = await CustomerModel.findById(job.customer)
        const contractor = await ContractorModel.findById(job.contractor)

        if (!customer || !contractor) return


        // send notification to contractor or company
        NotificationService.sendNotification(
            {
                user: contractor.id,
                userType: 'contractors',
                title: 'JobDay',
                heading: {},
                type: 'JOB_DAY_STARTED',
                message: 'JobDay trip successfully started',
                payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id, entityType: 'jobs', entity: job.id }
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )

        if (job.isAssigned) {
            // send notification to  assigned contractor
            NotificationService.sendNotification(
                {
                    user: job.assignment.contractor,
                    userType: 'contractors',
                    title: 'JobDay',
                    heading: {},
                    type: 'JOB_DAY_STARTED',
                    message: 'JobDay trip successfully started',
                    payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id, entityType: 'jobs', entity: job.id }
                },
                {
                    push: true,
                    socket: true,
                    database: true
                }
            )
        }

        // send notification to customer
        NotificationService.sendNotification(
            {
                user: customer.id,
                userType: 'customers',
                title: 'Job Day',
                heading: {},
                type: 'JOB_DAY_STARTED',
                message: 'Contractor is on his way',
                payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id, entityType: 'jobs', entity: job.id }
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )

    } catch (error) {
        Logger.error(`Error handling JOB_MARKED_COMPLETE_BY_CONTRACTOR event: ${error}`);
    }
});


JobEvent.on('JOB_DAY_ARRIVAL', async function (payload: { jobDay: IJobDay, verificationCode: number }) {
    try {
        Logger.info('handling alert JOB_DAY_ARRIVAL event', payload.jobDay.id)

        const jobDay = await payload.jobDay
        const job = await JobModel.findById(jobDay.job)
        const verificationCode = payload.verificationCode

        if (!job || !jobDay) return

        const customer = await CustomerModel.findById(jobDay.customer)
        const contractor = await ContractorModel.findById(jobDay.contractor)

        if (!customer || !contractor) return

        // send notification to  customer
        NotificationService.sendNotification(
            {
                user: jobDay.customer.toString(),
                userType: 'customers',
                title: 'JobDay',
                heading: { name: contractor.name, image: contractor.profilePhoto?.url },
                type: 'JOB_DAY_ARRIVAL',
                message: 'Contractor is at your site.',
                payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode, entityType: 'jobs', entity: job.id }
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: contractor.id,
                userType: 'contractors',
                title: 'JobDay',
                heading: { name: customer.name, image: customer.profilePhoto?.url },
                type: 'JOB_DAY_ARRIVAL',
                message: 'Job Day arrival, waiting for confirmation from customer.',
                payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode, entityType: 'jobs', entity: job.id }
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )

        if (job.isAssigned) {
            NotificationService.sendNotification(
                {
                    user: job.assignment.contractor,
                    userType: 'contractors',
                    title: 'JobDay',
                    heading: { name: customer.name, image: customer.profilePhoto?.url },
                    type: 'JOB_DAY_ARRIVAL',
                    message: 'Job Day arrival, waiting for confirmation from customer.',
                    payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode, entityType: 'jobs', entity: job.id }
                },
                {
                    push: true,
                    socket: true,
                    database: true
                }
            )
        }

    } catch (error) {
        Logger.error(`Error handling JOB_DAY_ARRIVAL event: ${error}`);
    }
});



JobEvent.on('JOB_DAY_CONFIRMED', async function (payload: { jobDay: IJobDay }) {
    try {
        Logger.info('handling alert JOB_DAY_CONFIRMED event', payload.jobDay.id)

        const jobDay = await payload.jobDay
        const job = await JobModel.findById(jobDay.job)

        if (!job || !jobDay) return

        const customer = await CustomerModel.findById(jobDay.customer)
        const contractor = await ContractorModel.findById(jobDay.contractor)

        if (!customer || !contractor) return

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: job.contractor,
                userType: 'contractors',
                title: 'JobDay confirmation',
                heading: { name: customer.name, image: customer.profilePhoto?.url },
                type: 'JOB_DAY_CONFIRMED',
                message: 'Customer has confirmed your arrival.',
                payload: { event: 'JOB_DAY_CONFIRMED', jobDayId: jobDay.id, entityType: 'jobs', entity: job.id }
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )

        if (job.assignment) {
            NotificationService.sendNotification(
                {
                    user: job.assignment.contractor,
                    userType: 'contractors',
                    title: 'JobDay confirmation',
                    heading: { name: customer.name, image: customer.profilePhoto?.url },
                    type: 'JOB_DAY_CONFIRMED',
                    message: 'Customer has confirmed your arrival.',
                    payload: { event: 'JOB_DAY_CONFIRMED', jobDayId: jobDay.id, entityType: 'jobs', entity: job.id }
                },
                {
                    push: true,
                    socket: true,
                    database: true
                }
            )

        }

        // send notification to  customer
        NotificationService.sendNotification(
            {
                user: job.customer,
                userType: 'customers',
                title: 'JobDay confirmation',
                heading: { name: contractor.name, image: contractor.profilePhoto?.url },
                type: 'JOB_DAY_CONFIRMED',
                message: "You successfully confirmed the contractor's arrival.",
                payload: { event: 'JOB_DAY_CONFIRMED', jobDayId: jobDay.id, entityType: 'jobs', entity: job.id }
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )


    } catch (error) {
        Logger.error(`Error handling JOB_DAY_CONFIRMED event: ${error}`);
    }
});



JobEvent.on('JOB_REFUND_REQUESTED', async function (payload: { job: any, payment: any, refund: any }) {
    try {
        Logger.info('handling alert JOB_REFUND_REQUESTED event', payload.payment.id)

        const job = payload.job
        const payment = payload.payment
        const refund = payload.refund

        const customer = await CustomerModel.findById(job.customer)
        const contractor = await ContractorModel.findById(job.contractor)

        if (!customer || !contractor) return

        // send notification to  customer
        let emailSubject = 'Job Refund Requested'
        let emailContent = `
                <p style="color: #333333;">A refund for your job on Repairfind has been requested </p>
                <p style="color: #333333;">The refund should be completed in 24 hours </p>
                <p><strong>Job Title:</strong> ${job.description}</p>
                <p><strong>Job Amount</strong> ${payment.amount}</p>
                <p><strong>Refund Amount:</strong> ${refund.refundAmount}</p>
                `
        let html = GenericEmailTemplate({ name: customer.name, subject: emailSubject, content: emailContent })
        EmailService.send(customer.email, emailSubject, html)


        // send notification to  contractor
        emailSubject = 'Job Refund Requested'
        emailContent = `
                <p style="color: #333333;">A refund for your job on Repairfind has been requested </p>
                <p style="color: #333333;">The refund should be completed in 24 hours </p>
                <p><strong>Job Title:</strong> ${job.description}</p>
                <p><strong>Job Amount</strong> ${payment.amount}</p>
                <p><strong>Refund Amount:</strong> ${refund.refundAmount}</p>
                `
        html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
        EmailService.send(contractor.email, emailSubject, html)


    } catch (error) {
        Logger.error(`Error handling JOB_REFUND_REQUESTED event: ${error}`);
    }
});



JobEvent.on('NEW_JOB_ENQUIRY', async function (payload: { jobId: any, enquiryId: IJobEnquiry }) {
    try {
        Logger.info('handling alert NEW_JOB_ENQUIRY event', payload.jobId)

        const job = await JobModel.findById(payload.jobId)
        const enquiry = await JobEnquiryModel.findById(payload.enquiryId)

        if (!job || !enquiry) return

        const customer = await CustomerModel.findOne({ _id: job.customer })
        const contractor = await ContractorModel.findOne({ _id: enquiry.contractor })

        if (!customer || !contractor) return


        // send push to all contractors that match the job ?
        const savedJobs = await ContractorSavedJobModel.find({ job: job.id })
        const contractorIds = savedJobs.map(savedJob => savedJob.contractor)
        const devices = await ContractorDeviceModel.find({ contractor: { $in: contractorIds } })
        devices.map(device => {
            NotificationService.sendNotification(
                {
                    user: device.contractor.toString(),
                    userType: 'contractors',
                    title: 'New Job Enquiry',
                    type: 'NEW_JOB_ENQUIRY',
                    heading: { name: customer.name, image: customer.profilePhoto?.url },
                    message: 'A Job you  saved on Repairfind has a new enquiry',
                    payload: { event: 'NEW_JOB_ENQUIRY', entityType: 'jobs', entity: job.id }
                },
                {
                    push: true,
                    socket: true,
                    database: true
                }
            )
        });


        if (customer) {
            NotificationService.sendNotification(
                {
                    user: job.customer,
                    userType: 'customers',
                    title: 'New Job Enquiry',
                    heading: { name: contractor.name, image: contractor.profilePhoto?.url },
                    type: 'NEW_JOB_ENQUIRY',
                    message: 'Your job on Repairfind has a new enquiry',
                    payload: { event: 'NEW_JOB_ENQUIRY', entityType: 'jobs', entity: job.id }
                },
                { push: true, socket: true, database: true }
            )
            let emailSubject = 'New Job Enquiry '
            let emailContent = `
                <p style="color: #333333;">Your Job on Repairfind has a new enquiry</p>
                <div style="background: whitesmoke;padding: 10px; border-radius: 10px;">
                <p style="border-bottom: 1px solid lightgray; padding-bottom: 5px;"><strong>Job Title:</strong> ${job.description}</p>
                <p style="border-bottom: 1px solid lightgray; padding-bottom: 5px;"><strong>Enquiry:</strong> ${enquiry.enquiry}</p>
                </div>
                <p style="color: #333333;">Do well to check and follow up as soon as possible </p>
                `
            let html = GenericEmailTemplate({ name: customer.name, subject: emailSubject, content: emailContent })
            EmailService.send(customer.email, emailSubject, html)
        }

    } catch (error) {
        Logger.error(`Error handling NEW_JOB_ENQUIRY event: ${error}`);
    }
});


JobEvent.on('NEW_JOB_ENQUIRY_REPLY', async function (payload: { jobId: any, enquiryId: IJobEnquiry }) {
    try {
        Logger.info('handling alert NEW_JOB_ENQUIRY_REPLY event', payload.jobId)


        const job = await JobModel.findById(payload.jobId)
        const enquiry = await JobEnquiryModel.findById(payload.enquiryId)

        if (!job || !enquiry) return

        const customer = await CustomerModel.findOne({ _id: job.customer })
        const contractor = await ContractorModel.findOne({ _id: enquiry.contractor })

        if (!customer || !contractor) return

        const savedJobs = await ContractorSavedJobModel.find({ job: job.id })
        const contractorIds = savedJobs.map(savedJob => savedJob.contractor)


        // send push to all contractors that match the job ?
        const devices = await ContractorDeviceModel.find({ contractor: { $in: contractorIds } })
        const deviceTokens = devices.map(device => device.deviceToken);


        devices.map(device => {
            NotificationService.sendNotification(
                {
                    user: device.contractor.toString(),
                    userType: 'contractors',
                    title: 'New Job Enquiry Reply',
                    type: 'NEW_JOB_ENQUIRY_REPLY',
                    heading: { name: customer.name, image: customer.profilePhoto?.url },
                    message: 'A job you are following on Repairfind has a new reply from the customer',
                    payload: { event: 'NEW_JOB_ENQUIRY_REPLY', entityType: 'jobs', entity: job.id }
                },
                {
                    push: true,
                    socket: true,
                    database: true
                }
            )
        });


        // sendPushNotifications(deviceTokens, {
        //     title: 'New Job Enquiry Reply',
        //     type: 'NEW_JOB_ENQUIRY_REPLY',
        //     icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
        //     body: 'A job you are following on Repairfind has a new reply from the customer',
        //     data: {
        //         entity: job.id,
        //         entityType: 'jobs',
        //         message: `A job you are following on Repairfind has a new reply from the customer`,
        //         event: 'NEW_JOB_QUESTION_REPLY',
        //     }
        // })



        // send notification to  contractor  that asked the question
        if (customer && contractor) {
            let emailSubject = 'Job Enquiry Reply'
            let emailContent = `
                    <p style="color: #333333;">Customer has replied to your enquiry on Repairfind</p>
                    <p style="color: #333333;">Do well to check and follow up </p>
                    <p><strong>Job Title:</strong> ${job.description}</p>
                    <p><strong>Your Enquiry</strong> ${enquiry.enquiry}</p>
                    <p><strong>Reply</strong> ${enquiry.replies ? enquiry.replies[0] : ''}</p>
                    `
            let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
            EmailService.send(contractor.email, emailSubject, html)
        }




    } catch (error) {
        Logger.error(`Error handling NEW_JOB_ENQUIRY_REPLY event: ${error}`);
    }
});