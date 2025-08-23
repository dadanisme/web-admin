import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import * as logger from "firebase-functions/logger";

/**
 * Helper to query user registrations
 */
export async function getUserRegistrations(userId: string) {
  return await db
    .collection("registrations")
    .where("userId", "==", userId)
    .get();
}

/**
 * Helper to batch update registrations with schoolId
 */
export async function batchUpdateRegistrations(
  registrations: FirebaseFirestore.QueryDocumentSnapshot[],
  schoolId: string
) {
  const batch = db.batch();

  registrations.forEach((doc) => {
    batch.update(doc.ref, {
      schoolId: schoolId,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  return await batch.commit();
}

/**
 * Main function to sync user schoolId to registrations
 * Handles the business logic when a user gets assigned to a school
 */
export async function syncUserSchoolToRegistrations(
  userId: string,
  schoolId: string
): Promise<void> {
  try {
    // Find all registrations for this user
    const registrationsQuery = await getUserRegistrations(userId);

    if (registrationsQuery.empty) {
      logger.info(`No registrations found for user ${userId}`);
      return;
    }

    // Update schoolId in all registrations for this user
    await batchUpdateRegistrations(registrationsQuery.docs, schoolId);

    logger.info(
      `Successfully updated schoolId to ${schoolId} for ${registrationsQuery.docs.length} registrations of user ${userId}`
    );
  } catch (error) {
    logger.error(`Error updating registrations for user ${userId}:`, error);
    throw error;
  }
}
