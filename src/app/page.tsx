"use client";

import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { user, adminClaims, logout } = useAuth();

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
                  <CardTitle>Pending Registrations</CardTitle>
                  <CardDescription>
                    Teachers waiting for approval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    No pending registrations
                  </p>
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
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    No active teachers yet
                  </p>
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
                  <Button className="w-full md:w-auto" disabled>
                    View Pending Registrations
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full md:w-auto ml-0 md:ml-2"
                    disabled
                  >
                    Invite Teacher by Email
                  </Button>
                  <p className="text-xs text-muted-foreground/80">
                    Features will be available once implemented
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
