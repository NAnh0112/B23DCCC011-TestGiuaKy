import { useCallback } from 'react';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import useInitModel from '@/hooks/useInitModel';
import type { DiplomaBook } from '@/services/DiplomaManagement/typing';
import { DIPLOMA_STORAGE_KEYS } from '@/services/DiplomaManagement/constant';

export default function useDiplomaBook() {
	const {
		data: diplomaBooks,
		setData: setDiplomaBooks,
		loading,
	} = useInitModel<DiplomaBook[]>({
		storageKey: DIPLOMA_STORAGE_KEYS.DIPLOMA_BOOKS,
		defaultValue: [],
	});

	// Tạo sổ văn bằng mới
	const createDiplomaBook = useCallback(
		(data: Omit<DiplomaBook, 'id' | 'createdAt' | 'updatedAt' | 'currentEntryNumber'>) => {
			const now = new Date();
			const newBook: DiplomaBook = {
				...data,
				id: uuidv4(),
				currentEntryNumber: 1,
				createdAt: now,
				updatedAt: now,
			};

			setDiplomaBooks((prev) => [...prev, newBook]);
			message.success('Tạo sổ văn bằng mới thành công');
			return newBook;
		},
		[setDiplomaBooks],
	);

	// Cập nhật sổ văn bằng
	const updateDiplomaBook = useCallback(
		(id: string, data: Partial<Omit<DiplomaBook, 'id' | 'createdAt' | 'updatedAt'>>) => {
			setDiplomaBooks((prev) =>
				prev.map((book) =>
					book.id === id
						? {
								...book,
								...data,
								updatedAt: new Date(),
						  }
						: book,
				),
			);
			message.success('Cập nhật sổ văn bằng thành công');
		},
		[setDiplomaBooks],
	);

	// Xóa sổ văn bằng
	const deleteDiplomaBook = useCallback(
		(id: string) => {
			setDiplomaBooks((prev) => prev.filter((book) => book.id !== id));
			message.success('Xóa sổ văn bằng thành công');
		},
		[setDiplomaBooks],
	);

	return {
		diplomaBooks,
		loading,
		createDiplomaBook,
		updateDiplomaBook,
		deleteDiplomaBook,
	};
}
