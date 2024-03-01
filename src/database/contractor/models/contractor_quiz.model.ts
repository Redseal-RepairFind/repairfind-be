import { ObjectId, Schema, model, Document } from 'mongoose';
import { IContractor } from '../interface/contractor.interface';
import QuestionModel, { IQuestion } from '../../admin/models/question.model';

interface IQuestionResponse {
  question: string;
  userAnswer: string;
  correct: boolean;
}

export interface IContractorQuiz extends Document {
  _id: ObjectId;
  contractor: IContractor['_id'];
  quiz: ObjectId; // Reference to the Quiz model
  response: IQuestionResponse[];
  result: Object
  createdAt: Date;
  updatedAt: Date;
}

const QuestionResultSchema = new Schema<IQuestionResponse>(
  {
    question: {
      type: String,
      required: true,
    },
    userAnswer: {
      type: String,
    },
    correct: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false } // Disable _id for subdocuments
);

const ContractorQuizSchema = new Schema<IContractorQuiz>(
  {
    contractor: {
      type: Schema.Types.ObjectId,
      ref: 'contractors',
      required: true,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'quizzes',
      required: true,
    },
    response: {
      type: [QuestionResultSchema],
      default: [],
    },
    // result:{
    //   type: Object
    // }
  },
  {
    timestamps: true,
  }
);



ContractorQuizSchema.virtual('result').get(async function () {
  // Retrieve the associated questions for the quiz
  const questions: IQuestion[] = await QuestionModel.find({ quiz: this.quiz });

  const totalQuestions = questions.length;
  const totalCorrect = this.response.filter((response) => response.correct).length;
  const totalWrong = totalQuestions - totalCorrect;
  const totalAnswered = this.response.length;
   const percentageCorrect = (totalCorrect / totalQuestions) * 100;
   const passed = percentageCorrect >= 70;

  return {
    totalQuestions,
    totalCorrect,
    totalWrong,
    totalAnswered,
    passed
  };
});



const ContractorQuizModel = model<IContractorQuiz>('contractor_quizzes', ContractorQuizSchema);

export default ContractorQuizModel;
