import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";

/**
 * Firebase trigger that listens to examResult document changes
 * Triggered when schools/{schoolId}/subjects/{subjectId}/exams/{examId}/examResults/{examResultId} is written
 * Updates the exam document with pendingReview count and isDone status
 */
export const writeExamPendingReview = onDocumentWritten(
  "schools/{schoolId}/subjects/{subjectId}/exams/{examId}/examResults/{examResultId}",
  async (event) => {
    const { schoolId, subjectId, examId } = event.params;

    try {
      // Get references
      const examRef = db
        .collection("schools")
        .doc(schoolId)
        .collection("subjects")
        .doc(subjectId)
        .collection("exams")
        .doc(examId);

      // Get school document to check activeBatchId
      const schoolDoc = await db
        .collection("schools")
        .doc(schoolId)
        .get();

      const schoolData = schoolDoc.data();
      const activeBatchId = schoolData?.activeBatchId;

      // Get total number of students in the active batch
      let totalStudents = 0;
      if (activeBatchId) {
        const studentsSnapshot = await db
          .collection("schools")
          .doc(schoolId)
          .collection("students")
          .where("batchId", "==", activeBatchId)
          .count()
          .get();

        totalStudents = studentsSnapshot.data()?.count ?? 0;
      }

      // Get exam document to check passingScore
      const examDoc = await examRef.get();
      const examData = examDoc.data();
      const passingScore = examData?.passingScore;

      // Get all exam results for this exam
      const examResultsSnapshot = await examRef
        .collection("examResults")
        .where("score", ">", 0)
        .count()
        .get();

      // Count graded results (results with scores)
      const gradedResults = examResultsSnapshot.data()?.count ?? 0;

      // Calculate pass/fail counts if passingScore is defined
      let totalStudentsPassed = 0;
      let totalStudentsFailed = 0;

      if (passingScore !== undefined && passingScore !== null) {
        // Count students who passed
        const passedSnapshot = await examRef
          .collection("examResults")
          .where("score", ">=", passingScore)
          .count()
          .get();

        totalStudentsPassed = passedSnapshot.data()?.count ?? 0;

        // Count students who failed (graded but below passing score)
        const failedSnapshot = await examRef
          .collection("examResults")
          .where("score", "<", passingScore)
          .count()
          .get();

        totalStudentsFailed = failedSnapshot.data()?.count ?? 0;
      }

      // Calculate pending reviews (students not yet graded)
      const pendingReview = totalStudents - gradedResults;

      // Determine if exam is done (all students have been graded)
      const isDone = pendingReview === 0 && totalStudents > 0;

      // Update the exam document
      await examRef.update({
        pendingReview,
        isDone,
        totalStudentsPassed,
        totalStudentsFailed,
      });

      logger.info(
        `Updated exam ${examId}: pendingReview=${pendingReview}, isDone=${isDone}, totalStudents=${totalStudents}, gradedResults=${gradedResults}, totalStudentsPassed=${totalStudentsPassed}, totalStudentsFailed=${totalStudentsFailed}`
      );
    } catch (error) {
      logger.error(
        `Error updating exam ${examId} pending review status:`,
        error
      );
      throw error;
    }
  }
);
