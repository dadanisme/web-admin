"use client";

import { use } from "react";
import { useAuth } from "@/contexts/auth-context";
import { AuthGuard } from "@/components/auth-guard";
import { ExamList } from "@/components/exams/exam-list";
import { useSubject } from "@/hooks/useSubjects";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/paths";

interface SubjectExamsPageProps {
  params: Promise<{
    subjectId: string;
  }>;
}

export default function SubjectExamsPage({ params }: SubjectExamsPageProps) {
  const { subjectId } = use(params);
  const { user, adminClaims, logout } = useAuth();
  const {
    subject,
    loading: subjectLoading,
    error: subjectError,
  } = useSubject(adminClaims?.schoolId || "", subjectId);

  if (!adminClaims?.schoolId) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <header className="bg-card shadow border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                    Subject Exams
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                    No school assignment found
                  </p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={ROUTES.SUBJECTS}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Subjects
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

  if (subjectLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <header className="bg-card shadow border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={ROUTES.SUBJECTS}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Subjects
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
            <Skeleton className="h-64 w-full" />
          </main>
        </div>
      </AuthGuard>
    );
  }

  if (subjectError || !subject) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <header className="bg-card shadow border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                    Subject Not Found
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                    {subjectError || "Subject not found"}
                  </p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={ROUTES.SUBJECTS}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Subjects
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
              Subject not found or you don&apos;t have permission to access it.
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
                  {subject.name} - Exams
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                  Welcome back, {user?.displayName || user?.email}
                </p>
              </div>
              <div className="flex-shrink-0 flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={ROUTES.SUBJECTS}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Subjects
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
          <ExamList
            schoolId={adminClaims.schoolId}
            subjectId={subjectId}
            subjectName={subject.name}
          />
        </main>
      </div>
    </AuthGuard>
  );
}
