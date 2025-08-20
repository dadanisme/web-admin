import { DefaultFirestoreFields } from "./common";
import { RegistrationStatus } from "@/lib/firestore-constants";

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

// For creating new registrations (without id and timestamps)
export type CreateRegistrationData = Omit<
  Registration,
  "id" | "createdAt" | "updatedAt"
>;