import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";
import { AggregateField, FieldValue } from "firebase-admin/firestore";

/**
 * Firebase trigger that listens to examResult document writes
 * Triggered when schools/{schoolId}/subjects/{subjectId}/exams/{examId}/examResults/{studentId} is written
 * Recomputes and writes the student's averageScore across all graded exam results in the school
 */
export const writeStudentAverage = onDocumentWritten(
  "schools/{schoolId}/subjects/{subjectId}/exams/{examId}/examResults/{studentId}",
  async (event) => {
    const { schoolId, studentId } = event.params;

    try {
      const beforeScore = event.data?.before?.data()?.score;
      const afterScore = event.data?.after?.data()?.score;

      if (beforeScore === afterScore) {
        logger.debug(
          `Skipped average recompute for student ${studentId} in school ${schoolId}: score unchanged.`
        );
        return;
      }

      const snapshot = await db
        .collectionGroup("examResults")
        .where("studentId", "==", studentId)
        .aggregate({
          averageScore: AggregateField.average("score"),
        })
        .get();

      const averageScore = snapshot.data()?.averageScore ?? null;

      // Write to the student document within the same school
      const studentRef = db
        .collection("schools")
        .doc(schoolId)
        .collection("students")
        .doc(studentId);

      await studentRef.update({
        averageScore,
        updatedAt: FieldValue.serverTimestamp(),
      });

      logger.info(
        `Updated student ${studentId} averageScore=${averageScore} in school ${schoolId}`
      );
    } catch (error) {
      logger.error(
        `Error writing average for student ${studentId} in school ${schoolId}:`,
        error
      );
      throw error;
    }
  }
);
