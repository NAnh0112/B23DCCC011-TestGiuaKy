import React, { useState } from 'react';
import { Table, Input, Select, Button, message } from 'antd';
import { useOrders } from '../../services/GiuaKy/orderService';
import { Order, OrderStatus } from '../../models/GiuaKy/order';

const { Search } = Input;
const { Option } = Select;

interface OrderTableProps {
  onEdit: (order: Order) => void; // ✅ Thêm prop onEdit để nhận từ OrdersPage.tsx
}

const OrderTable: React.FC<OrderTableProps> = ({ onEdit }) => {
  const [orders, setOrders] = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

  const handleDelete = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (order?.status !== OrderStatus.Pending) {
      message.error('Chỉ có thể hủy đơn ở trạng thái "Chờ xác nhận"');
      return;
    }
    setOrders(orders.filter(o => o.id !== id));
    message.success('Đã hủy đơn hàng');
  };

  const filteredOrders = orders.filter(o =>
    (o.id.includes(searchTerm) || o.customerId.includes(searchTerm)) &&
    (statusFilter ? o.status === statusFilter : true)
  );

  const columns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customerId', key: 'customerId' },
    { title: 'Ngày đặt', dataIndex: 'date', key: 'date' },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Hành động',
      render: (_: unknown, record: Order) => (
        <>
          <Button onClick={() => onEdit(record)}>Sửa</Button> {/* ✅ Gọi onEdit thay vì setEditingOrder */}
          <Button onClick={() => handleDelete(record.id)} danger>Hủy</Button>
        </>
      )
    }
  ];

  return (
    <div>
      <Button onClick={() => onEdit({} as Order)}>Thêm mới</Button> {/* ✅ Dùng onEdit từ prop */}
      <Search placeholder="Tìm kiếm" onChange={e => setSearchTerm(e.target.value)} />
      <Select defaultValue="" onChange={setStatusFilter}>
        <Option value="">Tất cả</Option>
        {Object.values(OrderStatus).map(status => <Option key={status} value={status}>{status}</Option>)}
      </Select>
      <Table dataSource={filteredOrders} columns={columns} rowKey="id" />
    </div>
  );
};

export default OrderTable;
