"use client";

import { PageLayout } from "@/components/layout/page-layout";
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
  const { adminClaims } = useAuth();
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useSchoolStats(adminClaims?.schoolId);

  return (
    <PageLayout title="School Admin Dashboard" requireAdmin showSignOut={true}>
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
              <CardTitle className="text-base sm:text-lg">School ID</CardTitle>
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
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={ROUTES.INVITE}>Invite Teacher by Email</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={ROUTES.STUDENTS}>Manage Students</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={ROUTES.SUBJECTS}>Manage Subjects</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={ROUTES.DEFAULT_EXAMS}>Manage Default Exams</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
