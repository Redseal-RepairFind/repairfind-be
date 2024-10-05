import { EventEmitter } from 'events';
import { EmailService, NotificationService } from '../services';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { IJob, JOB_SCHEDULE_TYPE, JobModel } from '../database/common/job.model';
import { ConversationEntityType, ConversationModel } from '../database/common/conversations.schema';
import { SocketService } from '../services/socket';
import { IContractor } from '../database/contractor/interface/contractor.interface';
import { ICustomer } from '../database/customer/interface/customer.interface';
import { JobCanceledEmailTemplate } from '../templates/common/job_canceled.template';
import { IJobDay, JobDayModel } from '../database/common/job_day.model';
import { IJobEmergency } from '../database/common/job_emergency.model';
import { GenericEmailTemplate } from '../templates/common/generic_email';
import { IJobDispute } from '../database/common/job_dispute.model';
import { IExtraEstimate, IJobQuotation, JobQuotationModel } from '../database/common/job_quotation.model';
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../database/common/transaction.model';
import { ObjectId } from 'mongoose';
import { sendPushNotifications } from '../services/expo';
import { ContractorProfileModel } from '../database/contractor/models/contractor_profile.model';
import ContractorDeviceModel from '../database/contractor/models/contractor_devices.model';
import ContractorSavedJobModel from '../database/contractor/models/contractor_saved_job.model';
import { IJobEnquiry, JobEnquiryModel } from '../database/common/job_enquiry.model';
import { Logger } from '../services/logger';
import { ConversationUtil } from '../utils/conversation.util';
import { MessageModel, MessageType } from '../database/common/messages.schema';
import { BlockedUserUtil } from '../utils/blockeduser.util';
import { i18n } from '../i18n';
import { PAYMENT_TYPE } from '../database/common/payment.schema';

export const JobEvent: EventEmitter = new EventEmitter();

