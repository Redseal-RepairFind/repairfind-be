import { Document, ObjectId, Schema, model } from "mongoose";
import { PAYMENT_TYPE } from "./payment.schema";
import { PaymentUtil } from "../../utils/payment.util";
import { COUPON_TYPE, COUPON_VALUE_TYPE } from "./coupon.schema";

export enum JOB_QUOTATION_STATUS {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
    COMPLETED = 'COMPLETED',
}

export enum JOB_QUOTATION_TYPE {
    SITE_VISIT = 'SITE_VISIT',
    JOB_DAY = 'JOB_DAY',
}



export interface IJobQuotationEstimate {
    description: string;
    quantity: number;
    rate: number;
    amount?: number;
}

export interface IQuotationDiscount {
    coupon: ObjectId;
    value: number;
    valueType: COUPON_VALUE_TYPE,
}


// Define interface for extra estimates
export interface IExtraEstimate extends Document {
    estimates: IJobQuotationEstimate[];
    isPaid: boolean;
    payment?: ObjectId;
    date: Date;
    charges: object
    customerDiscount: IQuotationDiscount
    contractorDiscount: IQuotationDiscount
}



export interface IJobQuotation extends Document {
    contractor: ObjectId;
    job: ObjectId;
    status: JOB_QUOTATION_STATUS;
    type: JOB_QUOTATION_TYPE;
    estimates: IJobQuotationEstimate[];
    startDate: Date;
    endDate: Date;
    siteVisit: Date;
    charges: object;
    payment: ObjectId;
    isPaid: boolean;
    changeOrderEstimate: IExtraEstimate;
    siteVisitEstimate: IExtraEstimate;
    responseTime: number;
    estimatedDuration: number;
    customerDiscount: IQuotationDiscount
    contractorDiscount: IQuotationDiscount
    calculateCharges: (type?: string)  => {
        subtotal: number, 
        gstAmount: number, 
        customerPayable: number,
        contractorPayable: number, 
        repairfindServiceFee:number, 
        customerProcessingFee:number, 
        contractorProcessingFee:number,
        gstRate:number,
        repairfindServiceFeeRate:number,
        contractorProcessingFeeRate:number,
        customerProcessingFeeRate:number,
    }; 

}

// Define schema for job quotation estimates
const JobQuotationEstimateSchema = new Schema<IJobQuotationEstimate>({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number }
});

const QuotationDiscountSchema = new Schema<IQuotationDiscount>({
    coupon: {type: Schema.Types.ObjectId, ref: 'coupons'}, 
    value: {type: Number}, 
    valueType: { type: String, enum: Object.values(COUPON_VALUE_TYPE)},
});


// Define schema for extra estimates
export const ExtraEstimateSchema = new Schema<IExtraEstimate>({
    estimates: { type: [JobQuotationEstimateSchema], required: true },
    isPaid: { type: Boolean, default: false },
    payment: { type: Schema.Types.ObjectId, ref: 'payments' },
    date: { type: Date, required: true },
    charges: { type: Schema.Types.Mixed },
    customerDiscount: QuotationDiscountSchema, 
    contractorDiscount: QuotationDiscountSchema
});



const JobQuotationSchema = new Schema<IJobQuotation>({
    contractor: { type: Schema.Types.ObjectId, ref: 'contractors', required: true },
    job: { type: Schema.Types.ObjectId, ref: 'jobs', required: true },
    status: { type: String, enum: Object.values(JOB_QUOTATION_STATUS), default: JOB_QUOTATION_STATUS.PENDING },
    type: { type: String, enum: Object.values(JOB_QUOTATION_TYPE), default: JOB_QUOTATION_TYPE.JOB_DAY },
    estimates: { type: [JobQuotationEstimateSchema], required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    siteVisit: { type: Date, required: false },
    payment: { type: Schema.Types.ObjectId, ref: 'payments' },
    charges: { type: Schema.Types.Mixed },
    isPaid: { type: Boolean, default: false },
    changeOrderEstimate: { type: ExtraEstimateSchema },
    siteVisitEstimate: { type: ExtraEstimateSchema },
    responseTime: { type: Number, default: 0 },
    estimatedDuration: { type: Number, default: 0 },
    customerDiscount: QuotationDiscountSchema, 
    contractorDiscount: QuotationDiscountSchema 

}, { timestamps: true });



// Define the static method to calculate charges
JobQuotationSchema.methods.calculateCharges = async function (type = null) {

    let estimates = this.estimates
    let totalEstimateAmount = 0
    let customerDiscount = this.customerDiscount
    let contractorDiscount = this.contractorDiscount

    if(type){
        if (type == PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) {
            estimates = this?.changeOrderEstimate?.estimates
            customerDiscount = undefined
            contractorDiscount = undefined
        }
    
        if (type == PAYMENT_TYPE.SITE_VISIT_PAYMENT) {
            estimates = this?.siteVisitEstimate?.estimates
            customerDiscount = this.siteVisitEstimate.customerDiscount
            contractorDiscount = this.siteVisitEstimate.contractorDiscount
        }
    }else{
        //merge all arrays
        const siteVisitEstimateNotPaid = this?.siteVisitEstimate?.isPaid === false ? this.siteVisitEstimate.estimates : [];
        estimates = [
            ...siteVisitEstimateNotPaid,
            ...(this?.changeOrderEstimate?.estimates ?? []),
            ...(this.estimates ?? [])
        ];
        
    }
   

    if(estimates){
        estimates.forEach((estimate: any) => {
            totalEstimateAmount += estimate.rate * estimate.quantity;
        });
    }
   
    

    const charges = await PaymentUtil.calculateCharges({totalEstimateAmount, customerDiscount, contractorDiscount})
    return charges
};




JobQuotationSchema.set('toObject', { virtuals: true });
JobQuotationSchema.set('toJSON', { virtuals: true });

const JobQuotationModel = model<IJobQuotation>('job_quotations', JobQuotationSchema);



export { JobQuotationModel };
