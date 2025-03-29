import { useState } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import type { DiplomaBook } from '@/services/DiplomaManagement/typing';

interface DiplomaBookFormProps {
	visible: boolean;
	onCancel: () => void;
	onSave: (book: DiplomaBook) => void;
	initialValues?: DiplomaBook | null;
}

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 2000;
const MAX_YEAR = CURRENT_YEAR + 10;

export default function DiplomaBookForm({ visible, onCancel, onSave, initialValues }: DiplomaBookFormProps) {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			setLoading(true);

			// Validate year
			if (values.year < MIN_YEAR || values.year > MAX_YEAR) {
				throw new Error(`Năm phải nằm trong khoảng ${MIN_YEAR} - ${MAX_YEAR}`);
			}

			// Validate name
			if (!values.name.trim()) {
				throw new Error('Tên sổ không được để trống');
			}

			const newBook: DiplomaBook = {
				id: initialValues?.id || `${values.year}-${Date.now()}`,
				...values,
				currentEntryNumber: initialValues?.currentEntryNumber || 1,
				createdAt: initialValues?.createdAt || new Date(),
				updatedAt: new Date(),
			};

			await onSave(newBook);
			form.resetFields();
		} catch (error) {
			if (error instanceof Error) {
				Modal.error({
					title: 'Lỗi',
					content: error.message,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			visible={visible}
			title={initialValues ? 'Chỉnh sửa Sổ Văn Bằng' : 'Thêm Sổ Văn Bằng'}
			onCancel={onCancel}
			onOk={handleOk}
			confirmLoading={loading}
			destroyOnClose
		>
			<Form
				form={form}
				initialValues={
					initialValues || {
						year: CURRENT_YEAR,
						name: '',
						description: '',
					}
				}
				layout='vertical'
			>
				<Form.Item
					name='year'
					label='Năm'
					rules={[
						{ required: true, message: 'Vui lòng nhập năm' },
						{ type: 'number', message: 'Năm phải là số' },
						{
							validator: (_, value) => {
								if (value < MIN_YEAR || value > MAX_YEAR) {
									return Promise.reject(`Năm phải nằm trong khoảng ${MIN_YEAR} - ${MAX_YEAR}`);
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<InputNumber min={MIN_YEAR} max={MAX_YEAR} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					name='name'
					label='Tên sổ'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên sổ' },
						{
							validator: (_, value) => {
								if (!value?.trim()) {
									return Promise.reject('Tên sổ không được để trống');
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<Input placeholder='Nhập tên sổ văn bằng' />
				</Form.Item>
				<Form.Item name='description' label='Mô tả'>
					<Input.TextArea placeholder='Nhập mô tả sổ văn bằng' rows={4} />
				</Form.Item>
			</Form>
		</Modal>
	);
}
