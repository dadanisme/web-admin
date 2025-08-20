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
  getCountFromServer,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Batch } from "@/types/school";
import { COLLECTIONS, FIRESTORE_ERRORS } from "@/lib/firestore-constants";

// Helper to convert Firestore document to typed object
function docToData<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists()) return null;
  return { id: doc.id, ...doc.data() } as T;
}

function queryToData<T>(snapshot: QuerySnapshot): T[] {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
}

export type CreateBatchData = Omit<Batch, "id" | "createdAt" | "updatedAt">;

export class BatchService {
  // Get batch by ID within a school
  static async getById(
    schoolId: string,
    batchId: string
  ): Promise<Batch | null> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(
      db,
      COLLECTIONS.SCHOOLS,
      schoolId,
      COLLECTIONS.BATCHES,
      batchId
    );
    const docSnap = await getDoc(docRef);
    return docToData<Batch>(docSnap);
  }

  // Get all batches for a school
  static async getBySchoolId(schoolId: string): Promise<Batch[]> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.BATCHES),
      orderBy("name", "asc")
    );
    const snapshot = await getDocs(q);
    return queryToData<Batch>(snapshot);
  }

  // Create new batch
  static async create(
    schoolId: string,
    data: CreateBatchData
  ): Promise<string> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = await addDoc(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.BATCHES),
      {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );
    return docRef.id;
  }

  // Update batch
  static async update(
    schoolId: string,
    batchId: string,
    data: Partial<CreateBatchData>
  ): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(
      db,
      COLLECTIONS.SCHOOLS,
      schoolId,
      COLLECTIONS.BATCHES,
      batchId
    );
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  // Delete batch
  static async delete(schoolId: string, batchId: string): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(
      db,
      COLLECTIONS.SCHOOLS,
      schoolId,
      COLLECTIONS.BATCHES,
      batchId
    );
    await deleteDoc(docRef);
  }

  // Listen to batches changes for a school
  static onSchoolBatchesSnapshot(
    schoolId: string,
    callback: (batches: Batch[]) => void
  ): () => void {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.BATCHES),
      orderBy("name", "asc")
    );
    return onSnapshot(q, (snapshot) => {
      callback(queryToData<Batch>(snapshot));
    });
  }

  // Listen to single batch changes
  static onBatchSnapshot(
    schoolId: string,
    batchId: string,
    callback: (batch: Batch | null) => void
  ): () => void {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(
      db,
      COLLECTIONS.SCHOOLS,
      schoolId,
      COLLECTIONS.BATCHES,
      batchId
    );
    return onSnapshot(docRef, (doc) => {
      callback(docToData<Batch>(doc));
    });
  }

  // Get batch count for school
  static async getCountBySchool(schoolId: string): Promise<number> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.SCHOOLS, schoolId, COLLECTIONS.BATCHES)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }
}
