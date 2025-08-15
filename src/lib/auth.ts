import { User } from "firebase/auth";

export interface AdminClaims {
  admin: boolean;
  schoolId: string;
}

export interface AuthUser extends User {
  customClaims?: AdminClaims;
}

export async function getAdminClaims(user: User): Promise<AdminClaims | null> {
  try {
    const idTokenResult = await user.getIdTokenResult();
    const claims = idTokenResult.claims;

    if (claims.admin && claims.schoolId) {
      return {
        admin: claims.admin as boolean,
        schoolId: claims.schoolId as string,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting admin claims:", error);
    return null;
  }
}

export function isAdmin(claims: AdminClaims | null): boolean {
  return claims?.admin === true && Boolean(claims?.schoolId);
}
