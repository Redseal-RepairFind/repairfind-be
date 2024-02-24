import { validationResult } from "express-validator";
import { Request, Response } from "express";
import QuestionModel, { IQuestion } from "../../../database/admin/models/question.model";
import QuizModel, { IQuiz } from "../../../database/admin/models/quiz.model";
import { ObjectId } from "mongoose";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import ContractorQuizModel, { IContractorQuiz } from "../../../database/contractor/models/contractor_quiz.model";
import { bool } from "aws-sdk/clients/signer";



export const StartQuiz = async (_: any, res: Response) => {
  try {
    // Retrieve a random quiz
    // const randomQuiz: IQuiz | null = await QuizModel.aggregate([{ $sample: { size: 1 } }]);
    const randomQuizzes: any[] = await QuizModel.aggregate([{ $sample: { size: 1 } }]);
    let randomQuiz: IQuiz | null = randomQuizzes[0] as IQuiz | null;
    if (!randomQuiz) {
      return res.status(404).json({
        status: false,
        message: 'No quizzes found',
      });
    }

    // Retrieve 10 random questions associated with the random quiz
    const randomQuestions = await QuestionModel.aggregate([
      { $match: { quiz: randomQuiz._id } },
      { $sample: { size: 10 } },
    ]);

    randomQuiz.questions = randomQuestions

    res.json({
      status: true,
      message: 'Quize retrieved',
      data: randomQuiz,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


//contractor  get quiz result
export const GetQuizResult = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    
    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    // const checkTakeTestAlready = await ContractorQuizModel.find({contractorId});  

    // if (checkTakeTestAlready.length < 1) {
    //   return res
    //     .status(401)
    //     .json({ message: "start the quiz first" });
    // }

    // const totalPass = await ContractorQuizModel.countDocuments({contractorId, mark: "pass"})

    // const totalQustion = await ContractorQuizModel.countDocuments({contractorId,})
     
    
    res.json({  
      // totalPass,
      // totalQustion
   });
    
  } catch (err: any) {
    res.status(500).json({status: false, message: err.message });
  }

}



export const SubmitQuiz = async (
  req: any,
  res: Response,
) => {
  try {
    const {
      quizId,
      response,
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contractor = req.contractor;
    const contractorId = contractor.id;

    // Check if the contractor exists
    const contractorExist = await ContractorModel.findOne({ _id: contractorId });

    if (!contractorExist) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Retrieve the quiz by ID
    const quiz: IQuiz | null = await QuizModel.findOne({ _id: quizId });

    if (!quiz) {
      return res.status(401).json({ message: 'Incorrect quiz ID' });
    }

    // Retrieve the associated questions for the quiz
    const questions: IQuestion[] = await QuestionModel.find({ quiz: quizId });

  

    // Update the quiz results
    const quizResults = response.map((userReponse: {  question: any; answer: any }) => {
      const question = questions.find((q) => q.question === userReponse.question);

      if (!question) {
        return {
          question: userReponse.question,
          userAnswer: userReponse.answer,
          correct: false,
        };
      }

      // Check if user's answer is in the array of correct answers
      const isCorrect = question.answer.includes(userReponse.answer);

      return {
        question: userReponse.question,
        userAnswer: userReponse.answer,
        correct: isCorrect,
      };
    });

    // Find existing ContractorQuiz or create a new one
    let contractorQuiz = await ContractorQuizModel.findOneAndUpdate(
      { contractor: contractorId, quiz: quizId },
      { $set: { response: quizResults } },
      { new: true, upsert: true }
    );

    // If upsert: true is used, and no document matches the query, findOneAndUpdate will create a new document.
    // If a document matches the query, it will update the existing document and return the updated document.
    if (!contractorQuiz) {
      // Handle the case where the contractorQuiz is not found or created.
      return res.status(500).json({success:false, message: 'Failed to update or create ContractorQuiz' });
    }

    // Compute result statistics
    const totalQuestions = quizResults.length;
    const totalCorrect = quizResults.filter((response: {question: string, userAnswer: string, correct: bool }) => response.correct).length;
    const totalWrong = totalQuestions - totalCorrect;
    const totalAnswered = response.length;
    
    const result = {
      totalQuestions,
      totalCorrect,
      totalWrong,
      totalAnswered
    }

    contractorQuiz.result = result
    res.json({
      success: true,
      message: 'Quiz results submitted successfully',
      data: contractorQuiz,
    });
  } catch (err: any) {
    res.status(500).json({ success:false, message: err.message });
  }
};


export const QuizController = {
    StartQuiz,
    SubmitQuiz,
    GetQuizResult
}



function areArraysEqualUnordered(arr1: any, arr2: any) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const countMap = new Map();

  // Count occurrences in arr1
  arr1.forEach((item: any) => {
    countMap.set(item, (countMap.get(item) || 0) + 1);
  });

  // Decrement occurrences in arr2
  arr2.forEach((item: any) => {
    const count = countMap.get(item);
    if (!count) {
      return false; // item not found in arr1
    }

    if (count === 1) {
      countMap.delete(item);
    } else {
      countMap.set(item, count - 1);
    }
  });

  return countMap.size === 0;
}