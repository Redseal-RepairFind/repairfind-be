import { Document, ObjectId, Schema, model } from "mongoose";


export interface IJobEnquiryReply  {
    userId: ObjectId; 
    userType: string; 
    replyText?: string;
}

export interface IJobEnquiry extends Document {
    job: ObjectId; // Contractor who asked the enquiry
    contractor: ObjectId; // Contractor who asked the enquiry
    enquiry: string; // The enquiry text
    replies?: IJobEnquiryReply[]
    createdAt: Date; // Timestamp when the enquiry was asked
    repliedAt?: Date; // Timestamp when the reply was made
}



// Define the JobEnquiryReply schema
const JobEnquiryReplySchema = new Schema<IJobEnquiryReply>({
    userId: { type: Schema.Types.ObjectId, refPath: "userType", required: true },
    userType: { type: String, required: true },
    replyText: { type: String },
});

// Define the JobEnquiry schema
const JobEnquirySchema = new Schema<IJobEnquiry>({
    job: { type: Schema.Types.ObjectId, ref: 'jobs', required: true },
    contractor: { type: Schema.Types.ObjectId, ref: 'contractors', required: true },
    enquiry: { type: String, required: true },
    replies: [JobEnquiryReplySchema],
    repliedAt: { type: Date }
}, { timestamps: true });

// Create the JobEnquiry model
const JobEnquiryModel = model<Document & any>("job_qna", JobEnquirySchema);

export { JobEnquiryModel };
