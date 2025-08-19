import { doc, getDoc, DocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { School } from "@/types";
import { COLLECTIONS, FIRESTORE_ERRORS } from "@/lib/firestore-constants";
import { UserService } from "./user.service";
import { RegistrationService } from "./registration.service";

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
