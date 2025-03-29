import React, { useEffect, useState } from 'react';
import { Card, Table, DatePicker, Button, Statistic, Row, Col, Typography, Space } from 'antd';
import {
	LineChartOutlined,
	BarChartOutlined,
	FileTextOutlined,
	EyeOutlined,
	FilterOutlined,
	ReloadOutlined,
} from '@ant-design/icons';
import useDiplomaLookup from '@/models/diploma/diplomaLookupModel';
import { LookupStatistic } from '@/models/diploma/diplomaLookupModel';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const LookupStatisticsPage: React.FC = () => {
	const { lookupRecords, loading, getLookupStatistics } = useDiplomaLookup();
	const [statistics, setStatistics] = useState<LookupStatistic[]>([]);
	const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
	const [filteredLookups, setFilteredLookups] = useState(lookupRecords);

	// Định nghĩa các hàm trước khi sử dụng
	// Tính toán thống kê
	const calculateStatistics = (records: typeof lookupRecords) => {
		const stats: Record<string, LookupStatistic> = {};

		// Tính tổng số lượt tra cứu cho mỗi quyết định
		records.forEach((record) => {
			if (!stats[record.graduationDecisionId]) {
				const existingStat = getLookupStatistics().find((s) => s.graduationDecisionId === record.graduationDecisionId);
				if (existingStat) {
					stats[record.graduationDecisionId] = {
						...existingStat,
						count: 0,
					};
				}
			}

			if (stats[record.graduationDecisionId]) {
				stats[record.graduationDecisionId].count += 1;
			}
		});

		// Chuyển đổi từ object sang mảng và sắp xếp theo số lượt giảm dần
		setStatistics(Object.values(stats).sort((a, b) => b.count - a.count));
	};

	// Xử lý lọc theo ngày
	const applyFilters = () => {
		let filtered = [...lookupRecords];

		// Lọc theo khoảng thời gian
		if (dateRange && dateRange[0] && dateRange[1]) {
			const startDate = dateRange[0].startOf('day');
			const endDate = dateRange[1].endOf('day');

			filtered = filtered.filter((record) => {
				const recordDate = dayjs(record.lookupTime);
				return recordDate.isAfter(startDate) && recordDate.isBefore(endDate);
			});
		}

		setFilteredLookups(filtered);

		// Tính toán thống kê từ dữ liệu đã lọc
		calculateStatistics(filtered);
	};

	// Cập nhật thống kê khi lookupRecords thay đổi
	useEffect(() => {
		applyFilters();
	}, [lookupRecords]);

	// Reset bộ lọc
	const resetFilters = () => {
		setDateRange(null);
		setFilteredLookups(lookupRecords);
		calculateStatistics(lookupRecords);
	};

	// Xử lý thay đổi khoảng thời gian
	const handleDateRangeChange = (range: any) => {
		setDateRange(range);
	};

	// Các cột của bảng thống kê
	const columns: ColumnsType<LookupStatistic> = [
		{
			title: 'Quyết định tốt nghiệp',
			dataIndex: 'decisionNumber',
			key: 'decisionNumber',
			render: (text: string) => (
				<span>
					<FileTextOutlined /> {text}
				</span>
			),
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'issueDate',
			key: 'issueDate',
			render: (date: string | Date) => {
				if (!date) return '-';
				return dayjs(date).format('DD/MM/YYYY');
			},
		},
		{
			title: 'Số lượt tra cứu',
			dataIndex: 'count',
			key: 'count',
			sorter: (a, b) => a.count - b.count,
			defaultSortOrder: 'descend',
			render: (count: number) => (
				<Text strong style={{ color: '#1890ff' }}>
					<EyeOutlined /> {count}
				</Text>
			),
		},
	];

	return (
		<div className='lookup-statistics-page'>
			<Title level={4}>
				<BarChartOutlined /> Thống kê lượt tra cứu văn bằng
			</Title>

			<Card>
				<div style={{ marginBottom: 16 }}>
					<Space>
						<RangePicker
							locale={locale}
							format='DD/MM/YYYY'
							value={dateRange}
							onChange={handleDateRangeChange}
							allowClear
							placeholder={['Từ ngày', 'Đến ngày']}
						/>
						<Button type='primary' icon={<FilterOutlined />} onClick={applyFilters}>
							Lọc
						</Button>
						<Button icon={<ReloadOutlined />} onClick={resetFilters}>
							Đặt lại
						</Button>
					</Space>
				</div>

				<Row gutter={16} style={{ marginBottom: 16 }}>
					<Col span={8}>
						<Card>
							<Statistic title='Tổng số lượt tra cứu' value={filteredLookups.length} prefix={<EyeOutlined />} />
						</Card>
					</Col>
					<Col span={8}>
						<Card>
							<Statistic title='Số quyết định được tra cứu' value={statistics.length} prefix={<FileTextOutlined />} />
						</Card>
					</Col>
					<Col span={8}>
						<Card>
							<Statistic
								title='Trung bình lượt tra cứu/quyết định'
								value={statistics.length > 0 ? (filteredLookups.length / statistics.length).toFixed(2) : 0}
								prefix={<LineChartOutlined />}
							/>
						</Card>
					</Col>
				</Row>

				<Table
					columns={columns}
					dataSource={statistics}
					rowKey='graduationDecisionId'
					loading={loading}
					pagination={{ defaultPageSize: 10, showSizeChanger: true }}
				/>
			</Card>
		</div>
	);
};

export default LookupStatisticsPage;
