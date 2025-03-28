import { useCallback } from 'react';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import useInitModel from '@/hooks/useInitModel';
import {
	DiplomaRecord,
	DiplomaBook,
	GraduationDecision,
	DiplomaFieldConfig,
} from '@/services/DiplomaManagement/typing';
import { DIPLOMA_STORAGE_KEYS } from '@/services/DiplomaManagement/constant';

export default function useDiplomaRecord() {
	const {
		data: diplomaRecords,
		setData: setDiplomaRecords,
		loading,
	} = useInitModel<DiplomaRecord[]>({
		storageKey: DIPLOMA_STORAGE_KEYS.DIPLOMA_RECORDS,
		defaultValue: [],
	});

	const { data: diplomaBooks, setData: setDiplomaBooks } = useInitModel<DiplomaBook[]>({
		storageKey: DIPLOMA_STORAGE_KEYS.DIPLOMA_BOOKS,
		defaultValue: [],
	});

	const { data: graduationDecisions } = useInitModel<GraduationDecision[]>({
		storageKey: DIPLOMA_STORAGE_KEYS.GRADUATION_DECISIONS,
		defaultValue: [],
	});

	const { data: diplomaFields } = useInitModel<DiplomaFieldConfig[]>({
		storageKey: DIPLOMA_STORAGE_KEYS.DIPLOMA_FIELDS,
		defaultValue: [],
	});

	// Tạo hồ sơ văn bằng mới
	const createDiplomaRecord = useCallback(
		(data: Omit<DiplomaRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
			const now = new Date();

			// Kiểm tra sổ văn bằng
			const diplomaBook = diplomaBooks.find((book) => book.id === data.diplomaBookId);
			if (!diplomaBook) {
				message.error('Sổ văn bằng không tồn tại');
				return null;
			}

			// Kiểm tra quyết định tốt nghiệp
			const graduationDecision = graduationDecisions.find((decision) => decision.id === data.graduationDecisionId);
			if (!graduationDecision) {
				message.error('Quyết định tốt nghiệp không tồn tại');
				return null;
			}

			// Cập nhật entryNumber của sổ văn bằng
			const entryNumber = diplomaBook.currentEntryNumber;

			const newRecord: DiplomaRecord = {
				...data,
				id: uuidv4(),
				entryNumber,
				createdAt: now,
				updatedAt: now,
			};

			setDiplomaRecords((prev) => [...prev, newRecord]);

			// Cập nhật currentEntryNumber của sổ văn bằng
			const updatedDiplomaBooks = diplomaBooks.map((book) =>
				book.id === data.diplomaBookId ? { ...book, currentEntryNumber: entryNumber + 1, updatedAt: now } : book,
			);
			setDiplomaBooks(updatedDiplomaBooks);

			message.success('Tạo hồ sơ văn bằng mới thành công');
			return newRecord;
		},
		[diplomaBooks, graduationDecisions, setDiplomaRecords, setDiplomaBooks],
	);

	// Cập nhật hồ sơ văn bằng
	const updateDiplomaRecord = useCallback(
		(
			id: string,
			data: Partial<Omit<DiplomaRecord, 'id' | 'createdAt' | 'updatedAt' | 'entryNumber' | 'diplomaBookId'>>,
		) => {
			// Không cho phép thay đổi diplomaBookId và entryNumber
			const { diplomaBookId, entryNumber, ...validData } = data as any;

			setDiplomaRecords((prev) =>
				prev.map((record) =>
					record.id === id
						? {
								...record,
								...validData,
								updatedAt: new Date(),
						  }
						: record,
				),
			);
			message.success('Cập nhật hồ sơ văn bằng thành công');
		},
		[setDiplomaRecords],
	);

	// Xóa hồ sơ văn bằng
	const deleteDiplomaRecord = useCallback(
		(id: string) => {
			setDiplomaRecords((prev) => prev.filter((record) => record.id !== id));
			message.success('Xóa hồ sơ văn bằng thành công');
		},
		[setDiplomaRecords],
	);

	// Lấy hồ sơ văn bằng theo ID
	const getDiplomaRecordById = useCallback(
		(id: string) => {
			return diplomaRecords.find((record) => record.id === id) || null;
		},
		[diplomaRecords],
	);

	// Lấy tất cả hồ sơ văn bằng của một sổ văn bằng
	const getRecordsByDiplomaBookId = useCallback(
		(diplomaBookId: string) => {
			return diplomaRecords.filter((record) => record.diplomaBookId === diplomaBookId);
		},
		[diplomaRecords],
	);

	// Lấy tất cả hồ sơ văn bằng của một quyết định tốt nghiệp
	const getRecordsByGraduationDecisionId = useCallback(
		(graduationDecisionId: string) => {
			return diplomaRecords.filter((record) => record.graduationDecisionId === graduationDecisionId);
		},
		[diplomaRecords],
	);

	// Tìm kiếm hồ sơ văn bằng
	const searchDiplomaRecords = useCallback(
		(params: Record<string, any>) => {
			return diplomaRecords.filter((record) => {
				for (const [key, value] of Object.entries(params)) {
					if (value === undefined || value === '' || value === null) continue;

					if (key === 'studentName' && record.studentName.toLowerCase().indexOf(value.toLowerCase()) === -1) {
						return false;
					}

					if (key === 'studentId' && record.studentId.toLowerCase().indexOf(value.toLowerCase()) === -1) {
						return false;
					}

					if (key === 'diplomaNumber' && record.diplomaNumber.toLowerCase().indexOf(value.toLowerCase()) === -1) {
						return false;
					}

					if (key === 'entryNumber' && record.entryNumber !== value) {
						return false;
					}

					if (key === 'graduationYear') {
						const diplomaBook = diplomaBooks.find((book) => book.id === record.diplomaBookId);
						if (!diplomaBook || diplomaBook.year !== value) {
							return false;
						}
					}

					if (key === 'dateOfBirth' && record.dateOfBirth.getTime() !== value.getTime()) {
						return false;
					}
				}
				return true;
			});
		},
		[diplomaRecords, diplomaBooks],
	);

	return {
		diplomaRecords,
		diplomaBooks,
		graduationDecisions,
		diplomaFields,
		loading,
		createDiplomaRecord,
		updateDiplomaRecord,
		deleteDiplomaRecord,
		getDiplomaRecordById,
		getRecordsByDiplomaBookId,
		getRecordsByGraduationDecisionId,
		searchDiplomaRecords,
	};
}
