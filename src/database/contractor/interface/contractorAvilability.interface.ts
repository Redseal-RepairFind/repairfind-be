import { Document, Types, ObjectId } from "mongoose";
import { IContractorReg } from "./contractor.interface";

export interface IContractorAvailbility extends Document {
  _id: ObjectId;
  contractorId: IContractorReg['_id']
  avialable: string;
  time: {
    from: string;
    to: string;
    sos: boolean;
    day: string;
  };

  createdAt: Date;
  updatedAt: Date;
}
