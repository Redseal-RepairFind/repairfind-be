import mongoose, { Schema, Document } from 'mongoose';

export interface ICountry {
  name: string;
  code: string;
  flag?: string;
  dial_code?: string;
  currency_code?: string
  states?: [object];
}


export const CountrySchema: Schema = new Schema<ICountry>({
  name: String,
  code: String,
  flag: String,
  dial_code: String,
  currency_code: String,
  states: [Object]
});

export const CountryModel = mongoose.model<ICountry>('countries', CountrySchema);
