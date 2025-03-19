import React, { useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs, Space, Select, Row, Col, Typography, Input, Button, message, Modal } from 'antd';
import { useModel, history } from 'umi';
import ReviewList from '@/components/DatLich/ReviewList';
import RatingSummary from '@/components/DatLich/RatingSummary';

const { TabPane } = Tabs;
const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StaffReviews: React.FC = () => {
  const { staff } = useModel('datlich.staff');
  const { services } = useModel('datlich.service');
  const { 
    reviews, 
    getStaffReviews, 
    getStaffAverageRating, 
    getServiceReviews, 
    getServiceAverageRating,
    addStaffResponse 
  } = useModel('datlich.review');
  
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState<string>('');
  const [responseText, setResponseText] = useState('');
  

  const staffReviews = useMemo(() => 
    selectedStaffId ? getStaffReviews(selectedStaffId) : [], 
    [selectedStaffId, getStaffReviews]
  );
  
  const serviceReviews = useMemo(() => 
    selectedServiceId ? getServiceReviews(selectedServiceId) : [], 
    [selectedServiceId, getServiceReviews]
  );
  
  const staffAverageRating = useMemo(() => 
    selectedStaffId ? getStaffAverageRating(selectedStaffId) : 0,
    [selectedStaffId, getStaffAverageRating]
  );
  
  const serviceAverageRating = useMemo(() => 
    selectedServiceId ? getServiceAverageRating(selectedServiceId) : 0,
    [selectedServiceId, getServiceAverageRating]
  );

  const countRatings = (reviewList: DatLich.Review[]) => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewList.forEach(review => {
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        counts[rating as keyof typeof counts] += 1;
      }
    });
    return counts;
  };
  
  const staffRatingCounts = useMemo(() => countRatings(staffReviews), [staffReviews]);
  const serviceRatingCounts = useMemo(() => countRatings(serviceReviews), [serviceReviews]);


  const openResponseModal = (reviewId: string) => {
    setCurrentReviewId(reviewId);
    setResponseText('');
    setResponseModalVisible(true);
  };
  
  const submitResponse = () => {
    if (responseText.trim()) {
      addStaffResponse(currentReviewId, responseText);
      message.success('Phản hồi đã được gửi thành công!');
      setResponseModalVisible(false);
      setCurrentReviewId('');
      setResponseText('');
    } else {
      message.error('Vui lòng nhập nội dung phản hồi!');
    }
  };

  return (
    <PageContainer title="Quản lý đánh giá">
      <Tabs defaultActiveKey="staff">
        <TabPane tab="Đánh giá theo nhân viên" key="staff">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card>
              <Text>Chọn nhân viên:</Text>
              <Select 
                style={{ width: 300, marginLeft: 16 }} 
                value={selectedStaffId}
                onChange={setSelectedStaffId}
              >
                {staff.map(s => (
                  <Option key={s.id} value={s.id}>{s.name}</Option>
                ))}
              </Select>
            </Card>
            
            {selectedStaffId && (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <RatingSummary 
                    averageRating={staffAverageRating} 
                    totalReviews={staffReviews.length}
                    ratingCounts={staffRatingCounts}
                  />
                </Col>
                <Col span={24}>
                  <Card title="Đánh giá và phản hồi">
                    <ReviewList 
                      reviews={staffReviews} 
                      showResponse={true} 
                      isStaff={true}
                      onAddResponse={openResponseModal}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </Space>
        </TabPane>
        
        <TabPane tab="Đánh giá theo dịch vụ" key="service">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card>
              <Text>Chọn dịch vụ:</Text>
              <Select 
                style={{ width: 300, marginLeft: 16 }} 
                value={selectedServiceId}
                onChange={setSelectedServiceId}
              >
                {services.map(s => (
                  <Option key={s.id} value={s.id}>{s.name}</Option>
                ))}
              </Select>
            </Card>
            
            {selectedServiceId && (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <RatingSummary 
                    averageRating={serviceAverageRating} 
                    totalReviews={serviceReviews.length}
                    ratingCounts={serviceRatingCounts}
                  />
                </Col>
                <Col span={24}>
                  <Card title="Đánh giá dịch vụ">
                    <ReviewList 
                      reviews={serviceReviews}
                      showResponse={true}
                      isStaff={true}
                      onAddResponse={openResponseModal}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </Space>
        </TabPane>
      </Tabs>
      
      {/* Response Modal */}
      <Modal
        title="Phản hồi đánh giá này"
        visible={responseModalVisible}
        onOk={submitResponse}
        onCancel={() => setResponseModalVisible(false)}
        okText="Đồng ý"
        cancelText="Hủy"
      >
        <TextArea
          rows={4}
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          autoFocus={true}
        />
      </Modal>
    </PageContainer>
  );
};

export default StaffReviews;
