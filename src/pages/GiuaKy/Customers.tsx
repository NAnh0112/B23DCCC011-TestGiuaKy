import React from 'react';
import { Table, Button, Input, Form, message } from 'antd';
import { useInitModel } from '../../hooks/useInitModel_1';
import { Customer } from '../../models/GiuaKy/customer';

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useInitModel<Customer[]>('customers', []);

  const handleAddCustomer = (values: Customer) => {
    if (customers.some(c => c.id === values.id)) {
      message.error('Mã khách hàng đã tồn tại');
      return;
    }
    setCustomers([...customers, values]);
    message.success('Thêm khách hàng thành công');
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    message.success('Xóa khách hàng thành công');
  };

  return (
    <div>
      <Form onFinish={handleAddCustomer} layout="inline">
        <Form.Item name="id" rules={[{ required: true, message: 'Nhập mã khách hàng' }]}>
          <Input placeholder="Mã khách hàng" />
        </Form.Item>
        <Form.Item name="name" rules={[{ required: true, message: 'Nhập tên khách hàng' }]}>
          <Input placeholder="Tên khách hàng" />
        </Form.Item>
        <Button type="primary" htmlType="submit">Thêm</Button>
      </Form>
      
      <Table dataSource={customers} rowKey="id" columns={[
        { title: 'Mã KH', dataIndex: 'id' },
        { title: 'Tên KH', dataIndex: 'name' },
        { title: 'Hành động', render: (_, record) => (
          <Button onClick={() => handleDeleteCustomer(record.id)}>Xóa</Button>
        )}
      ]} />
    </div>
  );
};

export default CustomerManagement;
