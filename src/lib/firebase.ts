import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

function createFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Check if any config values are undefined
  const undefinedValues = Object.entries(config).filter(
    ([, value]) => value === undefined
  );
  if (undefinedValues.length > 0) {
    console.warn(
      "Some Firebase config values are undefined:",
      undefinedValues.map(([key]) => key)
    );
  }

  return config;
}

// Initialize Firebase only on the client side
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;
let db: Firestore | undefined;

if (typeof window !== "undefined") {
  try {
    app = initializeApp(createFirebaseConfig());
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    // Provide fallback or throw error based on your needs
  }
}

export { auth, googleProvider, db };
export default app;
