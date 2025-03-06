import { Form, Input, Select, Button } from "antd";
import useQuestions from "@/models/nganhangcauhoi/useQuestions";

const { Option } = Select;

const QuestionComponent: React.FC = () => {
  const { questions, knowledgeBlocks, subjects, addQuestion, deleteQuestion, filterQuestions } = useQuestions();

  return (
    <div>
      <h2>Quản lý Câu Hỏi</h2>
      <Form onFinish={addQuestion} layout="vertical">
        <Form.Item name="id" rules={[{ required: true, message: "Nhập mã câu hỏi!" }]}> 
          <Input placeholder="Mã câu hỏi" />
        </Form.Item>
        <Form.Item name="content" rules={[{ required: true, message: "Nhập nội dung câu hỏi!" }]}> 
          <Input.TextArea placeholder="Nội dung câu hỏi" />
        </Form.Item>
        <Form.Item name="subjectId" rules={[{ required: true, message: "Chọn môn học!" }]}> 
          <Select placeholder="Chọn môn học">
            {subjects.map((subject) => (
              <Option key={subject.id} value={subject.id}>{subject.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="knowledgeBlockId" rules={[{ required: true, message: "Chọn khối kiến thức!" }]}> 
          <Select placeholder="Chọn khối kiến thức">
            {knowledgeBlocks.map((block) => (
              <Option key={block.id} value={block.id}>{block.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="difficulty" rules={[{ required: true, message: "Chọn mức độ khó!" }]}> 
          <Select placeholder="Chọn mức độ khó">
            <Option value="Dễ">Dễ</Option>
            <Option value="Trung bình">Trung bình</Option>
            <Option value="Khó">Khó</Option>
            <Option value="Rất khó">Rất khó</Option>
          </Select>
        </Form.Item>
        <Button htmlType="submit" type="primary">Thêm</Button>
      </Form>
      
      <h3>Tìm kiếm Câu Hỏi</h3>
      <Form onFinish={filterQuestions} layout="vertical">
        <Form.Item name="subjectId"> 
          <Select placeholder="Tìm theo môn học">
            {subjects.map((subject) => (
              <Option key={subject.id} value={subject.id}>{subject.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="knowledgeBlockId"> 
          <Select placeholder="Tìm theo khối kiến thức">
            {knowledgeBlocks.map((block) => (
              <Option key={block.id} value={block.id}>{block.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="difficulty"> 
          <Select placeholder="Tìm theo mức độ khó">
            <Option value="Dễ">Dễ</Option>
            <Option value="Trung bình">Trung bình</Option>
            <Option value="Khó">Khó</Option>
            <Option value="Rất khó">Rất khó</Option>
          </Select>
        </Form.Item>
        <Button htmlType="submit" type="primary">Tìm Kiếm</Button>
      </Form>
      
      <h3>Danh sách Câu Hỏi</h3>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            {question.id} - {question.content} - {question.difficulty} 
            <Button onClick={() => deleteQuestion(question.id)}>Xóa</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionComponent;
