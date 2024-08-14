import { Document, ObjectId, Schema, model } from "mongoose";
import { IJobQuotation, JOB_QUOTATION_STATUS, JobQuotationModel } from "./job_quotation.model";
import { PAYMENT_TYPE, PaymentModel } from "./payment.schema";
import { JOB_DAY_STATUS, JobDayModel } from "./job_day.model";
import { JobEnquiryModel } from "./job_enquiry.model";
import ContractorSavedJobModel from "../contractor/models/contractor_saved_job.model";
import { JobDisputeModel } from "./job_dispute.model";
import { CONVERSATION_TYPE, ConversationModel } from "./conversations.schema";

export interface IJobLocation extends Document {
    address?: string;
    city?: string;
    region?: string;
    country?: string;
    latitude: string;
    longitude: string;
    description?: string;
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
    SUBMITTED = 'SUBMITTED',
    EXPIRED = 'EXPIRED',
    REFUNDED = 'REFUNDED',
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



export enum JOB_SCHEDULE_REMINDER {
    HOURS_120 = 'HOURS_120', // 5 days
    HOURS_72 = 'HOURS_72', // 3days
    HOURS_48 = 'HOURS_48', // 2days
    HOURS_24 = 'HOURS_24',
    HOURS_12 = 'HOURS_12',
    HOURS_6 = 'HOURS_6',
    HOURS_1 = 'HOURS_1',
    NOT_STARTED = 'NOT_STARTED',
}


export interface IJobSchedule {
    startDate: Date;
    endDate?: Date;
    estimatedDuration?: number;
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
    startDate?: Date;
    endDate?: Date;
    expiryDate?: Date;
    time?: Date;
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
    hideFrom: string[];
    jobDay: ObjectId;
    dispute: any;
    distance: any;
    reminders: JOB_SCHEDULE_REMINDER[];
    enquiries: ObjectId[];
    totalEnquires: number;
    hasUnrepliedEnquiry: boolean;
    isSaved: boolean;
    revisitEnabled: boolean;
    getMyQuotation: (contractorId: ObjectId) => {
    };
    getJobDay: (scheduleType?: JOB_SCHEDULE_TYPE) => {
    };
    getJobDispute: () => {
    };
    getDistance: (contractorLatitude: number, contractorLongitude: number) => {
    };
    getPayments: (types?: PAYMENT_TYPE[]) => {
        paymentCount: number;
        totalAmount: number;
        payments: Array<{ id: ObjectId, transaction: ObjectId, amount: number, charge: string, status: string, refunded: boolean, paid: boolean, amount_refunded: number, captured: boolean }>;
    };
    getTotalEnquires: () => {
    };

    getHasUnrepliedEnquiry: () => {
    };

