import { useCallback } from 'react';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import useInitModel from '@/hooks/useInitModel';
import { GraduationDecision, DiplomaBook } from '@/services/DiplomaManagement/typing';
import { DIPLOMA_STORAGE_KEYS } from '@/services/DiplomaManagement/constant';

export default function useGraduationDecision() {
	const {
		data: graduationDecisions,
		setData: setGraduationDecisions,
		loading,
	} = useInitModel<GraduationDecision[]>({
		storageKey: DIPLOMA_STORAGE_KEYS.GRADUATION_DECISIONS,
		defaultValue: [],
	});

	const { data: diplomaBooks } = useInitModel<DiplomaBook[]>({
		storageKey: DIPLOMA_STORAGE_KEYS.DIPLOMA_BOOKS,
		defaultValue: [],
	});

	// Tạo quyết định tốt nghiệp mới
	const createGraduationDecision = useCallback(
		(data: Omit<GraduationDecision, 'id' | 'createdAt' | 'updatedAt' | 'diplomaBookName'>) => {
			const now = new Date();

			// Find diploma book name
			const diplomaBook = diplomaBooks.find((book) => book.id === data.diplomaBookId);
			const diplomaBookName = diplomaBook?.name || '';

			const newDecision: GraduationDecision = {
				...data,
				id: uuidv4(),
				diplomaBookName,
				createdAt: now,
				updatedAt: now,
			};

			setGraduationDecisions((prev) => [...prev, newDecision]);
			message.success('Tạo quyết định tốt nghiệp mới thành công');
			return newDecision;
		},
		[diplomaBooks, setGraduationDecisions],
	);

	// Cập nhật quyết định tốt nghiệp
	const updateGraduationDecision = useCallback(
		(id: string, data: Partial<Omit<GraduationDecision, 'id' | 'createdAt' | 'updatedAt'>>) => {
			// Find diploma book name if diplomaBookId is updated
			let diplomaBookName = undefined;
			if (data.diplomaBookId) {
				const diplomaBook = diplomaBooks.find((book) => book.id === data.diplomaBookId);
				diplomaBookName = diplomaBook?.name || '';
			}

			setGraduationDecisions((prev) =>
				prev.map((decision) =>
					decision.id === id
						? {
								...decision,
								...data,
								...(diplomaBookName !== undefined ? { diplomaBookName } : {}),
								updatedAt: new Date(),
						  }
						: decision,
				),
			);
			message.success('Cập nhật quyết định tốt nghiệp thành công');
		},
		[diplomaBooks, setGraduationDecisions],
	);

	// Xóa quyết định tốt nghiệp
	const deleteGraduationDecision = useCallback(
		(id: string) => {
			setGraduationDecisions((prev) => prev.filter((decision) => decision.id !== id));
			message.success('Xóa quyết định tốt nghiệp thành công');
		},
		[setGraduationDecisions],
	);

	// Lấy quyết định tốt nghiệp theo ID
	const getGraduationDecisionById = useCallback(
		(id: string) => {
			return graduationDecisions.find((decision) => decision.id === id) || null;
		},
		[graduationDecisions],
	);

	// Lấy tất cả quyết định tốt nghiệp của một sổ văn bằng
	const getDecisionsByDiplomaBookId = useCallback(
		(diplomaBookId: string) => {
			return graduationDecisions.filter((decision) => decision.diplomaBookId === diplomaBookId);
		},
		[graduationDecisions],
	);

	return {
		graduationDecisions,
		diplomaBooks,
		loading,
		createGraduationDecision,
		updateGraduationDecision,
		deleteGraduationDecision,
		getGraduationDecisionById,
		getDecisionsByDiplomaBookId,
	};
}
