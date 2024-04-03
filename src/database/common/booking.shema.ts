import { Schema } from "mongoose";

// Define schema for booking
interface IBooking extends Document {
    job: Object;
    customer: Object;
    application: Object;
    contractor: Object;
    startDate: Date;
    endDate: Date;
    siteVisit: boolean;
    estimates: string[];
    charges: number;
}

const BookingSchema = new Schema<IBooking>({
    job: { type: Schema.Types.ObjectId, ref: 'contractors', required: true },
    contractor: { type: Schema.Types.ObjectId, ref: 'contractors' },
    customer: { type: Schema.Types.ObjectId, ref: 'contractors' },
    application: { type: Schema.Types.ObjectId, ref: 'contractors' },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    
    siteVisit: { type: Boolean, default: false },
    estimates: { type: [String], required: true },
    charges: { type: Number, required: true }
});