import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, InputNumber, Divider, Row, Col, Typography, Alert, Card } from 'antd';
import dayjs from 'dayjs';
import type {
	DiplomaRecord,
	DiplomaBook,
	GraduationDecision,
	DiplomaFieldConfig,
} from '@/services/DiplomaManagement/typing';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Title, Text } = Typography;
const { Option } = Select;

interface DiplomaRecordFormProps {
	visible: boolean;
	onCancel: () => void;
	onSave: (record: Omit<DiplomaRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
	initialValues?: DiplomaRecord | null;
	diplomaBooks: DiplomaBook[];
	graduationDecisions: GraduationDecision[];
	diplomaFields: DiplomaFieldConfig[];
}

const DiplomaRecordForm: React.FC<DiplomaRecordFormProps> = ({
	visible,
	onCancel,
	onSave,
	initialValues,
	diplomaBooks,
	graduationDecisions,
	diplomaFields,
}) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [selectedBookId, setSelectedBookId] = useState<string | undefined>(initialValues?.diplomaBookId);
	const [entryNumber, setEntryNumber] = useState<number | null>(null);
	const [filteredDecisions, setFilteredDecisions] = useState<GraduationDecision[]>([]);

	// Khởi tạo giá trị mặc định
	useEffect(() => {
		if (initialValues) {
			try {
				// Chuyển đổi các trường ngày tháng sang dayjs
				const formValues = {
					...initialValues,
					dateOfBirth: initialValues.dateOfBirth ? dayjs(initialValues.dateOfBirth) : null,
					issueDate: initialValues.issueDate ? dayjs(initialValues.issueDate) : null,
				};

				// Xử lý các trường động
				const fieldValues: Record<string, any> = {};
				diplomaFields.forEach((field) => {
					const value = initialValues.fieldValues[field.name];
					if (field.dataType === 'date' && value) {
						fieldValues[field.name] = dayjs(value);
					} else {
						fieldValues[field.name] = value;
					}
				});

				form.setFieldsValue({
					...formValues,
					fieldValues: fieldValues,
				});

				setSelectedBookId(initialValues.diplomaBookId);
			} catch (error) {
				console.error('Error setting form values:', error);
			}
		} else {
			// Reset form khi không có initialValues
			form.resetFields();

			// Nếu có sổ văn bằng, set giá trị mặc định
			if (diplomaBooks.length > 0) {
				const firstBook = diplomaBooks[0];
				setSelectedBookId(firstBook.id);
				setEntryNumber(firstBook.currentEntryNumber);
				form.setFieldsValue({
					diplomaBookId: firstBook.id,
					entryNumber: firstBook.currentEntryNumber,
					issueDate: dayjs(),
				});
			}
		}
	}, [initialValues, diplomaBooks, diplomaFields, form]);

	// Lọc quyết định tốt nghiệp theo sổ văn bằng được chọn
	useEffect(() => {
		if (selectedBookId) {
			const decisions = graduationDecisions.filter((d) => d.diplomaBookId === selectedBookId);
			setFilteredDecisions(decisions);

			// Nếu đang tạo mới và có sổ được chọn, cập nhật số vào sổ
			if (!initialValues) {
				const selectedBook = diplomaBooks.find((book) => book.id === selectedBookId);
				if (selectedBook) {
					setEntryNumber(selectedBook.currentEntryNumber);
					form.setFieldsValue({
						entryNumber: selectedBook.currentEntryNumber,
					});
				}
			}

			// Nếu không có quyết định nào phù hợp, xóa giá trị hiện tại trong form
			if (decisions.length === 0) {
				form.setFieldsValue({
					graduationDecisionId: undefined,
				});
			} else if (!initialValues) {
				// Nếu đang tạo mới, chọn quyết định đầu tiên
				form.setFieldsValue({
					graduationDecisionId: decisions[0]?.id,
				});
			}
		}
	}, [selectedBookId, graduationDecisions, diplomaBooks, form, initialValues]);

	const handleBookChange = (bookId: string) => {
		setSelectedBookId(bookId);
		if (!initialValues) {
			// Chỉ cập nhật số vào sổ khi tạo mới
			const selectedBook = diplomaBooks.find((book) => book.id === bookId);
			if (selectedBook) {
				setEntryNumber(selectedBook.currentEntryNumber);
				form.setFieldsValue({
					entryNumber: selectedBook.currentEntryNumber,
				});
			}
		}
	};

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			setLoading(true);

			// Xử lý các trường động
			const fieldValues: Record<string, any> = {};
			diplomaFields.forEach((field) => {
				const value = values.fieldValues?.[field.name];
				if (field.dataType === 'date' && value) {
					fieldValues[field.name] = dayjs(value).toDate();
				} else {
					fieldValues[field.name] = value;
				}
			});

			// Tạo đối tượng record
			const recordData = {
				entryNumber: values.entryNumber,
				diplomaNumber: values.diplomaNumber,
				studentId: values.studentId,
				studentName: values.studentName,
				dateOfBirth: dayjs(values.dateOfBirth).toDate(),
				diplomaBookId: values.diplomaBookId,
				graduationDecisionId: values.graduationDecisionId,
				issueDate: dayjs(values.issueDate).toDate(),
				fieldValues,
			};

