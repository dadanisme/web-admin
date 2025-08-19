"use client";

import { useAuth } from "@/contexts/auth-context";
import { AuthGuard } from "@/components/auth-guard";
import { DefaultExamList } from "@/components/default-exams/default-exam-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/paths";

export default function DefaultExamsPage() {
  const { user, adminClaims, logout } = useAuth();

  if (!adminClaims?.schoolId) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <header className="bg-card shadow border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                    Default Exams Management
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                    No school assignment found
                  </p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={ROUTES.HOME}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Link>
                  </Button>
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-destructive">
              No school assignment found. Please contact an administrator.
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                  Default Exams Management
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                  Welcome back, {user?.displayName || user?.email}
                </p>
              </div>
              <div className="flex-shrink-0 flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={ROUTES.HOME}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <DefaultExamList schoolId={adminClaims.schoolId} />
        </main>
      </div>
    </AuthGuard>
  );
}
