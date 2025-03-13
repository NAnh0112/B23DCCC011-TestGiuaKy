import React, { useEffect, useState } from 'react';
import { Radio, Space, Alert, Empty } from 'antd';
import { generateAvailableTimeSlots } from '@/utils/datlich-utils';

interface TimeSlotPickerProps {
  staff?: DatLich.Staff;
  date?: string;
  appointments: DatLich.Appointment[];
  serviceDuration: number;
  value?: string;
  onChange?: (timeSlot: { startTime: string; endTime: string }) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  staff, 
  date, 
  appointments, 
  serviceDuration,
  value,
  onChange
}) => {
  const [availableSlots, setAvailableSlots] = useState<{ startTime: string; endTime: string }[]>([]);
  
  useEffect(() => {
    if (!staff || !date) {
      setAvailableSlots([]);
      return;
    }
    
    const slots = generateAvailableTimeSlots(staff, date, appointments, serviceDuration);
    setAvailableSlots(slots);
  }, [staff, date, appointments, serviceDuration]);
  
  if (!staff || !date) {
    return <Alert message="Vui lòng chọn nhân viên và ngày" type="info" />;
  }
  
  if (availableSlots.length === 0) {
    return <Empty description="Không có khung giờ trống" />;
  }
  
  return (
    <Radio.Group 
      value={value}
      onChange={e => {
        const selectedSlot = availableSlots.find(slot => `${slot.startTime}-${slot.endTime}` === e.target.value);
        if (selectedSlot && onChange) {
          onChange(selectedSlot);
        }
      }}
    >
      <Space direction="vertical">
        {availableSlots.map(slot => (
          <Radio 
            key={`${slot.startTime}-${slot.endTime}`} 
            value={`${slot.startTime}-${slot.endTime}`}
          >
            {slot.startTime} - {slot.endTime}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );
};

export default TimeSlotPicker;
