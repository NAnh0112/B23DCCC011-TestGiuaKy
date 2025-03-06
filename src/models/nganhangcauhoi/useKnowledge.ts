import { useState, useEffect } from "react";
import { getKnowledgeBlocks, saveKnowledgeBlocks } from "@/services/Question Management/knowledgeService";
import { getSubjects } from "@/services/Question Management/subjectService";

export default function useKnowledge() {
  const [knowledgeBlocks, setKnowledgeBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    setKnowledgeBlocks(getKnowledgeBlocks());
  }, []);

  const addKnowledgeBlock = (values) => {
    const newBlock = { id: Date.now(), name: values.name };
    const updatedBlocks = [...knowledgeBlocks, newBlock];
    setKnowledgeBlocks(updatedBlocks);
    saveKnowledgeBlocks(updatedBlocks);
  };

  const deleteKnowledgeBlock = (blockId) => {
    const updatedBlocks = knowledgeBlocks.filter(block => block.id !== blockId);
    setKnowledgeBlocks(updatedBlocks);
    saveKnowledgeBlocks(updatedBlocks);
    if (selectedBlock === blockId) {
      setSelectedBlock(null);
      setSubjects([]);
    }
  };

  const selectBlock = (blockId) => {
    setSelectedBlock(blockId);
    setSubjects(getSubjects().filter(subject => subject.knowledgeBlockId === blockId));
  };

  return { knowledgeBlocks, addKnowledgeBlock, deleteKnowledgeBlock, selectBlock, selectedBlock, subjects };
}