JobEvent.on('NEW_JOB_REQUEST', async function (payload) {
    try {
        Logger.info('handling NEW_JOB_REQUEST event')
        const customer = await CustomerModel.findById(payload.customerId)
        const contractor = await ContractorModel.findById(payload.contractorId)
        const job = await JobModel.findById(payload.jobId)
        const conversation = await ConversationModel.findById(payload.conversationId)

        if (job && contractor && customer) {


            const contractorLang = contractor.language
            let nMessage = await i18n.getTranslation({phraseOrSlug: "You've received a job request from",targetLang: contractorLang});
            let nTitle = await i18n.getTranslation({phraseOrSlug: 'New Job Request',targetLang: contractorLang});

            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: nTitle,
                type: 'NEW_JOB_REQUEST', //
                message: `${nMessage} ${customer.firstName}`,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `${nMessage} ${customer.firstName}`,
                    contractor: contractor.id,
                    event: 'NEW_JOB_REQUEST',
                }
            }, { database: true, push: true, socket: true })


            const customerLang = customer.language
            nMessage = await i18n.getTranslation({
                phraseOrSlug: "You've sent a job request to",
                targetLang: customerLang
            });
            nTitle = await i18n.getTranslation({
                phraseOrSlug: 'New Job Request',
                targetLang: customerLang
            });
            

            NotificationService.sendNotification({
                user: customer.id,
                userType: 'customers',
                title: nTitle,
                type: 'NEW_JOB_REQUEST', // Conversation, Conversation_Notification
                //@ts-ignore
                message: `${nMessage} ${contractor.name}`,
                //@ts-ignore
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    //@ts-ignore
                    message: `${nMessage} ${contractor.name}`,
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

            const contractorLang = contractor.language;  // Contractor's language
            let nMessage = await i18n.getTranslation({
                phraseOrSlug: "You've accepted a job request from",
                targetLang: contractorLang
            });
            let nTitle = await i18n.getTranslation({
                phraseOrSlug: 'Job Request Accepted',
                targetLang: contractorLang
            });
            
            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: nTitle,
                type: 'JOB_REQUEST_ACCEPTED',
                message: `${nMessage} ${customer.firstName}`,  // Translated message with the customer's first name
                heading: {
                    name: `${customer.firstName} ${customer.lastName}`,  // Customer's full name
                    image: customer.profilePhoto?.url  // Customer's profile photo, if available
                },
                payload: {
                    entity: job.id,  // Job ID
                    entityType: 'jobs',  // Type of entity (job)
                    message: `${nMessage} ${customer.firstName}`,  // Translated message
                    contractor: contractor.id,  // Contractor's ID
                    event: 'JOB_REQUEST_ACCEPTED',  // Event type
                }
            }, {
                push: true,
                socket: true,
                database: true
            });


            const customerLang = customer.language;  // Customer's language
            nTitle = await i18n.getTranslation({
                phraseOrSlug: 'Job Request Accepted',
                targetLang: customerLang
            });
            nMessage = await i18n.getTranslation({
                phraseOrSlug: "Contractor has accepted your job request",
                targetLang: customerLang
            });
            
            NotificationService.sendNotification({
                user: customer.id,
                userType: 'customers',
                title: nTitle,
                type: 'JOB_REQUEST_ACCEPTED',
                message: nMessage,
                heading: {
                    name: `${contractor.name}`,  // Contractor's name
                    image: contractor.profilePhoto?.url  // Contractor's profile photo (if available)
                },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',  // Entity type (job)
                    message: nMessage,  // Translated message
                    customer: customer.id,  // Customer's ID
                    event: 'JOB_REQUEST_ACCEPTED',  // Event type
                }
            }, {
                database: true,  // Save to database
                push: true,  // Push notification
                socket: true  // Real-time socket notification
            });


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


            const contractorLang = contractor.language;
            let nTitle = await i18n.getTranslation({
                phraseOrSlug: 'Job Request Rejected',
                targetLang: contractorLang
            });
            let nMessage = await i18n.getTranslation({
                phraseOrSlug: "You've rejected a job request from",
                targetLang: contractorLang
            });
            
            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: nTitle,
                type: 'JOB_REQUEST_REJECTED',
                message: `${nMessage} ${customer.firstName}`,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `${nMessage} ${customer.firstName}`,
                    contractor: contractor.id,
                    event: 'JOB_REQUEST_REJECTED',
                }
            }, { push: true, socket: true, database: true });


            const customerLang = customer.language;
            nTitle = await i18n.getTranslation({
                phraseOrSlug: 'Job Request Rejected',
                targetLang: customerLang
            });
            nMessage = await i18n.getTranslation({
                phraseOrSlug: "Contractor has rejected your job request",
                targetLang: customerLang
            });
            
            NotificationService.sendNotification({
                user: customer.id,
                userType: 'customers',
                title: nTitle,
                type: 'JOB_REQUEST_REJECTED',
                message: nMessage,
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: nMessage,
                    customer: customer.id,
                    event: 'JOB_REQUEST_REJECTED',
                }
            }, { database: true, push: true, socket: true });


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
            const customerId = job.customer

            const filteredContractorIds = [];
            for (const contractorId of contractorIds) {
                const { isBlocked, block } = await BlockedUserUtil.isUserBlocked({ customer: customerId, contractor: contractorId });
                if (!isBlocked) {
                    filteredContractorIds.push(contractorId);
                }
            }

            const devices = await ContractorDeviceModel.find({ contractor: { $in: filteredContractorIds } })
            // const deviceTokens = devices.map(device => device.expoToken);

            devices.map( async(device) => {
                const contractor = await ContractorModel.findById(device.contractor)
                
                if(contractor){
                    const contractorLang = contractor.language;
                    let nTitle = await i18n.getTranslation({
                        phraseOrSlug: 'New Job Listing',
                        targetLang: contractorLang
                    });
                    let nMessage = await i18n.getTranslation({
                        phraseOrSlug: 'There is a new job listing that matches your profile',
                        targetLang: contractorLang
                    });
                    sendPushNotifications([device.expoToken], {
                        title: nTitle,
                        type: 'NEW_JOB_LISTING',
                        icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                        body: nMessage,
                        data: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: nMessage,
                            event: 'NEW_JOB_LISTING',
                        }
                    })
                }

                
            });
        }


    } catch (error) {
        Logger.error(`Error handling NEW_JOB_LISTING event: ${error}`);
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
            const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true}) || html;            
            const translatedSubject = await i18n.getTranslation({phraseOrSlug: "Job Canceled", targetLang: contractor.language}) || 'Job Canceled';
            EmailService.send(customer.email, translatedSubject, translatedHtml)
        }
        if (payload.canceledBy == 'customer') {
            Logger.info('job cancelled by customer')
            const html = JobCanceledEmailTemplate({ name: contractor.name, canceledBy: 'customer', job: payload.job })
            const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: customer.language, saveToFile: false, useGoogle: true}) || html;            
            const translatedSubject = await i18n.getTranslation({phraseOrSlug: "Job Canceled", targetLang: customer.language}) || 'Job Canceled';
            EmailService.send(contractor.email, translatedSubject, translatedHtml)

        }

        const customerLang = customer.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Canceled',
            targetLang: customerLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Your job on Repairfind has been canceled',
            targetLang: customerLang
        });
        

        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: nTitle,
            type: 'JOB_CANCELED',
            message: nMessage,
            heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                customer: customer.id,
                event: 'JOB_CANCELED',
            }
        }, { push: true, socket: true, database: true });



        const contractorLang = contractor.language;
        nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Canceled',
            targetLang: contractorLang
        });
        nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Your job on Repairfind has been canceled',
            targetLang: contractorLang
        });
        
        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: nTitle,
            type: 'JOB_CANCELED',
            message: nMessage,
            heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                customer: customer.id,
                event: 'JOB_CANCELED',
            }
        }, { push: true, socket: true, database: true });


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

            const contractorLang = contractor.language;
            let nTitle = await i18n.getTranslation({
                phraseOrSlug: 'Job Dispute Refund Created',
                targetLang: contractorLang
            });
            let nMessage = await i18n.getTranslation({
                phraseOrSlug: 'Full refund of your disputed job has been approved on Repairfind',
                targetLang: contractorLang
            });
            

            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: nTitle,
                type: 'JOB_DISPUTE_REFUND_CREATED',
                message: nMessage,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: dispute.id,
                    entityType: 'job_disputes',
                    message: nMessage,
                    contractor: contractor.id,
                    event: 'JOB_DISPUTE_REFUND_CREATED',
                }
            }, { push: true, socket: true, database: true });


            const customerLang = customer.language;
            nTitle = await i18n.getTranslation({
                phraseOrSlug: 'Job Dispute Refund Created',
                targetLang: customerLang
            });
            nMessage = await i18n.getTranslation({
                phraseOrSlug: 'Full refund of your disputed job has been approved on Repairfind',
                targetLang: customerLang
            });
            

            NotificationService.sendNotification({
                user: customer.id,
                userType: 'customers',
                title: nTitle,
                type: 'JOB_DISPUTE_REFUND_CREATED',
                message: nMessage,
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: dispute.id,
                    entityType: 'job_disputes',
                    jobType: job.type,
                    message: nMessage,
                    customer: customer.id,
                    event: 'JOB_DISPUTE_REFUND_CREATED',
                }
            }, { database: true, push: true, socket: true });


        }



    } catch (error) {
        Logger.error(`Error handling JOB_DISPUTE_REFUND_CREATED event: ${error}`);
    }
});


