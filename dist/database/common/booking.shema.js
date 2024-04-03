"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var BookingSchema = new mongoose_1.Schema({
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors', required: true },
    contractor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors' },
    customer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors' },
    application: { type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    siteVisit: { type: Boolean, default: false },
    estimates: { type: [String], required: true },
    charges: { type: Number, required: true }
});
