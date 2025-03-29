import React, { useState, useCallback, useEffect } from 'react';
import { Button, Table, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import type { DiplomaBook } from '@/services/DiplomaManagement/typing';
import DiplomaBookForm from './Form';
import { DIPLOMA_STORAGE_KEYS } from '@/services/DiplomaManagement/constant';

const DiplomaBookPage: React.FC = () => {
	const [data, setData] = useState<DiplomaBook[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalState, setModalState] = useState<{ open: boolean; book: DiplomaBook | null }>({
		open: false,
		book: null,
	});

	// Load data from localStorage
	useEffect(() => {
		const loadData = () => {
			try {
				const storedData = localStorage.getItem(DIPLOMA_STORAGE_KEYS.DIPLOMA_BOOKS);
				if (storedData) {
					const parsedData = JSON.parse(storedData);
					if (Array.isArray(parsedData)) {
						setData(
							parsedData.map((item) => ({
								...item,
								createdAt: new Date(item.createdAt),
								updatedAt: new Date(item.updatedAt),
							})),
						);
					}
				}
			} catch (error) {
				message.error('Không thể tải dữ liệu sổ văn bằng');
			}
		};
		loadData();
	}, []);

	const openModal = (book?: DiplomaBook) => {
		setModalState({ open: true, book: book || null });
	};

	const closeModal = () => {
		setModalState({ open: false, book: null });
	};

	const handleSave = (values: DiplomaBook) => {
		setLoading(true);
		try {
			const now = new Date();
			let updatedBooks;

			if (modalState.book) {
				// Chỉnh sửa sổ văn bằng
				updatedBooks = data.map((b) => (b.id === modalState.book?.id ? { ...b, ...values, updatedAt: now } : b));
				message.success('Cập nhật thành công!');
			} else {
				// Tạo mới sổ văn bằng
				const newBook: DiplomaBook = {
					...values,
					id: uuidv4(),
					createdAt: now,
					updatedAt: now,
					currentEntryNumber: 1,
				};
				updatedBooks = [...data, newBook];
				message.success('Thêm mới thành công!');
			}

			// Validate data before saving
			if (!Array.isArray(updatedBooks)) {
				throw new Error('Invalid data format');
			}

			localStorage.setItem(DIPLOMA_STORAGE_KEYS.DIPLOMA_BOOKS, JSON.stringify(updatedBooks));
			setData(updatedBooks);
			closeModal();
		} catch (error) {
			message.error('Không thể lưu dữ liệu sổ văn bằng');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = useCallback(
		(id: string) => {
			Modal.confirm({
				title: 'Xác nhận xóa?',
				content: 'Bạn có chắc muốn xóa sổ văn bằng này không?',
				okText: 'Xóa',
				okType: 'danger',
				cancelText: 'Hủy',
				onOk: async () => {
					try {
						const updatedBooks = data.filter((item) => item.id !== id);
						localStorage.setItem(DIPLOMA_STORAGE_KEYS.DIPLOMA_BOOKS, JSON.stringify(updatedBooks));
						setData(updatedBooks);
						message.success('Xóa thành công!');
					} catch (error) {
						message.error('Không thể xóa sổ văn bằng');
					}
				},
			});
		},
		[data],
	);

	const columns = [
		{ title: 'Năm', dataIndex: 'year', key: 'year' },
		{ title: 'Tên sổ', dataIndex: 'name', key: 'name' },
		{ title: 'Mô tả', dataIndex: 'description', key: 'description' },
		{ title: 'Số hiện tại', dataIndex: 'currentEntryNumber', key: 'currentEntryNumber' },
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (date: Date) => date.toLocaleDateString(),
		},
		{
			title: 'Ngày cập nhật',
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			render: (date: Date) => date.toLocaleDateString(),
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_: any, record: DiplomaBook) => (
				<>
					<Button type='link' onClick={() => openModal(record)}>
						Sửa
					</Button>
					<Button type='link' danger onClick={() => handleDelete(record.id)}>
						Xóa
					</Button>
				</>
			),
		},
	];

	return (
		<>
			<Button type='primary' icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 16 }}>
				Thêm sổ văn bằng
			</Button>
			<Table columns={columns} dataSource={data} rowKey='id' loading={loading} />

			{modalState.open && (
				<DiplomaBookForm
					visible={modalState.open}
					onCancel={closeModal}
					onSave={handleSave}
					initialValues={modalState.book}
				/>
			)}
		</>
	);
};

export default DiplomaBookPage;
