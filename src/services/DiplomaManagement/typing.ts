export interface DiplomaBook {
	id: string;
	year: number;
	name: string;
	description?: string;
	currentEntryNumber: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface GraduationDecision {
	id: string;
	decisionNumber: string;
	issueDate: Date;
	excerpt: string;
	diplomaBookId: string;
	diplomaBookName?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface DiplomaFieldConfig {
	id: string;
	name: string;
	displayName: string;
	dataType: 'string' | 'number' | 'date';
	required: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface DiplomaRecord {
	id: string;
	entryNumber: number;
	diplomaNumber: string;
	studentId: string;
	studentName: string;
	dateOfBirth: Date;
	graduationDecisionId: string;
	diplomaBookId: string;
	issueDate: Date;
	fieldValues: Record<string, string | number | Date>;
	createdAt: Date;
	updatedAt: Date;
}

export interface DiplomaSearchParams {
	studentName?: string;
	studentId?: string;
	diplomaNumber?: string;
	entryNumber?: number;
	graduationYear?: number;
	dateOfBirth?: Date;
}
