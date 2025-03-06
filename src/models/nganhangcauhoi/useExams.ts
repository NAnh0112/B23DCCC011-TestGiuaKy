import { useState, useEffect } from "react";
import { getExams, saveExams } from "@/services/Question Management/examService";
import { getSubjects } from "@/services/Question Management/subjectService";
import { getQuestions } from "@/services/Question Management/questionService";
import { getKnowledgeBlocks } from "@/services/Question Management/knowledgeService";

export default function useExams() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [knowledgeBlocks, setKnowledgeBlocks] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    setExams(getExams());
    setSubjects(getSubjects());
    setQuestions(getQuestions());
    setKnowledgeBlocks(getKnowledgeBlocks());
  }, []);

  const createExam = (values) => {
    const { name, subjectId, structure } = values;
    const selectedQuestions = [];
    
    structure.forEach(({ knowledgeBlockId, difficulty, quantity }) => {
      const availableQuestions = questions.filter(
        (q) => q.subjectId === subjectId && q.knowledgeBlockId === knowledgeBlockId && q.difficulty === difficulty
      );
      
      if (availableQuestions.length < quantity) {
        alert(`Không đủ câu hỏi cho khối ${knowledgeBlockId} - ${difficulty}`);
        return;
      }
      
      selectedQuestions.push(...availableQuestions.slice(0, quantity));
    });

    if (selectedQuestions.length === structure.reduce((sum, item) => sum + item.quantity, 0)) {
      const newExam = { id: Date.now(), name, subjectId, questions: selectedQuestions };
      const updatedExams = [...exams, newExam];
      setExams(updatedExams);
      saveExams(updatedExams);
    }
  };

  const deleteQuestion = (examId, questionId) => {
    const updatedExams = exams.map(exam => {
      if (exam.id === examId) {
        return { ...exam, questions: exam.questions.filter(q => q.id !== questionId) };
      }
      return exam;
    });
    setExams(updatedExams);
    saveExams(updatedExams);
    setSelectedExam(updatedExams.find(exam => exam.id === examId));
  };

  const selectExam = (examId) => {
    setSelectedExam(exams.find(e => e.id === examId));
  };

  return { exams, subjects, questions, knowledgeBlocks, selectedExam, createExam, deleteQuestion, selectExam };
}
