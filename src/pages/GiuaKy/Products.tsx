import React from 'react';
import { Table, Button, Input, Form, InputNumber, message } from 'antd';
import { useInitModel } from '../../hooks/useInitModel_1';
import { Product } from '../../models/GiuaKy/product';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useInitModel<Product[]>('products', []);

  const handleAddProduct = (values: Product) => {
    if (products.some(p => p.id === values.id)) {
      message.error('Mã sản phẩm đã tồn tại');
      return;
    }
    setProducts([...products, values]);
    message.success('Thêm sản phẩm thành công');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  return (
    <div>
      <Form onFinish={handleAddProduct} layout="inline">
        <Form.Item name="id" rules={[{ required: true, message: 'Nhập mã sản phẩm' }]}>
          <Input placeholder="Mã sản phẩm" />
        </Form.Item>
        <Form.Item name="name" rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}>
          <Input placeholder="Tên sản phẩm" />
        </Form.Item>
        <Form.Item name="price" rules={[{ required: true, message: 'Nhập giá sản phẩm' }]}>
          <InputNumber placeholder="Giá" min={0} />
        </Form.Item>
        <Button type="primary" htmlType="submit">Thêm</Button>
      </Form>

      <Table dataSource={products} rowKey="id" columns={[
        { title: 'Mã SP', dataIndex: 'id' },
        { title: 'Tên SP', dataIndex: 'name' },
        { title: 'Giá', dataIndex: 'price' },
        { title: 'Hành động', render: (_, record) => (
          <Button onClick={() => handleDeleteProduct(record.id)}>Xóa</Button>
        )}
      ]} />
    </div>
  );
};

export default ProductManagement;
