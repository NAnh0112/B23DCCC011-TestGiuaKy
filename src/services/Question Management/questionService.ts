import type { Question } from './typings';

export const getQuestions = (): Question[] => {
  return JSON.parse(localStorage.getItem('questions') || '[]');
};

export const saveQuestions = (questions: Question[]) => {
  localStorage.setItem('questions', JSON.stringify(questions));
};