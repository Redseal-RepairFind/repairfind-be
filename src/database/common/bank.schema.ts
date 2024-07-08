import mongoose, { Schema, Document } from 'mongoose';

// Define the schema for the Bank
const BankSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true }
});

// Create an interface for the Bank document
export interface IBank extends Document {
  name: string;
  code: string;
}

// Create a model for the Bank
export const BankModel = mongoose.model<IBank>('banks', BankSchema);
