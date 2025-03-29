import { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, message } from 'antd';
import type { GraduationDecision, DiplomaBook } from '@/services/DiplomaManagement/typing';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';

interface GraduationDecisionFormProps {
	visible: boolean;
	onCancel: () => void;
	onSave: (decision: GraduationDecision) => void;
	initialValues?: GraduationDecision | null;
	diplomaBooks: DiplomaBook[];
}

export default function GraduationDecisionForm({
	visible,
	onCancel,
	onSave,
	initialValues,
	diplomaBooks,
}: GraduationDecisionFormProps) {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			setLoading(true);

			// Validate decision number
			if (!values.decisionNumber.trim()) {
				throw new Error('Số quyết định không được để trống');
			}

			// Validate excerpt
			if (!values.excerpt.trim()) {
				throw new Error('Trích yếu không được để trống');
			}

			// Validate diploma book
			if (!values.diplomaBookId) {
				throw new Error('Vui lòng chọn sổ văn bằng');
			}

			// Check if diplomaBook exists
			const diplomaBook = diplomaBooks.find((book) => book.id === values.diplomaBookId);
			if (!diplomaBook) {
				throw new Error('Sổ văn bằng không tồn tại');
			}

			const newDecision: GraduationDecision = {
				id: initialValues?.id || `decision-${Date.now()}`,
				...values,
				issueDate: values.issueDate.toDate(),
				createdAt: initialValues?.createdAt || new Date(),
				updatedAt: new Date(),
			};

			await onSave(newDecision);
			form.resetFields();
		} catch (error) {
			if (error instanceof Error) {
				Modal.error({
					title: 'Lỗi',
					content: error.message,
				});
			}
			console.error('Error in graduation decision form:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			visible={visible}
			title={initialValues ? 'Chỉnh sửa Quyết định tốt nghiệp' : 'Thêm Quyết định tốt nghiệp'}
			onCancel={onCancel}
			onOk={handleOk}
			confirmLoading={loading}
			destroyOnClose
			width={600}
		>
			<Form
				form={form}
				initialValues={
					initialValues
						? {
								...initialValues,
								issueDate: dayjs(initialValues.issueDate),
						  }
						: {
								decisionNumber: '',
								issueDate: dayjs(),
								excerpt: '',
								diplomaBookId: diplomaBooks.length > 0 ? diplomaBooks[0].id : undefined,
						  }
				}
				layout='vertical'
			>
				<Form.Item
					name='decisionNumber'
					label='Số quyết định'
					rules={[
						{ required: true, message: 'Vui lòng nhập số quyết định' },
						{
							validator: (_, value) => {
								if (!value?.trim()) {
									return Promise.reject('Số quyết định không được để trống');
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<Input placeholder='Nhập số quyết định' />
				</Form.Item>

				<Form.Item
					name='issueDate'
					label='Ngày ban hành'
					rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
				>
					<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' locale={locale} placeholder='Chọn ngày ban hành' />
				</Form.Item>

				<Form.Item
					name='excerpt'
					label='Trích yếu'
					rules={[
						{ required: true, message: 'Vui lòng nhập trích yếu' },
						{
							validator: (_, value) => {
								if (!value?.trim()) {
									return Promise.reject('Trích yếu không được để trống');
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<Input.TextArea placeholder='Nhập trích yếu quyết định' rows={4} showCount maxLength={500} />
				</Form.Item>

				<Form.Item
					name='diplomaBookId'
					label='Sổ văn bằng'
					rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
				>
					<Select placeholder='Chọn sổ văn bằng'>
						{diplomaBooks.length > 0 ? (
							diplomaBooks.map((book) => (
								<Select.Option key={book.id} value={book.id}>
									{book.name} ({book.year})
								</Select.Option>
							))
						) : (
							<Select.Option disabled value=''>
								Không có sổ văn bằng nào
							</Select.Option>
						)}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
}
