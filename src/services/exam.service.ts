import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Exam } from "@/types/school";
import { COLLECTIONS, FIRESTORE_ERRORS } from "@/lib/firestore-constants";

function docToData<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists()) return null;
  return { id: doc.id, ...doc.data() } as T;
}

function queryToData<T>(snapshot: QuerySnapshot): T[] {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
}

export type CreateExamData = Omit<Exam, "id" | "createdAt" | "updatedAt">;

export class ExamService {
  // Get exam by ID within a school's subject
  static async getById(
    schoolId: string,
    subjectId: string,
    examId: string
  ): Promise<Exam | null> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(
      db,
      COLLECTIONS.SCHOOLS,
      schoolId,
      COLLECTIONS.SUBJECTS,
      subjectId,
      COLLECTIONS.EXAMS,
      examId
    );
    const docSnap = await getDoc(docRef);
    return docToData<Exam>(docSnap);
  }

  // Get all exams for a specific subject
  static async getBySubjectId(
    schoolId: string,
    subjectId: string
  ): Promise<Exam[]> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(
        db,
        COLLECTIONS.SCHOOLS,
        schoolId,
        COLLECTIONS.SUBJECTS,
        subjectId,
        COLLECTIONS.EXAMS
      ),
      orderBy("name", "asc")
    );
    const snapshot = await getDocs(q);
    return queryToData<Exam>(snapshot);
  }

  // Create new exam for a subject
  static async create(
    schoolId: string,
    subjectId: string,
    data: CreateExamData
  ): Promise<string> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = await addDoc(
      collection(
        db,
        COLLECTIONS.SCHOOLS,
        schoolId,
        COLLECTIONS.SUBJECTS,
        subjectId,
        COLLECTIONS.EXAMS
      ),
      {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );
    return docRef.id;
  }

  // Update exam
  static async update(
    schoolId: string,
    subjectId: string,
    examId: string,
    data: Partial<CreateExamData>
  ): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(
      db,
      COLLECTIONS.SCHOOLS,
      schoolId,
      COLLECTIONS.SUBJECTS,
      subjectId,
      COLLECTIONS.EXAMS,
      examId
    );
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  // Delete exam
  static async delete(
    schoolId: string,
    subjectId: string,
    examId: string
  ): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(
      db,
      COLLECTIONS.SCHOOLS,
      schoolId,
      COLLECTIONS.SUBJECTS,
      subjectId,
      COLLECTIONS.EXAMS,
      examId
    );
    await deleteDoc(docRef);
  }

  // Listen to exams changes for a subject
  static onSubjectExamsSnapshot(
    schoolId: string,
    subjectId: string,
    callback: (exams: Exam[]) => void
  ): () => void {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(
        db,
        COLLECTIONS.SCHOOLS,
        schoolId,
        COLLECTIONS.SUBJECTS,
        subjectId,
        COLLECTIONS.EXAMS
      ),
      orderBy("name", "asc")
    );
    return onSnapshot(q, (snapshot) => {
      callback(queryToData<Exam>(snapshot));
    });
  }

  // Listen to single exam changes
  static onExamSnapshot(
    schoolId: string,
    subjectId: string,
    examId: string,
    callback: (exam: Exam | null) => void
  ): () => void {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(
      db,
      COLLECTIONS.SCHOOLS,
      schoolId,
      COLLECTIONS.SUBJECTS,
      subjectId,
      COLLECTIONS.EXAMS,
      examId
    );
    return onSnapshot(docRef, (doc) => {
      callback(docToData<Exam>(doc));
    });
  }

  // Copy from default exam to subject exam
  static async createFromDefault(
    schoolId: string,
    subjectId: string,
    defaultExam: Exam
  ): Promise<string> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const examData: CreateExamData = {
      name: defaultExam.name,
    };

    return this.create(schoolId, subjectId, examData);
  }
}
