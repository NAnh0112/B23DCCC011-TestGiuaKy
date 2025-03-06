import type { Subject } from './typings';

export const getSubjects = (): Subject[] => {
  return JSON.parse(localStorage.getItem('subjects') || '[]');
};

export const saveSubjects = (subjects: Subject[]) => {
  localStorage.setItem('subjects', JSON.stringify(subjects));
};
