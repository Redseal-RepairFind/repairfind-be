import { Request } from 'express';
import { BadRequestError } from '../../utils/custom.errors';
import { Log } from '../../utils/logger';
import { CertnService } from '..';

export const CertnWebhookHandler = async (req: Request) => {
    try {
        const eventType = req.headers['event-type'];
        const eventData = req.body;

        switch (eventType) {
            case 'applicant_created':
                handleApplicantCreated(eventData);
                break;
            case 'report_completed':
                handleReportCompleted(eventData);
                break;
            case 'report_failed':
                handleReportFailed(eventData);
                break;
            case 'report_retrieved':
                handleReportRetrieved(eventData);
                break;
            // Add more cases for other Certn event types
            default:
                console.log(`Unhandled Certn event type: ${eventType}`, eventData);
                break;
        }
    } catch (error: any) {
        console.error('Error handling Certn webhook:', error.message || "Something went wrong inside Certn webhook");
    }
};

const handleApplicantCreated = async (payload: any) => {
    try {
        // Handle applicant created event
        const applicantId = payload.applicant_id;
        // Fetch applicant details from Certn using CertnService
        const applicantDetails = await CertnService.initiateCertnInvite(applicantId);
        // Update database or perform other actions based on applicant details
        console.log('applicantDetails')
    } catch (error: any) {
        console.error('Error handling Certn applicant created event:', error.message || "Something went wrong");
    }
};

const handleReportCompleted = async (payload: any) => {
    try {
        // Handle report completed event
        const reportId = payload.report_id;
        // Fetch report details from Certn using CertnService
        // const reportDetails = await CertnService.getReportDetails(reportId);
        // Update database or perform other actions based on report details
    } catch (error: any) {
        console.error('Error handling Certn report completed event:', error.message || "Something went wrong");
    }
};

const handleReportFailed = async (payload: any) => {
    try {
        // Handle report failed event
        const reportId = payload.report_id;
        // Fetch report details from Certn using CertnService
        // const reportDetails = await CertnService.getReportDetails(reportId);
        // Update database or perform other actions based on report details
    } catch (error: any) {
        console.error('Error handling Certn report failed event:', error.message || "Something went wrong");
       
    }
};

const handleReportRetrieved = async (payload: any) => {
    try {
        // Handle report retrieved event
        const reportId = payload.report_id;
        // Fetch report details from Certn using CertnService
        // const reportDetails = await CertnService.getReportDetails(reportId);
        // Update database or perform other actions based on report details
    } catch (error: any) {
        console.error('Error handling Certn report retrieved event:', error.message || "Something went wrong");
       
    }
};

// Add more handler functions as needed for different Certn event types
