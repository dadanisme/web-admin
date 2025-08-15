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
  User,
  Registration,
  School,
  CreateRegistrationData,
  CreateUserData,
} from "@/types";
import {
  COLLECTIONS,
  REGISTRATION_STATUS,
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

    const users = await UserService.getBySchoolId(schoolId);
    return users.length;
  }

  // Get pending registration count for school
  static async getPendingCount(schoolId: string): Promise<number> {
    if (!db) throw new Error(FIRESTORE_ERRORS.NOT_INITIALIZED);

    const registrations =
      await RegistrationService.getPendingBySchoolId(schoolId);
    return registrations.length;
  }
}
