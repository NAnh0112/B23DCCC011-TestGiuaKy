import React, { useState } from 'react';
import { Spin, Empty, Alert, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { DiplomaRecord } from '@/services/DiplomaManagement/typing';
import useDiplomaRecord from '@/models/diploma/diplomaRecordModel';
import useDiplomaFieldConfig from '@/models/diploma/diplomaFieldConfigModel';
import useDiplomaLookup from '@/models/diploma/diplomaLookupModel';
import LookupForm from './Form';
import DiplomaDetails from './DiplomaDetails';
import dayjs from 'dayjs';

const { Title } = Typography;

interface SearchParams {
	diplomaNumber?: string;
	entryNumber?: string | number;
	studentId?: string;
	studentName?: string;
	dateOfBirth?: any;
}

const DiplomaLookupPage: React.FC = () => {
	const { diplomaRecords, diplomaBooks, graduationDecisions } = useDiplomaRecord();
	const { diplomaFields } = useDiplomaFieldConfig();
	const { recordLookup } = useDiplomaLookup();

	const [searchResult, setSearchResult] = useState<DiplomaRecord | null>(null);
	const [searching, setSearching] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [searched, setSearched] = useState(false);

	// Tìm kiếm văn bằng
	const handleSearch = (values: SearchParams) => {
		setSearching(true);
		setErrorMessage(null);
		setSearched(true);

		try {
			// Chuẩn hóa dữ liệu tìm kiếm
			const searchParams: Record<string, any> = {};

			// Xử lý số vào sổ
			if (values.entryNumber) {
				searchParams.entryNumber = parseInt(String(values.entryNumber), 10);
			}

			// Xử lý số hiệu văn bằng
			if (values.diplomaNumber?.trim()) {
				searchParams.diplomaNumber = values.diplomaNumber.trim();
			}

			// Xử lý mã sinh viên
			if (values.studentId?.trim()) {
				searchParams.studentId = values.studentId.trim();
			}

			// Xử lý họ tên
			if (values.studentName?.trim()) {
				searchParams.studentName = values.studentName.trim();
			}

			// Xử lý ngày sinh
			if (values.dateOfBirth) {
				const dateOfBirth = dayjs(values.dateOfBirth).startOf('day').toDate();
				searchParams.dateOfBirth = dateOfBirth;
			}

			// Đếm số tham số tìm kiếm
			const paramCount = Object.keys(searchParams).length;

			if (paramCount < 2) {
				setErrorMessage('Vui lòng nhập ít nhất 2 thông tin để tra cứu');
				setSearchResult(null);
				setSearching(false);
				return;
			}

			// Tìm kiếm trong danh sách văn bằng
			const results = diplomaRecords.filter((record) => {
				return Object.entries(searchParams).every(([key, value]) => {
					if (key === 'dateOfBirth') {
						const recordDate = dayjs(record[key]).startOf('day');
						const searchDate = dayjs(value).startOf('day');
						return recordDate.isSame(searchDate);
					}
					if (key === 'studentName') {
						return record[key].toLowerCase().includes(value.toLowerCase());
					}
					return record[key] === value;
				});
			});

			if (results.length === 0) {
				setErrorMessage('Không tìm thấy văn bằng với thông tin đã nhập');
				setSearchResult(null);
			} else if (results.length > 1) {
				setErrorMessage(
					'Tìm thấy nhiều văn bằng khớp với thông tin đã nhập. Vui lòng cung cấp thêm thông tin để thu hẹp kết quả.',
				);
				setSearchResult(null);
			} else {
				setSearchResult(results[0]);
				// Ghi nhận lượt tra cứu
				recordLookup(results[0].graduationDecisionId, searchParams);
			}
		} catch (error) {
			console.error('Search error:', error);
			setErrorMessage('Có lỗi xảy ra khi tra cứu. Vui lòng thử lại sau.');
			setSearchResult(null);
		} finally {
			setSearching(false);
		}
	};

	// Hiển thị thông báo lỗi
	const renderError = () => {
		if (!errorMessage) return null;

		return (
			<Alert
				message='Không thể tra cứu'
				description={errorMessage}
				type='error'
				showIcon
				icon={<WarningOutlined />}
				style={{ marginBottom: 16 }}
			/>
		);
	};

	// Hiển thị thông báo khi chưa tìm kiếm
	const renderEmptyResult = () => {
		if (!searched || searching || searchResult || errorMessage) return null;

		return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không tìm thấy thông tin văn bằng phù hợp' />;
	};

	// Hiển thị kết quả tìm kiếm
	const renderResult = () => {
		if (!searchResult) return null;

		const diplomaBook = diplomaBooks.find((book) => book.id === searchResult.diplomaBookId);
		const decision = graduationDecisions.find((d) => d.id === searchResult.graduationDecisionId);

		return (
			<DiplomaDetails
				diplomaRecord={searchResult}
				diplomaBook={diplomaBook}
				graduationDecision={decision}
				diplomaFields={diplomaFields}
			/>
		);
	};

	return (
		<div className='diploma-lookup-page'>
			<div style={{ maxWidth: 1000, margin: '0 auto' }}>
				<Title level={3} style={{ textAlign: 'center', margin: '24px 0' }}>
					Tra cứu thông tin văn bằng
				</Title>

				<LookupForm onSearch={handleSearch} loading={searching} />

				<Spin spinning={searching}>
					{renderError()}
					{renderEmptyResult()}
					{renderResult()}
				</Spin>
			</div>
		</div>
	);
};

export default DiplomaLookupPage;
