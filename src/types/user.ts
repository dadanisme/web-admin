import { DefaultFirestoreFields } from "./common";

export interface User extends DefaultFirestoreFields {
  email: string;
  displayName?: string;
  photoURL?: string;
  schoolId?: string;
  didCompleteOnboarding?: boolean;
}

// For creating new users (without id and timestamps)
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">;