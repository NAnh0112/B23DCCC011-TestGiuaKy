import React from 'react';
import { Form, Input, Button, Rate, Card, Typography } from 'antd';
import { useModel } from 'umi';

const { TextArea } = Input;
const { Title } = Typography;

interface ReviewFormProps {
  appointment: DatLich.Appointment;
  onComplete: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ appointment, onComplete }) => {
  const [form] = Form.useForm();
  const { addReview, hasBeenReviewed } = useModel('datlich.review');
  const { services } = useModel('datlich.service');
  const { staff } = useModel('datlich.staff');
  
  const handleSubmit = (values: any) => {
    const { rating, comment } = values;
    
    // Create review
    addReview({
      appointmentId: appointment.id,
      staffId: appointment.staffId,
      serviceId: appointment.serviceId,
      clientName: appointment.clientName,
      rating,
      comment,
    });
    
    form.resetFields();
    onComplete();
  };
  
  // Check if the appointment has already been reviewed
  if (hasBeenReviewed(appointment.id)) {
    return (
      <Card>
        <Title level={5}>Bạn đã đánh giá dịch vụ này</Title>
        <p>Cảm ơn bạn đã chia sẻ ý kiến!</p>
      </Card>
    );
  }

  // Find service and staff details
  const service = services.find(s => s.id === appointment.serviceId);
  const staffMember = staff.find(s => s.id === appointment.staffId);

  return (
    <Card title="Đánh giá dịch vụ">
      <p>Dịch vụ: {service?.name}</p>
      <p>Nhân viên: {staffMember?.name}</p>
      <p>Ngày: {appointment.date} | Giờ: {appointment.startTime} - {appointment.endTime}</p>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="rating"
          label="Đánh giá"
          rules={[{ required: true, message: 'Vui lòng đánh giá!' }]}
        >
          <Rate allowHalf />
        </Form.Item>

        <Form.Item
          name="comment"
          label="Nhận xét"
          rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
        >
          <TextArea rows={4} placeholder="Nhập nhận xét của bạn về dịch vụ và nhân viên" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi đánh giá
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ReviewForm;
