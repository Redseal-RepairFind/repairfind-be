"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceModel = void 0;
var mongoose_1 = require("mongoose");
var InvoiceItemSchema = new mongoose_1.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
});
var InvoiceSchema = new mongoose_1.Schema({
    jobId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job', required: true },
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Customer', required: true },
    amountDue: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true, enum: ['draft', 'open', 'paid', 'uncollectible'], default: 'draft' },
    items: { type: [InvoiceItemSchema], required: true }, // Array of invoice items
}, { timestamps: true });
var InvoiceModel = (0, mongoose_1.model)('invoices', InvoiceSchema);
exports.InvoiceModel = InvoiceModel;
