import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Registration,
  CreateRegistrationData,
} from "@/types";
import {
  COLLECTIONS,
  REGISTRATION_STATUS,
  FIRESTORE_ERRORS,
} from "@/lib/firestore-constants";
import { UserService } from "./user.service";

// Helper to convert Firestore document to typed object
function docToData<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists()) return null;
  return { id: doc.id, ...doc.data() } as T;
}

function queryToData<T>(snapshot: QuerySnapshot): T[] {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
}

export class RegistrationService {
  // Get registration by ID
  static async getById(registrationId: string): Promise<Registration | null> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.REGISTRATIONS, registrationId);
    const docSnap = await getDoc(docRef);
    return docToData<Registration>(docSnap);
  }

  // Get registrations by school ID
  static async getBySchoolId(schoolId: string): Promise<Registration[]> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.REGISTRATIONS),
      where("schoolId", "==", schoolId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return queryToData<Registration>(snapshot);
  }

  // Get pending registrations (no schoolId assigned yet)
  static async getPending(): Promise<Registration[]> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.REGISTRATIONS),
      where("status", "==", REGISTRATION_STATUS.PENDING),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return queryToData<Registration>(snapshot);
  }

  // Get pending registrations by school ID
  static async getPendingBySchoolId(schoolId: string): Promise<Registration[]> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.REGISTRATIONS),
      where("status", "==", REGISTRATION_STATUS.PENDING),
      where("schoolId", "==", schoolId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return queryToData<Registration>(snapshot);
  }

  // Create new registration
  static async create(data: CreateRegistrationData): Promise<string> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = await addDoc(collection(db, COLLECTIONS.REGISTRATIONS), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Get registration by email
  static async getByEmail(email: string): Promise<Registration | null> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.REGISTRATIONS),
      where("userEmail", "==", email),
      limit(1)
    );
    const snapshot = await getDocs(q);
    const registrations = queryToData<Registration>(snapshot);
    return registrations[0] || null;
  }

  // Approve registration and assign user to school
  static async approve(
    registrationId: string,
    schoolId: string,
    approvedBy: string
  ): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    // Get the registration to find the user ID
    const registration = await this.getById(registrationId);
    if (!registration) {
      throw new Error("Registration not found");
    }

    // Update registration status
    const regDocRef = doc(db, COLLECTIONS.REGISTRATIONS, registrationId);
    await updateDoc(regDocRef, {
      status: REGISTRATION_STATUS.APPROVED,
      schoolId,
      approvedBy,
      updatedAt: serverTimestamp(),
    });

    // Assign user to school
    await UserService.assignToSchool(registration.userId, schoolId);
  }

  // Reject registration
  static async reject(
    registrationId: string,
    rejectedBy: string,
    reason?: string
  ): Promise<void> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.REGISTRATIONS, registrationId);
    await updateDoc(docRef, {
      status: REGISTRATION_STATUS.REJECTED,
      rejectedBy,
      rejectionReason: reason,
      updatedAt: serverTimestamp(),
    });
  }

  // Listen to registration changes
  static onSnapshot(
    registrationId: string,
    callback: (registration: Registration | null) => void
  ): () => void {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const docRef = doc(db, COLLECTIONS.REGISTRATIONS, registrationId);
    return onSnapshot(docRef, (doc) => {
      callback(docToData<Registration>(doc));
    });
  }

  // Listen to pending registrations
  static onPendingSnapshot(
    callback: (registrations: Registration[]) => void
  ): () => void {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const q = query(
      collection(db, COLLECTIONS.REGISTRATIONS),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      callback(queryToData<Registration>(snapshot));
    });
  }
}