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
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  School Admin Dashboard
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Welcome back, {user?.displayName || user?.email}
                </p>
              </div>
              <Button onClick={logout} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Invitations</CardTitle>
                  <CardDescription>
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
                      <div className="text-2xl font-bold">
                        {stats.pendingInvitations}
                      </div>
                      <p className="text-xs text-muted-foreground">
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
                  <CardTitle>Active Teachers</CardTitle>
                  <CardDescription>
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
                      <div className="text-2xl font-bold">
                        {stats.activeTeachers}
                      </div>
                      <p className="text-xs text-muted-foreground">
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
                  <CardTitle>School ID</CardTitle>
                  <CardDescription>Your assigned school</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-mono bg-muted p-2 rounded">
                    {adminClaims?.schoolId || "Not assigned"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    <Link href={ROUTES.INVITE}>Invite Teacher by Email</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
