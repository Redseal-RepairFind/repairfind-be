import { EventEmitter } from 'events';
import { EmailService, NotificationService } from '../services';
import { htmlJobRequestTemplate } from '../templates/contractorEmail/jobRequestTemplate';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { IJob, JOB_SCHEDULE_TYPE, JOB_STATUS, JobModel } from '../database/common/job.model';
import { ConversationModel } from '../database/common/conversations.schema';
import { SocketService } from '../services/socket';
import { IContractor } from '../database/contractor/interface/contractor.interface';
import { ICustomer } from '../database/customer/interface/customer.interface';
import { NewJobAssignedEmailTemplate } from '../templates/contractorEmail/job_assigned.template';
import { JobCanceledEmailTemplate } from '../templates/common/job_canceled.template';
import { IJobDay, JobDayModel } from '../database/common/job_day.model';
import { IJobEmergency } from '../database/common/job_emergency.model';
import { JobEmergencyEmailTemplate } from '../templates/common/job_emergency_email';
import { GenericEmailTemplate } from '../templates/common/generic_email';
import { IJobDispute } from '../database/common/job_dispute.model';
import { IExtraEstimate, IJobQuotation } from '../database/common/job_quotation.model';
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../database/common/transaction.model';

export const JobEvent: EventEmitter = new EventEmitter();

JobEvent.on('NEW_JOB_REQUEST', async function (payload) {
    try {
        console.log('handling NEW_JOB_REQUEST event')

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
        console.error(`Error handling NEW_JOB_REQUEST event: ${error}`);
    }
});


