"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobEnquiryModel = void 0;
var mongoose_1 = require("mongoose");
// Define the JobEnquiryReply schema
var JobEnquiryReplySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, refPath: "userType", required: true },
    userType: { type: String, required: true },
    replyText: { type: String },
    user: { type: mongoose_1.Schema.Types.Mixed }
});
// Define the JobEnquiry schema
var JobEnquirySchema = new mongoose_1.Schema({
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: 'jobs', required: true },
    contractor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors', required: true },
    customer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'customers', required: true },
    enquiry: { type: String, required: true },
    replies: [JobEnquiryReplySchema],
    repliedAt: { type: Date }
}, { timestamps: true });
// Create the JobEnquiry model
var JobEnquiryModel = (0, mongoose_1.model)("job_enquires", JobEnquirySchema);
exports.JobEnquiryModel = JobEnquiryModel;
