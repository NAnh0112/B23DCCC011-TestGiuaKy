import React, { useState } from 'react';
import { Table, Input, Select, Button, message, Modal } from 'antd';
import { useOrders } from '../../services/GiuaKy/orderService';
import { Order, OrderStatus } from '../../models/GiuaKy/order';

const { Search } = Input;
const { Option } = Select;

interface OrderTableProps {
  onEdit: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ onEdit }) => {
  const [orders, setOrders] = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

  const handleDelete = (id: string) => {
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      message.error('Không tìm thấy đơn hàng');
      return;
    }

    // Kiểm tra trạng thái đơn hàng
    if (order.status !== OrderStatus.Pending) {
      message.error('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"');
      return;
    }

    // Hiển thị Modal cảnh báo trước khi hủy đơn hàng
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: `Bạn có chắc chắn muốn hủy đơn hàng mã ${id}? Hành động này không thể hoàn tác.`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        setOrders(orders.filter(o => o.id !== id));
        message.success('Đã hủy đơn hàng');
      }
    });
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
          <Button onClick={() => onEdit(record)}>Sửa</Button>
          <Button onClick={() => handleDelete(record.id)} danger>Hủy</Button>
        </>
      )
    }
  ];

  return (
    <div>
      <Button onClick={() => onEdit({} as Order)}>Thêm mới</Button>
      <Search placeholder="Tìm kiếm" onChange={e => setSearchTerm(e.target.value)} />
      <Select defaultValue="" onChange={setStatusFilter}>
        <Option value="">Tất cả</Option>
        {Object.values(OrderStatus).map(status => (
          <Option key={status} value={status}>{status}</Option>
        ))}
      </Select>
      <Table dataSource={filteredOrders} columns={columns} rowKey="id" />
    </div>
  );
};

export default OrderTable;
