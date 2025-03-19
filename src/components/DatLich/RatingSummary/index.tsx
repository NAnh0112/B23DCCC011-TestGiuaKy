import React from 'react';
import { Card, Rate, Progress, Statistic, Row, Col, Typography } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingCounts?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

const RatingSummary: React.FC<RatingSummaryProps> = ({ 
  averageRating, 
  totalReviews,
  ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
}) => {
  // tính phần trăm đánh giá
  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <Card>
      <Row gutter={24} align="middle">
        <Col span={8}>
          <Statistic 
            title="Đánh giá trung bình"
            value={averageRating}
            precision={1}
            prefix={<StarOutlined />}
            suffix={<span>/ 5</span>}
          />
          <div style={{ marginTop: 8 }}>
            <Rate disabled allowHalf value={averageRating} />
          </div>
          <Text>{totalReviews} đánh giá</Text>
        </Col>
        
        <Col span={16}>
          <Row align="middle" gutter={[8, 8]}>
            <Col span={3}>
              <Text>5 sao</Text>
            </Col>
            <Col span={21}>
              <Progress percent={getPercentage(ratingCounts[5])} showInfo={false} />
            </Col>
            
            <Col span={3}>
              <Text>4 sao</Text>
            </Col>
            <Col span={21}>
              <Progress percent={getPercentage(ratingCounts[4])} showInfo={false} />
            </Col>
            
            <Col span={3}>
              <Text>3 sao</Text>
            </Col>
            <Col span={21}>
              <Progress percent={getPercentage(ratingCounts[3])} showInfo={false} />
            </Col>
            
            <Col span={3}>
              <Text>2 sao</Text>
            </Col>
            <Col span={21}>
              <Progress percent={getPercentage(ratingCounts[2])} showInfo={false} />
            </Col>
            
            <Col span={3}>
              <Text>1 sao</Text>
            </Col>
            <Col span={21}>
              <Progress percent={getPercentage(ratingCounts[1])} showInfo={false} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default RatingSummary;
