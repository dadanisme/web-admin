import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { db, admin } from "../config/firebase";
import * as logger from "firebase-functions/logger";

/**
 * Cloud Function that triggers when a user document is created
 * Creates a corresponding registration document for the new user
 */
export const writeUserRegistration = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    const userId = event.params.userId;
    const userData = event.data?.data();

    if (!userData) {
      logger.warn(`No data found for created user ${userId}`);
      return;
    }

    try {
      // Check if registration already exists for this user or email
      const existingRegistrations = await db
        .collection("registrations")
        .where("userId", "==", userId)
        .limit(1)
        .get();

      if (!existingRegistrations.empty) {
        logger.info(
          `Registration already exists for user ${userId}, skipping creation`
        );
        return;
      }

      // Create registration data from user data
      const registrationData = {
        userId: userId,
        userEmail: userData.email,
        userName: userData.displayName,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Create the registration document
      await db.collection("registrations").add(registrationData);

      logger.info(
        `Successfully created registration for user ${userId} with status: ${registrationData.status}`
      );
    } catch (error) {
      logger.error(`Error creating registration for user ${userId}:`, error);
      throw error;
    }
  }
);
