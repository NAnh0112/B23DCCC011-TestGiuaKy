import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { 
  Card, 
  Button, 
  Table, 
  Space, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  message, 
  Typography,
  Popconfirm,
  Rate,
  Tooltip 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ClockCircleOutlined,
  DollarOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useModel, history } from 'umi';

const { TextArea } = Input;
const { Title } = Typography;

const ServiceManagement: React.FC = () => {
  const [form] = Form.useForm();
  const { services, addService, updateService, deleteService } = useModel('datlich.service');
  const { getServiceAverageRating, getServiceReviews } = useModel('datlich.review');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<DatLich.Service | null>(null);
  
  const showModal = (record?: DatLich.Service) => {
    setEditingService(record || null);
    if (record) {
      form.setFieldsValue({
        name: record.name,
        price: record.price,
        durationMinutes: record.durationMinutes,
        description: record.description,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };
  
  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingService) {
        updateService(editingService.id, values);
        message.success('Cập nhật dịch vụ thành công');
      } else {
        addService(values);
        message.success('Thêm dịch vụ thành công');
      }
      setIsModalVisible(false);
    });
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  const handleDelete = (id: string) => {
    deleteService(id);
    message.success('Xóa dịch vụ thành công');
  };

  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      render: (_, record: DatLich.Service) => {
        const rating = getServiceAverageRating(record.id);
        const reviewCount = getServiceReviews(record.id).length;
        
        return rating > 0 ? (
          <Tooltip title={`${reviewCount} đánh giá`}>
            <Space>
              <Rate disabled allowHalf value={rating} style={{ fontSize: 14 }} />
              <span>({rating.toFixed(1)})</span>
            </Space>
          </Tooltip>
        ) : (
          <span>Chưa có đánh giá</span>
        );
      },
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <span>{price.toLocaleString()} VNĐ</span>
      ),
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'durationMinutes',
      key: 'durationMinutes',
      render: (duration: number) => (
        <span>{duration} phút</span>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: DatLich.Service) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa dịch vụ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý dịch vụ">
      <Card 
        title="Đánh giá dịch vụ" 
        style={{ marginBottom: 16 }} 
        extra={
          <Button 
            icon={<StarOutlined />} 
            onClick={() => history.push('/datlich/staff-reviews?tab=service')}
          >
            Xem phân tích đánh giá
          </Button>
        }
      >
        <p>Xem chi tiết đánh giá từ khách hàng về các dịch vụ</p>
      </Card>
      
      <Card>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => showModal()} 
          style={{ marginBottom: 16 }}
        >
          Thêm dịch vụ
        </Button>
        
        <Table 
          dataSource={services} 
          columns={columns} 
          rowKey="id" 
        />
      </Card>

      <Modal
        title={editingService ? 'Sửa thông tin dịch vụ' : 'Thêm dịch vụ mới'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            price: 100000,
            durationMinutes: 30
          }}
        >
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Giá dịch vụ (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              prefix={<DollarOutlined />}
            />
          </Form.Item>
          
          <Form.Item
            name="durationMinutes"
            label="Thời gian thực hiện (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian thực hiện!' }]}
          >
            <InputNumber 
              min={5} 
              step={5} 
              style={{ width: '100%' }} 
              prefix={<ClockCircleOutlined />}
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả dịch vụ (tùy chọn)"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ServiceManagement;
