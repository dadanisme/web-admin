import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";

/**
 * Firebase trigger that listens to exam document changes
 * Triggered when schools/{schoolId}/subjects/{subjectId}/exams/{examId} is written
 * Updates the subject document with the oldest ungraded exam's pendingReview count
 */
export const writeSubjectPendingReview = onDocumentWritten(
  "schools/{schoolId}/subjects/{subjectId}/exams/{examId}",
  async (event) => {
    const { schoolId, subjectId } = event.params;

    try {
      // Get reference to the subject document
      const subjectRef = db
        .collection("schools")
        .doc(schoolId)
        .collection("subjects")
        .doc(subjectId);

      // Get all exams for this subject, ordered by creation date (oldest first)
      const examsSnapshot = await subjectRef
        .collection("exams")
        .where("isDone", "==", false)
        .orderBy("createdAt", "asc")
        .limit(1)
        .get();

      let pendingReview = 0;
      let totalStudentsPassed = 0;
      let totalStudentsFailed = 0;

      if (!examsSnapshot.empty) {
        // Get the oldest ungraded exam
        const oldestExam = examsSnapshot.docs[0];
        const examData = oldestExam.data();

        // Use the counts from the oldest exam
        pendingReview = examData.pendingReview || 0;
        totalStudentsPassed = examData.totalStudentsPassed || 0;
        totalStudentsFailed = examData.totalStudentsFailed || 0;
      }

      // Update the subject document
      await subjectRef.update({
        pendingReview,
        totalStudentsPassed,
        totalStudentsFailed,
      });

      logger.info(
        `Updated subject ${subjectId}: pendingReview=${pendingReview}, totalStudentsPassed=${totalStudentsPassed}, totalStudentsFailed=${totalStudentsFailed}`
      );
    } catch (error) {
      logger.error(
        `Error updating subject ${subjectId} pending review status:`,
        error
      );
      throw error;
    }
  }
);
