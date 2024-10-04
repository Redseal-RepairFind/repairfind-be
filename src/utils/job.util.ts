import { ObjectId } from "mongoose";
import { IJob } from "../database/common/job.model";
import { JobQuotationModel } from "../database/common/job_quotation.model";
import { PAYMENT_TYPE } from "../database/common/payment.schema";

interface PopulateOptions {
    contract?: boolean;
    totalEnquires?: boolean;
    hasUnrepliedEnquiry?: boolean;
    myQuotation?: boolean;
    jobDay?: boolean;
    dispute?: boolean;
}

const populate = async (
    job: any, 
    options: PopulateOptions = {}
) => {
    const tasks: Promise<void>[] = [];
    const result: any = {};

    if (options.contract) {
        const contractTask = JobQuotationModel.findOne({ _id: job.contract, job: job.id }).then(async contract => {
            if (contract) {
                if (contract.changeOrderEstimate) 
                    contract.changeOrderEstimate.charges = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {};
                if (contract.siteVisitEstimate) 
                    contract.siteVisitEstimate.charges = await contract.calculateCharges(PAYMENT_TYPE.SITE_VISIT_PAYMENT) ?? {};
                contract.charges = await contract.calculateCharges();
               
                result.contract = contract;
            }
            console.log(contract)
        });
       
        tasks.push(contractTask);
    }

    if (options.totalEnquires) {
        const totalEnquiresTask = job.getTotalEnquires().then((totalEnquires: any) => {
            result.totalEnquires = totalEnquires;
        });
        tasks.push(totalEnquiresTask);
    }

    if (options.hasUnrepliedEnquiry) {
        const hasUnrepliedEnquiryTask = job.getHasUnrepliedEnquiry().then((hasUnrepliedEnquiry: any) => {
            result.hasUnrepliedEnquiry = hasUnrepliedEnquiry;
        });
        tasks.push(hasUnrepliedEnquiryTask);
    }

    if (options.myQuotation) {
        const myQuotationTask = job.getMyQuotation(options.myQuotation).then( async (myQuotation: any) => {
            myQuotation.charges = await myQuotation.calculateCharges()
            if(myQuotation.siteVisitEstimate)myQuotation.siteVisitEstimate.charges = await myQuotation.calculateCharges(PAYMENT_TYPE.SITE_VISIT_PAYMENT)
            if(myQuotation.changeOrderEstimate)myQuotation.changeOrderEstimate.charges = await myQuotation.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)
            result.myQuotation = myQuotation;
        });
        tasks.push(myQuotationTask);
    }

    if (options.jobDay) {
        const jobDayTask = job.getJobDay().then((jobDay: any) => {
            result.jobDay = jobDay;
        });
        tasks.push(jobDayTask);
    }

    if (options.dispute) {
        const disputeTask = job.getJobDispute().then((dispute: any) => {
            result.dispute = dispute;
        });
        tasks.push(disputeTask);
    }

    // Wait for all tasks to complete
    await Promise.all(tasks);

    return result;
};

export const JobUtil = {
    populate
};
