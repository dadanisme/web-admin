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
import { Student } from "@/types/school";
import {
  COLLECTIONS,
  FIRESTORE_ERRORS,
} from "@/lib/firestore-constants";

// Helper to convert Firestore document to typed object
function docToData<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists()) return null;
  return { id: doc.id, ...doc.data() } as T;
}

function queryToData<T>(snapshot: QuerySnapshot): T[] {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
}

export type CreateStudentData = Omit<Student, "id" | "createdAt" | "updatedAt">;

export class StudentService {
  // Get student by ID within a school
  static async getById(schoolId: string, studentId: string): Promise<Student | null> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.STUDENTS, studentId);
    const docSnap = await getDoc(docRef);
    return docToData<Student>(docSnap);
  }

  // Get all students for a school
  static async getBySchoolId(schoolId: string): Promise<Student[]> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.STUDENTS),
      orderBy("name", "asc")
    );
    const snapshot = await getDocs(q);
    return queryToData<Student>(snapshot);
  }

  // Create new student
  static async create(schoolId: string, data: CreateStudentData): Promise<string> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = await addDoc(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.STUDENTS),
      {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );
    return docRef.id;
  }

  // Update student
  static async update(
    schoolId: string,
    studentId: string,
    data: Partial<CreateStudentData>
  ): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.STUDENTS, studentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  // Delete student
  static async delete(schoolId: string, studentId: string): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.STUDENTS, studentId);
    await deleteDoc(docRef);
  }

  // Listen to students changes for a school
  static onSchoolStudentsSnapshot(
    schoolId: string,
    callback: (students: Student[]) => void
  ): () => void {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.STUDENTS),
      orderBy("name", "asc")
    );
    return onSnapshot(q, (snapshot) => {
      callback(queryToData<Student>(snapshot));
    });
  }

  // Listen to single student changes
  static onStudentSnapshot(
    schoolId: string,
    studentId: string,
    callback: (student: Student | null) => void
  ): () => void {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.STUDENTS, studentId);
    return onSnapshot(docRef, (doc) => {
      callback(docToData<Student>(doc));
    });
  }
}