import React from 'react';
import { Card, Descriptions, Divider, Typography, Alert } from 'antd';
import { ProfileOutlined, FileTextOutlined, BookOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
	DiplomaRecord,
	DiplomaBook,
	GraduationDecision,
	DiplomaFieldConfig,
} from '@/services/DiplomaManagement/typing';

const { Title, Text, Paragraph } = Typography;

interface DiplomaDetailsProps {
	diplomaRecord: DiplomaRecord;
	diplomaBook?: DiplomaBook;
	graduationDecision?: GraduationDecision;
	diplomaFields: DiplomaFieldConfig[];
}

const DiplomaDetails: React.FC<DiplomaDetailsProps> = ({
	diplomaRecord,
	diplomaBook,
	graduationDecision,
	diplomaFields,
}) => {
	const sortedFields = [...diplomaFields].sort((a, b) => a.order - b.order);

	// Hàm format ngày tháng an toàn
	const formatDate = (date: any) => {
		if (!date) return '-';
		try {
			const dayjsDate = dayjs(date);
			return dayjsDate.isValid() ? dayjsDate.format('DD/MM/YYYY') : '-';
		} catch {
			return '-';
		}
	};

	return (
		<div className='diploma-details'>
			<Alert
				message='Đã tìm thấy thông tin văn bằng!'
				description='Dưới đây là thông tin chi tiết văn bằng bạn đang tra cứu.'
				type='success'
				showIcon
				style={{ marginBottom: 16 }}
			/>

			<Card
				title={
					<Title level={4}>
						<ProfileOutlined /> Thông tin văn bằng
					</Title>
				}
				bordered={false}
			>
				<Descriptions bordered column={2}>
					<Descriptions.Item label='Số hiệu văn bằng' span={1}>
						{diplomaRecord.diplomaNumber}
					</Descriptions.Item>
					<Descriptions.Item label='Số vào sổ' span={1}>
						{diplomaRecord.entryNumber}
					</Descriptions.Item>
					<Descriptions.Item label='Sổ văn bằng' span={2}>
						{diplomaBook ? (
							<span>
								<BookOutlined /> {diplomaBook.name} ({diplomaBook.year})
							</span>
						) : (
							'Không có thông tin'
						)}
					</Descriptions.Item>
					<Descriptions.Item label='Quyết định tốt nghiệp' span={2}>
						{graduationDecision ? (
							<span>
								<FileTextOutlined /> Số {graduationDecision.decisionNumber}, ngày{' '}
								{formatDate(graduationDecision.issueDate)}
							</span>
						) : (
							'Không có thông tin'
						)}
					</Descriptions.Item>
					<Descriptions.Item label='Ngày cấp' span={2}>
						{formatDate(diplomaRecord.issueDate)}
					</Descriptions.Item>
				</Descriptions>

				<Divider />

				<Title level={5}>Thông tin người học</Title>
				<Descriptions bordered column={2}>
					<Descriptions.Item label='Họ và tên' span={1}>
						{diplomaRecord.studentName}
					</Descriptions.Item>
					<Descriptions.Item label='Mã sinh viên' span={1}>
						{diplomaRecord.studentId}
					</Descriptions.Item>
					<Descriptions.Item label='Ngày sinh' span={2}>
						{formatDate(diplomaRecord.dateOfBirth)}
					</Descriptions.Item>

					{sortedFields.map((field) => {
						const value = diplomaRecord.fieldValues[field.name];
						let displayValue = '-';

						if (value !== undefined) {
							if (field.dataType === 'date') {
								displayValue = formatDate(value);
							} else {
								displayValue = String(value);
							}
						}

						return (
							<Descriptions.Item key={field.id} label={field.displayName} span={1}>
								{displayValue}
							</Descriptions.Item>
						);
					})}
				</Descriptions>

				<Divider />

				<Paragraph>
					<Text type='secondary'>
						Thông tin được truy xuất từ hệ thống quản lý văn bằng. Nếu có thắc mắc, vui lòng liên hệ phòng đào tạo.
					</Text>
				</Paragraph>
			</Card>
		</div>
	);
};

export default DiplomaDetails;
