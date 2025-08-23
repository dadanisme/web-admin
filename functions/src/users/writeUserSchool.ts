import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { db } from "../config/firebase";
import { FieldValue } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

/**
 * Firebase trigger that listens to registration document updates
 * Triggered when registrations/{registrationId} document is updated
 */
export const writeUserSchool = onDocumentUpdated(
  "registrations/{registrationId}",
  async (event) => {
    const registrationId = event.params.registrationId;
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    // Check if schoolId was added or changed
    const beforeSchoolId = beforeData?.schoolId;
    const afterSchoolId = afterData?.schoolId;
    const userId = afterData?.userId;

    if (beforeSchoolId === afterSchoolId || !userId || !afterSchoolId) {
      // No change in schoolId, or missing required data, exit early
      logger.info(
        `No change in schoolId, or missing required data, exiting early for registration ${registrationId}`
      );
      return;
    }

    logger.info(
      `Registration ${registrationId} schoolId changed from ${beforeSchoolId} to ${afterSchoolId}, updating user ${userId}`
    );

    try {
      // Update user document with schoolId from registration
      await db.collection("users").doc(userId).update({
        schoolId: afterSchoolId,
        updatedAt: FieldValue.serverTimestamp(),
      });

      logger.info(
        `Successfully updated user ${userId} with schoolId: ${afterSchoolId}`
      );
    } catch (error) {
      logger.error(`Error updating user ${userId} with schoolId:`, error);
      throw error;
    }
  }
);
