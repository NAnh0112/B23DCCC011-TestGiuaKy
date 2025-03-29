import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import type { DiplomaFieldConfig } from '@/services/DiplomaManagement/typing';

interface DiplomaFieldConfigFormProps {
	visible: boolean;
	onCancel: () => void;
	onSave: (values: Partial<DiplomaFieldConfig>) => void;
	initialValues?: DiplomaFieldConfig | null;
}

const DiplomaFieldConfigForm: React.FC<DiplomaFieldConfigFormProps> = ({
	visible,
	onCancel,
	onSave,
	initialValues,
}) => {
	const [form] = Form.useForm();

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			onSave(values);
			form.resetFields();
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	React.useEffect(() => {
		if (visible && initialValues) {
			form.setFieldsValue(initialValues);
		} else {
			form.resetFields();
		}
	}, [visible, initialValues, form]);

	return (
		<Modal
			title={initialValues ? 'Sửa trường' : 'Thêm trường mới'}
			visible={visible}
			onCancel={onCancel}
			onOk={handleSubmit}
			destroyOnClose
		>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					required: false,
					order: 0,
					dataType: 'text',
				}}
			>
				<Form.Item
					name='displayName'
					label='Tên hiển thị'
					rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					name='name'
					label='Tên trường'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên trường' },
						{
							pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
							message: 'Tên trường phải bắt đầu bằng chữ cái và chỉ chứa chữ cái và số',
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item name='dataType' label='Kiểu dữ liệu' rules={[{ required: true }]}>
					<Select>
						<Select.Option value='text'>Văn bản</Select.Option>
						<Select.Option value='number'>Số</Select.Option>
						<Select.Option value='date'>Ngày tháng</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item name='order' label='Thứ tự' rules={[{ required: true }]}>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item name='required' label='Bắt buộc' valuePropName='checked'>
					<Switch />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default DiplomaFieldConfigForm;
