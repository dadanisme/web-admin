import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { db, admin } from "../config/firebase";

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
      const beforeData = event.data?.before?.data() as { score?: number | null; schoolId?: string; studentId?: string } | undefined;
      const afterData = event.data?.after?.data() as { score?: number | null; schoolId?: string; studentId?: string } | undefined;

      const normalizeScore = (val: unknown): number | null => {
        if (val === null || val === undefined) return null;
        const num = Number(val);
        return Number.isFinite(num) ? num : null;
      };

      const beforeScore = normalizeScore(beforeData?.score);
      const afterScore = normalizeScore(afterData?.score);

      // Early return if score did not change (covers create/update with same score or unrelated field changes)
      const scoreUnchanged =
        (beforeScore === null && afterScore === null) ||
        (typeof beforeScore === "number" && typeof afterScore === "number" && beforeScore === afterScore);
      if (scoreUnchanged) {
        logger.debug(
          `Skipped average recompute for student ${studentId} in school ${schoolId}: score unchanged.`
        );
        return;
      }

      // Determine whether examResults include schoolId field; include it in query if present
      const examResultsIncludeSchoolId = Boolean(beforeData?.schoolId || afterData?.schoolId);

      let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db
        .collectionGroup("examResults")
        .where("studentId", "==", studentId);

      if (examResultsIncludeSchoolId) {
        query = query.where("schoolId", "==", schoolId);
      } else {
        // Rely on data isolation per school when schoolId is not stored on examResults
        logger.debug(
          `Querying averages by studentId only for ${studentId}; examResults missing schoolId.`
        );
      }

      // Only fetch the fields we need
      const snapshot = await query.select("score").get();

      const gradedScores: number[] = [];
      snapshot.forEach((doc) => {
        const score = normalizeScore(doc.get("score"));
        if (typeof score === "number") {
          gradedScores.push(score);
        } else if (doc.get("score") !== undefined && doc.get("score") !== null) {
          logger.warn(
            `Ignoring non-finite score for student ${studentId} in doc ${doc.ref.path}`
          );
        }
      });

      let averageScore: number | null = null;
      const gradedCount = gradedScores.length;
      if (gradedCount > 0) {
        const sum = gradedScores.reduce((acc, v) => acc + v, 0);
        averageScore = sum / gradedCount;
      }

      // Write to the student document within the same school
      const studentRef = db
        .collection("schools")
        .doc(schoolId)
        .collection("students")
        .doc(studentId);

      await studentRef.update({
        averageScore: averageScore ?? null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.info(
        `Updated student ${studentId} averageScore=${averageScore} in school ${schoolId}`
      );
    } catch (error: any) {
      // If you see an index error for the collection group query, add a composite index:
      // collectionGroup: examResults, filters: studentId ==, schoolId == (optional), select: score
      logger.error(
        `Error writing average for student ${event.params?.studentId} in school ${event.params?.schoolId}:`,
        error
      );
      throw error;
    }
  }
);
