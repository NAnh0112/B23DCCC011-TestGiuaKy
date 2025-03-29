import React, { useState } from 'react';
import { Button, Table, Modal, Tooltip } from 'antd';
import { PlusOutlined, BookOutlined } from '@ant-design/icons';
import type { GraduationDecision } from '@/services/DiplomaManagement/typing';
import GraduationDecisionForm from './Form';
import useGraduationDecision from '@/models/diploma/graduationDecisionModel';
import dayjs from 'dayjs';

const GraduationDecisionPage: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false);
	const {
		graduationDecisions: data,
		diplomaBooks,
		loading,
		createGraduationDecision,
		updateGraduationDecision,
		deleteGraduationDecision,
	} = useGraduationDecision();

	const [modalState, setModalState] = useState<{ open: boolean; decision: GraduationDecision | null }>({
		open: false,
		decision: null,
	});

	const openModal = (decision?: GraduationDecision) => {
		setModalState({ open: true, decision: decision || null });
	};

	const closeModal = () => {
		setModalState({ open: false, decision: null });
	};

	const handleSave = async (values: GraduationDecision) => {
		setIsLoading(true);
		try {
			if (modalState.decision) {
				await updateGraduationDecision(modalState.decision.id, values);
			} else {
				await createGraduationDecision(values);
			}
			closeModal();
		} catch (error) {
			console.error('Error saving graduation decision:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = (id: string) => {
		Modal.confirm({
			title: 'Xác nhận xóa?',
			content: 'Bạn có chắc muốn xóa quyết định tốt nghiệp này không?',
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk: async () => {
				deleteGraduationDecision(id);
			},
		});
	};

	const columns = [
		{
			title: 'Số quyết định',
			dataIndex: 'decisionNumber',
			key: 'decisionNumber',
			sorter: (a: GraduationDecision, b: GraduationDecision) => a.decisionNumber.localeCompare(b.decisionNumber),
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'issueDate',
			key: 'issueDate',
			render: (date: string | Date) => {
				if (!date) return '-';
				return dayjs(date).format('DD/MM/YYYY');
			},
			sorter: (a: GraduationDecision, b: GraduationDecision) => {
				return dayjs(a.issueDate).unix() - dayjs(b.issueDate).unix();
			},
		},
		{
			title: 'Trích yếu',
			dataIndex: 'excerpt',
			key: 'excerpt',
			ellipsis: {
				showTitle: false,
			},
			render: (text: string) => (
				<Tooltip placement='topLeft' title={text}>
					{text}
				</Tooltip>
			),
		},
		{
			title: 'Sổ văn bằng',
			dataIndex: 'diplomaBookName',
			key: 'diplomaBookName',
			render: (text: string) => (
				<span>
					<BookOutlined style={{ marginRight: 5 }} /> {text}
				</span>
			),
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
			key: 'actions',
			render: (_: any, record: GraduationDecision) => (
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
				Thêm quyết định tốt nghiệp
			</Button>
			<Table
				columns={columns}
				dataSource={data}
				rowKey='id'
				loading={loading || isLoading}
				pagination={{
					defaultPageSize: 10,
					showSizeChanger: true,
					pageSizeOptions: ['10', '20', '50'],
				}}
			/>

			{modalState.open && (
				<GraduationDecisionForm
					visible={modalState.open}
					onCancel={closeModal}
					onSave={handleSave}
					initialValues={modalState.decision}
					diplomaBooks={diplomaBooks}
				/>
			)}
		</>
	);
};

export default GraduationDecisionPage;
