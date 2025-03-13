import React from 'react';
import { Card, Row, Col, Statistic, Button } from 'antd';
import { CalendarOutlined, UserOutlined, ShoppingOutlined, ScheduleOutlined, PlusOutlined, SettingOutlined, StarOutlined, CommentOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import styles from './index.less';

const DatLichHomePage: React.FC = () => {
  const { staff } = useModel('datlich.staff');
  const { services } = useModel('datlich.service');
  const { appointments } = useModel('datlich.appointment');
  const { reviews } = useModel('datlich.review');
  
  const pendingAppointments = appointments.filter(app => app.status === 'pending').length;
  const todayAppointments = appointments.filter(
    app => app.date === new Date().toISOString().split('T')[0]
  ).length;
  
  return (
    <div className={styles.container}>
      <Row gutter={24}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số nhân viên"
              value={staff.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số dịch vụ"
              value={services.length}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Lịch hẹn chờ xác nhận"
              value={pendingAppointments}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đánh giá"
              value={reviews.length}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card title="Đặt lịch hẹn" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => history.push('/datlich/book')}>Đặt lịch</Button>}>
            <p>Đặt lịch hẹn cho khách hàng với các dịch vụ và nhân viên hiện có.</p>
            <p>Hệ thống sẽ tự động kiểm tra và ngăn chặn việc đặt lịch trùng nhau.</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Quản lý lịch hẹn" extra={<Button icon={<SettingOutlined />} onClick={() => history.push('/datlich/manage')}>Quản lý</Button>}>
            <p>Quản lý tất cả các lịch hẹn, cập nhật trạng thái và theo dõi tiến độ.</p>
            <p>Xác nhận, hoàn thành hoặc hủy các lịch hẹn đã đặt.</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Đánh giá dịch vụ" extra={<Button icon={<StarOutlined />} onClick={() => history.push('/datlich/reviews')}>Đánh giá</Button>}>
            <p>Đánh giá dịch vụ và nhân viên sau khi sử dụng.</p>
            <p>Xem lại các đánh giá trước đây và phản hồi từ nhân viên.</p>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Thống kê nhân viên" extra={<Button onClick={() => history.push('/datlich/staff-reviews')}>Chi tiết</Button>}>
            <p>Xem thống kê đánh giá cho từng nhân viên.</p>
            <p>Quản lý phản hồi đối với đánh giá của khách hàng.</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Thống kê dịch vụ" extra={<Button onClick={() => history.push('/datlich/staff-reviews?tab=service')}>Chi tiết</Button>}>
            <p>Xem thống kê đánh giá cho từng dịch vụ.</p>
            <p>Đánh giá chất lượng dịch vụ qua thời gian.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DatLichHomePage;
