import { Document, Types, ObjectId } from "mongoose";
import { IContractorReg } from "./contractor.interface";
import { IQuestion } from "../../admin/interface/question.interface";

export interface IContractorQuiz extends Document {
  _id: ObjectId;
  contractorId: IContractorReg['_id']
  questionId: IQuestion['_id'];
  answer: string[];
  mark: string;
  answered: string;
  createdAt: Date;
  updatedAt: Date;
}