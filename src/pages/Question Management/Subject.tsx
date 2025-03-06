import { Form, Input, Select, Button } from "antd";
import useSubjects from "@/models/nganhangcauhoi/useSubjects";

const { Option } = Select;

const SubjectComponent: React.FC = () => {
  const { subjects, knowledgeBlocks, addSubject, deleteSubject } = useSubjects();

  return (
    <div>
      <h2>Môn Học</h2>
      <Form onFinish={addSubject} layout="vertical">
        <Form.Item name="code" rules={[{ required: true, message: "Nhập mã môn học!" }]}> 
          <Input placeholder="Mã môn học" />
        </Form.Item>
        <Form.Item name="name" rules={[{ required: true, message: "Nhập tên môn học!" }]}> 
          <Input placeholder="Tên môn học" />
        </Form.Item>
        <Form.Item name="credits" rules={[{ required: true, message: "Nhập số tín chỉ!" }]}> 
          <Input type="number" placeholder="Số tín chỉ" />
        </Form.Item>
        <Form.Item name="knowledgeBlockId" rules={[{ required: true, message: "Chọn khối kiến thức!" }]}> 
          <Select placeholder="Chọn khối kiến thức">
            {knowledgeBlocks.map((block) => (
              <Option key={block.id} value={block.id}>{block.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Button htmlType="submit" type="primary">Thêm</Button>
      </Form>
      <h3>Danh sách Môn Học</h3>
      <ul>
        {subjects.map((subject) => (
          <li key={subject.id}>
            {subject.name} ({subject.code}) - {subject.credits} tín chỉ
            <Button onClick={() => deleteSubject(subject.id)}>Xóa</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubjectComponent;
