import { Document, Types, ObjectId } from "mongoose";
import { IContractorReg } from "./contractor.interface";

export interface IBankDetail extends Document {
  _id: ObjectId;
  contractorId: IContractorReg['_id']
  financialInstitution: string;
  accountNumber: string;
  transitNumber: string;
  financialInstitutionNumber: string;
  createdAt: Date;
  updatedAt: Date;
}