import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useInitModel from '@/hooks/useInitModel';
import { GraduationDecision } from '@/services/DiplomaManagement/typing';
import { DIPLOMA_STORAGE_KEYS } from '@/services/DiplomaManagement/constant';

// Interface cho lượt tra cứu
export interface DiplomaLookupRecord {
	id: string;
	graduationDecisionId: string;
	lookupParams: Record<string, string>;
	lookupTime: Date;
	ip?: string;
	userAgent?: string;
}

// Interface cho thống kê
export interface LookupStatistic {
	graduationDecisionId: string;
	decisionNumber: string;
	issueDate: Date;
	count: number;
}

export default function useDiplomaLookup() {
	const {
		data: lookupRecords,
		setData: setLookupRecords,
		loading,
	} = useInitModel<DiplomaLookupRecord[]>({
		storageKey: DIPLOMA_STORAGE_KEYS.DIPLOMA_LOOKUPS,
		defaultValue: [],
	});

	const { data: graduationDecisions } = useInitModel<GraduationDecision[]>({
		storageKey: DIPLOMA_STORAGE_KEYS.GRADUATION_DECISIONS,
		defaultValue: [],
	});

	// Ghi nhận lượt tra cứu mới
	const recordLookup = useCallback(
		(graduationDecisionId: string, params: Record<string, string>) => {
			const lookupRecord: DiplomaLookupRecord = {
				id: uuidv4(),
				graduationDecisionId,
				lookupParams: params,
				lookupTime: new Date(),
				userAgent: navigator.userAgent,
			};

			setLookupRecords((prev) => [...prev, lookupRecord]);
		},
		[setLookupRecords],
	);

	// Lấy thống kê lượt tra cứu theo quyết định tốt nghiệp
	const getLookupStatistics = useCallback((): LookupStatistic[] => {
		const statistics: Record<string, LookupStatistic> = {};

		// Tính tổng số lượt tra cứu cho mỗi quyết định
		lookupRecords.forEach((record) => {
			if (!statistics[record.graduationDecisionId]) {
				const decision = graduationDecisions.find((d) => d.id === record.graduationDecisionId);
				if (decision) {
					statistics[record.graduationDecisionId] = {
						graduationDecisionId: record.graduationDecisionId,
						decisionNumber: decision.decisionNumber,
						issueDate: decision.issueDate,
						count: 0,
					};
				}
			}

			if (statistics[record.graduationDecisionId]) {
				statistics[record.graduationDecisionId].count += 1;
			}
		});

		// Chuyển đổi từ object sang mảng và sắp xếp theo số lượt giảm dần
		return Object.values(statistics).sort((a, b) => b.count - a.count);
	}, [lookupRecords, graduationDecisions]);

	return {
		lookupRecords,
		loading,
		recordLookup,
		getLookupStatistics,
	};
}
