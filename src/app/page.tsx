"use client";

import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/contexts/auth-context";
import { useSchoolStats } from "@/hooks/useSchoolStats";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ROUTES } from "@/lib/paths";

export default function Home() {
  const { user, adminClaims, logout } = useAuth();
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useSchoolStats(adminClaims?.schoolId);

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                  School Admin Dashboard
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                  Welcome back, {user?.displayName || user?.email}
                </p>
              </div>
              <div className="flex-shrink-0">
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Pending Invitations
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Teachers invited but not yet logged in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ) : statsError ? (
                    <div className="text-sm text-destructive">
                      Error loading data
                    </div>
                  ) : (
                    <>
                      <div className="text-xl sm:text-2xl font-bold">
                        {stats.pendingInvitations}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {stats.pendingInvitations === 0
                          ? "No pending invitations"
                          : `${stats.pendingInvitations} teacher${stats.pendingInvitations === 1 ? "" : "s"} waiting to log in`}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Active Teachers
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Approved teachers in your school
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ) : statsError ? (
                    <div className="text-sm text-destructive">
                      Error loading data
                    </div>
                  ) : (
                    <>
                      <div className="text-xl sm:text-2xl font-bold">
                        {stats.activeTeachers}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {stats.activeTeachers === 0
                          ? "No active teachers yet"
                          : `${stats.activeTeachers} teacher${stats.activeTeachers === 1 ? "" : "s"} in your school`}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    School ID
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Your assigned school
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs sm:text-sm font-mono bg-muted p-2 rounded break-all">
                    {adminClaims?.schoolId || "Not assigned"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Link href={ROUTES.INVITE}>Invite Teacher by Email</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Link href={ROUTES.STUDENTS}>Manage Students</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Link href={ROUTES.SUBJECTS}>Manage Subjects</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Link href={ROUTES.DEFAULT_EXAMS}>
                      Manage Default Exams
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
