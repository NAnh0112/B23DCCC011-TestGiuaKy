import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs, Button, List, Tag, Space, Typography, Empty } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import ReviewForm from '@/components/DatLich/ReviewForm';
import ReviewList from '@/components/DatLich/ReviewList';

const { TabPane } = Tabs;
const { Text } = Typography;

const CustomerReviews: React.FC = () => {
  const { appointments } = useModel('datlich.appointment');
  const { hasBeenReviewed, reviews } = useModel('datlich.review');
  const { services } = useModel('datlich.service');
  const { staff } = useModel('datlich.staff');
  
  const [selectedAppointment, setSelectedAppointment] = useState<DatLich.Appointment | null>(null);
  
  // Lọc lịch hẹn đã hoàn thành
  const completedAppointments = appointments.filter(app => app.status === 'completed');
  
  // Nhận xét của khách hàng
  const customerReviews = reviews;
  
  // Hiện tên dịch vụ và nhân viên
  const getServiceName = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.name || 'Dịch vụ không xác định';
  };
  
  const getStaffName = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.name || 'Nhân viên không xác định';
  };
  
  return (
    <PageContainer title="Đánh giá dịch vụ">
      <Tabs defaultActiveKey="review">
        <TabPane tab="Đánh giá dịch vụ" key="review">
          <Card>
            <Text strong>Chọn lịch hẹn đã hoàn thành để đánh giá:</Text>
            
            {completedAppointments.length === 0 ? (
              <Empty description="Không có lịch hẹn nào đã hoàn thành để đánh giá" />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={completedAppointments}
                renderItem={item => (
                  <List.Item
                    actions={[
                      hasBeenReviewed(item.id) ? (
                        <Tag color="green">Đã đánh giá</Tag>
                      ) : (
                        <Button 
                          type="primary" 
                          onClick={() => setSelectedAppointment(item)}
                        >
                          Đánh giá ngay
                        </Button>
                      )
                    ]}
                  >
                    <List.Item.Meta
                      title={getServiceName(item.serviceId)}
                      description={
                        <Space direction="vertical">
                          <Text>Nhân viên: {getStaffName(item.staffId)}</Text>
                          <Text>Ngày: {moment(item.date).format('DD/MM/YYYY')}</Text>
                          <Text>Giờ: {item.startTime} - {item.endTime}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
            
            {selectedAppointment && (
              <div style={{ marginTop: 20 }}>
                <ReviewForm 
                  appointment={selectedAppointment} 
                  onComplete={() => setSelectedAppointment(null)} 
                />
              </div>
            )}
          </Card>
        </TabPane>
        
        <TabPane tab="Đánh giá của bạn" key="yourReviews">
          <ReviewList reviews={customerReviews} showResponse={true} />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default CustomerReviews;
