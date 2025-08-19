// Re-export all services from a single entry point
export { RegistrationService } from "./registration.service";
export { UserService } from "./user.service";
export { SchoolService } from "./school.service";
export { StudentService, type CreateStudentData } from "./student.service";
export { SubjectService, type CreateSubjectData } from "./subject.service";

// Re-export types for convenience
export type {
  User,
  Registration,
  School,
  CreateRegistrationData,
  CreateUserData,
  CreateSchoolData,
} from "@/types";
export type { Student, Subject } from "@/types/school";