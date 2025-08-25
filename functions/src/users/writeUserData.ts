import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { beforeUserCreated, HttpsError } from "firebase-functions/v2/identity";

/**
 * Firebase Auth trigger that runs when a new user signs up
 * Creates a user document in Firestore at users/{userId}
 */
export const writeUserData = beforeUserCreated(async (event) => {
  if (!event.data) {
    throw new HttpsError("invalid-argument", "No user data found");
  }

  const { uid, email, displayName, photoURL } = event.data;

  // Check for existing registrations with this email
  let schoolIdFromRegistration: string | null = null;

  try {
    if (email) {
      const existingRegistrations = await db
        .collection("registrations")
        // by email because it is possible userId is not set yet -- when an email invited, but that user is not created yet
        .where("userEmail", "==", email)
        .limit(1)
        .get();

      if (!existingRegistrations.empty) {
        const doc = existingRegistrations.docs[0];
        const registrationData = doc.data();

        // Get schoolId from the registration if it exists
        if (registrationData.schoolId) {
          schoolIdFromRegistration = registrationData.schoolId;
        }

        // Update existing registration to approved status and set userId
        await doc.ref.update({
          userId: uid,
          status: "approved",
          updatedAt: FieldValue.serverTimestamp(),
        });

        logger.info(`Updated existing registration to approved for ${email}`);
      }
    }

    // Create user document data based on User interface
    const userData = {
      email: email || "",
      displayName: displayName,
      photoURL: photoURL,
      schoolId: schoolIdFromRegistration,
      didCompleteOnboarding: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Create user document in Firestore
    await db.collection("users").doc(uid).set(userData);

    logger.info(
      `Created user document for ${email} (${uid}) with schoolId: ${schoolIdFromRegistration}`
    );
  } catch (error) {
    logger.error(`Failed to create user document for ${uid}:`, error);
    throw error;
  }
});