JobEvent.on('NEW_JOB_LISTING', async function (payload) {
    try {
        console.log('handling alert NEW_JOB_LISTING event')
        const job = await JobModel.findById(payload.jobId)

        if (job) {

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

JobEvent.on('JOB_CANCELED', async function (payload: { job: IJob, canceledBy: string }) {
    try {
        console.log('handling alert JOB_CANCELED event')
        const customer = await CustomerModel.findById(payload.job.customer) as ICustomer
        const contractor = await ContractorModel.findById(payload.job.contractor) as IContractor

        if (payload.canceledBy == 'contractor') {
            console.log('job cancelled by contractor')

            if (customer) {
                //send email to customer 
                const html = JobCanceledEmailTemplate({ name: customer.name, canceledBy: 'contractor', job: payload.job })
                EmailService.send(customer.email, "Job Canceled", html)
            }


        }
        if (payload.canceledBy == 'customer') {
            console.log('job cancelled by customer')

            if (contractor) {
                //send email to customer 
                const html = JobCanceledEmailTemplate({ name: contractor.name, canceledBy: 'customer', job: payload.job })
                EmailService.send(contractor.email, "Job Canceled", html)
            }




            // TODO: apply the guideline below and create cancelationData
            // Cancel jobs: Customers have the option to cancel jobs based on the following guidelines:
            // Free cancellation up to 48 hours before the scheduled job time..
            // For cancellations made within 24 hours, regardless of the job's cost, a $50 cancellation fee is applied. 80% of this fee is directed to the contractor, while the remaining 20% is retained by us.





        }

    } catch (error) {
        console.error(`Error handling JOB_CANCELED event: ${error}`);
    }
});


JobEvent.on('JOB_DAY_EMERGENCY', async function (payload: { jobEmergency: IJobEmergency }) {
    try {
        console.log('handling alert JOB_DAY_EMERGENCY event')
        const customer = await CustomerModel.findById(payload.jobEmergency.customer)
        const contractor = await ContractorModel.findById(payload.jobEmergency.contractor)
        const job = await JobModel.findById(payload.jobEmergency.job) as IJob


        if (job && contractor && customer) {
            if (payload.jobEmergency.triggeredBy == 'contractor') {
                console.log('job emergency triggered by contractor')
                if (customer) {
                    const html = JobEmergencyEmailTemplate({ name: customer.name, emergency: payload.jobEmergency, job })
                    EmailService.send(customer.email, "Job Emergency", html)
                }
            }
            if (payload.jobEmergency.triggeredBy == 'customer') {
                console.log('job emergency triggered by customer')
                if (contractor) {
                    const html = JobEmergencyEmailTemplate({ name: contractor.name, emergency: payload.jobEmergency, job })
                    EmailService.send(contractor.email, "Job Emergency", html)
                }
            }

            // send socket notification to general admins alert channel
            SocketService.broadcastChannel('admin_alerts', 'NEW_JOB_EMERGENCY', {
                type: 'NEW_JOB_EMERGENCY',
                message: 'A new Job emergency has been reported',
                data: { emergency: payload.jobEmergency, job, customer: customer.toJSON(), contractor: contractor.toJSON() }
            });

        }


    } catch (error) {
        console.error(`Error handling JOB_DAY_EMERGENCY event: ${error}`);
    }
});


JobEvent.on('JOB_RESCHEDULE_DECLINED_ACCEPTED', async function (payload: { job: IJob, action: string }) {
    try {
        console.log('handling alert JOB_RESCHEDULE_DECLINED_ACCEPTED event', payload.action)

        const customer = await CustomerModel.findById(payload.job.customer)
        const contractor = await ContractorModel.findById(payload.job.contractor)


        if (contractor && customer) {
            if (payload.job.reschedule?.createdBy == 'contractor') { // send mail to contractor
                let emailSubject = 'Job Schedule'
                let emailContent = `
                <p style="color: #333333;">Your Job reschedule request on Repairfind has been ${payload.action} by customer</p>
                <p><strong>Job Title:</strong> ${payload.job.description}</p>
                <p><strong>Proposed Date:</strong> ${payload.job.reschedule.date}</p>
                `
                let html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent })
                EmailService.send(contractor.email, emailSubject, html)

            }
            if (payload.job.reschedule?.createdBy == 'customer') { // send mail to  customer
                let emailSubject = 'Job Schedule'
                let emailContent = `
                <p style="color: #333333;">Your Job reschedule request on Repairfind has been ${payload.action}  by the contractor</p>
                <p><strong>Job Title:</strong> ${payload.job.description}</p>
                <p><strong>Proposed Date:</strong> ${payload.job.reschedule.date}</p>
                `
                let html = GenericEmailTemplate({ name: customer.name, subject: emailSubject, content: emailContent })
                EmailService.send(customer.email, emailSubject, html)
            }

        }


    } catch (error) {
        console.error(`Error handling JOB_RESCHEDULE_DECLINED_ACCEPTED event: ${error}`);
    }
});


JobEvent.on('NEW_JOB_RESCHEDULE_REQUEST', async function (payload: { job: IJob, action: string }) {
    try {
        console.log('handling alert NEW_JOB_RESCHEDULE_REQUEST event', payload.action)

        const customer = await CustomerModel.findById(payload.job.customer)
        const contractor = await ContractorModel.findById(payload.job.contractor)


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
            }

        }


    } catch (error) {
        console.error(`Error handling NEW_JOB_RESCHEDULE_REQUEST event: ${error}`);
    }
});


JobEvent.on('JOB_DISPUTE_CREATED', async function (payload: { dispute: IJobDispute }) {
    try {
        console.log('handling alert JOB_DISPUTE_CREATED event', payload.dispute)

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
            type: 'JOB_DISPUTED', // Conversation, Conversation_Notification
            //@ts-ignore
            message: `You have an open job dispute`,
            //@ts-ignore
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
                entity: dispute.id,
                entityType: 'disputes',
                message: `You have an open job dispute`,
                contractor: contractor.id,
                event: 'JOB_DISPUTED',
            }
        }, { database: true, push: true, socket: true })

        if (job.isAssigned) {
            NotificationService.sendNotification({
                user: job.assignment.contractor,
                userType: 'contractors',
                title: 'Job Disputed',
                type: 'JOB_DISPUTED', //
                message: `You have an open job dispute`,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: dispute.id,
                    entityType: 'disputes',
                    message: `You have an open job dispute`,
                    contractor: contractor.id,
                    event: 'JOB_DISPUTED',
                }
            }, { database: true, push: true, socket: true })
        }

        // send socket notification to general admins alert channel
        SocketService.broadcastChannel('admin_alerts', 'NEW_DISPUTED_JOB', {
            type: 'NEW_DISPUTED_JOB',
            message: 'A new Job dispute has been reported',
            data: { dispute }
        });



    } catch (error) {
        console.error(`Error handling JOB_DISPUTE_CREATED event: ${error}`);
    }
});


