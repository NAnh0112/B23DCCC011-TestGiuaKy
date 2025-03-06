// import { useState } from 'react';
// import { Button, Input, List } from 'antd';

// const SubjectList = ({ subject, setSubjects }) => {
//   const [newSubject, setNewSubject] = useState("");

//   const addSubject = () => {
//     if (newSubject.trim()) {
//       const updatedSubjects = [...subjects, { id: Date.now(), name: newSubject }];
//       setSubjects(updatedSubjects);
//       localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
//       setNewSubject('');
//     }
//   };

//   const deleteSubject = (id) => {
//     const updatedSubjects = subjects.filter((s) => s.id !== id);
//     setSubjects(updatedSubjects);
//     localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
//   };

//   return (
//     <div>
//       <h2>📖 Danh mục môn học</h2>
//       <Input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
//       <Button onClick={addSubject}>Thêm</Button>
//       <List
//         dataSource={subjects}
//         renderItem={(item) => (
//           <List.Item>
//             {item.name}
//             <Button onClick={() => deleteSubject(item.id)}>Xóa</Button>
//           </List.Item>
//         )}
//       />
//     </div>
//   );
// };

// export default SubjectList;
