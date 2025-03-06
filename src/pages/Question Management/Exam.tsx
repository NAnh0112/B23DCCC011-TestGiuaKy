import { Form, Input, Select, Button, InputNumber } from "antd";
import useExams from "@/models/nganhangcauhoi/useExams";

const { Option } = Select;

const ExamComponent: React.FC = () => {
  const { exams, subjects, knowledgeBlocks, selectedExam, createExam, deleteQuestion, selectExam } = useExams();

  return (
    <div>
      <h2>Quản lý Đề Thi</h2>
      <Form onFinish={createExam} layout="vertical">
        <Form.Item name="name" rules={[{ required: true, message: "Nhập tên đề thi!" }]}> 
          <Input placeholder="Tên đề thi" />
        </Form.Item>
        <Form.Item name="subjectId" rules={[{ required: true, message: "Chọn môn học!" }]}> 
          <Select placeholder="Chọn môn học">
            {subjects.map((subject) => (
              <Option key={subject.id} value={subject.id}>{subject.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.List name="structure">
          {(fields, { add, remove }) => (
            <div>
              {fields.map(({ key, name }) => (
                <div key={key}>
                  <Form.Item name={[name, "knowledgeBlockId"]} rules={[{ required: true, message: "Chọn khối kiến thức!" }]}> 
                    <Select placeholder="Chọn khối kiến thức">
                      {knowledgeBlocks.map((block) => (
                        <Option key={block.id} value={block.id}>{block.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name={[name, "difficulty"]} rules={[{ required: true, message: "Chọn mức độ khó!" }]}> 
                    <Select placeholder="Chọn mức độ khó">
                      <Option value="Dễ">Dễ</Option>
                      <Option value="Trung bình">Trung bình</Option>
                      <Option value="Khó">Khó</Option>
                      <Option value="Rất khó">Rất khó</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name={[name, "quantity"]} rules={[{ required: true, message: "Nhập số lượng câu hỏi!" }]}> 
                    <InputNumber min={1} placeholder="Số lượng câu hỏi" />
                  </Form.Item>
                  <Button onClick={() => remove(name)}>Xóa</Button>
                </div>
              ))}
              <Button onClick={() => add()}>Thêm Cấu Trúc</Button>
            </div>
          )}
        </Form.List>
        <Button htmlType="submit" type="primary">Tạo Đề Thi</Button>
      </Form>
      <h3>Danh sách Đề Thi</h3>
      <ul>
        {exams.map((exam) => (
          <li key={exam.id}>
            <span onClick={() => selectExam(exam.id)}>{exam.name}</span>
          </li>
        ))}
      </ul>
      {selectedExam && (
        <div>
          <h3>Chi Tiết Đề Thi: {selectedExam.name}</h3>
          <ul>
            {selectedExam.questions.map((question) => (
              <li key={question.id}>
                {question.content} - {question.difficulty} 
                <Button onClick={() => deleteQuestion(selectedExam.id, question.id)}>Xóa</Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExamComponent;
