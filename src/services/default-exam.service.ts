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

// Helper to convert Firestore document to typed object
function docToData<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists()) return null;
  return { id: doc.id, ...doc.data() } as T;
}

function queryToData<T>(snapshot: QuerySnapshot): T[] {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
}

export type CreateDefaultExamData = Omit<
  Exam,
  "id" | "createdAt" | "updatedAt"
>;

export class DefaultExamService {
  // Get default exam by ID within a school
  static async getById(schoolId: string, examId: string): Promise<Exam | null> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(
      db,
      COLLECTIONS.SCHOOLS,
      schoolId,
      COLLECTIONS.DEFAULT_EXAMS,
      examId
    );
    const docSnap = await getDoc(docRef);
    return docToData<Exam>(docSnap);
  }

  // Get all default exams for a school
  static async getBySchoolId(schoolId: string): Promise<Exam[]> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.DEFAULT_EXAMS),
      orderBy("name", "asc")
    );
    const snapshot = await getDocs(q);
    return queryToData<Exam>(snapshot);
  }

  // Create new default exam
  static async create(
    schoolId: string,
    data: CreateDefaultExamData
  ): Promise<string> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = await addDoc(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.DEFAULT_EXAMS),
      {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );
    return docRef.id;
  }

  // Update default exam
  static async update(
    schoolId: string,
    examId: string,
    data: Partial<CreateDefaultExamData>
  ): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(
      db,
      COLLECTIONS.SCHOOLS,
      schoolId,
      COLLECTIONS.DEFAULT_EXAMS,
      examId
    );
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  // Delete default exam
  static async delete(schoolId: string, examId: string): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(
      db,
      COLLECTIONS.SCHOOLS,
      schoolId,
      COLLECTIONS.DEFAULT_EXAMS,
      examId
    );
    await deleteDoc(docRef);
  }

  // Listen to default exams changes for a school
  static onSchoolDefaultExamsSnapshot(
    schoolId: string,
    callback: (exams: Exam[]) => void
  ): () => void {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.DEFAULT_EXAMS),
      orderBy("name", "asc")
    );
    return onSnapshot(q, (snapshot) => {
      callback(queryToData<Exam>(snapshot));
    });
  }

  // Listen to single default exam changes
  static onDefaultExamSnapshot(
    schoolId: string,
    examId: string,
    callback: (exam: Exam | null) => void
  ): () => void {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(
      db,
      COLLECTIONS.SCHOOLS,
      schoolId,
      COLLECTIONS.DEFAULT_EXAMS,
      examId
    );
    return onSnapshot(docRef, (doc) => {
      callback(docToData<Exam>(doc));
    });
  }
}
