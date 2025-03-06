import { Table, Button } from 'antd';
import { Todo } from '@/models/todo';

interface TodoTableProps {
  data: Todo.Record[];
  onEdit: (record: Todo.Record) => void;
  onDelete: (record: Todo.Record) => void;
}

const TodoTable: React.FC<TodoTableProps> = ({ data, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 150,
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      align: 'center',
      render: (record: Todo.Record) => (
        <div>
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Button style={{ marginLeft: 10 }} type="primary" onClick={() => onDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return <Table dataSource={data} columns={columns} rowKey="id" />;
};

export default TodoTable;
