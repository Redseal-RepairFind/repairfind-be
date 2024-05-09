import { Document, ObjectId, Schema, model } from "mongoose";
import { IJobQuotation, JOB_QUOTATION_STATUS, JobQuotationModel } from "./job_quotation.model";

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
    details?: any; // Additional details specific to each event
}

export enum JOB_STATUS {
    PENDING = 'PENDING',
    DECLINED = 'DECLINED',
    ACCEPTED = 'ACCEPTED',
    EXPIRED = 'EXPIRED',
    BOOKED = 'BOOKED',
    COMPLETED = 'COMPLETED',
    DISPUTED = 'DISPUTED',
    CANCELED = 'CANCELED',
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
    location: IJobLocation;
    date: Date;
    startDate: Date;
    endDate: Date; 
    time: Date;
    expiresIn: number;
    media: string[];
    tags?: string[];
    experience?: string;
    createdAt: Date;
    updatedAt: Date;
    quotations: [{id: ObjectId, status: string}];
    jobHistory: IJobHistory[];
    payments: ObjectId[];
    schedule: IJobSchedule;
    assignment: IJobAssignment;
    emergency: boolean;
    myQuotation: Object | null
    getMyQoutation: (contractorId: ObjectId) => {
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
    date: { type: Date, required: true },
    previousDate: { type: Date},
    awaitingConfirmation: { type: Boolean, default: false },
    isCustomerAccept: { type: Boolean, default: false },
    isContractorAccept: { type: Boolean, default: false },
    createdBy: String,
    type: { type: String, enum: Object.values(JOB_SCHEDULE_TYPE) },
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
    details: { type: Schema.Types.Mixed }, // Additional details specific to the event
});


const JobSchema = new Schema<IJob>({
    customer: { type: Schema.Types.ObjectId, ref: 'customers', required: true },
    contractor: { type: Schema.Types.ObjectId, ref: 'contractors' },
    quotation: { type: Schema.Types.ObjectId, ref: 'job_quotations' },
    contract: { type: Schema.Types.ObjectId, ref: 'job_quotations' }, // TODO: replace quotation with this
    contractorType: { type: String },
    status: { type: String, enum: Object.values(JOB_STATUS), default: JOB_STATUS.PENDING },
    type: { type: String, enum: Object.values(JobType), default: JobType.LISTING },
    category: { type: String, required: false },
    description: { type: String, required: true },
    title: { type: String },
    voiceDescription: VoiceDescriptionSchema,
    location: { type: JobLocationSchema, required: true },
    date: { type: Date, required: true },
    time: { type: Date, required: false },
    expiresIn: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    media: { type: [String], default: [] },
    tags: { type: [String] },
    experience: { type: String },
    jobHistory: [JobHistorySchema], // Array of job history entries
    schedule: ScheduleSchema,
    quotations: [{
        id: { type: Schema.Types.ObjectId, ref: 'job_quotations' },
        status: { type: String, enum: Object.values(JOB_QUOTATION_STATUS) }
    }],
    payments: {
        type: [Schema.Types.ObjectId],
        ref: 'payments'
    },
    myQuotation: Object,
    assignment: JobAssignmentSchema,
    emergency: {type: Boolean, default:false},
}, { timestamps: true });




JobSchema.virtual('totalQuotations').get(function () {
    const pendingQuotations = this.quotations.filter(quote => quote.status !== JOB_QUOTATION_STATUS.DECLINED);
    return pendingQuotations.length;
});



JobSchema.methods.getMyQoutation = async function (contractor: any) {
    const contractorQuotation = await JobQuotationModel.findOne({job:this.id, contractor})
    if(contractorQuotation){
        return contractorQuotation
    }else{
        return null
    }
};


JobSchema.set('toObject', { virtuals: true });
JobSchema.set('toJSON', { virtuals: true });


const JobModel = model<IJob>("jobs", JobSchema);

export { JobModel };
