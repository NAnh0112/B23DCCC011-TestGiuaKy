import { Form, Input, Button } from "antd";
import useKnowledge from "@/models/nganhangcauhoi/useKnowledge";

const KnowledgeBlockComponent: React.FC = () => {
  const { knowledgeBlocks, addKnowledgeBlock, deleteKnowledgeBlock, selectBlock, selectedBlock, subjects } = useKnowledge();

  return (
    <div>
      <h2>Khối Kiến Thức</h2>
      <Form onFinish={addKnowledgeBlock}>
        <Form.Item name="name" rules={[{ required: true, message: "Nhập tên khối kiến thức!" }]}> 
          <Input placeholder="Tên khối kiến thức" />
        </Form.Item>
        <Button htmlType="submit" type="primary">Thêm</Button>
      </Form>
      <ul>
        {knowledgeBlocks?.map((block) => (
          <li key={block.id}>
            <span onClick={() => selectBlock(block.id)}>{block.name}</span>
            <Button onClick={() => deleteKnowledgeBlock(block.id)}>Xóa</Button>
          </li>
        ))}
      </ul>
      {selectedBlock && (
        <div>
          <h3>Môn học thuộc khối: {knowledgeBlocks.find(b => b.id === selectedBlock)?.name}</h3>
          <ul>
            {subjects.map(subject => (
              <li key={subject.id}>{subject.name} ({subject.code}) - {subject.credits} tín chỉ</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBlockComponent;
