import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, message, Typography, Input, Form, Space, Tooltip, Tag, Row, Col } from 'antd';
import {
	PlusOutlined,
	SearchOutlined,
	FileTextOutlined,
	BookOutlined,
	ProfileOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons';
import type {
	DiplomaRecord,
	DiplomaBook,
	GraduationDecision,
	DiplomaFieldConfig,
} from '@/services/DiplomaManagement/typing';
import DiplomaRecordForm from './Form';
import useDiplomaRecord from '@/models/diploma/diplomaRecordModel';
import useDiplomaFieldConfig from '@/models/diploma/diplomaFieldConfigModel';
import type { ColumnsType } from 'antd/es/table';
import { DiplomaSearchParams } from '@/services/DiplomaManagement/typing';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;

const DiplomaRecordPage: React.FC = () => {
	const {
		diplomaRecords,
		diplomaBooks,
		graduationDecisions,
		loading,
		setLoading,
		createDiplomaRecord,
		updateDiplomaRecord,
		deleteDiplomaRecord,
		searchDiplomaRecords,
	} = useDiplomaRecord();

	const { diplomaFields } = useDiplomaFieldConfig();

	const [modalVisible, setModalVisible] = useState(false);
	const [editingRecord, setEditingRecord] = useState<DiplomaRecord | null>(null);

	const [dataSource, setDataSource] = useState<DiplomaRecord[]>([]);
	const [searchParams, setSearchParams] = useState<DiplomaSearchParams>({});
	const [searchForm] = Form.useForm();
	const [searchVisible, setSearchVisible] = useState(false);
	const [filteredRecords, setFilteredRecords] = useState<DiplomaRecord[]>([]);
	const [searching, setSearching] = useState(false);

	// Khởi tạo dataSource ban đầu
	useEffect(() => {
		setDataSource(diplomaRecords);
		setFilteredRecords(diplomaRecords);
	}, [diplomaRecords]);

	// Mở modal thêm mới
	const handleAdd = () => {
		setEditingRecord(null);
		setModalVisible(true);
	};

	// Mở modal sửa
	const handleEdit = (record: DiplomaRecord) => {
		setEditingRecord(record);
		setModalVisible(true);
	};

	// Xử lý lưu
	const handleSave = async (values: Omit<DiplomaRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
		try {
			if (editingRecord) {
				// Cập nhật
				await updateDiplomaRecord(editingRecord.id, values);
				message.success('Cập nhật văn bằng thành công');
			} else {
				// Thêm mới
				await createDiplomaRecord(values);
				message.success('Thêm văn bằng thành công');
			}
			setModalVisible(false);
			setEditingRecord(null);
		} catch (error) {
			console.error('Error saving diploma record:', error);
			message.error('Có lỗi xảy ra khi lưu thông tin văn bằng');
		}
	};

	// Xử lý xóa
	const handleDelete = (record: DiplomaRecord) => {
		Modal.confirm({
			title: 'Xác nhận xóa',
			icon: <ExclamationCircleOutlined />,
			content: 'Bạn có chắc chắn muốn xóa văn bằng này không?',
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk: async () => {
				try {
					await deleteDiplomaRecord(record.id);
					message.success('Xóa văn bằng thành công');
				} catch (error) {
					console.error('Error deleting diploma record:', error);
					message.error('Có lỗi xảy ra khi xóa văn bằng');
				}
			},
		});
	};

	const handleSearch = (values: any) => {
		setSearching(true);
		try {
			let filtered = [...diplomaRecords];

			// Tìm theo tên hoặc mã sinh viên từ thanh Search
			if (values.studentName) {
				const searchTerm = values.studentName.toLowerCase();
				filtered = filtered.filter(
					(record) =>
						record.studentName.toLowerCase().includes(searchTerm) ||
						record.studentId.toLowerCase().includes(searchTerm),
				);
			}

			// Tìm theo số hiệu văn bằng
			if (values.diplomaNumber) {
				filtered = filtered.filter((record) =>
					record.diplomaNumber.toLowerCase().includes(values.diplomaNumber.toLowerCase()),
				);
			}

			// Tìm theo số vào sổ
			if (values.entryNumber) {
				filtered = filtered.filter((record) => record.entryNumber.toString().includes(values.entryNumber.toString()));
			}

			// Tìm theo mã sinh viên (từ form tìm kiếm nâng cao)
			if (values.studentId) {
				filtered = filtered.filter((record) => record.studentId.toLowerCase().includes(values.studentId.toLowerCase()));
			}

			setFilteredRecords(filtered);

			// Nếu không tìm thấy kết quả
			if (filtered.length === 0) {
				message.info('Không tìm thấy kết quả phù hợp');
			}
		} catch (error) {
			console.error('Search error:', error);
			message.error('Có lỗi xảy ra khi tìm kiếm');
		} finally {
			setSearching(false);
		}
	};

	const handleReset = () => {
		searchForm.resetFields();
		setFilteredRecords(diplomaRecords);
	};

	// Xây dựng cột cho các trường động
	const buildDynamicColumns = (): ColumnsType<DiplomaRecord> => {
		const dynamicColumns: ColumnsType<DiplomaRecord> = diplomaFields
			.sort((a, b) => a.order - b.order)
			.map((field) => ({
				title: field.displayName,
				key: field.name,
				render: (_, record) => {
					const value = record.fieldValues[field.name];
					if (field.dataType === 'date' && value instanceof Date) {
						return value.toLocaleDateString('vi-VN');
					}
					return value !== undefined ? String(value) : '-';
				},
			}));

		return dynamicColumns;
	};

	// Các cột cố định
	const fixedColumns: ColumnsType<DiplomaRecord> = [
		{
			title: 'Số vào sổ',
			dataIndex: 'entryNumber',
			key: 'entryNumber',
			sorter: (a, b) => a.entryNumber - b.entryNumber,
		},
		{
			title: 'Số hiệu văn bằng',
			dataIndex: 'diplomaNumber',
			key: 'diplomaNumber',
		},
		{
			title: 'Mã sinh viên',
			dataIndex: 'studentId',
			key: 'studentId',
		},
		{
			title: 'Họ và tên',
			dataIndex: 'studentName',
			key: 'studentName',
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'dateOfBirth',
			key: 'dateOfBirth',
			render: (date: string | Date) => {
				if (!date) return '-';
				return dayjs(date).format('DD/MM/YYYY');
			},
		},
		{
			title: 'Sổ văn bằng',
			key: 'diplomaBook',
			render: (_, record) => {
				const book = diplomaBooks.find((b) => b.id === record.diplomaBookId);
				return book ? (
					<Tooltip title={`Sổ: ${book.name} (${book.year})`}>
						<Tag icon={<BookOutlined />} color='blue'>
							{book.name}
						</Tag>
					</Tooltip>
				) : (
					'-'
				);
			},
		},
		{
			title: 'Quyết định TN',
			key: 'graduationDecision',
			render: (_, record) => {
				const decision = graduationDecisions.find((d) => d.id === record.graduationDecisionId);
				return decision ? (
					<Tooltip title={`QĐ: ${decision.decisionNumber} - ${decision.excerpt}`}>
						<Tag icon={<FileTextOutlined />} color='green'>
							{decision.decisionNumber}
						</Tag>
					</Tooltip>
				) : (
					'-'
				);
			},
		},
		{
			title: 'Ngày cấp',
			dataIndex: 'issueDate',
			key: 'issueDate',
			render: (date: string | Date) => {
				if (!date) return '-';
				return dayjs(date).format('DD/MM/YYYY');
			},
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (date: string | Date) => {
				if (!date) return '-';
				return dayjs(date).format('DD/MM/YYYY');
			},
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: DiplomaRecord) => (
				<Space size='middle'>
					<Button type='link' onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Button type='link' danger onClick={() => handleDelete(record)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	// Kết hợp cột cố định và cột động
	const columns = [...fixedColumns.slice(0, 5), ...buildDynamicColumns(), ...fixedColumns.slice(5)];

	const renderAdvancedSearch = () => (
		<Modal
			title='Tìm kiếm nâng cao'
			open={searchVisible}
			onCancel={() => setSearchVisible(false)}
			footer={[
				<Button key='reset' onClick={handleReset}>
					Đặt lại
				</Button>,
				<Button key='cancel' onClick={() => setSearchVisible(false)}>
					Hủy
				</Button>,
				<Button key='search' type='primary' onClick={() => searchForm.submit()} loading={searching}>
					Tìm kiếm
				</Button>,
			]}
			width={700}
		>
			<Form form={searchForm} layout='vertical' onFinish={handleSearch} initialValues={searchParams}>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
					<Form.Item name='studentName' label='Họ tên sinh viên'>
						<Input placeholder='Nhập họ tên sinh viên' />
					</Form.Item>
					<Form.Item name='studentId' label='Mã sinh viên'>
						<Input placeholder='Nhập mã sinh viên' />
					</Form.Item>
					<Form.Item name='diplomaNumber' label='Số hiệu văn bằng'>
						<Input placeholder='Nhập số hiệu văn bằng' />
					</Form.Item>
					<Form.Item name='entryNumber' label='Số vào sổ'>
						<Input type='number' placeholder='Nhập số vào sổ' />
					</Form.Item>
				</div>
			</Form>
		</Modal>
	);

	return (
		<div className='diploma-record-page'>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
				<Title level={4}>
					<ProfileOutlined /> Quản lý văn bằng
				</Title>
				<Space>
					<Search
						placeholder='Tìm kiếm theo tên hoặc mã SV'
						allowClear
						onSearch={(value) => {
							if (value.trim() === '') {
								// Nếu xóa từ khóa tìm kiếm, hiển thị lại tất cả
								setFilteredRecords(diplomaRecords);
							} else {
								handleSearch({ studentName: value });
							}
						}}
						onChange={(e) => {
							// Nếu xóa hết ký tự trong ô tìm kiếm
							if (e.target.value === '') {
								setFilteredRecords(diplomaRecords);
							}
						}}
						style={{ width: 300 }}
					/>
					<Button type='primary' icon={<SearchOutlined />} onClick={() => setSearchVisible(true)}>
						Tìm kiếm nâng cao
					</Button>
					<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
						Thêm văn bằng
					</Button>
				</Space>
			</div>

			<Table
				columns={columns}
				dataSource={filteredRecords}
				rowKey='id'
				loading={loading || searching}
				pagination={{ defaultPageSize: 10, showSizeChanger: true }}
				scroll={{ x: 'max-content' }}
			/>

			<DiplomaRecordForm
				visible={modalVisible}
				onCancel={() => {
					setModalVisible(false);
					setEditingRecord(null);
				}}
				onSave={handleSave}
				initialValues={editingRecord}
				diplomaBooks={diplomaBooks}
				graduationDecisions={graduationDecisions}
				diplomaFields={diplomaFields}
			/>

			{renderAdvancedSearch()}
		</div>
	);
};

export default DiplomaRecordPage;
