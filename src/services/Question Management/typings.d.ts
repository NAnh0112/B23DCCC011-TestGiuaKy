export interface KnowledgeBlock {
    id: number;
    name: string;
  }
  
  export interface Subject {
    id: number;
    code: string;
    name: string;
    credits: number;
    knowledgeBlockId: number;
  }
  
  export interface Question {
    id: number;
    content: string;
    subjectId: number;
    difficulty: "Dễ" | "Trung bình" | "Khó" | "Rất khó";
    knowledgeBlockId: number;
  }
  
  export interface Exam {
    id: number;
    name: string;
    structure: { knowledgeBlockId: number; difficulty: string; quantity: number }[];
  }