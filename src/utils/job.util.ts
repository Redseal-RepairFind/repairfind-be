import { ObjectId } from "mongoose";
import { IJob } from "../database/common/job.model";
import { JobQuotationModel } from "../database/common/job_quotation.model";
import { PAYMENT_TYPE } from "../database/common/payment.schema";


const populate = async (job: any, contractorId?: ObjectId) => {

    const contract = await JobQuotationModel.findOne({ _id: job.contract, job: job.id });
    if(contract){
        if(contract.changeOrderEstimate)contract.changeOrderEstimate.charges  = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
        if(contract.siteVisitEstimate)contract.siteVisitEstimate.charges  = await contract.calculateCharges(PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) ?? {}
        contract.charges  = await contract.calculateCharges()
        job.contract = contract
    }
    
    const myQuotation = await job.getMyQuotation(contractorId)
    const totalEnquires = await job.getTotalEnquires()
    const hasUnrepliedEnquiry = await job.getHasUnrepliedEnquiry()
    
    return { 
        contract,
        totalEnquires,
        hasUnrepliedEnquiry,
        myQuotation
    };
};



export const JobUtil = {
    populate
}