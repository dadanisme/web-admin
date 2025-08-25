/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Export all functions from their respective modules
export { writeUserData } from "./users/writeUserData";
export { writeUserRegistration } from "./users/writeUserRegistration";
export { writeUserSchool } from "./users/writeUserSchool";
export { writeExamPendingReview } from "./exams/writeExamPendingReview";
export { writeSubjectPendingReview } from "./exams/writeSubjectPendingReview";
export { writeStudentAverage } from "./exams/writeStudentAverage";
