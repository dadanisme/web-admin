import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  getCountFromServer,
  collection,
  query,
  where,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { School, Batch } from "@/types";
import { COLLECTIONS, FIRESTORE_ERRORS } from "@/lib/firestore-constants";

import { BatchService } from "./batch.service";

// Helper to convert Firestore document to typed object
function docToData<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists()) return null;
  return { id: doc.id, ...doc.data() } as T;
}

export class SchoolService {
  // Get school by ID
  static async getById(schoolId: string): Promise<School | null> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.SCHOOLS, schoolId);
    const docSnap = await getDoc(docRef);
    return docToData<School>(docSnap);
  }

  // Get teacher count for school
  static async getTeacherCount(schoolId: string): Promise<number> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.USERS),
      where("schoolId", "==", schoolId)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  // Get pending registration count for school
  static async getPendingCount(schoolId: string): Promise<number> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.REGISTRATIONS),
      where("schoolId", "==", schoolId),
      where("status", "==", "pending")
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  // Set active batch for school
  static async setActiveBatch(
    schoolId: string,
    batchId: string | null
  ): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.SCHOOLS, schoolId);
    await updateDoc(docRef, {
      activeBatchId: batchId,
      updatedAt: serverTimestamp(),
    });
  }

  // Get active batch for school
  static async getActiveBatch(schoolId: string): Promise<Batch | null> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const school = await this.getById(schoolId);
    if (!school?.activeBatchId) {
      return null;
    }

    return BatchService.getById(schoolId, school.activeBatchId);
  }
}
