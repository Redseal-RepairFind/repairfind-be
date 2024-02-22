import { Document, Types, ObjectId } from "mongoose";
import { IContractor } from "./contractor.interface";

export interface IBankDetail extends Document {
  _id: ObjectId;
  contractorId: IContractor['_id']
  financialInstitution: string;
  accountNumber: string;
  transitNumber: string;
  financialInstitutionNumber: string;
  createdAt: Date;
  updatedAt: Date;
}