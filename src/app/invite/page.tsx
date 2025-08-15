"use client";

import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { RegistrationService, UserService } from "@/services/firestore";
import { ROUTES } from "@/lib/paths";
import Link from "next/link";

export default function InviteTeacherPage() {
  const { user: currentUser, adminClaims } = useAuth();
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    if (!currentUser?.uid || !adminClaims?.schoolId) {
      setError("Admin credentials not found");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if user already exists
      const existingUser = await UserService.getByEmail(email.trim());

      if (existingUser) {
        if (existingUser.schoolId) {
          setError("This teacher is already assigned to a school");
          return;
        }

        // User exists but not assigned to school - assign directly
        await UserService.assignToSchool(existingUser.id, adminClaims.schoolId);
        setSuccess(`${email} has been assigned to your school successfully!`);
      } else {
        // Check if registration already exists for this email
        const existingRegistration = await RegistrationService.getByEmail(
          email.trim()
        );

        if (existingRegistration) {
          setError("An invitation has already been sent to this email address");
          return;
        }

        // User doesn't exist - create registration entry
        await RegistrationService.create({
          userId: "", // Will be filled when user first logs in
          userEmail: email.trim(),
          status: "pending",
          schoolId: adminClaims.schoolId,
        });
        setSuccess(
          `Invitation sent to ${email}. They will be auto-assigned to your school when they first log in.`
        );
      }

      setEmail("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send invitation";
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold text-foreground">
                Invite Teacher
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Invite a teacher to join your school
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Send Teacher Invitation</CardTitle>
                  <CardDescription>
                    Enter the teacher&apos;s email address to invite them to
                    your school
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Teacher Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="teacher@example.com"
                        disabled={isProcessing}
                        className="mt-1"
                      />
                    </div>

                    {error && (
                      <div className="text-destructive text-sm bg-destructive/10 p-3 rounded">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="text-green-700 text-sm bg-green-50 p-3 rounded">
                        {success}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 sm:flex-none"
                      >
                        {isProcessing
                          ? "Sending Invitation..."
                          : "Send Invitation"}
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 sm:flex-none"
                      >
                        <Link href={ROUTES.HOME}>Back to Dashboard</Link>
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded">
                      <p className="font-medium mb-2">How it works:</p>
                      <ul className="space-y-1">
                        <li>
                          • If the teacher already has an account but no school
                          assignment, they&apos;ll be immediately assigned to
                          your school
                        </li>
                        <li>
                          • If the teacher doesn&apos;t have an account yet,
                          they&apos;ll be auto-assigned to your school when they
                          first log in to the iOS app
                        </li>
                        <li>
                          • Teachers will be assigned to school:{" "}
                          <span className="font-mono">
                            {adminClaims?.schoolId}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
