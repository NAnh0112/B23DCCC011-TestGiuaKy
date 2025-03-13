import React, { useState } from 'react';
import { Table, Card, Tag, Button, Space, Modal, Select, DatePicker, message, Popconfirm, Tooltip } from 'antd';
import { useModel, history } from 'umi';
import { CheckOutlined, CloseOutlined, SearchOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusColors = {
  pending: 'orange',
  confirmed: 'blue',
  completed: 'green',
  cancelled: 'red',
};

const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã hủy',
};

const ManageAppointments: React.FC = () => {
  const { appointments, updateAppointmentStatus, deleteAppointment } = useModel('datlich.appointment');
  const { staff } = useModel('datlich.staff');
  const { services } = useModel('datlich.service');
  const { hasBeenReviewed, getStaffAverageRating } = useModel('datlich.review');
  
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  
  // Filter appointments based on selected filters
  const filteredAppointments = appointments.filter(app => {
    // Filter by status
    if (filteredStatus && app.status !== filteredStatus) {
      return false;
    }
    
    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const appDate = moment(app.date);
      return appDate.isBetween(dateRange[0], dateRange[1], null, '[]');
    }
    
    return true;
  });
  
  // Update appointment status
  const handleStatusChange = (status: string) => {
    if (!selectedAppointment) return;
    
    updateAppointmentStatus(selectedAppointment.id, status as any);
    message.success(`Cập nhật trạng thái thành công`);
    setStatusModalVisible(false);
  };
  
  // Delete appointment
  const handleDeleteAppointment = () => {
    if (!selectedAppointment) return;
    
    deleteAppointment(selectedAppointment.id);
    message.success('Xóa lịch hẹn thành công');
    setStatusModalVisible(false);
  };
  
  // Get staff and service name from their IDs
  const getStaffName = (staffId: string) => {
    const foundStaff = staff.find(s => s.id === staffId);
    return foundStaff ? foundStaff.name : 'Unknown';
  };
  
  const getServiceName = (serviceId: string) => {
    const foundService = services.find(s => s.id === serviceId);
    return foundService ? foundService.name : 'Unknown';
  };
  
  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'SĐT',
      dataIndex: 'clientPhone',
      key: 'clientPhone',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceId',
      key: 'service',
      render: (serviceId: string) => getServiceName(serviceId),
    },
    {
      title: 'Nhân viên',
      key: 'staff',
      render: (record: any) => {
        const staffRating = getStaffAverageRating(record.staffId);
        return (
          <Space>
            {getStaffName(record.staffId)}
            {staffRating > 0 && (
              <Tooltip title={`Đánh giá: ${staffRating.toFixed(1)}/5`}>
                <StarOutlined style={{ color: '#faad14' }} />
                <span style={{ marginLeft: 4 }}>{staffRating.toFixed(1)}</span>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giờ',
      key: 'time',
      render: (record: any) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => (
        <Space>
          <Tag color={statusColors[status]}>
            {statusLabels[status]}
          </Tag>
          {status === 'completed' && (
            hasBeenReviewed(record.id) ? 
              <Tooltip title="Khách hàng đã đánh giá">
                <StarOutlined style={{ color: '#52c41a' }} />
              </Tooltip> : null
          )}
        </Space>
      ),
    },
    {
      title: 'Tác vụ',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            type="primary" 
            onClick={() => {
              setSelectedAppointment(record);
              setStatusModalVisible(true);
            }}
          >
            Cập nhật
          </Button>
          {record.status === 'completed' && hasBeenReviewed(record.id) && (
            <Button
              icon={<StarOutlined />}
              onClick={() => history.push(`/datlich/reviews?appointmentId=${record.id}`)}
            >
              Xem đánh giá
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card title="Quản lý lịch hẹn" bordered={false}>
        <div className={styles.filters}>
          <Space size="large">
            <Select 
              placeholder="Lọc theo trạng thái" 
              style={{ width: 180 }} 
              allowClear
              onChange={(value) => setFilteredStatus(value)}
            >
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="completed">Đã hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
            
            <RangePicker 
              onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment])}
            />
            
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
            >
              Lọc
            </Button>
          </Space>
        </div>
        
        <Table 
          dataSource={filteredAppointments} 
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        
        <Modal
          title="Cập nhật trạng thái lịch hẹn"
          visible={statusModalVisible}
          onCancel={() => setStatusModalVisible(false)}
          footer={null}
        >
          {selectedAppointment && (
            <div>
              <p><strong>Khách hàng:</strong> {selectedAppointment.clientName}</p>
              <p><strong>SĐT:</strong> {selectedAppointment.clientPhone}</p>
              <p><strong>Dịch vụ:</strong> {getServiceName(selectedAppointment.serviceId)}</p>
              <p><strong>Ngày giờ:</strong> {moment(selectedAppointment.date).format('DD/MM/YYYY')} {selectedAppointment.startTime} - {selectedAppointment.endTime}</p>
              <p><strong>Trạng thái hiện tại:</strong> {statusLabels[selectedAppointment.status]}</p>
              
              {selectedAppointment.status === 'completed' && hasBeenReviewed(selectedAppointment.id) && (
                <p><strong>Khách hàng đã đánh giá dịch vụ này</strong></p>
              )}
              
              <div className={styles.statusButtons}>
                <Space>
                  <Button 
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => handleStatusChange('confirmed')}
                    disabled={selectedAppointment.status === 'confirmed'}
                  >
                    Xác nhận
                  </Button>
                  <Button 
                    type="default"
                    onClick={() => handleStatusChange('completed')}
                    disabled={selectedAppointment.status === 'completed'}
                  >
                    Hoàn thành
                  </Button>
                  <Button 
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => handleStatusChange('cancelled')}
                    disabled={selectedAppointment.status === 'cancelled'}
                  >
                    Hủy
                  </Button>
                </Space>
                
                <div style={{ marginTop: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa lịch hẹn này?"
                    onConfirm={handleDeleteAppointment}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button 
                      danger
                      icon={<DeleteOutlined />}
                    >
                      Xóa lịch hẹn
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default ManageAppointments;
