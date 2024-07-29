import { validationResult } from "express-validator";
import { Request, Response, urlencoded } from "express";
import QuestionModel, { IQuestion } from "../../../database/admin/models/question.model";
import QuizModel, { IQuiz } from "../../../database/admin/models/quiz.model";
import { ObjectId } from "mongoose";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import ContractorQuizModel, { IContractorQuiz } from "../../../database/contractor/models/contractor_quiz.model";
import { bool } from "aws-sdk/clients/signer";
import { REVIEW_TYPE, ReviewModel } from "../../../database/common/review.model";
import { Logger } from "../../../services/logger";
import { CONTRACTOR_BADGE } from "../../../database/contractor/interface/contractor.interface";



export const StartQuiz = async (req: any, res: Response) => {
  try {

    const contractorId = req.contractor.id
    // Retrieve a random quiz
    // const randomQuiz: IQuiz | null = await QuizModel.aggregate([{ $sample: { size: 1 } }]);
    const randomQuizzes: any[] = await QuizModel.aggregate([{ $sample: { size: 1 } }]);
    let randomQuiz = randomQuizzes[0] ;
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
    const quizSession = encodeURI(`https://contractorapp.netlify.app/training?session=${ contractorId+"%"+randomQuiz._id }`)
    randomQuiz.session = quizSession

    res.json({
      status: true,
      message: 'Quiz retrieved',
      data: randomQuiz,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


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

    const contractorId = req.contractor.id;

    // Check if the contractor exists
    const contractor = await ContractorModel.findOne({ _id: contractorId });

    if (!contractor) {
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
    const quizResults = response.map((userReponse: { question: any; answer: any }) => {
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

    if (!contractorQuiz) {
      return res.status(500).json({ success: false, message: 'Failed to update or create ContractorQuiz' });
    }

    const result = await contractorQuiz.result
    const onboarding = await contractor.getOnboarding()
    contractor.onboarding = onboarding

    if(onboarding.hasPassedQuiz){
      // give rating here
      // Check if the customer has already reviewed this job

      const ratings: any = [
        {item: "Cleanliness", rating: 5},
        {item: "Skill", rating: 5},
        {item: "Communication", rating: 5},
        {item: "Timeliness", rating: 5}
      ]
      const review: string = 'Contractor has completed the basic customer service training with Repairfind and has attained a verification badge'

      const existingReview = await ReviewModel.findOne({ contractor: contractorId, type: REVIEW_TYPE.TRAINING_COMPLETION })

      if (!existingReview) {
        const totalRatings = ratings?.length;
        const totalReviewScore = totalRatings ? ratings.reduce((a: any, b: any) => a + b.rating, 0) : 0;
        const averageRating = (totalRatings && totalReviewScore) > 0 ? totalReviewScore / totalRatings : 0;
  
        // Create a new review object
        const newReview = await ReviewModel.findOneAndUpdate({ contractor: contractorId, type: REVIEW_TYPE.TRAINING_COMPLETION }, {
            averageRating,
            ratings,
            // customer: job.customer,
            contractor: contractorId,
            comment: review,
            type: REVIEW_TYPE.TRAINING_COMPLETION,
            createdAt: new Date(),
        }, { new: true, upsert: true });
  
  
        const foundIndex = contractor.reviews.findIndex((review) => review.review == newReview.id);
        if (foundIndex !== -1) {
            contractor.reviews[foundIndex] = { review: newReview.id, averageRating };
        } else {
            contractor.reviews.push({ review: newReview.id, averageRating });
        }

        contractor.badge = {label: CONTRACTOR_BADGE.TRAINING}

        await contractor.save();
  
      }

      
      
    }

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        ...contractorQuiz.toJSON(),
        result,
        contractor
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const QuizController = {
  StartQuiz,
  SubmitQuiz,
}

