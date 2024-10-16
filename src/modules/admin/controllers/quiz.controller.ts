import { validationResult } from "express-validator";
import { Request, Response } from "express";
import QuestionModel, { IQuestion } from "../../../database/admin/models/question.model";
import QuizModel, { IQuiz } from "../../../database/admin/models/quiz.model";
import { ObjectId } from "mongoose";


//admin create quiz /////////////
export const CreateQuiz = async (req: any, res: Response) => {
  try {
    let { video_url, questions } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const admin = req.admin;
    const adminId = admin.id;

    // Create a new Quiz
    const newQuiz: IQuiz = await QuizModel.create({
      video_url,
      questions: [], // Initially empty, we'll fill this in later
    });

    // Array to store references to the newly created questions
    const createdQuestionRefs: ObjectId[] = [];

    // Create and associate each question with the quiz
    for (const questionData of questions) {
      const { question, options, answer } = questionData;

      // Create a new Question
      const newQuestion: IQuestion = await QuestionModel.create({
        quiz: newQuiz._id,
        question,
        options,
        answer,
      });

      // Store the reference to the created question
      createdQuestionRefs.push(newQuestion._id);
    }

    // Update the quiz with the references to the created questions
    const quiz = await QuizModel.findByIdAndUpdate(newQuiz._id, { questions: createdQuestionRefs }, {new: true});

    res.json({
      status: true,
      message: 'Quiz and questions successfully entered',
      data: quiz
    });
  } catch (err: any) {
    // Error handling
    res.status(500).json({ status: false, message: err.message });
  }
};

export const getAllQuizzes = async (_: any, res: Response) => {
  try {
    // Retrieve all quizzes
    const quizzes: IQuiz[] = await QuizModel.find().populate('questions');

    res.json({
      status: true,
      message: 'Quizzes retrieved',
      data: quizzes,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getRandomQuiz = async (_: any, res: Response) => {
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
      message: 'Random quize retreived',
      data: randomQuiz,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


export const getSingleQuiz = async (req: any, res: Response) => {
  try {
   
    const {quizId} = req.params
    const quiz = await QuizModel.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'No quizzes found',
      });
    }

    res.json({
      success: true,
      message: 'Quiz retreived',
      data: quiz,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//admin add question /////////////
export const addSingleQuestion = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        question,
        options,
        answer,
      } = req.body;
  
      const {quizId} = req.params

        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const quiz = await QuizModel.findById(quizId)
        if(!quiz){
          return res.status(404).json({  
            success: false,
            message: "Quiz not found"
          });
        }
        const newQuestion =  await QuestionModel.create({
            quiz : quiz.id,
            options,
            answer,
            question
        })

        quiz.questions.push(newQuestion.id)
        await quiz.save()

      res.json({  
        success: true,
        message: "question successfully entered"
      });
      
    } catch (err: any) {
      res.status(500).json({success: false,  message: err.message });
    }
  
}


//admin get all question /////////////
export const GetAllQuestions = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        page,
       limit
      } = req.query;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id

      page = page || 1;
      limit = limit || 50;

      const skip = (page - 1) * limit;

      const questions = await QuestionModel.find()
      .skip(skip)
      .limit(limit);

      const totalQuestion = await QuestionModel.countDocuments()
            

      res.json({ 
        status: true,
        data: {
          currentPage: page, 
          totalPages: Math.ceil( totalQuestion / limit),
          totalQuestion,
          questions,
        }
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//admin get single question /////////////
export const GetSingleQuestion = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        questionId
      } = req.params
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
      const admin =  req.admin;
      const adminId = admin.id

      const question = await QuestionModel.findOne({_id: questionId})

      if (!question) {
          return res
          .status(401)
          .json({ message: "invalid question ID" });
      } 

      res.json({ 
        status: true, 
        question
      });  
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//admin edit question /////////////
export const EditQuestion = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        question,
        options,
        answer,
        questionId
      } = req.body;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id
        
        const questionDb = await QuestionModel.findOne({_id: questionId})

        if (!questionDb) {
            return res
            .status(401)
            .json({ message: "invalid question ID" });
        }

        questionDb.question = question;
        questionDb.options = options;
        questionDb.answer = answer

        await questionDb.save();

      res.json({ 
        status: true, 
        message: "question successfully updated"
      });
      
    } catch (err: any) {
      // signup error
      console.log("error",  err)
      res.status(500).json({ message: err.message });
    }
  
}



//admin Delete question /////////////
export const DeleteQuestion = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        questionId
      } = req.params;
  
      
        const admin =  req.admin;
        const adminId = admin.id
        
        const question = await QuestionModel.findById(questionId)

        if (!question) {
            return res
            .status(401)
            .json({success: false,  message: "Invalid question ID" });
        }

        await question.deleteOne()

        const quiz = await  QuizModel.findById(question.quiz)
        if (quiz) {
          quiz.questions = quiz.questions.filter((questionId) => questionId.toString() !== question._id.toString());
          await quiz.save();
        }

      res.json({  
        status: true,
        message: "question successfully deleted"
      });
      
    } catch (err: any) {
      res.status(500).json({success: false, message: err.message });
    }
  
}


export const AdminQuizController = {
    DeleteQuestion,
    EditQuestion,
    GetSingleQuestion,
    GetAllQuestions,
    addSingleQuestion,
    CreateQuiz,
    getAllQuizzes,
    getRandomQuiz,
    getSingleQuiz
}

