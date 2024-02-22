import { Document, Types, ObjectId } from "mongoose";
import { IContractor } from "./contractor.interface";
import { IQuestion } from "../../admin/interface/question.interface";

export interface IContractorQuiz extends Document {
  _id: ObjectId;
  contractorId: IContractor['_id']
  questionId: IQuestion['_id'];
  answer: string[];
  mark: string;
  answered: string;
  createdAt: Date;
  updatedAt: Date;
}