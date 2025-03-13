import React from 'react';
import { Badge } from 'antd';

interface StatusBadgeProps {
  status: DatLich.Appointment['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge status="warning" text="Đang chờ" />;
    case 'confirmed':
      return <Badge status="processing" text="Đã xác nhận" />;
    case 'completed':
      return <Badge status="success" text="Đã hoàn thành" />;
    case 'cancelled':
      return <Badge status="error" text="Đã hủy" />;
    default:
      return null;
  }
};

export default StatusBadge;