JobEvent.on('JOB_REVISIT_ENABLED', async function (payload: { job: IJob, dispute: IJobDispute }) {
    try {
        Logger.info('handling alert JOB_REVISIT_ENABLED event')
        const job = payload.job
        const dispute = payload.dispute
        const customer = await CustomerModel.findById(payload.job.customer) as ICustomer
        const contractor = await ContractorModel.findById(payload.job.contractor) as IContractor


        if (job && contractor && customer) {

            const conversation = await ConversationUtil.updateOrCreateConversation(contractor.id, 'contractors', customer.id, 'customers')

            const contractorLang = contractor.language;
            let nTitle = await i18n.getTranslation({
                phraseOrSlug: 'Job Revisit Enabled',
                targetLang: contractorLang
            });
            let nMessage = await i18n.getTranslation({
                phraseOrSlug: 'A revisit for your disputed job has been enabled on Repairfind',
                targetLang: contractorLang
            });
            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: nTitle,
                type: 'JOB_REVISIT_ENABLED',
                message: nMessage,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: nMessage,
                    contractor: contractor.id,
                    conversationId: conversation?.id,
                    event: 'JOB_REVISIT_ENABLED',
                }
            }, { push: true, socket: true, database: true });


            const customerLang = customer.language;
            nTitle = await i18n.getTranslation({
                phraseOrSlug: 'Job Revisit Enabled',
                targetLang: customerLang
            });
            nMessage = await i18n.getTranslation({
                phraseOrSlug: 'A revisit for your disputed job has been enabled on Repairfind',
                targetLang: customerLang
            });
            

            NotificationService.sendNotification({
                user: customer.id,
                userType: 'customers',
                title: nTitle,
                type: 'JOB_REVISIT_ENABLED',
                message: nMessage,
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    jobType: job.type,
                    message: nMessage,
                    customer: customer.id,
                    conversationId: conversation?.id,
                    event: 'JOB_REVISIT_ENABLED',
                }
            }, { database: true, push: true, socket: true });


        }



    } catch (error) {
        Logger.error(`Error handling JOB_REVISIT_ENABLED event: ${error}`);
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
                <h2>${emailSubject}</h2>
                <p>Hello ${contractor.name},</p>
                <p style="color: #333333;">Your job  quotation for a job  on RepairFind was declined.</p>
                <p>
                    <strong>Job Title:</strong> ${job.title} </br>
                    <strong>Customer:</strong> ${customer.name} </br>
                    <strong>Reason:</strong> ${payload.reason}  </br>
                </p>
              
                <p>Login to our app to follow up </p>
                `
            let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
           
            const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true}) || html;            
            const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: contractor.language}) || emailSubject;
            EmailService.send(contractor.email, translatedSubject, translatedHtml)

            const conversation = await ConversationUtil.updateOrCreateConversation(customer.id, 'customers', contractor.id, 'contractors')

            const contractorLang = contractor.language;
            let nMessage = await i18n.getTranslation({
                phraseOrSlug: 'Your job quotation for a job on RepairFind was declined',
                targetLang: contractorLang
            });
            let nTitle = await i18n.getTranslation({
                phraseOrSlug: 'Job Quotation Declined',
                targetLang: contractorLang
            });            
            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: nTitle,
                type: 'JOB_QUOTATION_DECLINED', // Conversation, Conversation_Notification
                message: nMessage,
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: nMessage,
                    customerId: customer.id,
                    jobType: job.type,
                    conversationId: conversation.id,
                    event: 'JOB_QUOTATION_DECLINED',
                }
            }, { push: true, socket: true, database: true })

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
                <h2>${emailSubject}</h2>
                <p>Hello ${contractor.name},</p>
                <p style="color: #333333;">Congratulations! your job quotation for a job  on RepairFind was accepted.</p>
                <p>
                    <strong>Job Title:</strong> ${job.title} </br>
                    <strong>Customer:</strong> ${customer.name} </br>
                </p>
              
                <p>Login to our app to follow up </p>
                `

            let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
            const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true}) || html;            
            const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: contractor.language}) || emailSubject;
            EmailService.send(contractor.email, translatedSubject, translatedHtml)

            const conversation = await ConversationUtil.updateOrCreateConversation(customer.id, 'customers', contractor.id, 'contractors')

            const contractorLang = contractor.language;
            let nTitle = await i18n.getTranslation({
                phraseOrSlug: 'Job Quotation Accepted',
                targetLang: contractorLang
            });
            let nMessage = await i18n.getTranslation({
                phraseOrSlug: 'Your quotation for a job on RepairFind was accepted',
                targetLang: contractorLang
            });            
            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: nTitle,
                type: 'JOB_QUOTATION_ACCEPTED',
                message: nMessage,
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: nMessage,
                    customerId: customer.id,
                    conversationId: conversation.id,
                    event: 'JOB_QUOTATION_ACCEPTED',
                }
            }, { push: true, socket: true, database: true });


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
            }
            if (payload.jobEmergency.triggeredBy == 'customer') {
                Logger.info('job emergency triggered by customer')
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

            const conversation = await ConversationUtil.updateOrCreateConversation(customer.id, 'customers', contractor.id, 'contractors')
            const message = new MessageModel({
                conversation: conversation.id,
                message: `Job reschedule request ${payload.action}`,
                messageType: MessageType.ALERT,
                entity: job.id,
                entityType: 'jobs'
            });

            if (payload.job.reschedule?.createdBy == 'contractor') { // send mail to contractor

                const dateTimeOptions: any = {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: contractor.currentTimezone,
                    timeZoneName: 'long'
                }
                const rescheduleDate = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(payload.job.reschedule.date));


                let emailSubject = 'Job Reschedule Request'
                let emailContent = `
                <h2>${emailSubject}</h2>
                <p>Hello ${contractor.name},</p>
                <p style="color: #333333;">Your Job reschedule request on Repairfind has been ${payload.action} by customer</p>
                <p><strong>Job Title:</strong> ${payload.job.description}</p>
                <p><strong>Proposed Date:</strong> ${rescheduleDate}</p>
                `
                let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
                const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true}) || html;            
                const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: contractor.language}) || emailSubject;
                EmailService.send(contractor.email, translatedSubject, translatedHtml)

                const contractorLang = contractor.language;

                let nTitle = await i18n.getTranslation({
                    phraseOrSlug: `Job Reschedule Request ${payload.action}`,
                    targetLang: contractorLang
                });
                let nMessage = await i18n.getTranslation({
                    phraseOrSlug: `Your job reschedule request on Repairfind has been ${payload.action} by customer`,
                    targetLang: contractorLang
                });                

                NotificationService.sendNotification({
                    user: contractor.id,
                    userType: 'contractors',
                    title: nTitle,
                    type: event,
                    message: nMessage,
                    heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                    payload: {
                        entity: job.id,
                        entityType: 'jobs',
                        message: nMessage,
                        customer: customer.id,
                        contractor: contractor.id,
                        conversationId: conversation.id,
                        event: event,
                    }
                }, { push: true, socket: true, database: true });


                message.sender = customer.id
                message.senderType = 'customers'

            }
            if (payload.job.reschedule?.createdBy == 'customer') { // send mail to  customer

                const dateTimeOptions: any = {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: customer.currentTimezone,
                    timeZoneName: 'long'
                }
                const rescheduleDate = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(payload.job.reschedule.date));


                let emailSubject = 'Job Reschedule Request'
                let emailContent = `
                <h2>${emailSubject}</h2>
                <p>Hello ${customer.name},</p>
                <p style="color: #333333;">Your Job reschedule request on Repairfind has been ${payload.action}  by the contractor</p>
                <p><strong>Job Title:</strong> ${payload.job.description}</p>
                <p><strong>Proposed Date:</strong> ${rescheduleDate}</p>
                `
                let html = GenericEmailTemplate({ name: customer.name, subject: emailSubject, content: emailContent })
                const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: customer.language, saveToFile: false, useGoogle: true}) || html;            
                const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: customer.language}) || emailSubject;
                EmailService.send(customer.email, translatedSubject, translatedHtml)


                const customerLang = customer.language;
                let nTitle = await i18n.getTranslation({
                    phraseOrSlug: `Job Reschedule Request ${payload.action}`,
                    targetLang: customerLang
                });
                let nMessage = await i18n.getTranslation({
                    phraseOrSlug: `Your job reschedule request on Repairfind has been ${payload.action} by contractor`,
                    targetLang: customerLang
                });
                

                NotificationService.sendNotification({
                    user: customer.id,
                    userType: 'customers',
                    title: nTitle,
                    type: event,
                    message: nMessage,
                    heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                    payload: {
                        entity: job.id,
                        entityType: 'jobs',
                        message: nMessage,
                        contractor: contractor.id,
                        customer: customer.id,
                        conversationId: conversation.id,
                        event: event,
                    }
                }, { push: true, socket: true, database: true });


                message.sender = contractor.id
                message.senderType = 'contractors'

            }

            await message.save()

        }


    } catch (error) {
        Logger.error(`Error handling JOB_RESCHEDULE_DECLINED_ACCEPTED event: ${error}`);
    }
});

