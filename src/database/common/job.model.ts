import { Document, ObjectId, Schema, model } from "mongoose";
import { IJobQuotation, JOB_QUOTATION_STATUS, JobQuotationModel } from "./job_quotation.model";
import { PAYMENT_TYPE, PaymentModel } from "./payment.schema";
import { JobDayModel } from "./job_day.model";

export interface IJobLocation extends Document {
    address?: string;
    city?: string;
    region?: string;
    country?: string;
    latitude: string;
    longitude: string;
}


export interface IJobHistory {
    eventType: string; // Custom event type identifier
    timestamp: Date;
    payload?: any; // Additional details specific to each event
}

export enum JOB_STATUS {
    PENDING = 'PENDING',
    DECLINED = 'DECLINED',
    ACCEPTED = 'ACCEPTED',
    EXPIRED = 'EXPIRED',
    BOOKED = 'BOOKED',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    DISPUTED = 'DISPUTED',
    CANCELED = 'CANCELED',
    NOT_STARTED = 'NOT_STARTED',
    ONGOING_SITE_VISIT = 'ONGOING_SITE_VISIT',
    COMPLETED_SITE_VISIT = 'COMPLETED_SITE_VISIT',
}



export enum JOB_SCHEDULE_TYPE {
    JOB_DAY = 'JOB_DAY',
    SITE_VISIT = 'SITE_VISIT',
}


export enum JobType {
    LISTING = 'LISTING',
    REQUEST = 'REQUEST',
}


export interface IJobSchedule {
    startDate: Date;
    endDate?: Date;
    createdBy?: 'customer' | 'contractor'
    type: JOB_SCHEDULE_TYPE
    remark: string
}

export interface IJobReSchedule {
    date: Date;
    previousDate?: Date;
    awaitingConfirmation?: boolean; // if there is a pending rescheduling request that has not been accepted by contractor and customer
    isCustomerAccept?: boolean;
    isContractorAccept?: boolean;
    createdBy?: 'customer' | 'contractor'
    type: JOB_SCHEDULE_TYPE
    remark: string
}

export interface IJobAssignment {
    contractor: ObjectId
    confirmed?: boolean;
    date?: Date;
}

interface IVoiceDescription {
    url: string;
    metrics?: [];
    duration?: string;
}


export interface IStatusUpdate {
    awaitingConfirmation?: boolean; // 
    isCustomerAccept?: boolean;
    isContractorAccept?: boolean;
    createdBy?: 'customer' | 'contractor'
    remark?: string
    status: string;
}


export interface IJob extends Document {
    _id: ObjectId;
    customer: ObjectId;
    contractor: ObjectId; // contractor that has been engaged
    quotation: ObjectId; // application or estimate or quatation that has been paid for
    contract: ObjectId; // TODO: replace quotation with this
    contractorType: String;
    status: JOB_STATUS;
    type: JobType;
    category: string;
    description: string;
    title: string;
    voiceDescription: IVoiceDescription;
    statusUpdate: IStatusUpdate;
    location: IJobLocation;
    date: Date;
    startDate: Date;
    endDate: Date;
    expiryDate?: Date;
    time: Date;
    expiresIn: number;
    media: string[];
    tags?: string[];
    experience?: string;
    createdAt: Date;
    updatedAt: Date;
    quotations: [{ id: ObjectId, status: string, contractor: ObjectId }];
    jobHistory: IJobHistory[];
    payments: ObjectId[];
    schedule: IJobSchedule;
    reschedule: IJobReSchedule | null;
    assignment: IJobAssignment;
    emergency: boolean;
    myQuotation: Object | null
    isAssigned: boolean;
    review: ObjectId;
    isChangeOrder: boolean;
    jobDay: ObjectId;
    getMyQoutation: (contractorId: ObjectId) => {
    };
    getJobDay: (scheduleType?: JOB_SCHEDULE_TYPE) => {
    };
    getPayments: (types?: PAYMENT_TYPE[]) => {
        paymentCount: number;
        totalAmount: number;
        payments: Array<{id: ObjectId, transaction: ObjectId, amount: number, charge: string, status: string, refunded: boolean, paid: boolean, amount_refunded: number, captured: boolean }>;
    };
}


const VoiceDescriptionSchema = new Schema<IVoiceDescription>({
    url: {
        type: String,
        required: true,
    },
    metrics: {
        type: Array,
        required: false,
    },
    duration: {
        type: String,
        required: false,
    }
});


const ScheduleSchema = new Schema<IJobSchedule>({
    startDate: { type: Date },
    endDate: { type: Date },
    createdBy: String,
    type: { type: String, enum: Object.values(JOB_SCHEDULE_TYPE) },
    remark: String,
});

const ReScheduleSchema = new Schema<IJobReSchedule>({
    date: { type: Date, required: true },
    previousDate: { type: Date },
    awaitingConfirmation: { type: Boolean, default: false },
    isCustomerAccept: { type: Boolean, default: false },
    isContractorAccept: { type: Boolean, default: false },
    createdBy: String,
    remark: String,
});


const StatusUpdateSchema = new Schema<IStatusUpdate>({
    awaitingConfirmation: { type: Boolean, default: false },
    isCustomerAccept: { type: Boolean, default: false },
    isContractorAccept: { type: Boolean, default: false },
    createdBy: String,
    status: {
        type: String
    },
    remark: String,
});


