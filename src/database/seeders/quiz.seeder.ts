import QuizModel from "../admin/models/quiz.model";
import QuestionModel from "../admin/models/question.model";
import { ObjectId } from "mongoose"; // Assuming you're using ObjectId from mongoose

export const QuizSeeder = async (options: Object) => {
  try {
    for (const quizData of quizzes) {
      const { video_url, questions } = quizData;

      // Check if the quiz already exists
      const existingQuiz = await QuizModel.findOne({ video_url });
      if (existingQuiz) continue; // Skip if the quiz already exists

      // Create a new Quiz with an empty questions array
      const newQuiz = await QuizModel.create({
        video_url,
        questions: [], // Initially empty, we'll fill this in later
      });

      // Array to store references to the newly created questions
      const createdQuestionRefs: ObjectId[] = [];

      // Create and associate each question with the quiz
      for (const questionData of questions) {
        const { question, options, answer } = questionData;

        // Create a new Question
        const newQuestion = await QuestionModel.create({
          quiz: newQuiz._id,
          question,
          options,
          answer,
        });

        // Store the reference to the created question
        createdQuestionRefs.push(newQuestion._id);
      }

      // Update the quiz with the references to the created questions
      await QuizModel.findByIdAndUpdate(newQuiz._id, { questions: createdQuestionRefs }, { new: true });

      console.log(`Quiz for video ${video_url} and its questions successfully seeded`);
    }
  } catch (error) {
    console.log("Error seeding quizzes:", error);
  }
};

const quizzes = [{
  "video_url": "https://contractorapp.s3.eu-west-3.amazonaws.com/y2mate.com+-+RepairFind_480dp.mp4",
  "questions": [
    {
      "question": "What are the five chapters of basic customer service mentioned in the video?",
      "options": ["The First Impression, Courtesy, A Positive Attitude, Ethical Behavior, Effective Communication", "The Beginning, Kindness, Positivity, Honesty, Communication",  "Introduction, Respect, Optimism, Integrity, Dialogue"],
      "answer": ["The First Impression, Courtesy, A Positive Attitude, Ethical Behavior, Effective Communication"]
    },
    {
      "question": "According to the video, how does it characterize customers in terms of marketing?",
      "options": ["Passive Observers",  "Unimportant Entities", "Valuable Assets"],
      "answer": ["Valuable Assets"]
    },
    {
      "question": "Why does the video emphasize the significance of leaving a positive impression?",
      "options": ["It's Politically Correct", "It Leads to Referrals and More Jobs", "It's a Trendy Concept"],
      "answer": ["It Leads to Referrals and More Jobs"]
    },
    {
      "question": "How does the video describe the negative impact of poor communication on a service provider's expertise?",
      "options": ["It Enhances Expertise", "It Highlights Expertise", "It Overshadows Expertise"],
      "answer": ["It Overshadows Expertise"]
    },
    {
      "question": "How does the video introduce the character who is new compared to David?",
      "options": ["As Fairly New, Arriving Early, Polite, and Respectful", "As Arrogant", "As Late Arriving"],
      "answer": ["As Fairly New, Arriving Early, Polite, and Respectful"]
    },
    {
      "question": "What qualities does the video consider as exemplary professionalism, especially in the context of Repair Find?",
      "options": ["Punctuality and Disregard for Cleanliness", "Arriving Early, Politeness, Respect, and Thoughtfulness", "Lack of Respect and Thoughtfulness"],
      "answer": ["Arriving Early, Politeness, Respect, and Thoughtfulness"]
    },
    {
      "question": "According to the video, why does Repair Find value small but significant gestures in professionalism?",
      "options": ["They Are Insignificant",  "They Don't Matter"],
      "answer": ["They Contribute to the Customer Service Experience", "They Contribute to the Customer Service Experience"]
    },
    {
      "question": "According to the video, what are the elements that count in customer service?",
      "options": ["Only Communication", "Appearance, Mannerisms, and Communication", "Appearance Only"],
      "answer": ["Appearance, Mannerisms, and Communication"]
    },
    {
      "question": "How does the video characterize the initial interaction in customer service?",
      "options": ["Lays the Groundwork for a Successful Relationship", "Unimportant for Relationships", "Only Relevant in Person"],
      "answer": ["Lays the Groundwork for a Successful Relationship"]
    },
    {
      "question": "According to the video, how does an excellent first impression impact the dynamics of customer service?",
      "options": ["It Doesn't Matter",  "It Hinders Customer Relations", "It Leads to Referrals and More Jobs",],
      "answer": ["It Leads to Referrals and More Jobs"]
    }
  ]
}];