// TODO: Separate this - so I ca translate, break the actions into individual events
JobEvent.on('NEW_JOB_RESCHEDULE_REQUEST', async function (payload: { job: IJob, action: string }) {
    try {
        Logger.info('handling alert NEW_JOB_RESCHEDULE_REQUEST event', payload.action)

        const customer = await CustomerModel.findById(payload.job.customer)
        const contractor = await ContractorModel.findById(payload.job.contractor)
        const job = payload.job


        if (contractor && customer) {

            const conversation = await ConversationUtil.updateOrCreateConversation(customer.id, 'customers', contractor.id, 'contractors')
            const message = new MessageModel({
                conversation: conversation.id,
                message: job.revisitEnabled ? "Job Revisit reschedule request" : "Job reschedule request",
                messageType: MessageType.ALERT,
                entity: job.id,
                entityType: 'jobs'
            });




            if (payload.job.reschedule?.createdBy == 'contractor') { // send mail to contractor

                const dateTimeOptions: any = {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: contractor.currentTimezone,
                    timeZoneName: 'long'
                }
                const rescheduleDate = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(payload.job.reschedule.date));


                let emailSubject = 'Job Schedule'
                let emailContent = `
                <h2>${emailSubject}</h2>
                <p>Hello ${customer.name},</p>
                <p style="color: #333333;">Contractor has requested  to reschedule a job on RepairFind</p>
                <p><strong>Job Title:</strong> ${payload.job.description}</p>
                <p><strong>Proposed Date:</strong> ${rescheduleDate}</p>
                `
                let html = GenericEmailTemplate({ name: customer.name, subject: emailSubject, content: emailContent })
                const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: customer.language, saveToFile: false, useGoogle: true}) || html;            
                const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: customer.language}) || emailSubject;
                EmailService.send(customer.email, translatedSubject, translatedHtml)


                NotificationService.sendNotification({
                    user: customer.id,
                    userType: 'customers',
                    title: job.revisitEnabled ? "Job Revisit reschedule request" : "Job reschedule request",
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

                message.sender = contractor.id
                message.senderType = 'contractors'

            }
            if (payload.job.reschedule?.createdBy == 'customer') { // send mail to  customer

                const dateTimeOptions: any = {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: customer.currentTimezone,
                    timeZoneName: 'long'
                }
                const rescheduleDate = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(payload.job.reschedule.date));

                let emailSubject = 'Job Schedule'
                let emailContent = `
                <h2>${emailSubject}</h2>
                <p>Hello ${contractor.name},</p>
                <p style="color: #333333;">Customer has requested  to reschedule a job on RepairFind</p>
                <p><strong>Job Title:</strong> ${payload.job.description}</p>
                <p><strong>Proposed Date:</strong> ${rescheduleDate}</p>
                `
                let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
                const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true}) || html;            
                const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: contractor.language}) || emailSubject;
                EmailService.send(contractor.email, translatedSubject, translatedHtml)

                NotificationService.sendNotification({
                    user: contractor.id,
                    userType: 'contractors',
                    title: job.revisitEnabled ? "Job Revisit reschedule request" : "Job reschedule request",
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

                message.sender = customer.id
                message.senderType = 'customer'
            }



            await message.save();

            conversation.lastMessageAt = new Date()
            conversation.lastMessage = "Job reschedule requested"
            conversation.entity = job.id
            conversation.entityType = ConversationEntityType.JOB
            await conversation.save()

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
        const paymentType = payload.paymentType ?? null
        
        if (job && contractor && customer && quotation) {
            const charges = await quotation.calculateCharges(paymentType);
            const contractorProfile = await ContractorProfileModel.findOne({ contractor: contractor.id })
            let paymentReceipt: any = quotation.payment
            let estimates = quotation.estimates

            if(paymentType == PAYMENT_TYPE.SITE_VISIT_PAYMENT){
                paymentReceipt = quotation?.siteVisitEstimate?.payment
                estimates =  paymentReceipt = quotation?.siteVisitEstimate?.estimates
            }
            if(paymentType == PAYMENT_TYPE.SITE_VISIT_PAYMENT){
                paymentReceipt = quotation.siteVisitEstimate?.payment
                estimates = quotation.siteVisitEstimate?.estimates
            }
            if (contractor && contractorProfile) {
                const dateTimeOptions: any = {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: contractor.currentTimezone,
                    timeZoneName: 'long'
                }
                const jobDateContractor = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(job.schedule.startDate));
                const currentDate = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(new Date));
               
                   
                let emailSubject = 'Job Escrow Payment';
                let emailContent = `
                    <h2>${emailSubject}</h2>
                    <p style="color: #333333;">Hello ${contractor.name},</p>
                    <p style="color: #333333;">You have received escrow payment for a job on RepairFind. The money is securely held in Escrow, and will be released to your paypal email once job is done</p>
                    <p><strong>Job Title:</strong> ${job.description}</p>
                    <p><strong>Scheduled Date:</strong>${jobDateContractor}</p>
                    <hr>
                    <p style="color: #333333;">Thank you for your service!</p>
                    <p style="color: #333333;">Kindly open the App for more information.</p>
                `;


               

                // HTML content for the receipt
                const receipthtmlContent = `
                    <h3>Escrow Payment Receipt</h3>
                    <p><strong>RepairFind</strong><br>
                    Phone: (604) 568-6378<br>
                    Email: info@repairfind.ca</p>
                    <hr>

                    <p>Date: ${currentDate}<br>
                    Receipt Number: RFP${paymentReceipt}</p>

                    <p><strong>Contractor:</strong><br>
                    ${contractor.name}<br>
                    ${contractorProfile?.location?.address}<br>
                    </p>

                    <hr>
                    <strong>Description:</strong>
                    <strong>Job Title:</strong> ${job.description}<br>
                    <strong>Scheduled Date:</strong> ${jobDateContractor}

                    <p><strong>Invoice Items:</strong></p>
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid lightgray;">
                    ${estimates.map(estimate => `
                        <tr>
                          <td style="border: 1px solid lightgray; padding: 8px;"><strong>${estimate.description}</strong></td>
                          <td style="border: 1px solid lightgray; padding: 8px; text-align: right;">$${(estimate.rate * estimate.quantity).toFixed(2)}</td>
                        </tr>
                      `).join('')}   
                        <tr>
                            <td style="border: 1px solid lightgray; padding: 8px;"><strong>Subtotal</strong></td>
                            <td style="border: 1px solid lightgray; padding: 8px; text-align: right;">$${(charges.subtotal).toFixed(2)}</td>
                        </tr>
                    </table>
                    <p><strong>Deduction/Charges:</strong></p>
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid lightgray;">
                        <tr>
                            <td style="border: 1px solid lightgray; padding: 8px;">Payment Processing Fee ($${charges.customerProcessingFeeRate}%)</td>
                            <td style="border: 1px solid lightgray; padding: 8px; text-align: right;">$${charges.contractorProcessingFee}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid lightgray; padding: 8px;">Service Fee (${charges.repairfindServiceFeeRate}%)</td>
                            <td style="border: 1px solid lightgray; padding: 8px; text-align: right;">$${charges.repairfindServiceFee}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid lightgray; padding: 8px;"><strong>Total Deducted</strong></td>
                            <td style="border: 1px solid lightgray; padding: 8px; text-align: right;"><strong>$${charges.repairfindServiceFee + charges.contractorProcessingFee}</strong></td>
                        </tr>
                    </table>
                    <p><strong>Net Amount to Contractor:</strong> $${charges.subtotal} + GST $${charges.gstAmount} - Total Deduction $${charges.repairfindServiceFee + charges.contractorProcessingFee} = $${charges.contractorPayable}</p>
                    <p><strong>Payment Method:</strong> Card Payment<br>
                    <strong>Transaction ID:</strong> RFT${quotation.id}</p>
                `;


                let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent });
                const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true}) || html;            
                const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: contractor.language}) || emailSubject;
                EmailService.send(contractor.email, translatedSubject, translatedHtml);

                let receipthtml = GenericEmailTemplate({ name: contractor.name, subject: 'Escrow Payment Receipt', content: receipthtmlContent });
                const translatedReceiptHtml = await i18n.getTranslation({phraseOrSlug: receipthtml, targetLang: contractor.language, saveToFile: false, useGoogle: true}) || html;            
                const translatedReceiptSubject = await i18n.getTranslation({phraseOrSlug: 'Escrow Payment Receipt', targetLang: contractor.language}) || 'Escrow Payment Receipt';
                EmailService.send(contractor.email, translatedReceiptSubject, translatedReceiptHtml);

            }



            if (customer) {

                const dateTimeOptions: any = {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: customer.currentTimezone,
                    timeZoneName: 'long'
                }
                const jobDateCustomer = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(job.schedule.startDate));
                const currentDate = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(new Date));


                let emailSubject = 'Job Payment';
                let emailContent = `
                 <h2>${emailSubject}</h2>
                  <p style="color: #333333;">Hello ${customer.name},</p>
                  <p style="color: #333333;">You have made a payment for a job on RepairFind. The money is held securely in Escrow until job is is complete</p>
                  <p><strong>Job Title:</strong> ${job.description}</p>
                  <p><strong>Proposed Date:</strong>${jobDateCustomer}</p>
                  <p style="color: #333333;">Thank you for your payment!</p>
                  <p style="color: #333333;">If you did not initiate this payment, kindly reach out to us via support.</p>
                `;


                let receiptContent = `
                    <p><strong>RepairFind</strong><br>
                    Phone: (604) 568-6378<br>
                    Email: info@repairfind.ca</p>
                    <hr>

                    <p><strong>Receipt</strong></p>
                    <p>Date: ${currentDate}<br>
                    Receipt Number: RFP${paymentReceipt}</p>
                    <p><strong>Customer:</strong><br>
                    ${customer.name}<br>
                    ${customer?.location?.address}<br>

                    <hr>
                    <strong>Description:</strong>
                    <strong>Job Title:</strong> ${job.description} <br>
                    <strong>Scheduled Date:</strong> ${jobDateCustomer}

                    <p><strong>Services/Charges:</strong></p>
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid lightgray; margin-bottom: 10px;">
                         ${estimates.map(estimate => `
                        <tr>
                          <td style="border: 1px solid lightgray; padding: 8px;"><strong>${estimate.description}</strong></td>
                          <td style="border: 1px solid lightgray; padding: 8px; text-align: right;">$${(estimate.rate * estimate.quantity).toFixed(2)}</td>
                        </tr>
                      `).join('')}   
                        <tr>
                            <td style="border: 1px solid lightgray; padding: 8px;"><strong>Subtotal</strong></td>
                            <td style="border: 1px solid lightgray; padding: 8px; text-align: right;"><strong>$${(charges.subtotal).toFixed(2)}</strong></td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid lightgray; padding: 8px;">GST (${charges.gstRate}%)</td>
                            <td style="border: 1px solid lightgray; padding: 8px; text-align: right;">$${charges.gstAmount}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid lightgray; padding: 8px;">Payment Processing Fee (${charges.customerProcessingFeeRate}%)</td>
                            <td style="border: 1px solid lightgray; padding: 8px; text-align: right;">$${charges.customerProcessingFee}</td>
                        </tr>
                       
                        <tr>
                            <td style="border: 1px solid lightgray; padding: 8px;"><strong>Total Amount Due</strong></td>
                            <td style="border: 1px solid lightgray; padding: 8px; text-align: right;"><strong>$${charges.customerPayable}</strong></td>
                        </tr>
                    </table>
                  <p><strong>Payment Method:</strong> Credit/Debit Card<br>
                  <strong>Transaction ID:</strong> RPT${quotation.id}</p>
                  <p style="color: #333333;">Thank you for your payment!</p>
                  <p style="color: #333333;">If you did not initiate this payment, kindly reach out to us via support.</p>
                `;

                let html = GenericEmailTemplate({ name: customer.name, subject: emailSubject, content: emailContent });
                const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: customer.language, saveToFile: false, useGoogle: true}) || html;            
                const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: customer.language}) || emailSubject;
                EmailService.send(customer.email, translatedSubject, translatedHtml);


                let receipthtml = GenericEmailTemplate({ name: customer.name, subject: 'Payment Receipt', content: receiptContent });
                const translatedReceiptHtml = await i18n.getTranslation({phraseOrSlug: receipthtml, targetLang: customer.language, saveToFile: false, useGoogle: true}) || html;            
                const translatedReceiptSubject = await i18n.getTranslation({phraseOrSlug: 'Payment Receipt', targetLang: customer.language}) || 'Payment Receipt';
                EmailService.send(customer.email, translatedReceiptSubject, translatedReceiptHtml);


            }




            const customerLang = customer.language;
            let nTitle = await i18n.getTranslation({
                phraseOrSlug: 'Job Booked',
                targetLang: customerLang
            });
            let nMessage = await i18n.getTranslation({
                phraseOrSlug: 'You have booked a job on Repairfind',
                targetLang: customerLang
            });
            
            NotificationService.sendNotification({
                user: customer.id,
                userType: 'customers',
                title: nTitle,
                type: 'JOB_BOOKED',
                message: nMessage,
                heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: nMessage,
                    customer: customer.id,
                    contractor: contractor.id,
                    event: 'JOB_BOOKED',
                }
            }, { push: true, socket: true, database: true });



            const contractorLang = contractor.language;
            nTitle = await i18n.getTranslation({
                phraseOrSlug: 'Job Booked',
                targetLang: contractorLang
            });
            nMessage = await i18n.getTranslation({
                phraseOrSlug: 'You have a booked job on Repairfind',
                targetLang: contractorLang
            });
            

            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: nTitle,
                type: 'JOB_BOOKED',
                message: nMessage,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: nMessage,
                    contractor: contractor.id,
                    customer: customer.id,
                    event: 'JOB_BOOKED',
                }
            }, { push: true, socket: true, database: true });


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


        const customerLang = customer.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Disputed',
            targetLang: customerLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: 'You have an open job dispute',
            targetLang: customerLang
        });
        
        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: nTitle,
            type: 'JOB_DISPUTED',
            message: nMessage,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                customer: customer.id,
                event: 'JOB_DISPUTED',
            }
        }, { database: true, push: true, socket: true });



        const contractorLang = contractor.language;
        nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Disputed',
            targetLang: contractorLang
        });
        nMessage = await i18n.getTranslation({
            phraseOrSlug: 'You have an open job dispute',
            targetLang: contractorLang
        });
        

        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: nTitle,
            type: 'JOB_DISPUTED',
            message: nMessage,
            heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                contractor: contractor.id,
                event: 'JOB_DISPUTED',
            }
        }, { database: true, push: true, socket: true });


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

        const customerLang = customer.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Marked Complete',
            targetLang: customerLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Contractor has marked job as completed',
            targetLang: customerLang
        });
        
        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: nTitle,
            type: event,
            message: nMessage,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                event: event,
            }
        }, { database: true, push: true, socket: true });


        const contractorLang = contractor.language;
        nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Marked Complete',
            targetLang: contractorLang
        });
        nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Job marked as completed',
            targetLang: contractorLang
        });
        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: nTitle,
            type: event,
            message: nMessage,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                event: event,
            }
        }, { database: true, push: true, socket: true });




        if (job.isAssigned) {
            // NotificationService.sendNotification({
            //     user: job.assignment.contractor,
            //     userType: 'contractors',
            //     title: 'Job Marked Complete',
            //     type: event, //
            //     message: `Job marked as completed`,
            //     heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
            //     payload: {
            //         entity: job.id,
            //         entityType: 'jobs',
            //         message: `Job marked as completed`,
            //         contractor: contractor.id,
            //         event: event,
            //     }
            // }, { push: true, socket: true, database: true })
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

        const contractorLang = contractor.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Completed',
            targetLang: contractorLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Job completion confirmed by customer',
            targetLang: contractorLang
        });
        
        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: nTitle,
            type: event,
            message: nMessage,
            heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                contractor: contractor.id,
                event: event,
            }
        }, { push: true, socket: true, database: true });



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

        const contractorLang = contractor.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Completed',
            targetLang: contractorLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: `Change order is ${state} for your job`,
            targetLang: contractorLang
        });
        
        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: nTitle,
            type: event,
            message: nMessage,
            heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                jobId: job.id,
                jobDayId: jobDay?.id,
                message: nMessage,
                event: event,
            }
        }, { push: true, socket: true, database: true });




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

        const customerLang = customer.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Completed',
            targetLang: customerLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Site visit estimate has been submitted',
            targetLang: customerLang
        });
        
        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: nTitle,
            type: 'SITE_VISIT_ESTIMATE_SUBMITTED',
            message: nMessage,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                customer: customer.id,
                event: 'SITE_VISIT_ESTIMATE_SUBMITTED',
                jobDayId: jobDay?.id,
                jobId: job.id,
                quotationId: quotation.id,
            }
        }, { push: true, socket: true, database: true });


        const contractorLang = contractor.language;
        nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Completed',
            targetLang: contractorLang
        });
        nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Site visit estimate has been submitted',
            targetLang: contractorLang
        });
        
        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: nTitle,
            type: 'SITE_VISIT_ESTIMATE_SUBMITTED',
            message: nMessage,
            heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                customer: customer.id,
                event: 'SITE_VISIT_ESTIMATE_SUBMITTED',
                jobDayId: jobDay?.id,
                jobId: job.id,
                quotationId: quotation.id,
            }
        }, { push: true, socket: true, database: true });



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


        const customerLang = customer.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Change order estimate submitted',
            targetLang: customerLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Change order estimate has been submitted',
            targetLang: customerLang
        });
        
        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: nTitle,
            type: 'CHANGE_ORDER_ESTIMATE_SUBMITTED',
            message: nMessage,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                customer: customer.id,
                event: 'CHANGE_ORDER_ESTIMATE_SUBMITTED',
                jobDayId: jobDay?.id,
                jobId: job.id,
                quotationId: quotation.id
            }
        }, { push: true, socket: true, database: true });



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

        const conversation = await ConversationUtil.updateOrCreateConversation(customer.id, 'customers', contractor.id, 'contractors')

        const customerLang = customer.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'New Job Bid',
            targetLang: customerLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Your job on Repairfind has received a new bid',
            targetLang: customerLang
        });
        
        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: nTitle,
            type: 'NEW_JOB_QUOTATION',
            message: nMessage,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                customer: customer.id,
                event: 'NEW_JOB_QUOTATION',
                quotationId: quotation.id,
                jobType: job.type,
                conversationId: conversation.id,
            }
        }, { push: true, socket: true, database: true });


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


        const customerLang = customer.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Bid Edited',
            targetLang: customerLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Job estimate has been edited by contractor',
            targetLang: customerLang
        });
        
        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: nTitle,
            type: 'JOB_QUOTATION_EDITED',
            message: nMessage,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                customer: customer.id,
                event: 'JOB_QUOTATION_EDITED',
                quotationId: quotation.id,
            }
        }, { push: true, socket: true, database: true });



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


        const contractorLang = contractor.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Change Order Estimate Paid',
            targetLang: contractorLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Change order estimate has been paid',
            targetLang: contractorLang
        });
        
        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: nTitle,
            type: 'CHANGE_ORDER_ESTIMATE_PAID',
            message: nMessage,
            heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: nMessage,
                customer: customer.id,
                event: 'CHANGE_ORDER_ESTIMATE_PAID',
                jobId: job.id,
                jobDayId: jobDay?.id
            }
        }, { push: true, socket: true, database: true });



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
        const contractorLang = contractor.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'JobDay Trip Started',
            targetLang: contractorLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: 'JobDay trip started',
            targetLang: contractorLang
        });
        
        NotificationService.sendNotification(
            {
                user: contractor.id,
                userType: 'contractors',
                title: nTitle,
                heading: { name: contractor.name, image: contractor.profilePhoto?.url },
                type: 'JOB_DAY_STARTED',
                message: nMessage,
                payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id, entityType: 'jobs', entity: job.id }
            },
            { push: true, socket: true, database: true }
        );


        if (job.isAssigned) {
            // send notification to  assigned contractor
            // NotificationService.sendNotification(
            //     {
            //         user: job.assignment.contractor,
            //         userType: 'contractors',
            //         title: 'JobDay Trip Started',
            //         heading: { name: contractor.name, image: contractor.profilePhoto?.url },
            //         type: 'JOB_DAY_STARTED',
            //         message: 'JobDay trip  started',
            //         payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id, entityType: 'jobs', entity: job.id }
            //     },
            //     {
            //         push: true,
            //         socket: true,
            //         database: true
            //     }
            // )
        }

        // send notification to customer
        const customerLang = customer.language;
        nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Day',
            targetLang: customerLang
        });
        nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Contractor is on his way',
            targetLang: customerLang
        });
        
        NotificationService.sendNotification({
            user: customer.id,
            userType: 'customers',
            title: nTitle,
            heading: { name: customer.name, image: customer.profilePhoto?.url },
            type: 'JOB_DAY_STARTED',
            message: nMessage,
            payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id, entityType: 'jobs', entity: job.id }
        },
            { push: true, socket: true, database: true });


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
        const customerLang = customer.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Day',
            targetLang: customerLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Contractor is at your site.',
            targetLang: customerLang
        });
        

        NotificationService.sendNotification(
            {
                user: customer.id,
                userType: 'customers',
                title: nTitle,
                heading: { name: contractor.name, image: contractor.profilePhoto?.url },
                type: 'JOB_DAY_ARRIVAL',
                message: nMessage,
                payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode, entityType: 'jobs', entity: job.id }
            },
            {
                push: true,
                socket: true,
                database: true
            }
        );


        // send notification to  contractor
        const contractorLang = contractor.language;
        nTitle = await i18n.getTranslation({
            phraseOrSlug: 'Job Day',
            targetLang: contractorLang
        });
        nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Job Day arrival, waiting for confirmation from customer.',
            targetLang: contractorLang
        });
        

        NotificationService.sendNotification(
            {
                user: contractor.id,
                userType: 'contractors',
                title: nTitle,
                heading: { name: customer.name, image: customer.profilePhoto?.url },
                type: 'JOB_DAY_ARRIVAL',
                message: nMessage,
                payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode, entityType: 'jobs', entity: job.id }
            },
            {
                push: true,
                socket: true,
                database: true
            }
        );


        if (job.isAssigned) {
            // NotificationService.sendNotification(
            //     {
            //         user: job.assignment.contractor,
            //         userType: 'contractors',
            //         title: 'JobDay',
            //         heading: { name: customer.name, image: customer.profilePhoto?.url },
            //         type: 'JOB_DAY_ARRIVAL',
            //         message: 'Job Day arrival, waiting for confirmation from customer.',
            //         payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode, entityType: 'jobs', entity: job.id }
            //     },
            //     {
            //         push: true,
            //         socket: true,
            //         database: true
            //     }
            // )
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
        const contractorLang = contractor.language;
        let nTitle = await i18n.getTranslation({
            phraseOrSlug: 'JobDay Confirmation',
            targetLang: contractorLang
        });
        let nMessage = await i18n.getTranslation({
            phraseOrSlug: 'Customer has confirmed your arrival.',
            targetLang: contractorLang
        });
        
        NotificationService.sendNotification(
            {
                user: job.contractor,
                userType: 'contractors',
                title: nTitle,
                heading: { name: customer.name, image: customer.profilePhoto?.url },
                type: 'JOB_DAY_CONFIRMED',
                message: nMessage,
                payload: { event: 'JOB_DAY_CONFIRMED', jobDayId: jobDay.id, entityType: 'jobs', entity: job.id }
            },
            {
                push: true,
                socket: true,
                database: true
            }
        );


        if (job.assignment) {
            // NotificationService.sendNotification(
            //     {
            //         user: job.assignment.contractor,
            //         userType: 'contractors',
            //         title: 'JobDay confirmation',
            //         heading: { name: customer.name, image: customer.profilePhoto?.url },
            //         type: 'JOB_DAY_CONFIRMED',
            //         message: 'Customer has confirmed your arrival.',
            //         payload: { event: 'JOB_DAY_CONFIRMED', jobDayId: jobDay.id, entityType: 'jobs', entity: job.id }
            //     },
            //     {
            //         push: true,
            //         socket: true,
            //         database: true
            //     }
            // )

        }

        // send notification to  customer
        const customerLang = customer.language;
        nTitle = await i18n.getTranslation({
            phraseOrSlug: 'JobDay confirmation',
            targetLang: customerLang
        });
        nMessage = await i18n.getTranslation({
            phraseOrSlug: "You successfully confirmed the contractor's arrival.",
            targetLang: customerLang
        });
        

        NotificationService.sendNotification(
            {
                user: job.customer,
                userType: 'customers',
                title: nTitle,
                heading: { name: contractor.name, image: contractor.profilePhoto?.url },
                type: 'JOB_DAY_CONFIRMED',
                message: nMessage,
                payload: { event: 'JOB_DAY_CONFIRMED', jobDayId: jobDay.id, entityType: 'jobs', entity: job.id }
            },
            { push: true, socket: true, database: true }
        );



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
                <h2>${emailSubject}</h2>
                <p>Hello ${customer.name},</p>
                <p style="color: #333333;">A refund for your job on Repairfind has been requested </p>
                <p style="color: #333333;">The refund should be completed in 24 hours </p>
                <p><strong>Job Title:</strong> ${job.description}</p>
                <p><strong>Job Amount</strong> ${payment.amount}</p>
                <p><strong>Refund Amount:</strong> ${refund.refundAmount}</p>
                `
        let html = GenericEmailTemplate({ name: customer.name, subject: emailSubject, content: emailContent })
        const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: customer.language, saveToFile: false, useGoogle: true}) || html;            
        const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: customer.language}) || emailSubject;
        EmailService.send(customer.email, translatedSubject, translatedHtml)


        // send notification to  contractor
        emailSubject = 'Job Refund Requested'
        emailContent = `
                <h2>${emailSubject}</h2>
                <p>Hello ${contractor.name},</p>
                <p style="color: #333333;">A refund for your job on Repairfind has been requested </p>
                <p style="color: #333333;">The refund should be completed in 24 hours </p>
                <p><strong>Job Title:</strong> ${job.description}</p>
                <p><strong>Job Amount</strong> ${payment.amount}</p>
                <p><strong>Refund Amount:</strong> ${refund.refundAmount}</p>
                `
        html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
        const translatedHtmlC = await i18n.getTranslation({phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true}) || html;            
        const translatedSubjectC = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: contractor.language}) || emailSubject;
        EmailService.send(contractor.email, translatedSubjectC, translatedHtmlC)


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
        devices.map(async (device) => {
            const contractor = await ContractorModel.findById(device.contractor)
            if (contractor) {
                const contractorLang = contractor.language;
                let nTitle = await i18n.getTranslation({
                    phraseOrSlug: 'New Job Enquiry',
                    targetLang: contractorLang
                });
                let nMessage = await i18n.getTranslation({
                    phraseOrSlug: 'A Job you saved on Repairfind has a new enquiry',
                    targetLang: contractorLang
                });
                
                NotificationService.sendNotification(
                    {
                        user: device.contractor.toString(),
                        userType: 'contractors',
                        title: nTitle,
                        type: 'NEW_JOB_ENQUIRY',
                        heading: { name: customer.name, image: customer.profilePhoto?.url },
                        message: nMessage,
                        payload: { event: 'NEW_JOB_ENQUIRY', entityType: 'jobs', entity: job.id }
                    },
                    { push: true, socket: true, database: true }
                );
            }

        });


        if (customer) {
            const customerLang = customer.language;
            let nTitle = await i18n.getTranslation({
                phraseOrSlug: 'New Job Enquiry',
                targetLang: customerLang
            });
            let nMessage = await i18n.getTranslation({
                phraseOrSlug: 'Your job on Repairfind has a new enquiry',
                targetLang: customerLang
            });
            
            NotificationService.sendNotification(
                {
                    user: customer.id,
                    userType: 'customers',
                    title: nTitle,
                    heading: { name: contractor.name, image: contractor.profilePhoto?.url },
                    type: 'NEW_JOB_ENQUIRY',
                    message: nMessage,
                    payload: { event: 'NEW_JOB_ENQUIRY', entityType: 'jobs', entity: job.id }
                },
                { push: true, socket: true, database: true }
            );

            
            let emailSubject = 'New Job Enquiry '
            let emailContent = `
                <h2>${emailSubject}</h2>
                <p>Hello ${customer.name},</p>
                <p style="color: #333333;">Your Job on Repairfind has a new enquiry</p>
                <div style="background: whitesmoke;padding: 10px; border-radius: 10px;">
                <p style="border-bottom: 1px solid lightgray; padding-bottom: 5px;"><strong>Job Title:</strong> ${job.description}</p>
                <p style="border-bottom: 1px solid lightgray; padding-bottom: 5px;"><strong>Enquiry:</strong> ${enquiry.enquiry}</p>
                </div>
                <p style="color: #333333;">Do well to check and follow up as soon as possible </p>
                `
            let html = GenericEmailTemplate({ name: customer.name, subject: emailSubject, content: emailContent })
            const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: customer.language, saveToFile: false, useGoogle: true}) || html;            
            const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: customer.language}) || emailSubject;
            EmailService.send(customer.email, translatedSubject, translatedHtml)
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
        const deviceTokens = devices.map(device => device.expoToken);


        devices.map( async(device) => {
            const contractor = await ContractorModel.findById(device.contractor)
            if(contractor){
                const contractorLang = contractor.language;
                let nTitle = await i18n.getTranslation({
                    phraseOrSlug: 'New Job Enquiry Reply',
                    targetLang: contractorLang
                });
                let nMessage = await i18n.getTranslation({
                    phraseOrSlug: 'A job you are following on Repairfind has a new reply from the customer',
                    targetLang: contractorLang
                });
                
                NotificationService.sendNotification(
                    {
                        user: contractor.id,
                        userType: 'contractors',
                        title: nTitle,
                        type: 'NEW_JOB_ENQUIRY_REPLY',
                        heading: { name: customer.name, image: customer.profilePhoto?.url },
                        message: nMessage,
                        payload: { event: 'NEW_JOB_ENQUIRY_REPLY', entityType: 'jobs', entity: job.id }
                    },
                    { push: true, socket: true, database: true }
                );
                
            }
        });



        // send notification to  contractor  that asked the question
        if (customer && contractor) {
            let emailSubject = 'Job Enquiry Reply'
            let emailContent = `
                    <h2>${emailSubject}</h2>
                    <p>Hello ${contractor.name},</p>
                    <p style="color: #333333;">Customer has replied to your enquiry on Repairfind</p>
                    <p style="color: #333333;">Do well to check and follow up </p>
                    <p><strong>Job Title:</strong> ${job.description}</p>
                    <p><strong>Your Enquiry</strong> ${enquiry.enquiry}</p>
                    <p><strong>Reply</strong> ${enquiry.replies ? enquiry.replies[0] : ''}</p>
                    `
            let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
            const translatedHtml = await i18n.getTranslation({phraseOrSlug: html, targetLang: contractor.language, saveToFile: false, useGoogle: true}) || html;            
            const translatedSubject = await i18n.getTranslation({phraseOrSlug: emailSubject, targetLang: contractor.language}) || emailSubject;
            EmailService.send(contractor.email, translatedSubject, translatedHtml)
        }




    } catch (error) {
        Logger.error(`Error handling NEW_JOB_ENQUIRY_REPLY event: ${error}`);
    }
});