import { useState } from 'react';
import { Button, Input, Select, DatePicker, TimePicker, List, Modal } from 'antd';
import moment from 'moment';

const StudyLog = ({ subjects, studyLogs, setStudyLogs }) => {
  const [subjectId, setSubjectId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [note, setNote] = useState('');
  const [editingLog, setEditingLog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 🟢 Tính toán thời lượng học
  const calculateDuration = () => {
    if (startTime && endTime) {
      const start = moment(startTime, 'HH:mm');
      const end = moment(endTime, 'HH:mm');
      return moment.duration(end.diff(start)).asHours();
    }
    return 0;
  };

  // 🟢 Thêm lịch học
  const addStudyLog = () => {
    if (subjectId && startDate && endDate && startTime && endTime) {
      const newLog = {
        id: Date.now(),
        subjectId,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        startTime: startTime.format('HH:mm'),
        endTime: endTime.format('HH:mm'),
        duration: calculateDuration(),
        note,
      };

      const updatedLogs = [...studyLogs, newLog];
      setStudyLogs(updatedLogs);
      localStorage.setItem('studyLogs', JSON.stringify(updatedLogs));
      resetForm();
    }
  };

  // 🟡 Mở Modal chỉnh sửa
  const openEditModal = (log) => {
    setEditingLog(log);
    setSubjectId(log.subjectId);
    setStartDate(moment(log.startDate));
    setEndDate(moment(log.endDate));
    setStartTime(moment(log.startTime, 'HH:mm'));
    setEndTime(moment(log.endTime, 'HH:mm'));
    setNote(log.note);
    setIsModalVisible(true);
  };

  // 🔵 Cập nhật lịch học
  const updateStudyLog = () => {
    const updatedLogs = studyLogs.map((log) =>
      log.id === editingLog.id
        ? {
            ...log,
            subjectId,
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            startTime: startTime.format('HH:mm'),
            endTime: endTime.format('HH:mm'),
            duration: calculateDuration(),
            note,
          }
        : log
    );
    setStudyLogs(updatedLogs);
    localStorage.setItem('studyLogs', JSON.stringify(updatedLogs));
    setIsModalVisible(false);
    resetForm();
  };

  // 🔴 Xóa lịch học
  const deleteLog = (id) => {
    const updatedLogs = studyLogs.filter((log) => log.id !== id);
    setStudyLogs(updatedLogs);
    localStorage.setItem('studyLogs', JSON.stringify(updatedLogs));
  };

  // 🧹 Reset Form
  const resetForm = () => {
    setSubjectId(null);
    setStartDate(null);
    setEndDate(null);
    setStartTime(null);
    setEndTime(null);
    setNote('');
    setEditingLog(null);
  };

  return (
    <div>
      <h2>📅 Tiến độ học tập</h2>
      <Select
        placeholder="Chọn môn học"
        value={subjectId}
        onChange={setSubjectId}
        options={subjects.map((s) => ({ value: s.id, label: s.name }))}
      />
      <DatePicker placeholder="Ngày bắt đầu" value={startDate} onChange={setStartDate} />
      <DatePicker placeholder="Ngày kết thúc" value={endDate} onChange={setEndDate} />
      <TimePicker value={startTime} onChange={setStartTime} format="HH:mm" placeholder="Giờ bắt đầu" />
      <TimePicker value={endTime} onChange={setEndTime} format="HH:mm" placeholder="Giờ kết thúc" />
      <Input placeholder="Ghi chú" value={note} onChange={(e) => setNote(e.target.value)} />
      <Button onClick={editingLog ? updateStudyLog : addStudyLog}>
        {editingLog ? 'Cập nhật' : 'Thêm'}
      </Button>

      <List
        dataSource={studyLogs}
        renderItem={(item) => (
          <List.Item>
            📚 {subjects.find((s) => s.id === item.subjectId)?.name} - 📅 {item.startDate} → {item.endDate} - ⏰ {item.startTime} → {item.endTime} - ⏳ {item.duration.toFixed(2)}h - {item.note}
            <Button onClick={() => openEditModal(item)} style={{ marginLeft: 10 }}>✏️ Sửa</Button>
            <Button onClick={() => deleteLog(item.id)} danger style={{ marginLeft: 10 }}>❌ Xóa</Button>
          </List.Item>
        )}
      />

      {/* 🟢 Modal Chỉnh Sửa */}
      <Modal
        title="Chỉnh sửa lịch học"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={updateStudyLog}
      >
        <Select
          placeholder="Chọn môn học"
          value={subjectId}
          onChange={setSubjectId}
          options={subjects.map((s) => ({ value: s.id, label: s.name }))}
        />
        <DatePicker placeholder="Ngày bắt đầu" value={startDate} onChange={setStartDate} />
        <DatePicker placeholder="Ngày kết thúc" value={endDate} onChange={setEndDate} />
        <TimePicker value={startTime} onChange={setStartTime} format="HH:mm" placeholder="Giờ bắt đầu" />
        <TimePicker value={endTime} onChange={setEndTime} format="HH:mm" placeholder="Giờ kết thúc" />
        <Input placeholder="Ghi chú" value={note} onChange={(e) => setNote(e.target.value)} />
      </Modal>
    </div>
  );
};

export default StudyLog;