JobEvent.on('JOB_MARKED_COMPLETE_BY_CONTRACTOR', async function (payload: { job: IJob }) {
    try {
        console.log('handling alert JOB_MARKED_COMPLETE_BY_CONTRACTOR event', payload.job.id)
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
            message: `contractor has marked job has completed`,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `contractor has marked job has completed`,
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
        console.error(`Error handling JOB_MARKED_COMPLETE_BY_CONTRACTOR event: ${error}`);
    }
});


JobEvent.on('JOB_COMPLETED', async function (payload: { job: IJob }) {
    try {
        console.log('handling alert JOB_COMPLETED event', payload.job.id)

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
        }, { push: true, socket: true })

        if (job.isAssigned) {
            NotificationService.sendNotification({
                user: job.assignment.contractor,
                userType: 'contractors',
                title: 'Job Completed',
                type: event,
                message: `Job completion confirmed by customer`,
                heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `Job completion confirmed by customer`,
                    contractor: contractor.id,
                    event: event,
                }
            }, { push: true, socket: true })
        }

         //approve payout here - change status to approved and use  cron jobs to schedule the transfer
         const transaction = await TransactionModel.findOne({job: job.id, type: TRANSACTION_TYPE.TRANSFER})
         if(transaction){
            transaction.status = TRANSACTION_STATUS.APPROVED
            const metadata = transaction.metadata ?? {}
            transaction.metadata = { ...metadata, event }
            transaction.save()
         }

    } catch (error) {
        console.error(`Error handling JOB_COMPLETED event: ${error}`);
    }
});


JobEvent.on('JOB_CHANGE_ORDER', async function (payload: { job: IJob }) {
    try {
        console.log('handling JOB_CHANGE_ORDER event', payload.job.id)

        const job = await JobModel.findById(payload.job.id)

        if (!job) {
            return
        }

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
            message: `change order is ${state} for your job`,
            heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `change order is ${state} for your job`,
                event: event,
            }
        }, { push: true, socket: true })

        if (job.isAssigned) {
            NotificationService.sendNotification({
                user: job.assignment.contractor,
                userType: 'contractors',
                title: 'Job Completed',
                type: event, //
                message: `Change order is ${state}`,
                heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `Change order is ${state}`,
                    event: event,
                }
            }, { push: true, socket: true })
        }

    } catch (error) {
        console.error(`Error handling JOB_CHANGE_ORDER event: ${error}`);
    }
});


JobEvent.on('SITE_VISIT_ESTIMATE_SUBMITTED', async function (payload: { job: IJob, quotation: IJobQuotation }) {
    try {
        console.log('handling SITE_VISIT_ESTIMATE_SUBMITTED event', payload.job.id)

        const job = await JobModel.findById(payload.job.id)

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
            message: `change order estimate has been submitted`,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `site visit estimate has been submitted`,
                customer: customer.id,
                event: 'SITE_VISIT_ESTIMATE_SUBMITTED',
                jobDayId: jobDay?.id,
                jobId: job.id,
            }
        }, { push: true, socket: true })

        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: 'Job Completed',
            type: 'SITE_VISIT_ESTIMATE_SUBMITTED', //
            message: `change order estimate has been submitted`,
            heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `site visit estimate has been submitted`,
                customer: customer.id,
                event: 'SITE_VISIT_ESTIMATE_SUBMITTED',
                jobDayId: jobDay?.id,
                jobId: job.id,
            }
        }, { push: true, socket: true })


    } catch (error) {
        console.error(`Error handling SITE_VISIT_ESTIMATE_SUBMITTED event: ${error}`);
    }
});

