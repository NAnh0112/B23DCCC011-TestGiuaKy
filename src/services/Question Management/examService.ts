import type { Exam } from './typings';

export const getExams = (): Exam[] => {
  return JSON.parse(localStorage.getItem('exams') || '[]');
};

export const saveExams = (exams: Exam[]) => {
  localStorage.setItem('exams', JSON.stringify(exams));
};
