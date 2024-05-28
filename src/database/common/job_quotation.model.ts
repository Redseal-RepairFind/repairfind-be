import { Document, ObjectId, Schema, model } from "mongoose";

export enum JOB_QUOTATION_STATUS {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
    COMPLETED = 'COMPLETED',
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
    estimates: IJobQuotationEstimate[];
    startDate: Date;
    endDate: Date;
    siteVisit: Date;
    charges: object;
    payment: ObjectId;
    isPaid: boolean;
    extraEstimates: [IExtraEstimate];
    calculateCharges: (extraEstimateId?: any) => {
        subtotal: number;
        processingFee: number;
        gst: number;
        totalAmount: number;
        contractorAmount: number;
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
    date: { type: Date, required: true }
});


const JobQoutationSchema = new Schema<IJobQuotation>({
    contractor: { type: Schema.Types.ObjectId, ref: 'contractors', required: true },
    job: { type: Schema.Types.ObjectId, ref: 'jobs', required: true },
    status: { type: String, enum: Object.values(JOB_QUOTATION_STATUS), default: JOB_QUOTATION_STATUS.PENDING },
    estimates: { type: [JobQuotationEstimateSchema], required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    siteVisit: { type: Date, required: false },
    payment: { type: Schema.Types.ObjectId, ref: 'payments' },
    isPaid: { type: Boolean, default: false },
    extraEstimates: { type: [ExtraEstimateSchema] }
}, { timestamps: true });



// Define the static method to calculate charges
JobQoutationSchema.methods.calculateCharges = async function (extraEstimateId = null) {

    if (extraEstimateId) {


        let totalEstimateAmount = 0;
        const extraEstimate = this.extraEstimates.find((estimate: any) => estimate.id === extraEstimateId)
        if (!extraEstimate) return
        extraEstimate.estimates.forEach((estimate: any) => {
            totalEstimateAmount += estimate.rate * estimate.quantity;
        });

        let processingFee = 0;
        let gst = 0;

        if (totalEstimateAmount <= 1000) {
            processingFee = parseFloat(((20 / 100) * totalEstimateAmount).toFixed(2));
        } else if (totalEstimateAmount <= 5000) {
            processingFee = parseFloat(((15 / 100) * totalEstimateAmount).toFixed(2));
        } else {
            processingFee = parseFloat(((10 / 100) * totalEstimateAmount).toFixed(2));
        }

        gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));

        // Calculate subtotal before adding processing fee and GST
        const subtotal = totalEstimateAmount;

        // Calculate total amounts for customer and contractor
        const totalAmount = (subtotal + processingFee + gst).toFixed(2);
        const contractorAmount = (subtotal + gst).toFixed(2);

        return { subtotal, processingFee, gst, totalAmount, contractorAmount };
    } else {
        let totalEstimateAmount = 0;

        // Calculate total estimate amount from rate * quantity for each estimate
        this.estimates.forEach((estimate: any) => {
            totalEstimateAmount += estimate.rate * estimate.quantity;
        });

        let processingFee = 0;
        let gst = 0;

        if (totalEstimateAmount <= 1000) {
            processingFee = parseFloat(((20 / 100) * totalEstimateAmount).toFixed(2));
        } else if (totalEstimateAmount <= 5000) {
            processingFee = parseFloat(((15 / 100) * totalEstimateAmount).toFixed(2));
        } else {
            processingFee = parseFloat(((10 / 100) * totalEstimateAmount).toFixed(2));
        }

        gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));

        // Calculate subtotal before adding processing fee and GST
        const subtotal = totalEstimateAmount;

        // Calculate total amounts for customer and contractor
        const totalAmount = (subtotal + processingFee + gst).toFixed(2);
        const contractorAmount = (subtotal + gst).toFixed(2);

        return { subtotal, processingFee, gst, totalAmount, contractorAmount };
    }

};


JobQoutationSchema.virtual('charges').get(function () {
    let totalEstimateAmount = 0;

    // Calculate total estimate amount from rate * quantity for each estimate
    if (this.estimates) {
        this.estimates.forEach((estimate: any) => {
            totalEstimateAmount += estimate.rate * estimate.quantity;
        });

        let processingFee = 0;
        let gst = 0;


        if (totalEstimateAmount <= 1000) {
            processingFee = parseFloat(((20 / 100) * totalEstimateAmount).toFixed(2));
        } else if (totalEstimateAmount <= 5000) {
            processingFee = parseFloat(((15 / 100) * totalEstimateAmount).toFixed(2));
        } else {
            processingFee = parseFloat(((10 / 100) * totalEstimateAmount).toFixed(2));
        }

        gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));

        // Calculate subtotal before adding processing fee and GST
        const subtotal = totalEstimateAmount;

        // Calculate total amounts for customer and contractor
        const totalAmount = (subtotal + processingFee + gst).toFixed(2);
        const contractorAmount = (subtotal + gst).toFixed(2);

        return { subtotal, processingFee, gst, totalAmount, contractorAmount };
    }
    return { subtotal: 0, processingFee: 0, gst: 0, totalAmount: 0, contractorAmount: 0, siteVisitAmount: 0 }

});

JobQoutationSchema.set('toObject', { virtuals: true });
JobQoutationSchema.set('toJSON', { virtuals: true });

const JobQuotationModel = model<IJobQuotation>('job_quotations', JobQoutationSchema);



export { JobQuotationModel };
