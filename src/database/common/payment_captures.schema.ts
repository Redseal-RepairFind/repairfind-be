import { Schema, model, Document, ObjectId } from 'mongoose';

export interface IPaymentCapture extends Document {
    payment: ObjectId;
    user: ObjectId;
    userType: 'customers' | 'contractors';

    payment_method: string;
    payment_intent: string;
    amount_authorized: number;
    currency: string;

    brand?: string;
    capture_before?: number;
    country?: string;
    exp_month?: number;
    exp_year?: number;
    extended_authorization?: {
        status: string;
    };
    fingerprint?: string;
    funding?: string;
    incremental_authorization?: {
        status: string;
    };
    installments?: number | null;
    last4?: string;
    mandate?: any;
    multicapture?: {
        status: string;
    };
    network?: string;
    network_token?: {
        used: boolean;
    };
    overcapture?: {
        maximum_amount_capturable: number;
        status: string;
    };
    three_d_secure?: string | null;
    wallet?: any;
    status: string;  //'captured', 'requires_capture'
    captured: boolean;
    canceled_at?: string;
    cancellation_reason?: string;
    capture_method?: string;
}

const PaymentCaptureSchema = new Schema<IPaymentCapture>({
    payment: { type: Schema.Types.ObjectId, required: true },
    user: { type: Schema.Types.ObjectId, refPath: 'userType', required: true },
    userType: { type: String, enum: ['customers', 'contractors'], required: true },
    payment_method: { type: String, required: true },
    payment_intent: { type: String, required: true },
    amount_authorized: { type: Number, required: true },
    currency: { type: String, required: true },
    brand: { type: String },
    capture_before: { type: Number },
    country: { type: String },
    exp_month: { type: Number },
    exp_year: { type: Number },
    extended_authorization: {
        status: { type: String }
    },
    fingerprint: { type: String },
    funding: { type: String },
    incremental_authorization: {
        status: { type: String }
    },
    installments: { type: Number },
    last4: { type: String },
    mandate: { type: Schema.Types.Mixed },
    multicapture: {
        status: { type: String }
    },
    network: { type: String },
    network_token: {
        used: { type: Boolean }
    },
    overcapture: {
        maximum_amount_capturable: { type: Number },
        status: { type: String }
    },
    three_d_secure: { type: String },
    wallet: { type: Schema.Types.Mixed },
    status: { type: String, required: true },
    captured: { type: Boolean, required: true },
    canceled_at: { type: String },
    cancellation_reason: { type: String },
    capture_method: { type: String }
});

const PaymentCaptureModel = model<IPaymentCapture>('payment_captures', PaymentCaptureSchema);

export { PaymentCaptureModel };
