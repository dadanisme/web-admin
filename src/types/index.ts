import { Timestamp } from "firebase/firestore";
import { RegistrationStatus } from "@/lib/firestore-constants";

export interface DefaultFirestoreFields {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface User extends DefaultFirestoreFields {
  email: string;
  displayName?: string;
  photoURL?: string;
  schoolId: string | null;
}

export interface Registration extends DefaultFirestoreFields {
  userId: string;
  userEmail?: string;
  userName?: string;
  status?: RegistrationStatus;
  schoolId?: string; // Set when approved
  approvedBy?: string; // Admin user ID who approved
  rejectedBy?: string; // Admin user ID who rejected
  rejectionReason?: string;
}

export interface School extends DefaultFirestoreFields {
  name: string;
  domain?: string;
}

// For creating new registrations/users (without id and timestamps)
export type CreateRegistrationData = Omit<
  Registration,
  "id" | "createdAt" | "updatedAt"
>;
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">;
export type CreateSchoolData = Omit<School, "id" | "createdAt" | "updatedAt">;