const JobAssignmentSchema = new Schema<IJobAssignment>({
    contractor: { type: Schema.Types.ObjectId, ref: 'contractors' },
    date: { type: Date, required: true },
    confirmed: { type: Boolean, default: false },
});


const JobLocationSchema = new Schema<IJobLocation>({
    address: { type: String },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    latitude: { type: String },
    longitude: { type: String },
});


const JobHistorySchema = new Schema<IJobHistory>({
    eventType: { type: String, required: false }, // Identify the type of event - JOB_REJECTED, JOB_ACCEPTED, JOB_CLOSED, JOB_EXPIRED
    timestamp: { type: Date, default: Date.now }, // Timestamp of the event
    payload: { type: Schema.Types.Mixed }, // Additional details specific to the event
});


const JobSchema = new Schema<IJob>({
    customer: { type: Schema.Types.ObjectId, ref: 'customers', required: true },
    contractor: { type: Schema.Types.ObjectId, ref: 'contractors' },
    quotation: { type: Schema.Types.ObjectId, ref: 'job_quotations' },
    contract: { type: Schema.Types.ObjectId, ref: 'job_quotations' }, // TODO: replace quotation with this
    contractorType: { type: String },
    status: { type: String, enum: Object.values(JOB_STATUS), default: JOB_STATUS.PENDING },
    statusUpdate: StatusUpdateSchema,
    type: { type: String, enum: Object.values(JobType), default: JobType.LISTING },
    category: { type: String, required: false },
    description: { type: String, required: true },
    title: { type: String },
    voiceDescription: VoiceDescriptionSchema,
    location: { type: JobLocationSchema, required: true },
    date: { type: Date, required: true },
    time: { type: Date, required: false },
    // expiresIn: { type: Number, default: 10 },
    startDate: { type: Date },
    expiryDate: { 
        type: Date,
        default: function() {
            const now = new Date();
            return new Date(now.setDate(now.getDate() + 7));
        }
     },
    endDate: { type: Date },
    media: { type: [String], default: [] },
    tags: { type: [String] },
    experience: { type: String },
    jobHistory: [JobHistorySchema], // Array of job history entries
    schedule: ScheduleSchema,
    reschedule: ReScheduleSchema,
    quotations: [{
        id: { type: Schema.Types.ObjectId, ref: 'job_quotations' },
        contractor: { type: Schema.Types.ObjectId, ref: 'contractors' },
        status: { type: String, enum: Object.values(JOB_QUOTATION_STATUS) }
    }],
    payments: {
        type: [Schema.Types.ObjectId],
        ref: 'payments'
    },
    myQuotation: Object,
    assignment: JobAssignmentSchema,
    emergency: { type: Boolean, default: false },
    isAssigned: { type: Boolean, default: false },
    review: { type: Schema.Types.ObjectId, ref: 'reviews' },
    isChangeOrder: { type: Boolean, default: false },
    jobDay: { type: Schema.Types.ObjectId, ref: 'job_days' },
}, { timestamps: true });




JobSchema.virtual('totalQuotations').get(function () {
    const pendingQuotations = this.quotations.filter(quote => quote.status !== JOB_QUOTATION_STATUS.DECLINED);
    return pendingQuotations.length;
});

JobSchema.virtual('expiresIn').get(function () {
   return this.expiryDate ?  this.expiryDate.getDate() - this.createdAt.getDate() : null
});

//get job day that match with the schedule type
 JobSchema.methods.getJobDay = async function (scheduleType = null) {
    if(!scheduleType) scheduleType = this.schedule.type;
    return await JobDayModel.findOne({ job: this.id, type: scheduleType })
};

JobSchema.methods.getMyQoutation = async function (contractor: any) {
    const contractorQuotation = await JobQuotationModel.findOne({ job: this.id, contractor })
    if (contractorQuotation) {
        return contractorQuotation
    } else {
        return null
    }
};


// get job payments summary
JobSchema.methods.getPayments = async function (types = null) {
    let totalAmount = 0;

    const paymentIds = await this.payments


    if(!paymentIds)return  { totalAmount: 0, paymentCount:0,  payments: null }


    let jobPayments = null
    if(types){
        jobPayments = await PaymentModel.find({_id: {$in: paymentIds}, type: {$in: types } })
    }else{
        jobPayments = await PaymentModel.find({_id: {$in: paymentIds} })
    }

    console.log(paymentIds, jobPayments, types)
    if(!jobPayments)return  { totalAmount: 0, paymentCount:0,  payments: null }

    totalAmount = jobPayments.reduce((acc: number, payment: any) => acc + payment.amount, 0);
    const payments = jobPayments.map((payment: any) => {
        return {
            id: payment._id,
            transaction: payment.transaction,
            charge: payment.charge,
            amount: payment.amount,
            amount_refunded: payment.amount_refunded,
            status: payment.status,
            refunded: payment.refunded,
            paid: payment.paid,
            captured: payment.captured,
        }
    })
   

    return { totalAmount, paymentCount:payments.length,  payments };
};


JobSchema.set('toObject', { virtuals: true });
JobSchema.set('toJSON', { virtuals: true });


const JobModel = model<IJob>("jobs", JobSchema);

export { JobModel };
