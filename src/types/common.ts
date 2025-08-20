import { Timestamp } from "firebase/firestore";

export interface DefaultFirestoreFields {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
