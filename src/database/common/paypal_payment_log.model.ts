import { ObjectId, Schema, model } from "mongoose";

export interface IPaypalPaymentLog {
    metadata: Array<{ title: string; description: string }>;
    user: ObjectId; 
    userType: string; 
    createdAt: Date;
}

const PaypalPaymentLogSchema = new Schema<IPaypalPaymentLog>({
    metadata: {
        type: [
            {
                title: { type: String, required: true },
                description: { type: String, required: true },
            },
        ],
        required: false,
    },
    user: {
        type: Schema.Types.ObjectId, 
        refPath: "userType" 
    },
    userType: { type: "String"},
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
});


export const PaypalPaymentLog = model<IPaypalPaymentLog>("paypal_logs", PaypalPaymentLogSchema);
