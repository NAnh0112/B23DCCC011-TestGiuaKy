import React from 'react';
import { Form, Switch, TimePicker, Card, Row, Col } from 'antd';
import moment from 'moment';

interface WeekSchedulerProps {
  value?: DatLich.Staff['workSchedule'];
  onChange?: (value: DatLich.Staff['workSchedule']) => void;
  disabled?: boolean;
}

const dayNames = [
  'Chủ nhật',
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
];

const WeekScheduler: React.FC<WeekSchedulerProps> = ({ value = {}, onChange, disabled = false }) => {
  const handleWorkingChange = (day: string, isWorking: boolean) => {
    if (!onChange) return;
    
    const newSchedule = { ...value };
    newSchedule[day] = {
      ...newSchedule[day],
      isWorking
    };
    
    onChange(newSchedule);
  };
  
  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', timeStr: string) => {
    if (!onChange) return;
    
    const newSchedule = { ...value };
    newSchedule[day] = {
      ...newSchedule[day],
      [field]: timeStr
    };
    
    onChange(newSchedule);
  };
  
  return (
    <Card title="Lịch làm việc">
      {[0, 1, 2, 3, 4, 5, 6].map(day => {
        const daySchedule = value[day.toString()] || { 
          isWorking: false, 
          startTime: '08:00', 
          endTime: '17:00' 
        };
        
        return (
          <Row key={day} gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Form.Item label={dayNames[day]} style={{ marginBottom: 0 }}>
                <Switch 
                  checked={daySchedule.isWorking} 
                  onChange={checked => handleWorkingChange(day.toString(), checked)}
                  disabled={disabled}
                />
              </Form.Item>
            </Col>
            <Col span={9}>
              <TimePicker 
                format="HH:mm"
                value={moment(daySchedule.startTime, 'HH:mm')}
                onChange={(_, timeStr) => handleTimeChange(day.toString(), 'startTime', timeStr)}
                disabled={disabled || !daySchedule.isWorking}
                minuteStep={15}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={9}>
              <TimePicker 
                format="HH:mm"
                value={moment(daySchedule.endTime, 'HH:mm')}
                onChange={(_, timeStr) => handleTimeChange(day.toString(), 'endTime', timeStr)}
                disabled={disabled || !daySchedule.isWorking}
                minuteStep={15}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        );
      })}
    </Card>
  );
};

export default WeekScheduler;
