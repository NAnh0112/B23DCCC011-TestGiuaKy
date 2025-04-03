import React, { useState } from 'react';
import OrderTable from './OrderTable';
import { Button, Modal } from 'antd';
import OrderForm from './OrderForm';
import { Order } from '../../models/GiuaKy/order';

const OrdersPage: React.FC = () => {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  return (
    <div>
      <h1>Quản lý đơn hàng</h1>
      <Button type="primary" onClick={() => setEditingOrder({} as Order)}>Thêm đơn hàng</Button>
      <OrderTable onEdit={setEditingOrder} />
      <Modal visible={!!editingOrder} onCancel={() => setEditingOrder(null)} footer={null}>
  <OrderForm order={editingOrder!} onClose={() => setEditingOrder(null)} />
</Modal>

    </div>
  );
};

export default OrdersPage;
