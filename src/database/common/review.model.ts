import { ObjectId, Schema, model } from "mongoose";
import CustomerModel from "../customer/models/customer.model";



export enum REVIEW_TYPE {
    JOB_COMPLETION = "JOB_COMPLETION",
    JOB_CANCELATION = "JOB_CANCELATION",
    TRAINING_COMPLETION = "TRAINING_COMPLETION"
}


export interface IReview {
    customer?: ObjectId; // Optional: ObjectId referencing the User who left the rating
    contractor?: ObjectId; // Optional: ObjectId referencing the User who left the rating
    averageRating: number; // avaraged from the items in ratings array
    ratings?: Array<{ item: string; rating: number }>; //Rating value (e.g., 1-5 stars)
    comment?: string; // Optional: Textual feedback
    job?: ObjectId; // Optional: Textual feedback
    createdAt: Date;
    type: string;
    heading: object;
}

const ReviewSchema = new Schema<IReview>({
    customer: {
        type: Schema.Types.ObjectId,
    },
    contractor: {
        type: Schema.Types.ObjectId,
    },
    averageRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // Adjust based on your rating scale
    },
    ratings: {
        type: [{ item: String, rating: Number }],
    },
    comment: {
        type: String,
    },
    job: {
        type: Schema.Types.ObjectId,
    },
    type: {
        type: String,
        enum: Object.values(REVIEW_TYPE),
        default: REVIEW_TYPE.JOB_COMPLETION
    },
    heading: Object,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});





// Define a method for the virtual field
ReviewSchema.methods.getHeading = async function() {
    if (this.customer) {
        const customer = await CustomerModel.findById(this.customer)
        if (customer) {
            return { name: customer.name, image: customer?.profilePhoto?.url };
        }
    }
    
    return {
        name: "Repairfind",
        image: "https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png" 
    };
};





ReviewSchema.set('toObject', { virtuals: true });
ReviewSchema.set('toJSON', { virtuals: true });

export const ReviewModel = model<IReview>("reviews", ReviewSchema);
