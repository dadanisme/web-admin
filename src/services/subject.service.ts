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
import { Subject } from "@/types/school";
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

export type CreateSubjectData = Omit<Subject, "id" | "createdAt" | "updatedAt">;

export class SubjectService {
  // Get subject by ID within a school
  static async getById(schoolId: string, subjectId: string): Promise<Subject | null> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.SUBJECTS, subjectId);
    const docSnap = await getDoc(docRef);
    return docToData<Subject>(docSnap);
  }

  // Get all subjects for a school
  static async getBySchoolId(schoolId: string): Promise<Subject[]> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.SUBJECTS),
      orderBy("name", "asc")
    );
    const snapshot = await getDocs(q);
    return queryToData<Subject>(snapshot);
  }

  // Create new subject
  static async create(schoolId: string, data: CreateSubjectData): Promise<string> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = await addDoc(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.SUBJECTS),
      {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );
    return docRef.id;
  }

  // Update subject
  static async update(
    schoolId: string,
    subjectId: string,
    data: Partial<CreateSubjectData>
  ): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.SUBJECTS, subjectId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  // Delete subject
  static async delete(schoolId: string, subjectId: string): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.SUBJECTS, subjectId);
    await deleteDoc(docRef);
  }

  // Listen to subjects changes for a school
  static onSchoolSubjectsSnapshot(
    schoolId: string,
    callback: (subjects: Subject[]) => void
  ): () => void {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.SUBJECTS),
      orderBy("name", "asc")
    );
    return onSnapshot(q, (snapshot) => {
      callback(queryToData<Subject>(snapshot));
    });
  }

  // Listen to single subject changes
  static onSubjectSnapshot(
    schoolId: string,
    subjectId: string,
    callback: (subject: Subject | null) => void
  ): () => void {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.SUBJECTS, subjectId);
    return onSnapshot(docRef, (doc) => {
      callback(docToData<Subject>(doc));
    });
  }
}