			await onSave(recordData);
			onCancel(); // Đóng modal sau khi lưu thành công
		} catch (error) {
			console.error('Form validation failed:', error);
		} finally {
			setLoading(false);
		}
	};

	// Thêm hàm format ngày tháng
	const formatDate = (date: string | Date | null | undefined) => {
		if (!date) return '-';
		return dayjs(date).format('DD/MM/YYYY');
	};

	// Sửa lại phần render các trường động
	const renderDynamicFields = () => {
		return diplomaFields
			.sort((a, b) => a.order - b.order)
			.map((field) => {
				const isRequired = field.required;

				switch (field.dataType) {
					case 'string':
						return (
							<Row key={field.id} gutter={16}>
								<Col span={12}>
									<Form.Item
										name={['fieldValues', field.name]}
										label={field.displayName}
										rules={[
											{
												required: isRequired,
												message: `Vui lòng nhập ${field.displayName}`,
											},
										]}
									>
										<Input placeholder={`Nhập ${field.displayName}`} />
									</Form.Item>
								</Col>
							</Row>
						);
					case 'number':
						return (
							<Row key={field.id} gutter={16}>
								<Col span={12}>
									<Form.Item
										name={['fieldValues', field.name]}
										label={field.displayName}
										rules={[
											{
												required: isRequired,
												message: `Vui lòng nhập ${field.displayName}`,
											},
										]}
									>
										<InputNumber style={{ width: '100%' }} placeholder={`Nhập ${field.displayName}`} />
									</Form.Item>
								</Col>
							</Row>
						);
					case 'date':
						return (
							<Row key={field.id} gutter={16}>
								<Col span={12}>
									<Form.Item
										name={['fieldValues', field.name]}
										label={field.displayName}
										rules={[
											{
												required: isRequired,
												message: `Vui lòng chọn ${field.displayName}`,
											},
										]}
									>
										<DatePicker
											style={{ width: '100%' }}
											format='DD/MM/YYYY'
											locale={locale}
											placeholder={`Chọn ${field.displayName}`}
										/>
									</Form.Item>
								</Col>
							</Row>
						);
					default:
						return null;
				}
			});
	};

	return (
		<Modal
			title={initialValues ? 'Chỉnh sửa thông tin văn bằng' : 'Thêm thông tin văn bằng'}
			visible={visible}
			onCancel={onCancel}
			onOk={handleOk}
			confirmLoading={loading}
			width={800}
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Alert
					message='Lưu ý: Số vào sổ sẽ tự động tăng theo sổ văn bằng, không thể chỉnh sửa.'
					type='info'
					showIcon
					style={{ marginBottom: 16 }}
				/>

				<Card title='Thông tin cơ bản' bordered={false}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name='diplomaBookId'
								label='Sổ văn bằng'
								rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
							>
								<Select
									placeholder='Chọn sổ văn bằng'
									onChange={handleBookChange}
									disabled={!!initialValues} // Không cho phép thay đổi sổ khi chỉnh sửa
								>
									{diplomaBooks.map((book) => (
										<Option key={book.id} value={book.id}>
											{book.name} ({book.year})
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='entryNumber' label='Số vào sổ'>
								<InputNumber style={{ width: '100%' }} disabled placeholder='Số vào sổ tự động tăng' />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name='graduationDecisionId'
								label='Quyết định tốt nghiệp'
								rules={[{ required: true, message: 'Vui lòng chọn quyết định tốt nghiệp' }]}
							>
								<Select placeholder='Chọn quyết định tốt nghiệp' disabled={filteredDecisions.length === 0}>
									{filteredDecisions.map((decision) => (
										<Option key={decision.id} value={decision.id}>
											{decision.decisionNumber} - {formatDate(decision.issueDate)}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='diplomaNumber'
								label='Số hiệu văn bằng'
								rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng' }]}
							>
								<Input placeholder='Nhập số hiệu văn bằng' />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name='issueDate'
								label='Ngày cấp văn bằng'
								rules={[{ required: true, message: 'Vui lòng chọn ngày cấp' }]}
							>
								<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' locale={locale} placeholder='Chọn ngày cấp' />
							</Form.Item>
						</Col>
					</Row>
				</Card>

				<Divider />

				<Card title='Thông tin người học' bordered={false}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name='studentId'
								label='Mã sinh viên'
								rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
							>
								<Input placeholder='Nhập mã sinh viên' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='studentName'
								label='Họ và tên'
								rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
							>
								<Input placeholder='Nhập họ và tên' />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name='dateOfBirth'
								label='Ngày sinh'
								rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
							>
								<DatePicker
									style={{ width: '100%' }}
									format='DD/MM/YYYY'
									locale={locale}
									placeholder='Chọn ngày sinh'
								/>
							</Form.Item>
						</Col>
					</Row>
				</Card>

				<Divider />

				<Card title='Thông tin bổ sung' bordered={false}>
					{renderDynamicFields()}
				</Card>
			</Form>
		</Modal>
	);
};

export default DiplomaRecordForm;

('');

('');
