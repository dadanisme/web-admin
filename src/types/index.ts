import { Timestamp } from "firebase/firestore";
import { RegistrationStatus } from "@/lib/firestore-constants";

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  schoolId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Registration {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  status?: RegistrationStatus;
  schoolId?: string; // Set when approved
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvedBy?: string; // Admin user ID who approved
  rejectedBy?: string; // Admin user ID who rejected
  rejectionReason?: string;
}

export interface School {
  id: string;
  name: string;
  domain?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// For creating new registrations/users (without id and timestamps)
export type CreateRegistrationData = Omit<
  Registration,
  "id" | "createdAt" | "updatedAt"
>;
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">;
export type CreateSchoolData = Omit<School, "id" | "createdAt" | "updatedAt">;
