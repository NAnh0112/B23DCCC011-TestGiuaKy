import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import TodoTable from './TodoTable';
import TodoForm from './TodoForm';
import { Todo } from '@/models/todo';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo.Record[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [row, setRow] = useState<Todo.Record>();

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    setTodos(storedTodos);
  }, []);

  const handleEdit = (record: Todo.Record) => {
    setVisible(true);
    setRow(record);
    setIsEdit(true);
  };

  const handleDelete = (record: Todo.Record) => {
    const newData = todos.filter((item) => item.id !== record.id);
    localStorage.setItem('todos', JSON.stringify(newData));
    setTodos(newData);
  };

  const handleSave = (values: Todo.Record) => {
    let newData;
    if (isEdit) {
      newData = todos.map((item) => (item.id === row?.id ? values : item));
    } else {
      newData = [{ ...values, id: Date.now() }, ...todos];
    }
    localStorage.setItem('todos', JSON.stringify(newData));
    setTodos(newData);
    setVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
          setIsEdit(false);
        }}
      >
        Add Todo
      </Button>
      <TodoTable data={todos} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal
        destroyOnClose
        footer={false}
        title={isEdit ? 'Edit Todo' : 'Add Todo'}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <TodoForm isEdit={isEdit} row={row} onClose={() => setVisible(false)} onSave={handleSave} />
      </Modal>
    </div>
  );
};

export default TodoList;
