import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { beforeUserCreated } from "firebase-functions/v2/identity";

/**
 * Firebase Auth trigger that runs when a new user signs up
 * Creates a user document in Firestore at users/{userId}
 */
export const writeUserData = beforeUserCreated(async (event) => {
  if (!event.data) {
    throw new Error("No user data found");
  }

  const { uid, email, displayName, photoURL } = event.data;

  // Create user document data based on User interface
  const userData = {
    email: email || "",
    displayName: displayName,
    photoURL: photoURL,
    didCompleteOnboarding: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  try {
    // Create user document in Firestore
    await db.collection("users").doc(uid).set(userData);

    logger.info(`Created user document for ${email} (${uid})`);
  } catch (error) {
    logger.error(`Failed to create user document for ${uid}:`, error);
    throw error;
  }
});
