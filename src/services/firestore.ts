// Re-export all services from a single entry point
export { RegistrationService } from "./registration.service";
export { UserService } from "./user.service";
export { SchoolService } from "./school.service";
export { StudentService, type CreateStudentData } from "./student.service";
export { SubjectService, type CreateSubjectData } from "./subject.service";
export { BatchService, type CreateBatchData } from "./batch.service";
export {
  DefaultExamService,
  type CreateDefaultExamData,
} from "./default-exam.service";
export { ExamService, type CreateExamData } from "./exam.service";

// Re-export types for convenience
export type {
  User,
  Registration,
  School,
  CreateRegistrationData,
  CreateUserData,
} from "@/types";
export type { Student, Subject, Exam, Batch } from "@/types/school";
