import { Document, ObjectId, Schema, model } from "mongoose";
import { IJobQuotation, JOB_QUOTATION_STATUS, JobQoutationModel } from "./job_quotation.model";

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
    isCurrent?: boolean;
    isRescheduled?: boolean;
    isCustomerAccept?: boolean;
    isContractorAccept?: boolean;
    createdBy?: 'customer' | 'contractor'
    type: JOB_SCHEDULE_TYPE
}


export interface IJob extends Document {
    _id: ObjectId;
    customer: ObjectId;
    contractor: ObjectId; // contractor that has been engaged
    quotation: ObjectId; // application or estimate or quatation that has been paid for
    contractorType: String;
    status: JOB_STATUS;
    type: JobType;
    category: string;
    description: string;
    title: string;
    voiceDescription: string;
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
    schedules: [IJobSchedule];
    emergency: boolean;
    myQuotation: Object | null
    getMyQoutation: (jobId: ObjectId, contractorId: ObjectId) => {
    };
}



const ScheduleSchema = new Schema<IJobSchedule>({
    startDate: { type: Date, required: true },
    endDate: { type: Date},
    isCurrent: { type: Boolean, default: true },
    isRescheduled: { type: Boolean, default: false },
    isCustomerAccept: { type: Boolean, default: false },
    isContractorAccept: { type: Boolean, default: false },
    createdBy: String,
    type: { type: String, enum: Object.values(JOB_SCHEDULE_TYPE) },
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
    contractorType: { type: String },
    status: { type: String, enum: Object.values(JOB_STATUS), default: JOB_STATUS.PENDING },
    type: { type: String, enum: Object.values(JobType), default: JobType.LISTING },
    category: { type: String, required: false },
    description: { type: String, required: true },
    title: { type: String },
    voiceDescription: { type: String, default: null },
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
    schedules: [ScheduleSchema],
    quotations: [{
        id: { type: Schema.Types.ObjectId, ref: 'job_quotations' },
        status: { type: String, enum: Object.values(JOB_QUOTATION_STATUS) }
    }],
    payments: {
        type: [Schema.Types.ObjectId],
        ref: 'payments'
    },
    emergency: {type: Boolean, default:false},
    myQuotation: { type: Object, default: null },
}, { timestamps: true });




JobSchema.virtual('totalQuotations').get(function () {
    const pendingQuotations = this.quotations.filter(quote => quote.status !== JOB_QUOTATION_STATUS.DECLINED);
    return pendingQuotations.length;
});



JobSchema.methods.getMyQoutation = async function (jobId: any, contractor: any) {
    // const job = await this.populate({
    //     path: 'quotations',
    //     match: { contractor } // Match quotations by contractorId
    //   });
  
    // if(job.quotations.length){
    //     return job.quotations[0]
    // }else{
    //     return null
    // }

    const contractorQuotation = await JobQoutationModel.findOne({job:this.id, contractor})
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
