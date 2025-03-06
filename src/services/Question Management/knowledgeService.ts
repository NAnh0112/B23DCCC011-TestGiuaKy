import type { KnowledgeBlock } from './typings';

export const getKnowledgeBlocks = (): KnowledgeBlock[] => {
  return JSON.parse(localStorage.getItem('knowledgeBlocks') || '[]');
};

export const saveKnowledgeBlocks = (blocks: KnowledgeBlock[]) => {
  localStorage.setItem('knowledgeBlocks', JSON.stringify(blocks));
};