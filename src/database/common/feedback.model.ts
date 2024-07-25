import { ObjectId, Schema, model } from "mongoose";
import CustomerModel from "../customer/models/customer.model";
import { ContractorModel } from "../contractor/models/contractor.model";




export interface IFeedback {
    user?: ObjectId; // Optional: ObjectId referencing the User who left the rating
    userType?: string; // Optional: ObjectId referencing the User who left the rating
    remark?: string; // Optional: Textual feedback
    media: Array<string>;
    heading: object;
    createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
    user: {
        type: Schema.Types.ObjectId,
        refPath: 'userType',
    },
    userType: {
        type: String,
    },
    remark: {
        type: String,
    },
    media: {
        type: [String]
    },
   
    heading: Object,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});





// Define a method for the virtual field
FeedbackSchema.methods.getHeading = async function() {
    const user = this.userType == 'customers' ? await CustomerModel.findById(this.customer) : await ContractorModel.findById(this.customer)
    if (user) {
        return { name: user.name, image: user?.profilePhoto?.url };
    }else{
        return {
            name: "Repairfind",
            image: "https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png" 
        };
    }
    
};


export const FeedbackModel = model<IFeedback>("feedbacks", FeedbackSchema);
