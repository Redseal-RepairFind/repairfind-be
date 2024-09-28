import { NotificationService } from "../..";
import { IContractor } from "../../../database/contractor/interface/contractor.interface";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import ContractorQuizModel from "../../../database/contractor/models/contractor_quiz.model";
import { Logger } from "../../logger";


export const QUIZ_REMINDER = {
    NOT_TAKEN: 'NOT_TAKEN',
    FAILED: 'FAILED',
    DAYS_1: 'DAYS_1',
    DAYS_3: 'DAYS_3',
    DAYS_7: 'DAYS_7',
};


export const quizReminderCheck = async () => {
    try {
        const contractors = await ContractorModel.find({}) as IContractor[];

        for (const contractor of contractors) {
            try {
                const latestQuiz = await ContractorQuizModel.findOne({ contractor: contractor._id }).sort({ createdAt: -1 });
                
                const currentDate = new Date();
                const quizTakenDate = latestQuiz ? new Date(latestQuiz.createdAt) : null;
                const daysSinceQuizTaken = quizTakenDate ? Math.floor((currentDate.getTime() - quizTakenDate.getTime()) / (1000 * 60 * 60 * 24)) : null;

                if (!latestQuiz) {
                    sendReminderContractor(contractor, `You have not taken or passed the optional quiz yet. Please complete it as soon as possible.`);
                    continue;
                }

                const result = await latestQuiz.result
                // sendReminderContractor(contractor, `It's been 1 day since you took the quiz. Please review and retake if needed.`);
                // sendReminderContractor(contractor, `You did not pass the quiz. Please retake it as soon as possible.`);


                Logger.info(`Processed quiz reminder for contractor: ${contractor._id}`);
            } catch (error) {
                Logger.error(`Error sending quiz reminder for contractor ID ${contractor._id}:`, error);
            }
        }
    } catch (error) {
        Logger.error('Error fetching contractors for quiz reminders:', error);
    }
};

function sendReminderContractor(contractor: IContractor, message: string) {
    NotificationService.sendNotification({
        user: contractor._id,
        userType: 'contractors',
        title: 'Quiz Reminder',
        type: 'QUIZ_REMINDER',
        message: message,
        heading: { name: contractor.name, image: contractor.profilePhoto?.url },
        payload: {
            entity: contractor._id,
            entityType: 'contractors',
            message: message,
            event: 'QUIZ_REMINDER',
        }
    }, { push: true, socket: true });
}
