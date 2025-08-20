import { DefaultFirestoreFields } from "./common";

export interface School extends DefaultFirestoreFields {
  name: string;
}

export interface Subject extends DefaultFirestoreFields {
  name: string;
  passingGrade?: number;
  maxGrade?: number;
}

export interface Student extends DefaultFirestoreFields {
  name: string;
  photoURL?: string;
  batchId?: string;
}

export interface Exam extends DefaultFirestoreFields {
  name: string;
}

export interface ExamResult extends DefaultFirestoreFields {
  studentId: string;
  score: number;
}

export interface Batch extends DefaultFirestoreFields {
  name: string;
}
