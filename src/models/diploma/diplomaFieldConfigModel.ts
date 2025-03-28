import { useCallback } from 'react';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import useInitModel from '@/hooks/useInitModel';
import { DiplomaFieldConfig } from '@/services/DiplomaManagement/typing';
import { DIPLOMA_STORAGE_KEYS, DEFAULT_DIPLOMA_FIELDS } from '@/services/DiplomaManagement/constant';

export default function useDiplomaFieldConfig() {
	const {
		data: diplomaFields,
		setData: setDiplomaFields,
		loading,
	} = useInitModel<DiplomaFieldConfig[]>({
		storageKey: DIPLOMA_STORAGE_KEYS.DIPLOMA_FIELDS,
		defaultValue: DEFAULT_DIPLOMA_FIELDS.map((field, index) => ({
			id: uuidv4(),
			name: field.name,
			displayName: field.displayName,
			dataType: field.dataType,
			required: field.required,
			order: index + 1,
			createdAt: new Date(),
			updatedAt: new Date(),
		})),
	});

	// Tạo trường mới
	const createDiplomaField = useCallback(
		(data: Omit<DiplomaFieldConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
			const now = new Date();

			// Kiểm tra trùng tên
			const isDuplicate = diplomaFields.some(
				(field) => field.name === data.name || field.displayName === data.displayName,
			);

			if (isDuplicate) {
				message.error('Tên trường hoặc tên hiển thị đã tồn tại');
				return null;
			}

			const newField: DiplomaFieldConfig = {
				...data,
				id: uuidv4(),
				createdAt: now,
				updatedAt: now,
			};

			setDiplomaFields((prev) => [...prev, newField]);
			message.success('Tạo trường thông tin mới thành công');
			return newField;
		},
		[diplomaFields, setDiplomaFields],
	);

	// Cập nhật trường
	const updateDiplomaField = useCallback(
		(id: string, data: Partial<Omit<DiplomaFieldConfig, 'id' | 'createdAt' | 'updatedAt'>>) => {
			// Kiểm tra trùng tên
			const isDuplicate = diplomaFields.some(
				(field) =>
					field.id !== id &&
					((data.name && field.name === data.name) || (data.displayName && field.displayName === data.displayName)),
			);

			if (isDuplicate) {
				message.error('Tên trường hoặc tên hiển thị đã tồn tại');
				return;
			}

			setDiplomaFields((prev) =>
				prev.map((field) =>
					field.id === id
						? {
								...field,
								...data,
								updatedAt: new Date(),
						  }
						: field,
				),
			);

			message.success('Cập nhật trường thông tin thành công');
		},
		[diplomaFields, setDiplomaFields],
	);

	// Xóa trường
	const deleteDiplomaField = useCallback(
		(id: string) => {
			setDiplomaFields((prev) => prev.filter((field) => field.id !== id));
			message.success('Xóa trường thông tin thành công');
		},
		[setDiplomaFields],
	);

	// Sắp xếp lại thứ tự các trường
	const reorderDiplomaFields = useCallback(
		(newOrder: string[]) => {
			setDiplomaFields((prev) => {
				const fieldMap = new Map(prev.map((field) => [field.id, field]));
				return newOrder
					.map((id, index) => {
						const field = fieldMap.get(id);
						if (field) {
							return { ...field, order: index + 1, updatedAt: new Date() };
						}
						return null;
					})
					.filter((field): field is DiplomaFieldConfig => field !== null);
			});

			message.success('Cập nhật thứ tự trường thành công');
		},
		[setDiplomaFields],
	);

	return {
		diplomaFields,
		loading,
		createDiplomaField,
		updateDiplomaField,
		deleteDiplomaField,
		reorderDiplomaFields,
	};
}
