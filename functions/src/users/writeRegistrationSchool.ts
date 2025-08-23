import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { syncUserSchoolToRegistrations } from "./helpers";

/**
 * Firebase trigger that listens to user document updates
 * Triggered when users/{userId} document is updated
 */
export const writeRegistrationSchool = onDocumentUpdated(
  "users/{userId}",
  async (event) => {
    const userId = event.params.userId;
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    // Check if schoolId was added or changed
    const beforeSchoolId = beforeData?.schoolId;
    const afterSchoolId = afterData?.schoolId;

    if (beforeSchoolId === afterSchoolId) {
      // No change in schoolId, exit early
      return;
    }

    logger.info(
      `User ${userId} schoolId changed from ${beforeSchoolId} to ${afterSchoolId}`
    );

    await syncUserSchoolToRegistrations(userId, afterSchoolId);
  }
);
