import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, DatePicker, Row, Col } from 'antd';
import { Order, OrderStatus, OrderProduct } from '../../models/GiuaKy/order';
import { useOrders } from '../../services/GiuaKy/orderService';
import { useInitModel } from '../../hooks/useInitModel_1';
import { Customer } from '../../models/GiuaKy/customer';
import { Product } from '../../models/GiuaKy/product';
import moment from 'moment';

const { Option } = Select;

const OrderForm: React.FC<{ order?: Order; onClose: () => void }> = ({ order, onClose }) => {
  const [orders, setOrders] = useOrders();
  const [customers] = useInitModel<Customer[]>('customers', []);
  const [products] = useInitModel<Product[]>('products', []);
  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>(order?.products || []);
  const [total, setTotal] = useState<number>(order?.total || 0);
  const [form] = Form.useForm();

  useEffect(() => {
    const totalAmount = selectedProducts.reduce((sum, product) => sum + product.quantity * product.price, 0);
    setTotal(totalAmount);
  }, [selectedProducts]);

  const handleProductChange = (productIds: string[]) => {
    const updatedProducts = productIds.map(productId => {
      const product = products.find(p => p.id === productId);
      return product ? { productId: product.id, quantity: 1, price: product.price } : null;
    }).filter(Boolean) as OrderProduct[];
    setSelectedProducts(updatedProducts);
  };

  const handleQuantityChange = (value: number, productId: string) => {
    setSelectedProducts(prev => prev.map(p => p.productId === productId ? { ...p, quantity: value } : p));
  };

  const handleSubmit = (values: any) => {
    if (!values.id) {
      message.error('Vui lòng nhập mã đơn hàng');
      return;
    }

    if (orders.some(o => o.id === values.id)) {
      message.error('Mã đơn hàng đã tồn tại');
      return;
    }

    if (!values.customerId) {
      message.error('Vui lòng chọn khách hàng');
      return;
    }

    if (selectedProducts.length === 0) {
      message.error('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }

    const newOrder: Order = {
      id: values.id,
      customerId: values.customerId,
      date: moment(values.date).format('YYYY-MM-DD'),
      total: total,
      status: values.status,
      products: selectedProducts,
    };

    if (!order) {
      setOrders([...orders, newOrder]);
      message.success('Đã thêm đơn hàng thành công');
    } else {
      setOrders(orders.map(o => (o.id === order.id ? { ...order, ...values } : o)));
      message.success('Cập nhật đơn hàng thành công');
    }

    onClose();
  };

  return (
    <Form form={form} onFinish={handleSubmit} initialValues={{ ...order, date: order?.date ? moment(order.date) : moment() }}>
      <Form.Item name="id" label="Mã đơn" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="customerId" label="Khách hàng" rules={[{ required: true }]}>
        <Select placeholder="Chọn khách hàng">
          {customers.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="status" label="Trạng thái đơn hàng" rules={[{ required: true }]}>
        <Select>
          {Object.values(OrderStatus).map(s => <Option key={s} value={s}>{s}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="date" label="Ngày đặt hàng" rules={[{ required: true }]}>
        <DatePicker defaultValue={order ? moment(order.date) : moment()} format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item label="Sản phẩm" rules={[{ required: true }]}>
        <Select mode="multiple" placeholder="Chọn sản phẩm" onChange={handleProductChange} style={{ width: '100%' }}>
          {products.map(product => (
            <Option key={product.id} value={product.id}>{product.name}</Option>
          ))}
        </Select>
        {selectedProducts.map((product, index) => (
          <Row key={index} gutter={16} style={{ marginTop: 10 }}>
            <Col span={16}>
              <span>{products.find(p => p.id === product.productId)?.name}</span>
            </Col>
            <Col span={4}>
              <Input
                type="number"
                min={1}
                value={product.quantity}
                onChange={e => handleQuantityChange(Number(e.target.value), product.productId)}
                style={{ width: 100 }}
              />
            </Col>
            <Col span={4}>
              <span>Tổng tiền: {product.quantity * product.price}</span>
            </Col>
          </Row>
        ))}
      </Form.Item>

      <Form.Item label="Tổng tiền">
        <Input value={total} disabled />
      </Form.Item>

      <Button type="primary" htmlType="submit">{order ? 'Cập nhật' : 'Thêm mới'}</Button>
    </Form>
  );
};

export default OrderForm;