import React from 'react';
import { Form, Input, Button, DatePicker, Row, Col, Card, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Title, Paragraph } = Typography;

interface FormProps {
	onSearch: (values: any) => void;
	loading: boolean;
}

const LookupForm: React.FC<FormProps> = ({ onSearch, loading }) => {
	const [form] = Form.useForm();

	const handleReset = () => {
		form.resetFields();
	};

	return (
		<Card
			title={
				<Title level={4}>
					<SearchOutlined /> Tra cứu văn bằng 
				</Title>
			}
			bordered={false}
		>
			<Paragraph>
				Vui lòng nhập ít nhất 2 thông tin để tra cứu văn bằng. Các thông tin càng chính xác sẽ giúp tìm kiếm nhanh hơn.
			</Paragraph>

			<Form form={form} layout='vertical' onFinish={onSearch}>
				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item name='diplomaNumber' label='Số hiệu văn bằng'>
							<Input placeholder='Nhập số hiệu văn bằng' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item name='entryNumber' label='Số vào sổ'>
							<Input type='number' placeholder='Nhập số vào sổ' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item name='studentId' label='Mã sinh viên'>
							<Input placeholder='Nhập mã sinh viên' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item name='studentName' label='Họ và tên'>
							<Input placeholder='Nhập họ và tên người học' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item name='dateOfBirth' label='Ngày sinh'>
							<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' locale={locale} placeholder='Chọn ngày sinh' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} style={{ display: 'flex', alignItems: 'flex-end' }}>
						<Button onClick={handleReset} style={{ marginRight: 8 }}>
							Đặt lại
						</Button>
					</Col>
				</Row>

				<Form.Item>
					<Button type='primary' htmlType='submit' icon={<SearchOutlined />} loading={loading} size='large' block>
						Tra cứu
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default LookupForm;
