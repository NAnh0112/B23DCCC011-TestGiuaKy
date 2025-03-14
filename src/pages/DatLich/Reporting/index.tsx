import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useModel } from 'umi'; 

Chart.register(...registerables);

const Reports: React.FC = () => {
  //  Lấy dữ liệu từ models
  const { appointments } = useModel('datlich.appointment');
  const { services } = useModel('datlich.service');

  const [appointmentData, setAppointmentData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const [revenueData, setRevenueData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!Array.isArray(appointments) || !Array.isArray(services)) {
      console.error('Dữ liệu không hợp lệ!');
      return;
    }

    // Thống kê số lượng lịch hẹn theo tháng
    const monthlyCounts = new Array(12).fill(0);
    appointments.forEach((appointment) => {
      if (appointment.date) {
        const month = new Date(appointment.date).getMonth(); // Lấy tháng (0-11)
        monthlyCounts[month]++;
      }
    });

    setAppointmentData({
      labels: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ],
      datasets: [
        {
          label: 'Số lượng lịch hẹn',
          data: monthlyCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
      ],
    });

    // Thống kê doanh thu theo dịch vụ
    const serviceRevenue: Record<string, { name: string; totalRevenue: number }> = {};

    services.forEach((service) => {
      serviceRevenue[service.id] = {
        name: service.name,
        totalRevenue: 0,
      };
    });

    appointments.forEach((appointment) => {
      const matchedService = services.find((s) => s.id === appointment.serviceId);
      if (matchedService) {
        serviceRevenue[matchedService.id].totalRevenue += matchedService.price;
      }
    });

    setRevenueData({
      labels: Object.values(serviceRevenue).map((s) => s.name),
      datasets: [
        {
          label: 'Doanh thu (VNĐ)',
          data: Object.values(serviceRevenue).map((s) => s.totalRevenue),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    });
  }, [appointments, services]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 Thống kê & Báo cáo</h1>

      {/* Biểu đồ số lượng lịch hẹn theo tháng */}
      <div style={{ width: '80%', margin: '20px auto' }}>
        <h3>📅 Số lượng lịch hẹn theo tháng</h3>
        {appointmentData.labels.length > 0 ? (
          <Bar data={appointmentData} />
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </div>

      {/* Biểu đồ doanh thu theo dịch vụ */}
      <div style={{ width: '80%', margin: '20px auto' }}>
        <h3>💰 Doanh thu theo dịch vụ</h3>
        {revenueData.labels.length > 0 ? (
          <Bar data={revenueData} />
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
