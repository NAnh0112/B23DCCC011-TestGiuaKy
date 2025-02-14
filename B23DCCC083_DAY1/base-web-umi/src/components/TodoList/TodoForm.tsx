import { Form, Input, Button, DatePicker } from 'antd';
import { Todo } from '@/models/todo';
import moment from 'moment';

interface TodoFormProps {
  isEdit: boolean;
  row?: Todo.Record;
  onClose: () => void;
  onSave: (values: Todo.Record) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ isEdit, row, onClose, onSave }) => {
  return (
    <Form
      onFinish={(values) => {
        onSave({ ...values, deadline: values.deadline?.format('YYYY-MM-DD') });
      }}
      initialValues={{
        ...row,
        deadline: row?.deadline ? moment(row.deadline) : null,
      }}
    >
      <Form.Item
        label="Task"
        name="task"
        rules={[{ required: true, message: 'Please input your task!' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: 'Please input the status!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Deadline"
        name="deadline"
        rules={[{ required: true, message: 'Please select a deadline!' }]}
      >
        <DatePicker />
      </Form.Item>

      <div className="form-footer">
        <Button htmlType="submit" type="primary">
          {isEdit ? 'Save' : 'Insert'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </Form>
  );
};

export default TodoForm;
