import { ObjectId, Schema, model, Types } from "mongoose";

export interface IPaypalPaymentLog {
    metadata: Array<object>;
    user: ObjectId; 
    userType: string; 
    createdAt: Date;
}

const PaypalPaymentLogSchema = new Schema<IPaypalPaymentLog>({
    metadata: {
        type: [Schema.Types.Mixed],
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
