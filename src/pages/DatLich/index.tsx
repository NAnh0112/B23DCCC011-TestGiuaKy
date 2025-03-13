import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { CalendarOutlined, UserOutlined, ShoppingOutlined, ScheduleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import styles from './index.less';

const DatLichHomePage: React.FC = () => {
  const { staff } = useModel('datlich.staff');
  const { services } = useModel('datlich.service');
  const { appointments } = useModel('datlich.appointment');
  
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
              title="Lịch hẹn hôm nay"
              value={todayAppointments}
              prefix={<ScheduleOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DatLichHomePage;
