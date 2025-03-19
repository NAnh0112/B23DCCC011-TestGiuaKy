import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, DatePicker, TimePicker, 
  Select, message, Card, Divider, Alert, Row, Col
} from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { 
  isStaffWorkingOnDate, 
  generateAvailableTimeSlots, 
  isTimeSlotAvailable 
} from '@/utils/datlich-utils';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

const BookAppointment: React.FC = () => {
  const [form] = Form.useForm();
  const { staff } = useModel('datlich.staff');
  const { services } = useModel('datlich.service');
  const { appointments, addAppointment } = useModel('datlich.appointment');
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedService, setSelectedService] = useState<DatLich.Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<DatLich.Staff | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{startTime: string, endTime: string}[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  // lọc nhân viên dựa theo ngày và dịch vụ đã chọn
  const availableStaff = staff.filter(s => {
    if (!selectedDate || !selectedService) return false;
    
    // kiểm tra xem nhân viên có làm việc vào ngày đã chọn không
    const isWorking = isStaffWorkingOnDate(s, selectedDate);
    
    // kiểm tra xem nhân viên có cung cấp dịch vụ đã chọn không
    const providesService = s.serviceIds.includes(selectedService.id);
    
    return isWorking && providesService;
  });

  // update nếu có thay đổi ngày hoặc dịch vụ
  useEffect(() => {
    if (selectedDate && selectedService) {
      // Reset
      setSelectedStaff(null);
      form.setFieldsValue({ staffId: undefined, timeSlot: undefined });
      setAvailableTimeSlots([]);
    }
  }, [selectedDate, selectedService]);

  // Update nếu có thay đổi nhân viên, ngày hoặc dịch vụ
  useEffect(() => {
    if (selectedStaff && selectedDate && selectedService) {
      const slots = generateAvailableTimeSlots(
        selectedStaff, 
        selectedDate, 
        appointments, 
        selectedService.durationMinutes
      );
      setAvailableTimeSlots(slots);
      // Reset
      form.setFieldsValue({ timeSlot: undefined });
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedStaff, selectedDate, selectedService]);

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId) || null;
    setSelectedService(service);
  };

  const handleStaffChange = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId) || null;
    setSelectedStaff(staffMember);
  };

  const handleSubmit = (values: any) => {
    if (!selectedService || !selectedStaff || !selectedDate || !values.timeSlot) {
      message.error('Vui lòng điền đầy đủ thông tin lịch hẹn');
      return;
    }

    
    const [startTime, endTime] = values.timeSlot.split(' - ');
    
    // Tạo lịch hẹn mới
    const newAppointment: Partial<DatLich.Appointment> = {
      id: `appointment-${Date.now()}`,
      clientName: values.name,
      clientPhone: values.phone,
      clientEmail: values.email,
      serviceId: selectedService.id,
      staffId: selectedStaff.id,
      date: selectedDate,
      startTime: startTime,
      endTime: endTime,
      status: 'pending',
      notes: values.notes,
      createdAt: new Date().toISOString()
    };
    
    addAppointment(newAppointment);
    
    message.success('Đặt lịch hẹn thành công! Vui lòng chờ xác nhận.');
    form.resetFields();
    setSelectedDate('');
    setSelectedService(null);
    setSelectedStaff(null);
    setAvailableTimeSlots([]);
  };

  return (
    <div className={styles.container}>
      <Card title="Đặt Lịch Hẹn" bordered={false}>
        <Form 
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Divider orientation="left">Thông tin khách hàng</Divider>
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ bao gồm số!' }
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email (không bắt buộc)" />
          </Form.Item>
          
          <Divider orientation="left">Chi tiết lịch hẹn</Divider>
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="serviceId"
                label="Dịch vụ"
                rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
              >
                <Select 
                  placeholder="Chọn dịch vụ" 
                  onChange={handleServiceChange}
                >
                  {services.map(service => (
                    <Option key={service.id} value={service.id}>
                      {service.name} - {service.price.toLocaleString('vi-VN')} VNĐ ({service.durationMinutes} phút)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="date"
                label="Ngày hẹn"
                rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                  disabledDate={(current) => current && current < moment().startOf('day')}
                  onChange={(date) => setSelectedDate(date ? date.format('YYYY-MM-DD') : '')}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="staffId"
            label="Nhân viên phục vụ"
            rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
          >
            <Select 
              placeholder={
                !selectedDate || !selectedService 
                  ? "Vui lòng chọn dịch vụ và ngày hẹn trước" 
                  : availableStaff.length === 0 
                    ? "Không có nhân viên phù hợp vào ngày này" 
                    : "Chọn nhân viên"
              }
              disabled={!selectedDate || !selectedService || availableStaff.length === 0}
              onChange={handleStaffChange}
            >
              {availableStaff.map(s => (
                <Option key={s.id} value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="timeSlot"
            label="Khung giờ"
            rules={[{ required: true, message: 'Vui lòng chọn khung giờ!' }]}
          >
            <Select 
              placeholder={
                !selectedStaff || !selectedDate || !selectedService
                  ? "Vui lòng chọn nhân viên trước"
                  : availableTimeSlots.length === 0
                    ? "Không có khung giờ trống vào ngày này"
                    : "Chọn khung giờ"
              }
              disabled={!selectedStaff || availableTimeSlots.length === 0}
              onChange={setSelectedTimeSlot}
            >
              {availableTimeSlots.map((slot, index) => (
                <Option key={index} value={`${slot.startTime} - ${slot.endTime}`}>
                  {slot.startTime} - {slot.endTime}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea 
              rows={3}
              placeholder="Nhập ghi chú về nhu cầu đặc biệt (nếu có)"
            />
          </Form.Item>
          
          {availableTimeSlots.length === 0 && selectedStaff && selectedDate && selectedService && (
            <Alert
              message="Không có khung giờ trống"
              description="Nhân viên đã kín lịch vào ngày này hoặc đã đạt giới hạn khách trong ngày. Vui lòng chọn ngày khác hoặc nhân viên khác."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
            >
              Đặt lịch
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};


export default BookAppointment;
