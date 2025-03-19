import React, { useState } from 'react';
import { List, Avatar, Rate, Typography, Space, Divider, Comment, Form, Input, Button } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useModel } from 'umi';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ReviewListProps {
  reviews: DatLich.Review[];
  showResponse?: boolean;
  isStaff?: boolean; 
  onAddResponse?: (reviewId: string, responseText: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ 
  reviews, 
  showResponse = false,
  isStaff = false,
  onAddResponse 
}) => {
  const { services } = useModel('datlich.service');
  const { staff } = useModel('datlich.staff');
  
  const [activeResponseId, setActiveResponseId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>('');
  
  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Dịch vụ không xác định';
  };
  
  const getStaffName = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? staffMember.name : 'Nhân viên không xác định';
  };
  
  const handleSubmitResponse = (reviewId: string) => {
    if (responseText.trim() && onAddResponse) {
      onAddResponse(reviewId, responseText);
      setResponseText('');
      setActiveResponseId(null);
    }
  };
  
  return (
    <List
      itemLayout="vertical"
      dataSource={reviews}
      locale={{ emptyText: 'Chưa có đánh giá nào' }}
      renderItem={review => (
        <List.Item key={review.id}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space align="start">
              <Avatar icon={<UserOutlined />} />
              <Space direction="vertical">
                <Text strong>{review.clientName}</Text>
                <Text type="secondary">{moment(review.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
              </Space>
            </Space>
            
            <Space>
              <Rate disabled allowHalf value={review.rating} />
              <Text>{review.rating.toFixed(1)}</Text>
            </Space>
            
            <Paragraph>{review.comment}</Paragraph>
            
            <Space>
              <Text type="secondary">Dịch vụ: {getServiceName(review.serviceId)}</Text>
              <Text type="secondary">Nhân viên: {getStaffName(review.staffId)}</Text>
            </Space>
            
            {showResponse && (
              <>
                {review.staffResponse ? (
                  <Comment
                    author={<Text strong>Phản hồi từ nhân viên</Text>}
                    avatar={<Avatar icon={<MessageOutlined />} />}
                    content={<p>{review.staffResponse.response}</p>}
                    datetime={
                      <Text type="secondary">
                        {moment(review.staffResponse.respondedAt).format('DD/MM/YYYY HH:mm')}
                      </Text>
                    }
                  />
                ) : isStaff && onAddResponse ? (
                  activeResponseId === review.id ? (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Form.Item>
                        <TextArea 
                          rows={3} 
                          value={responseText}
                          onChange={e => setResponseText(e.target.value)}
                          placeholder="Nhập phản hồi của bạn..."
                        />
                      </Form.Item>
                      <Space>
                        <Button 
                          type="primary" 
                          onClick={() => handleSubmitResponse(review.id)}
                        >
                          Gửi phản hồi
                        </Button>
                        <Button onClick={() => {
                          setActiveResponseId(null);
                          setResponseText('');
                        }}>
                          Hủy
                        </Button>
                      </Space>
                    </Space>
                  ) : (
                    <Button 
                      type="link" 
                      icon={<MessageOutlined />}
                      onClick={() => setActiveResponseId(review.id)}
                    >
                      Phản hồi đánh giá này
                    </Button>
                  )
                ) : null}
              </>
            )}
          </Space>
          <Divider />
        </List.Item>
      )}
    />
  );
};

export default ReviewList;