JobEvent.on('CHANGE_ORDER_ESTIMATE_SUBMITTED', async function (payload: { job: IJob, quotation: IJobQuotation }) {
    try {
        console.log('handling CHANGE_ORDER_ESTIMATE_SUBMITTED event', payload.job.id)

        const job = await JobModel.findById(payload.job.id)

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
                extraEstimate: payload.quotation
            }
        }, { push: true, socket: true })


        if (job.isAssigned) {
            NotificationService.sendNotification({
                user: contractor.id,
                userType: 'contractors',
                title: 'Change order estimate submitted',
                type: 'CHANGE_ORDER_ESTIMATE_SUBMITTED', //
                message: `Change order estimate has been submitted`,
                heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
                payload: {
                    entity: job.id,
                    entityType: 'jobs',
                    message: `Change order estimate has been submitted`,
                    customer: customer.id,
                    event: 'CHANGE_ORDER_ESTIMATE_SUBMITTED',
                    jobDayId: jobDay?.id,
                    jobId: job.id,
                    extraEstimate: payload.quotation
                }
            }, { push: true, socket: true })
        }




    } catch (error) {
        console.error(`Error handling CHANGE_ORDER_ESTIMATE_SUBMITTED event: ${error}`);
    }
});


JobEvent.on('CHANGE_ORDER_ESTIMATE_PAID', async function (payload: { job: IJob, quotation: IJobQuotation, extraEstimate: IExtraEstimate }) {
    try {
        console.log('handling CHANGE_ORDER_ESTIMATE_PAID event', payload.job.id)

        const job = payload.job
        if (!job) return

        const customer = await CustomerModel.findById(job.customer)
        const contractor = await ContractorModel.findById(job.contractor)

        if (!customer || !contractor) return



        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: 'Change Order Estimate Paid',
            type: 'CHANGE_ORDER_ESTIMATE_PAID', //
            message: `change order estimate has been paid`,
            heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: job.id,
                entityType: 'jobs',
                message: `change order estimate has been paid`,
                customer: customer.id,
                event: 'CHANGE_ORDER_ESTIMATE_PAID',
                extraEstimate: payload.extraEstimate,
                jobId: job.id
            }
        }, { push: true, socket: true })


    } catch (error) {
        console.error(`Error handling CHANGE_ORDER_ESTIMATE_PAID event: ${error}`);
    }
});


// JOB DAY
JobEvent.on('JOB_DAY_STARTED', async function (payload: { job: IJob, jobDay: IJobDay }) {
    try {
        console.log('handling alert JOB_DAY_STARTED event', payload.job.id)

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
                message: 'JobDay Trip successfully started',
                payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id }
            },
            {
                push: true,
                socket: true,
                // database: true
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
                    message: 'JobDay Trip successfully started',
                    payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id }
                },
                {
                    push: true,
                    socket: true,
                    // database: true
                }
            )
        }

        // send notification to customer
        NotificationService.sendNotification(
            {
                user: customer.id,
                userType: 'customers',
                title: 'jobDay',
                heading: {},
                type: 'JOB_DAY_STARTED',
                message: 'Contractor has started JobDay Trip to your site.',
                payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id }
            },
            {
                push: true,
                socket: true,
                // database: true
            }
        )

    } catch (error) {
        console.error(`Error handling JOB_MARKED_COMPLETE_BY_CONTRACTOR event: ${error}`);
    }
});


JobEvent.on('JOB_DAY_ARRIVAL', async function (payload: { jobDay: IJobDay, verificationCode: number }) {
    try {
        console.log('handling alert JOB_DAY_ARRIVAL event', payload.jobDay.id)

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
                payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode }
            },
            {
                push: true,
                socket: true,
            }
        )

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: contractor.id,
                userType: 'contractors',
                title: 'JobDay',
                heading: {},
                type: 'JOB_DAY_ARRIVAL',
                message: 'Job Day arrival, waiting for confirmation from customer.',
                payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode }
            },
            {
                push: true,
                socket: true,
            }
        )

        if (job.isAssigned) {
            NotificationService.sendNotification(
                {
                    user: job.assignment.contractor,
                    userType: 'contractors',
                    title: 'JobDay',
                    heading: {},
                    type: 'JOB_DAY_ARRIVAL',
                    message: 'Job Day arrival, waiting for confirmation from customer.',
                    payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode }
                },
                {
                    push: true,
                    socket: true,
                }
            )
        }

    } catch (error) {
        console.error(`Error handling JOB_DAY_ARRIVAL event: ${error}`);
    }
});



JobEvent.on('JOB_REFUND_REQUESTED', async function (payload: {job: any, payment: any, refund: any }) {
    try {
        console.log('handling alert JOB_REFUND_REQUESTED event', payload.payment.id)

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
        console.error(`Error handling JOB_REFUND_REQUESTED event: ${error}`);
    }
});