import { useState, useEffect } from "react";
import { getSubjects, saveSubjects } from "@/services/Question Management/subjectService";
import { getKnowledgeBlocks } from "@/services/Question Management/knowledgeService";

export default function useSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [knowledgeBlocks, setKnowledgeBlocks] = useState([]);

  useEffect(() => {
    setSubjects(getSubjects());
    setKnowledgeBlocks(getKnowledgeBlocks());
  }, []);

  const addSubject = (values) => {
    const newSubject = { id: Date.now(), ...values };
    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
  };

  const deleteSubject = (subjectId) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
  };

  return { subjects, knowledgeBlocks, addSubject, deleteSubject };
}
