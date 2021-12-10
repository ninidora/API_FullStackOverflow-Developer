import * as questionsRepository from '../repositories/questionsRepository';
import { answerSchema } from '../schemas/AnswerSchema';
import { questionSchema } from '../schemas/QuestionSchema';

export async function createQuestion(question: string, student: string, userClass: string, tags: string) {
    const isValid = questionSchema.validate({ question, student, userClass, tags });
    if (isValid.error !== undefined) return false;

    const questionId = await questionsRepository.newQuestion(question, student, userClass, tags);
    return {
        id: questionId
    }
}

export async function getQuestions() {
    const questions = await questionsRepository.getUnansweredQuestions();
    if (!questions) return false;
    return questions;
}

export async function answerAQuestion(answer: string, questionId: number, token: string) {
    const checkIfAnwersIsValid = answerSchema.validate({ answer });
    if (checkIfAnwersIsValid.error !== undefined) return null;

    const checkIfQuestionExists = await questionsRepository.checkQuestionId(questionId);
    if (!checkIfQuestionExists) return false;
    
    const answerTheQuestion = await questionsRepository.answer(answer, questionId, token);
    if (!answerTheQuestion) return false;

    return true;
}
