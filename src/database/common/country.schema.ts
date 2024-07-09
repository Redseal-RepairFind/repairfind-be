import mongoose, { Schema, Document } from 'mongoose';

export interface ICountry {
    iso2Code: string;
    iso3Code: string;
    name: string;
    callingCode?: string;
    currencyCode?: string
    states?: [object];
  }
  

  export const CountrySchema: Schema = new Schema<ICountry>({
    iso2Code: String,
    iso3Code: String,
    name: String,
    callingCode: String,
    currencyCode: String,
    states: [Object]
  });

  export const CountryModel = mongoose.model<ICountry>('countries', CountrySchema);
