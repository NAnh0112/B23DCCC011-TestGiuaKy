export const DIPLOMA_DATA_TYPES = [
	{ label: 'Chuỗi', value: 'string' },
	{ label: 'Số', value: 'number' },
	{ label: 'Ngày tháng', value: 'date' },
];

export const DEFAULT_DIPLOMA_FIELDS: Array<{
	name: string;
	displayName: string;
	dataType: 'string' | 'number' | 'date';
	required: boolean;
}> = [
	{ name: 'ethnicGroup', displayName: 'Dân tộc', dataType: 'string', required: true },
	{ name: 'placeOfBirth', displayName: 'Nơi sinh', dataType: 'string', required: true },
	{ name: 'gpa', displayName: 'Điểm trung bình', dataType: 'number', required: true },
	{ name: 'enrollmentDate', displayName: 'Ngày nhập học', dataType: 'date', required: true },
	{ name: 'major', displayName: 'Ngành đào tạo', dataType: 'string', required: true },
	{ name: 'classification', displayName: 'Xếp loại', dataType: 'string', required: true },
	{ name: 'modeOfStudy', displayName: 'Hình thức đào tạo', dataType: 'string', required: true },
];

export const DIPLOMA_STORAGE_KEYS = {
	DIPLOMA_BOOKS: 'diploma_books',
	GRADUATION_DECISIONS: 'graduation_decisions',
	DIPLOMA_FIELDS: 'diploma_fields',
	DIPLOMA_RECORDS: 'diploma_records',
	DIPLOMA_LOOKUPS: 'diploma_lookups',
};
