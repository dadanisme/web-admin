import { DefaultFirestoreFields } from "./common";

export interface School extends DefaultFirestoreFields {
  name: string;
  activeBatchId?: string;
}

export interface Subject extends DefaultFirestoreFields {
  name: string;
  passingGrade?: number;
  maxGrade?: number;
  totalStudentsPassed?: number;
  totalStudentsFailed?: number;
  pendingReview?: number;
  targetExamId?: string;
}

export interface Student extends DefaultFirestoreFields {
  name: string;
  photoURL?: string;
  batchId?: string;
}

export interface Exam extends DefaultFirestoreFields {
  name: string;
  maxScore?: number;
  passingScore?: number;
  totalStudentsPassed?: number;
  totalStudentsFailed?: number;
  pendingReview?: number;
}

export interface ExamResult extends DefaultFirestoreFields {
  studentId: string;
  score: number;
  comment?: string;
}

export interface Batch extends DefaultFirestoreFields {
  name: string;
}
