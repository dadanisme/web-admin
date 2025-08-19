// Firestore collection names
export const COLLECTIONS = {
  USERS: "users",
  REGISTRATIONS: "registrations",
  SCHOOLS: "schools",
  STUDENTS: "students",
} as const;

// Registration status values
export const REGISTRATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

// Error messages
export const FIRESTORE_ERRORS = {
  NOT_INITIALIZED: "Firestore not initialized",
  DOCUMENT_NOT_FOUND: "Document not found",
  PERMISSION_DENIED: "Permission denied",
  NETWORK_ERROR: "Network error occurred",
} as const;

// Query limits
export const QUERY_LIMITS = {
  DEFAULT: 50,
  MAX: 100,
  SMALL: 10,
} as const;

export type RegistrationStatus =
  (typeof REGISTRATION_STATUS)[keyof typeof REGISTRATION_STATUS];
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
