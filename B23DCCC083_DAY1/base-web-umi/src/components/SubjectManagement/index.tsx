import { useEffect, useState } from 'react';
import SubjectList from './SubjectList';
import StudyLog from './StudyLog';
import StudyGoal from './StudyGoal';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [studyLogs, setStudyLogs] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage khi khởi động
    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const storedLogs = JSON.parse(localStorage.getItem('studyLogs') || '[]');
    const storedGoals = JSON.parse(localStorage.getItem('goals') || '[]');

    setSubjects(storedSubjects);
    setStudyLogs(storedLogs);
    setGoals(storedGoals);
  }, []);

  return (
    <div>
      <h1>📚 Ứng dụng quản lý học tập</h1>
      <SubjectList subjects={subjects} setSubjects={setSubjects} />
      <StudyLog subjects={subjects} studyLogs={studyLogs} setStudyLogs={setStudyLogs} />
      <StudyGoal subjects={subjects} goals={goals} setGoals={setGoals} />
    </div>
  );
};

export default SubjectManagement;
