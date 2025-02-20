import { useState } from 'react';
import { Button, Input, Select, DatePicker, List } from 'antd';
import moment from 'moment';

const StudyGoal = ({ subjects, goals, setGoals }) => {
  const [subjectId, setSubjectId] = useState(null);
  const [month, setMonth] = useState(null);
  const [targetHours, setTargetHours] = useState('');

  // 🆕 Đánh dấu mục tiêu là hoàn thành
  const completeGoal = (index) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, completedHours: goal.targetHours } : goal
    );

    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  };

  // 🆕 Xóa mục tiêu học tập
  const deleteGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  };

  // 🆕 Thêm mục tiêu học tập mới
  const addGoal = () => {
    if (subjectId && month && targetHours) {
      const newGoal = {
        month: month.format('YYYY-MM'),
        subjectId,
        targetHours: parseFloat(targetHours),
        completedHours: 0,
      };

      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      localStorage.setItem('goals', JSON.stringify(updatedGoals));
    }
  };

  return (
    <div>
      <h2>🎯 Mục tiêu học tập</h2>
      <Select
        placeholder="Chọn môn học"
        onChange={setSubjectId}
        options={subjects.map((s) => ({ value: s.id, label: s.name }))}
      />
      <DatePicker picker="month" onChange={setMonth} />
      <Input placeholder="Số giờ mục tiêu" onChange={(e) => setTargetHours(e.target.value)} />
      <Button onClick={addGoal}>Thêm</Button>

      {/* Danh sách mục tiêu */}
      <List
        dataSource={goals}
        renderItem={(item, index) => (
          <List.Item>
            <div>
              {subjects.find((s) => s.id === item.subjectId)?.name} - {item.targetHours}h
              {item.completedHours >= item.targetHours ? (
                <span style={{ color: 'green', marginLeft: 10 }}>✅ Hoàn thành</span>
              ) : (
                <Button
                  onClick={() => completeGoal(index)}
                  style={{ marginLeft: 10 }}
                  type="primary"
                >
                  Hoàn thành
                </Button>
              )}
              <Button
                onClick={() => deleteGoal(index)}
                danger
                style={{ marginLeft: 10 }}
              >
                ❌ Xóa
              </Button>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default StudyGoal;