    getIsSaved: (contractorId: any) => {
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
    estimatedDuration: { type: Number, default: 0 },
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
    description: { type: String },
});


const JobHistorySchema = new Schema<IJobHistory>({
    eventType: { type: String, required: false }, // Identify the type of event - JOB_REJECTED, JOB_ACCEPTED, JOB_CLOSED, JOB_EXPIRED
    timestamp: { type: Date, default: Date.now }, // Timestamp of the event
    payload: { type: Schema.Types.Mixed }, // Additional details specific to the event
});




// replies?: {userType: 'string', userId: ObjectId, replyText: string}[]

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
    date: { type: Date, required: false },
    time: { type: Date, required: false },
    startDate: { type: Date },
    expiryDate: {
        type: Date,
        default: function () {
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
    dispute: { type: Schema.Types.Mixed },
    distance: { type: Schema.Types.Mixed, default: 0 },
    hideFrom: {
        type: [String]
    },
    reminders: {
        type: [String],
        enum: Object.values(JOB_SCHEDULE_REMINDER)
    },
    enquiries: [{ type: Schema.Types.ObjectId, ref: 'JobQuestion' }],  // Reference to JobQuestion schema
    totalEnquires: { type: Schema.Types.Number, default: 0 },
    hasUnrepliedEnquiry: { type: Schema.Types.Boolean, default: false },
    isSaved: { type: Schema.Types.Boolean, default: false },
    revisitEnabled: { type: Schema.Types.Boolean, default: false },
}, { timestamps: true });




JobSchema.virtual('totalQuotations').get(function () {
    const pendingQuotations = this.quotations ? this.quotations.filter(quote => quote.status !== JOB_QUOTATION_STATUS.DECLINED) : [];
    return pendingQuotations.length;
});

JobSchema.virtual('expiresIn').get(function () {
    if (this.expiryDate && this.createdAt) {
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const timeDifference = this.expiryDate.getTime() - new Date().getTime();
        const daysDifference = Math.ceil(timeDifference / millisecondsPerDay);
        return daysDifference;
    }
    return null;
});


JobSchema.methods.getDistance = async function (contractorLatitude: number, contractorLongitude: number) {

    let distance = 0
    if (contractorLatitude && contractorLongitude) {
        // Contractor location (Toronto, Ontario, Canada)
        // const contractorLatitude = 43.65107;
        // const contractorLongitude = -79.347015;

        // Job location
        const { latitude, longitude } = this.location;

        // Distance calculation using Haversine formula
        const earthRadius = 6371; // Earth's radius in kilometers
        const lat1 = Math.PI * Number(latitude) / 180;
        const lat2 = Math.PI * contractorLatitude / 180;
        const deltaLat = Math.PI * (contractorLatitude - Number(latitude)) / 180;
        const deltaLon = Math.PI * (Number(contractorLongitude) - Number(longitude)) / 180;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distance = earthRadius * c;
    }


    return distance.toFixed(4); // Distance in kilometers
};



//get job day that match with the schedule type
JobSchema.methods.getJobDay = async function (scheduleType = null) {
    if (!scheduleType && this.schedule) scheduleType = this.schedule?.type;
    return await JobDayModel.findOne({ job: this.id, type: scheduleType, status: {$ne: [JOB_DAY_STATUS.DISPUTED ]} })
};


JobSchema.methods.getJobDispute = async function () {
    const dispute = await JobDisputeModel.findOne({ job: this._id })
        .populate([{
            path: 'customer',
            select: 'firstName lastName name profilePhoto _id phoneNumber email'
        },
        {
            path: 'contractor',
            select: 'firstName lastName name profilePhoto _id phoneNumber email'
        }]);


    if (!dispute) {
        return null
    }

    return {
        ...dispute?.toJSON()
    }


};


// Method to get the total number of enquiries for a job
JobSchema.methods.getTotalEnquires = async function () {
    return await JobEnquiryModel.countDocuments({ job: this.id });
};


// Method to get the total number of enquiries for a job
JobSchema.methods.getIsSaved = async function (contractorId: any) {
    const savedJobs = await ContractorSavedJobModel.countDocuments({ contractor: contractorId, job: this.id });
    return savedJobs > 0;
};


JobSchema.methods.getHasUnrepliedEnquiry = async function () {
    const count = await JobEnquiryModel.countDocuments({
        job: this.id,
        replies: { $exists: true, $size: 0 }
    });
    return count > 0;
};



JobSchema.methods.getMyQuotation = async function (contractor: any) {
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


    if (!paymentIds) return { totalAmount: 0, paymentCount: 0, payments: null }


    let jobPayments = null
    if (types) {
        jobPayments = await PaymentModel.find({ _id: { $in: paymentIds }, type: { $in: types } })
    } else {
        jobPayments = await PaymentModel.find({ _id: { $in: paymentIds } })
    }


    if (!jobPayments) return { totalAmount: 0, paymentCount: 0, payments: null }



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


    return { totalAmount, paymentCount: payments.length, payments };
};


JobSchema.set('toObject', { virtuals: true });
JobSchema.set('toJSON', { virtuals: true });


const JobModel = model<IJob>("jobs", JobSchema);

export { JobModel };
