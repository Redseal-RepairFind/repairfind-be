import { Document, ObjectId, Schema, model } from "mongoose";

export enum JobQuotationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
}

export interface IJobQuotationEstimate {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}


export interface IJobQuotation extends Document {
    contractor: ObjectId;
    job: ObjectId;
    status: JobQuotationStatus;
    estimates: IJobQuotationEstimate[];
    startDate: Date;
    endDate: Date;
    siteVisit: object;
    charges: object;
    calculateCharges: () => {
        subtotal: number;
        processingFee: number;
        gst: number;
        totalAmount: number;
        contractorAmount: number;
    };
}


const JobApplicationSchema = new Schema<IJobQuotation>({
    contractor: { type: Schema.Types.ObjectId, ref: 'contractors', required: true },
    job: { type: Schema.Types.ObjectId, ref: 'jobs', required: true },
    status: { type: String, enum: Object.values(JobQuotationStatus), default: JobQuotationStatus.PENDING },
    estimates: { type: [Object], required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    siteVisit: { type: Object, default: null, properties: {
        address: { type: String, required: false },
        date: { type: Date, required: false },
    } },
    charges: { type: Object, default:{
        subtotal: 0.00, 
        processingFee: 0.00, 
        gst: 0.00, 
        totalAmount: 0.00, 
        contractorAmount: 0.00
    } },
}, { timestamps: true });



// Define the static method to calculate charges
JobApplicationSchema.methods.calculateCharges = async function () {
    let totalEstimateAmount = 0;

    // Calculate total estimate amount from rate * quantity for each estimate
    this.estimates.forEach( (estimate: any) => {
        totalEstimateAmount += estimate.rate * estimate.quantity;
    });

    let processingFee = 0;
    let gst = 0;

    if (totalEstimateAmount <= 1000) {
        processingFee = parseFloat(((20 / 100) * totalEstimateAmount).toFixed(2));
    } else if (totalEstimateAmount <= 5000) {
        processingFee = parseFloat(((15 / 100) * totalEstimateAmount).toFixed(2));
    } else {
        processingFee = parseFloat(( (10 / 100) * totalEstimateAmount).toFixed(2));
    }

    gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));

    // Calculate subtotal before adding processing fee and GST
    const subtotal = totalEstimateAmount;

    // Calculate total amounts for customer and contractor
    const totalAmount =  (subtotal + processingFee + gst).toFixed(2);
    const contractorAmount = (subtotal + gst).toFixed(2);

    return { subtotal, processingFee, gst, totalAmount, contractorAmount };
};

const JobQoutationModel = model<IJobQuotation>('job_quotations', JobApplicationSchema);


export { JobQoutationModel };
