import { useState, useEffect } from "react";
import { getQuestions, saveQuestions } from "@/services/Question Management/questionService";
import { getKnowledgeBlocks } from "@/services/Question Management/knowledgeService";
import { getSubjects } from "@/services/Question Management/subjectService";

export default function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [knowledgeBlocks, setKnowledgeBlocks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    setQuestions(getQuestions());
    setKnowledgeBlocks(getKnowledgeBlocks());
    setSubjects(getSubjects());
  }, []);

  const addQuestion = (values) => {
    const newQuestion = { id: Date.now(), ...values };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };

  const deleteQuestion = (questionId) => {
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };

  const filterQuestions = (values) => {
    const filtered = getQuestions().filter(q => 
      (!values.subjectId || q.subjectId === values.subjectId) &&
      (!values.knowledgeBlockId || q.knowledgeBlockId === values.knowledgeBlockId) &&
      (!values.difficulty || q.difficulty === values.difficulty)
    );
    setQuestions(filtered);
  };

  return { questions, knowledgeBlocks, subjects, addQuestion, deleteQuestion, filterQuestions };
}
