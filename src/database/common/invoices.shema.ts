import { Schema, Document, model } from "mongoose";

// Define the schema for invoice items
interface IInvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
}

// Define the schema for invoices
interface IInvoice extends Document {
    jobId: Schema.Types.ObjectId;
    customerId: Schema.Types.ObjectId;
    amountDue: number;
    currency: string;
    description: string;
    status: string;
    items: IInvoiceItem[]; // Array of invoice items
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
});

const InvoiceSchema = new Schema<IInvoice>({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    amountDue: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true, enum: ['draft', 'open', 'paid', 'uncollectible'], default: 'draft' },
    items: { type: [InvoiceItemSchema], required: true }, // Array of invoice items
}, { timestamps: true });

const InvoiceModel = model<IInvoice>('invoices', InvoiceSchema);

export { InvoiceModel, IInvoice };
