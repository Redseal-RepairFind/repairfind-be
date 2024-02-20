import { Document, Types, ObjectId } from "mongoose";
import { IJob } from "./job.interface";

export interface IContractorRatedJob extends Document {
  _id: ObjectId;
  jobId: IJob['_id'];
  createdAt: Date;
  updatedAt: Date;
}
