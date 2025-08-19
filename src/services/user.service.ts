import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  limit,
  serverTimestamp,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, CreateUserData } from "@/types";
import { COLLECTIONS, FIRESTORE_ERRORS } from "@/lib/firestore-constants";

// Helper to convert Firestore document to typed object
function docToData<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists()) return null;
  return { id: doc.id, ...doc.data() } as T;
}

function queryToData<T>(snapshot: QuerySnapshot): T[] {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
}

export class UserService {
  // Get user by ID
  static async getById(userId: string): Promise<User | null> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(docRef);
    return docToData<User>(docSnap);
  }

  // Get user by email
  static async getByEmail(email: string): Promise<User | null> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.USERS),
      where("email", "==", email),
      limit(1)
    );
    const snapshot = await getDocs(q);
    const users = queryToData<User>(snapshot);
    return users[0] || null;
  }

  // Get users by school ID
  static async getBySchoolId(schoolId: string): Promise<User[]> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.USERS),
      where("schoolId", "==", schoolId)
    );
    const snapshot = await getDocs(q);
    return queryToData<User>(snapshot);
  }

  // Create new user
  static async create(data: CreateUserData): Promise<string> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Update user school assignment
  static async assignToSchool(userId: string, schoolId: string): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, {
      schoolId,
      updatedAt: serverTimestamp(),
    });
  }

  // Remove user from school
  static async removeFromSchool(userId: string): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, {
      schoolId: null,
      updatedAt: serverTimestamp(),
    });
  }
}
