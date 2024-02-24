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
    await QuizModel.findByIdAndUpdate(newQuiz._id, { questions: createdQuestionRefs });

    res.json({
      status: true,
      message: 'Quiz and questions successfully entered',
    });
  } catch (err: any) {
    // Error handling
    res.status(500).json({ status: false, message: err.message });
  }
};

export const getAllQuizzes = async (_: any, res: Response) => {
  try {
    // Retrieve all quizzes
    const quizzes: IQuiz[] = await QuizModel.find().exec();

    res.json({
      status: true,
      quizzes,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

//admin add question /////////////
export const AdminAddQuestionlController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        question,
        options,
        answer,
      } = req.body;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id

        const newQuestion = new QuestionModel({
            question,
            options,
            answer
        })

        await newQuestion.save()

      res.json({  
        message: "question successfully enterd"
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//admin get all question /////////////
export const AdminGetAllQuestionController = async (
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
        questions,
        totalQuestion
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//admin get single question /////////////
export const AdminGetSingleQuestionController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        questionId
      } = req.query;
  
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
        question
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//admin edit question /////////////
export const AdminEditQuestionlController = async (
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
        message: "question successfully updated"
      });
      
    } catch (err: any) {
      // signup error
      console.log("error",  err)
      res.status(500).json({ message: err.message });
    }
  
}



//admin Delete question /////////////
export const AdminDeleteQuestionlController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        questionId
      } = req.body;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id
        
        const deleteQuestion = await QuestionModel.findOneAndDelete({_id: questionId}, {new: true})

        if (!deleteQuestion) {
            return res
            .status(401)
            .json({ message: "invalid question ID" });
        }

      res.json({  
        message: "question successfully deleted"
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


export const AdminQuizController = {
    DeleteQuestion:AdminDeleteQuestionlController,
    EditQuestion: AdminEditQuestionlController,
    GetSingleQuestion: AdminGetSingleQuestionController,
    GetAllQuestion: AdminGetAllQuestionController,
    AddQuestion: AdminAddQuestionlController,
    CreateQuiz,
    getAllQuizzes
}

