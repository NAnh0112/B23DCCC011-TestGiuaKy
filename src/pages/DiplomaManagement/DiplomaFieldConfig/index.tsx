import React, { useState } from 'react';
import { Button, Table, Modal, Badge, Tag, Space, message } from 'antd';
import { DragOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { DiplomaFieldConfig } from '@/services/DiplomaManagement/typing';
import DiplomaFieldForm from './Form';
import useDiplomaFieldConfig from '@/models/diploma/diplomaFieldConfigModel';
import { DIPLOMA_DATA_TYPES } from '@/services/DiplomaManagement/constant';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import type { ColumnsType } from 'antd/es/table';

const { confirm } = Modal;

const DEFAULT_FIELDS = [
	'ethnicGroup',
	'placeOfBirth',
	'gpa',
	'enrollmentDate',
	'major',
	'classification',
	'modeOfStudy',
];

const DiplomaFieldConfigPage: React.FC = () => {
	const {
		diplomaFields,
		loading,
		setLoading,
		createDiplomaField,
		updateDiplomaField,
		deleteDiplomaField,
		reorderDiplomaFields,
	} = useDiplomaFieldConfig();

	const [modalState, setModalState] = useState<{ open: boolean; field: DiplomaFieldConfig | null }>({
		open: false,
		field: null,
	});

	const [isDragging, setIsDragging] = useState(false);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const openModal = (field?: DiplomaFieldConfig) => {
		setModalState({ open: true, field: field || null });
	};

	const closeModal = () => {
		setModalState({ open: false, field: null });
	};

	const handleSave = async (values: Partial<DiplomaFieldConfig>) => {
		try {
			if (modalState.field) {
				// Edit existing field
				await updateDiplomaField(modalState.field.id, values);
				message.success('Cập nhật trường thành công');
			} else {
				// Create new field
				await createDiplomaField(values as Omit<DiplomaFieldConfig, 'id'>);
				message.success('Thêm trường thành công');
			}
			closeModal();
		} catch (error) {
			console.error('Error saving diploma field:', error);
			message.error('Có lỗi xảy ra khi lưu trường');
		}
	};

	const handleDelete = (id: string) => {
		confirm({
			title: 'Xác nhận xóa?',
			icon: <ExclamationCircleOutlined />,
			content: 'Bạn có chắc muốn xóa trường thông tin này không? Dữ liệu đã nhập cho trường này có thể sẽ bị mất.',
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk: async () => {
				await deleteDiplomaField(id);
				message.success('Xóa trường thành công');
			},
		});
	};

	const handleDragEnd = (event: any) => {
		const { active, over } = event;

		if (active.id !== over.id) {
			const oldIndex = diplomaFields.findIndex((field) => field.id === active.id);
			const newIndex = diplomaFields.findIndex((field) => field.id === over.id);

			const newOrder = arrayMove(
				diplomaFields.map((field) => field.id),
				oldIndex,
				newIndex,
			);

			reorderDiplomaFields(newOrder);
		}

		setIsDragging(false);
	};

	const getDataTypeLabel = (type: 'string' | 'number' | 'date') => {
		const dataType = DIPLOMA_DATA_TYPES.find((dt) => dt.value === type);
		return dataType?.label || type;
	};

	const getDataTypeColor = (type: 'string' | 'number' | 'date') => {
		switch (type) {
			case 'string':
				return 'blue';
			case 'number':
				return 'green';
			case 'date':
				return 'orange';
			default:
				return 'default';
		}
	};

	const columns: ColumnsType<DiplomaFieldConfig> = [
		{
			key: 'sort',
			width: 50,
			render: () => (
				<DragOutlined
					style={{ cursor: 'move', color: '#999' }}
					onMouseOver={() => setIsDragging(true)}
					onMouseOut={() => setIsDragging(false)}
				/>
			),
		},
		{
			title: 'Tên trường',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Tên hiển thị',
			dataIndex: 'displayName',
			key: 'displayName',
		},
		{
			title: 'Kiểu dữ liệu',
			dataIndex: 'dataType',
			key: 'dataType',
			render: (type: 'string' | 'number' | 'date') => (
				<Tag color={getDataTypeColor(type)}>{getDataTypeLabel(type)}</Tag>
			),
		},
		{
			title: 'Bắt buộc',
			dataIndex: 'required',
			key: 'required',
			render: (required: boolean) => (
				<Badge status={required ? 'success' : 'default'} text={required ? 'Có' : 'Không'} />
			),
		},
		{
			title: 'Thứ tự',
			dataIndex: 'order',
			key: 'order',
			sorter: (a, b) => a.order - b.order,
			defaultSortOrder: 'ascend',
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button type='link' onClick={() => openModal(record)}>
						Sửa
					</Button>
					<Button
						type='link'
						danger
						onClick={() => handleDelete(record.id)}
						disabled={DEFAULT_FIELDS.includes(record.name)}
					>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	const sortedFields = [...diplomaFields].sort((a, b) => a.order - b.order);

	return (
		<div className='diploma-field-config-page'>
			<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => openModal()}>
					Thêm trường thông tin
				</Button>
				<div>
					<span style={{ marginRight: 8 }}>Kéo thả các hàng để thay đổi thứ tự hiển thị</span>
				</div>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				onDragStart={() => setIsDragging(true)}
			>
				<SortableContext items={sortedFields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
					<Table
						components={{
							body: {
								row: SortableItem,
							},
						}}
						rowKey='id'
						columns={columns}
						dataSource={sortedFields}
						loading={loading}
						pagination={false}
						className={isDragging ? 'dragging' : ''}
					/>
				</SortableContext>
			</DndContext>

			{modalState.open && (
				<DiplomaFieldForm
					visible={modalState.open}
					onCancel={closeModal}
					onSave={handleSave}
					initialValues={modalState.field}
					existingFields={diplomaFields}
				/>
			)}

			<style>{`
				.dragging .ant-table-tbody > tr {
					cursor: move;
				}
			`}</style>
		</div>
	);
};

export default DiplomaFieldConfigPage;
