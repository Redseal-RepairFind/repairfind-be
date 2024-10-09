import { Document, ObjectId, Schema, model } from "mongoose";
import { PAYMENT_TYPE } from "./payment.schema";
import { PaymentUtil } from "../../utils/payment.util";

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


// Define interface for extra estimates
export interface IExtraEstimate extends Document {
    estimates: IJobQuotationEstimate[];
    isPaid: boolean;
    payment?: ObjectId;
    date: Date;
    charges: object
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
    customerDiscount: {coupon: ObjectId, value: number}  // {code: "CUSHY43", value: 10} 
    contractorDiscount: {coupon: ObjectId, value: number}  // {code: "CUSHY43", value: 10}
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

// Define schema for extra estimates
export const ExtraEstimateSchema = new Schema<IExtraEstimate>({
    estimates: { type: [JobQuotationEstimateSchema], required: true },
    isPaid: { type: Boolean, default: false },
    payment: { type: Schema.Types.ObjectId, ref: 'payments' },
    date: { type: Date, required: true },
    charges: { type: Schema.Types.Mixed }
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
    customerDiscount: {coupon: {type: Schema.Types.ObjectId, ref: 'user_coupons'}, value: {type: Number}}, 
    contractorDiscount: {coupon: {type: Schema.Types.ObjectId, ref: 'user_coupons'}, value: {type: Number}} 

}, { timestamps: true });



// Define the static method to calculate charges
JobQuotationSchema.methods.calculateCharges = async function (type = null) {

    let estimates = this.estimates
    let totalEstimateAmount = 0

    if(type){
        if (type == PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) {
            estimates = this?.changeOrderEstimate?.estimates
        }
    
        if (type == PAYMENT_TYPE.SITE_VISIT_PAYMENT) {
            estimates = this?.siteVisitEstimate?.estimates
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
   

    const charges = await PaymentUtil.calculateCharges(totalEstimateAmount)
    return charges
};




// JobQuotationSchema.virtual('charges').get(function () {
//     let totalEstimateAmount = 0;
//     let estimates: any = this.estimates

//     estimates.forEach((estimate: any) => {
//         totalEstimateAmount += estimate.rate * estimate.quantity;
//     });

//     let subtotal, repairfindServiceFee, gst, totalAmount, contractorAmount, customerProcessingFee, contractorProcessingFee, siteVisitAmount = 0;

//     if (totalEstimateAmount <= 1000) {
//         repairfindServiceFee = parseFloat(((10 / 100) * totalEstimateAmount).toFixed(2));
//     } else if (totalEstimateAmount <= 5000) {
//         repairfindServiceFee = parseFloat(((8 / 100) * totalEstimateAmount).toFixed(2));
//     } else {
//         repairfindServiceFee = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));
//     }

//     customerProcessingFee   = parseFloat(((3 / 100) * totalEstimateAmount).toFixed(2));
//     contractorProcessingFee   = parseFloat(((3 / 100) * totalEstimateAmount).toFixed(2));

//     gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));
//     subtotal = totalEstimateAmount;
//     totalAmount = (subtotal + repairfindServiceFee + gst + customerProcessingFee).toFixed(2);
//     contractorAmount = (subtotal + gst - contractorProcessingFee).toFixed(2);

    
//     return { subtotal, repairfindServiceFee, gst, totalAmount, contractorAmount, customerProcessingFee, contractorProcessingFee };
// });



// JobQuotationSchema.virtual('changeOrderEstimate.charges').get(function () {


//     let totalEstimateAmount = 0;

//     let estimates: any = []
//     if (this.changeOrderEstimate) {
//         estimates = this.changeOrderEstimate.estimates
//     }

//     estimates.forEach((estimate: any) => {
//         totalEstimateAmount += estimate.rate * estimate.quantity;
//     });

//     let subtotal, processingFee, gst, totalAmount, contractorAmount, siteVisitAmount = 0;

//     if (totalEstimateAmount <= 1000) {
//         processingFee = parseFloat(((20 / 100) * totalEstimateAmount).toFixed(2));
//     } else if (totalEstimateAmount <= 5000) {
//         processingFee = parseFloat(((15 / 100) * totalEstimateAmount).toFixed(2));
//     } else {
//         processingFee = parseFloat(((10 / 100) * totalEstimateAmount).toFixed(2));
//     }

//     gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));
//     subtotal = totalEstimateAmount;
//     totalAmount = (subtotal + processingFee + gst).toFixed(2);
//     contractorAmount = (subtotal + gst).toFixed(2);

//     return { subtotal, processingFee, gst, totalAmount, contractorAmount };
// });



// JobQuotationSchema.virtual('siteVisitEstimate.charges').get(function () {

//     let totalEstimateAmount = 0;

//     let estimates: any = []
//     if (this.siteVisitEstimate) {
//         estimates = this.siteVisitEstimate.estimates
//     }

//     estimates.forEach((estimate: any) => {
//         totalEstimateAmount += estimate.rate * estimate.quantity;
//     });

//     let subtotal, processingFee, gst, totalAmount, contractorAmount, siteVisitAmount = 0;

//     if (totalEstimateAmount <= 1000) {
//         processingFee = parseFloat(((20 / 100) * totalEstimateAmount).toFixed(2));
//     } else if (totalEstimateAmount <= 5000) {
//         processingFee = parseFloat(((15 / 100) * totalEstimateAmount).toFixed(2));
//     } else {
//         processingFee = parseFloat(((10 / 100) * totalEstimateAmount).toFixed(2));
//     }

//     gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));
//     subtotal = totalEstimateAmount;
//     totalAmount = (subtotal + processingFee + gst).toFixed(2);
//     contractorAmount = (subtotal + gst).toFixed(2);

//     return { subtotal, processingFee, gst, totalAmount, contractorAmount };
// });




JobQuotationSchema.set('toObject', { virtuals: true });
JobQuotationSchema.set('toJSON', { virtuals: true });

const JobQuotationModel = model<IJobQuotation>('job_quotations', JobQuotationSchema);



export { JobQuotationModel };
