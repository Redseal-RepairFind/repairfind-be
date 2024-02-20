import { Document, Types, ObjectId } from "mongoose";
import { IContractorReg } from "./contractor.interface";

interface Rate {
  customerId: string;
  jobId: string;
  cleanliness: number;
  timeliness: number;
  skill: number;
  communication: number
  courteous: number;
  cleanlinessText: string;
  timelinessText: string;
  skillText: string;
  communicationText: string;
  courteousText: string;
}

export interface IContractorRating extends Document {
  _id: ObjectId;
  contractorId: IContractorReg['_id'];
  rate: Rate[];
  avgCleanliness: number;
  avgTimeliness: number;
  avgSkill: number;
  avgCommunication: number;
  avgCourteous: number;
  avgRating: number;
  createdAt: Date;
  updatedAt: Date;
}
