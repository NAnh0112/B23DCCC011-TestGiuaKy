import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Table, Space, Modal, Form, Input, InputNumber, Select, message, Rate, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import WeekScheduler from '@/components/DatLich/WeekScheduler';

const { Option } = Select;

const StaffManagement: React.FC = () => {
  const [form] = Form.useForm();
  const { staff, addStaff, updateStaff, deleteStaff } = useModel('datlich.staff');
  const { services } = useModel('datlich.service');
  const { getStaffAverageRating, getStaffReviews } = useModel('datlich.review');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState<DatLich.Staff | null>(null);
  
  const showModal = (record?: DatLich.Staff) => {
    setEditingStaff(record || null);
    if (record) {
      form.setFieldsValue({
        name: record.name,
        maxClientsPerDay: record.maxClientsPerDay,
        serviceIds: record.serviceIds,
        workSchedule: record.workSchedule,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };
  
  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingStaff) {
        updateStaff(editingStaff.id, values);
        message.success('Cập nhật nhân viên thành công');
      } else {
        addStaff(values);
        message.success('Thêm nhân viên thành công');
      }
      setIsModalVisible(false);
    });
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  const confirmDelete = (id: string) => {
    deleteStaff(id);
    message.success('Xóa nhân viên thành công');
  };

  const columns = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      render: (_, record: DatLich.Staff) => {
        const rating = getStaffAverageRating(record.id);
        const reviewCount = getStaffReviews(record.id).length;
        
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
      title: 'Số khách tối đa/ngày',
      dataIndex: 'maxClientsPerDay',
      key: 'maxClientsPerDay',
    },
    {
      title: 'Dịch vụ đảm nhận',
      dataIndex: 'serviceIds',
      key: 'serviceIds',
      render: (serviceIds: string[]) => (
        <>
          {serviceIds?.map(serviceId => {
            const service = services.find(s => s.id === serviceId);
            return service ? (
              <div key={serviceId}>{service.name}</div>
            ) : null;
          })}
        </>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record: DatLich.Staff) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          >
            Sửa
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => confirmDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý nhân viên">
      <Card 
        title="Đánh giá nhân viên" 
        style={{ marginBottom: 16 }} 
        extra={
          <Button 
            icon={<StarOutlined />} 
            onClick={() => history.push('/datlich/staff-reviews')}
          >
            Quản lý đánh giá
          </Button>
        }
      >
        <p>Xem chi tiết đánh giá của khách hàng và phản hồi</p>
      </Card>
      
      <Card>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => showModal()} 
          style={{ marginBottom: 16 }}
        >
          Thêm nhân viên
        </Button>
        <Table 
          dataSource={staff} 
          columns={columns} 
          rowKey="id" 
        />
      </Card>

      <Modal
        title={editingStaff ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            maxClientsPerDay: 10
          }}
        >
          <Form.Item
            name="name"
            label="Tên nhân viên"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="maxClientsPerDay"
            label="Số khách tối đa mỗi ngày"
            rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="serviceIds"
            label="Dịch vụ đảm nhận"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một dịch vụ!' }]}
          >
            <Select mode="multiple" placeholder="Chọn dịch vụ">
              {services.map(service => (
                <Option key={service.id} value={service.id}>{service.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="workSchedule"
            label="Lịch làm việc"
          >
            <WeekScheduler />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default StaffManagement;
