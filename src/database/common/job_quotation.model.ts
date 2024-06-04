import { Document, ObjectId, Schema, model } from "mongoose";
import { PAYMENT_TYPE } from "./payment.schema";

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
    calculateCharges: (type?: string) => {
        subtotal: number;
        processingFee: number;
        gst: number;
        totalAmount: number;
        contractorAmount: number;
    }; // type can be to calc charges for SITE_VISIT, JOB_DAY, CHANGE_ORDER

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
    date: { type: Date, required: true }
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
    isPaid: { type: Boolean, default: false },
    changeOrderEstimate: { type: ExtraEstimateSchema },
    siteVisitEstimate: { type: ExtraEstimateSchema }
}, { timestamps: true });



// Define the static method to calculate charges
JobQuotationSchema.methods.calculateCharges = async function (type = null) {

    let estimates = this.estimates
    if (type == 'CHANGE_ORDER') {
        estimates = this.changeOrderEstimate.estimates
    }

    if (type == 'SITE_VISIT') {
        estimates = this.siteVisitEstimate.estimates
    }

    let subtotal, processingFee, gst, totalAmount, contractorAmount, siteVisitAmount = 0;
    let totalEstimateAmount = 0

    estimates.forEach((estimate: any) => {
        totalEstimateAmount += estimate.rate * estimate.quantity;
    });

    if (totalEstimateAmount <= 1000) {
        processingFee = parseFloat(((20 / 100) * totalEstimateAmount).toFixed(2));
    } else if (totalEstimateAmount <= 5000) {
        processingFee = parseFloat(((15 / 100) * totalEstimateAmount).toFixed(2));
    } else {
        processingFee = parseFloat(((10 / 100) * totalEstimateAmount).toFixed(2));
    }

    gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));
    subtotal = totalEstimateAmount;
    totalAmount = (subtotal + processingFee + gst).toFixed(2);
    contractorAmount = (subtotal + gst).toFixed(2);

    return { subtotal, processingFee, gst, totalAmount, contractorAmount };


};




JobQuotationSchema.virtual('charges').get(function () {
    let totalEstimateAmount = 0;
    let estimates: any = this.estimates

    estimates.forEach((estimate: any) => {
        totalEstimateAmount += estimate.rate * estimate.quantity;
    });

    let subtotal, processingFee, gst, totalAmount, contractorAmount, siteVisitAmount = 0;

    if (totalEstimateAmount <= 1000) {
        processingFee = parseFloat(((20 / 100) * totalEstimateAmount).toFixed(2));
    } else if (totalEstimateAmount <= 5000) {
        processingFee = parseFloat(((15 / 100) * totalEstimateAmount).toFixed(2));
    } else {
        processingFee = parseFloat(((10 / 100) * totalEstimateAmount).toFixed(2));
    }

    gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));
    subtotal = totalEstimateAmount;
    totalAmount = (subtotal + processingFee + gst).toFixed(2);
    contractorAmount = (subtotal + gst).toFixed(2);

    return { subtotal, processingFee, gst, totalAmount, contractorAmount };
});




JobQuotationSchema.virtual('changeOrderEstimate.charges').get(function () {


    let totalEstimateAmount = 0;

    let estimates: any = []
    if (this.changeOrderEstimate) {
        estimates = this.changeOrderEstimate.estimates
    }

    estimates.forEach((estimate: any) => {
        totalEstimateAmount += estimate.rate * estimate.quantity;
    });

    let subtotal, processingFee, gst, totalAmount, contractorAmount, siteVisitAmount = 0;

    if (totalEstimateAmount <= 1000) {
        processingFee = parseFloat(((20 / 100) * totalEstimateAmount).toFixed(2));
    } else if (totalEstimateAmount <= 5000) {
        processingFee = parseFloat(((15 / 100) * totalEstimateAmount).toFixed(2));
    } else {
        processingFee = parseFloat(((10 / 100) * totalEstimateAmount).toFixed(2));
    }

    gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));
    subtotal = totalEstimateAmount;
    totalAmount = (subtotal + processingFee + gst).toFixed(2);
    contractorAmount = (subtotal + gst).toFixed(2);

    return { subtotal, processingFee, gst, totalAmount, contractorAmount };
});



JobQuotationSchema.virtual('siteVisitEstimate.charges').get(function () {

    let totalEstimateAmount = 0;

    let estimates: any = []
    if (this.siteVisitEstimate) {
        estimates = this.siteVisitEstimate.estimates
    }

    estimates.forEach((estimate: any) => {
        totalEstimateAmount += estimate.rate * estimate.quantity;
    });

    let subtotal, processingFee, gst, totalAmount, contractorAmount, siteVisitAmount = 0;

    if (totalEstimateAmount <= 1000) {
        processingFee = parseFloat(((20 / 100) * totalEstimateAmount).toFixed(2));
    } else if (totalEstimateAmount <= 5000) {
        processingFee = parseFloat(((15 / 100) * totalEstimateAmount).toFixed(2));
    } else {
        processingFee = parseFloat(((10 / 100) * totalEstimateAmount).toFixed(2));
    }

    gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));
    subtotal = totalEstimateAmount;
    totalAmount = (subtotal + processingFee + gst).toFixed(2);
    contractorAmount = (subtotal + gst).toFixed(2);

    return { subtotal, processingFee, gst, totalAmount, contractorAmount };
});

JobQuotationSchema.set('toObject', { virtuals: true });
JobQuotationSchema.set('toJSON', { virtuals: true });

const JobQuotationModel = model<IJobQuotation>('job_quotations', JobQuotationSchema);



export { JobQuotationModel };
