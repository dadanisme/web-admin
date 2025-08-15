"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { AuthGuard } from "@/components/auth-guard";

export default function ForbiddenPage() {
  const { logout, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthGuard requireAdmin={false}>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-destructive">
              Access Forbidden
            </CardTitle>
            <CardDescription>
              You don&apos;t have permission to access this admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="text-muted-foreground">
              <p className="mb-2">
                This dashboard is restricted to authorized administrators only.
              </p>
              <p className="mb-4">
                You are currently signed in as:{" "}
                <span className="font-mono text-sm">{user?.email}</span>
              </p>
              <p>
                Sign out and try with an administrator account, or contact your
                system administrator.
              </p>
            </div>

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
