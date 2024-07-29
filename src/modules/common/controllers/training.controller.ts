import { NextFunction, Request, Response } from "express";
import QuizModel, { IQuiz } from "../../../database/admin/models/quiz.model";
import QuestionModel, { IQuestion } from "../../../database/admin/models/question.model";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import ContractorQuizModel from "../../../database/contractor/models/contractor_quiz.model";
import { REVIEW_TYPE, ReviewModel } from "../../../database/common/review.model";
import { CONTRACTOR_BADGE } from "../../../database/contractor/interface/contractor.interface";
import { NotificationService } from "../../../services";


export const getQuiz = async (
    req: Request,
    res: Response,
) => {

    try {

        const { session } = req.query

        if (!session) {
            return res.status(404).json({
                status: false,
                message: 'Session does not exists',
            });
        }
        const randomQuizzes: any[] = await QuizModel.aggregate([{ $sample: { size: 1 } }]);
        let randomQuiz = randomQuizzes[0];
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
        const quizSession = encodeURI(`https://contractorapp.netlify.app/training?session=${session}`)
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

}



export const submitQuiz = async (
    req: any,
    res: Response,
) => {
    try {
        const {
            response,
        } = req.body;


        const { session } = req.query

        if (!session) {
            return res.status(404).json({
                status: false,
                message: 'Session does not exists',
            });
        }

        const [contractorId, quizId] = session.split('%');

        console.log(contractorId, quizId)

        if (!response) {
            return res.status(404).json({
                status: false,
                message: 'Quiz response is required',
            });
        }



        // Check if the contractor exists
        const contractor = await ContractorModel.findOne({ _id: contractorId });

        if (!contractor) {
            return res.status(401).json({ message: 'Contractor not found' });
        }

        // Retrieve the quiz by ID
        const quiz: IQuiz | null = await QuizModel.findOne({ _id: quizId });

        if (!quiz) {
            return res.status(401).json({ message: 'Incorrect quiz ID' });
        }

        // Retrieve the associated questions for the quiz
        const questions: IQuestion[] = await QuestionModel.find({ quiz: quizId });



        // Update the quiz results
        const quizResults = response.map((userResponse: { question: any; answer: any }) => {
            const question = questions.find((q) => q.question === userResponse.question);

            if (!question) {
                return {
                    question: userResponse.question,
                    userAnswer: userResponse.answer,
                    correct: false,
                };
            }

            // Check if user's answer is in the array of correct answers
            const isCorrect = question.answer.includes(userResponse.answer);

            return {
                question: userResponse.question,
                userAnswer: userResponse.answer,
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

        if (onboarding.hasPassedQuiz) {
            // give rating here
            // Check if the customer has already reviewed this job

            const ratings: any = [
                { item: "Cleanliness", rating: 5 },
                { item: "Skill", rating: 5 },
                { item: "Communication", rating: 5 },
                { item: "Timeliness", rating: 5 }
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

                contractor.badge = { label: CONTRACTOR_BADGE.TRAINING }

                await contractor.save();

            }

        }

        NotificationService.sendNotification({
            user: contractor.id,
            userType: 'contractors',
            title: 'Quiz Submitted',
            type: 'QUIZ_SUBMITTED',
            message: `You have completed repairfind basic training quiz`,
            heading: { name: `${contractor.firstName} ${contractor.lastName}`, image: contractor.profilePhoto?.url },
            payload: {
                entity: contractor.id,
                entityType: 'contractors',
                message: `You have completed repairfind basic training quiz`,
                contractor: contractor.id,
                event: 'QUIZ_SUBMITTED',
            }
        }, { push: true, socket: true })


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


export const TrainingController = {
    getQuiz,
    submitQuiz
}

