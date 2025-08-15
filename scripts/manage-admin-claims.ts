#!/usr/bin/env npx ts-node

/**
 * Firebase Admin Claims Management Script
 *
 * This script allows you to set/remove admin claims for users.
 *
 * Usage:
 *   # Set admin claims
 *   npx ts-node scripts/manage-admin-claims.ts set user@example.com school123
 *
 *   # Remove admin claims
 *   npx ts-node scripts/manage-admin-claims.ts remove user@example.com
 *
 *   # Check user claims
 *   npx ts-node scripts/manage-admin-claims.ts get user@example.com
 */

import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth, UserRecord } from "firebase-admin/auth";

interface AdminClaims {
  admin: boolean;
  schoolId: string;
}

// Validate environment variables
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
] as const;

function validateEnvironment(): void {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ Missing required environment variable: ${envVar}`);
      process.exit(1);
    }
  }
}

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
  // Check if Firebase Admin is already initialized
  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
    projectId: process.env.FIREBASE_PROJECT_ID!,
  });
}

async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const auth = getAuth();

  try {
    return await auth.getUserByEmail(email);
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "auth/user-not-found"
    ) {
      console.error(`❌ User with email ${email} not found`);
      return null;
    }
    throw error;
  }
}

async function setAdminClaims(email: string, schoolId: string): Promise<void> {
  try {
    const user = await getUserByEmail(email);
    if (!user) return;

    const auth = getAuth();
    const claims: AdminClaims = {
      admin: true,
      schoolId: schoolId,
    };

    await auth.setCustomUserClaims(user.uid, claims);

    console.log(`✅ Successfully set admin claims for ${email}`);
    console.log(`   - admin: true`);
    console.log(`   - schoolId: ${schoolId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error setting admin claims:`, errorMessage);
  }
}

async function removeAdminClaims(email: string): Promise<void> {
  try {
    const user = await getUserByEmail(email);
    if (!user) return;

    const auth = getAuth();
    await auth.setCustomUserClaims(user.uid, {});

    console.log(`✅ Successfully removed admin claims for ${email}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error removing admin claims:`, errorMessage);
  }
}

async function getUserClaims(email: string): Promise<void> {
  try {
    const user = await getUserByEmail(email);
    if (!user) return;

    const claims = user.customClaims || {};

    console.log(`📋 Custom claims for ${email}:`);
    console.log(`   - UID: ${user.uid}`);
    console.log(`   - Claims:`, JSON.stringify(claims, null, 2));

    if (claims.admin && claims.schoolId) {
      console.log(`   - Status: ✅ Admin user for school ${claims.schoolId}`);
    } else {
      console.log(`   - Status: ❌ Not an admin user`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error getting user claims:`, errorMessage);
  }
}

function printUsage(): void {
  console.log(`
📝 Firebase Admin Claims Management

Usage:
  npx ts-node scripts/manage-admin-claims.ts <action> <email> [schoolId]

Actions:
  set <email> <schoolId>  - Set admin claims for user
  remove <email>          - Remove admin claims from user  
  get <email>             - Get current user claims

Examples:
  npx ts-node scripts/manage-admin-claims.ts set admin@school.com school123
  npx ts-node scripts/manage-admin-claims.ts remove admin@school.com
  npx ts-node scripts/manage-admin-claims.ts get admin@school.com
`);
}

async function main(): Promise<void> {
  const [, , action, email, schoolId] = process.argv;

  if (!action || !email) {
    printUsage();
    process.exit(1);
  }

  // Validate environment and initialize Firebase
  validateEnvironment();
  initializeFirebaseAdmin();

  switch (action) {
    case "set":
      if (!schoolId) {
        console.error("❌ schoolId is required when setting admin claims");
        process.exit(1);
      }
      await setAdminClaims(email, schoolId);
      break;

    case "remove":
      await removeAdminClaims(email);
      break;

    case "get":
      await getUserClaims(email);
      break;

    default:
      console.error(`❌ Unknown action: ${action}`);
      process.exit(1);
  }

  process.exit(0);
}

main().catch((error: unknown) => {
  const errorMessage =
    error instanceof Error ? error.message : "Unknown error occurred";
  console.error("❌ Unexpected error:", errorMessage);
  process.exit(1);
});
