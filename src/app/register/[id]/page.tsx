"use client";

import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/contexts/auth-context";
import { useRegistration } from "@/hooks/useRegistrations";
import { useUser } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { REGISTRATION_STATUS } from "@/lib/firestore-constants";

export default function RegistrationApprovalPage() {
  const params = useParams();
  const registrationId = params.id as string;
  const { user: currentUser, adminClaims } = useAuth();
  
  const { registration, loading: regLoading, error: regError, approve, reject } = useRegistration(registrationId);
  const { user: teacherUser, loading: userLoading } = useUser(registration?.userId || "");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleApprove = async () => {
    if (!currentUser?.uid || !adminClaims?.schoolId) {
      setActionError("Admin credentials not found");
      return;
    }

    setIsProcessing(true);
    setActionError(null);
    
    try {
      await approve(adminClaims.schoolId, currentUser.uid);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to approve registration";
      setActionError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!currentUser?.uid) {
      setActionError("Admin credentials not found");
      return;
    }

    setIsProcessing(true);
    setActionError(null);
    
    try {
      await reject(currentUser.uid, "Rejected by admin");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reject registration";
      setActionError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (regLoading || userLoading) {
    return (
      <AuthGuard requireAdmin>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground"></div>
        </div>
      </AuthGuard>
    );
  }

  if (regError || !registration) {
    return (
      <AuthGuard requireAdmin>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-destructive">
                Registration Not Found
              </CardTitle>
              <CardDescription>
                The registration link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Please check the link or contact the teacher for a new registration link.
              </p>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    );
  }

  const isAlreadyProcessed = registration.status !== REGISTRATION_STATUS.PENDING;

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold text-foreground">
                Teacher Registration Review
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Review and approve teacher registration request
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Teacher Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Teacher Information</CardTitle>
                  <CardDescription>
                    Details about the requesting teacher
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Name
                    </label>
                    <p className="text-sm">
                      {teacherUser?.displayName || registration.userName || "Not provided"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-sm font-mono">
                      {teacherUser?.email || registration.userEmail}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      User ID
                    </label>
                    <p className="text-sm font-mono">
                      {registration.userId}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Registration Date
                    </label>
                    <p className="text-sm">
                      {registration.createdAt?.toDate().toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Registration Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Registration Status</CardTitle>
                  <CardDescription>
                    Current status and actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        registration.status === REGISTRATION_STATUS.PENDING 
                          ? "bg-yellow-100 text-yellow-800" 
                          : registration.status === REGISTRATION_STATUS.APPROVED
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {registration.status || "pending"}
                      </div>
                    </div>
                  </div>

                  {registration.schoolId && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Assigned School
                      </label>
                      <p className="text-sm font-mono">
                        {registration.schoolId}
                      </p>
                    </div>
                  )}

                  {registration.approvedBy && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Approved By
                      </label>
                      <p className="text-sm font-mono">
                        {registration.approvedBy}
                      </p>
                    </div>
                  )}

                  {registration.rejectedBy && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Rejected By
                      </label>
                      <p className="text-sm font-mono">
                        {registration.rejectedBy}
                      </p>
                    </div>
                  )}

                  {registration.rejectionReason && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Rejection Reason
                      </label>
                      <p className="text-sm">
                        {registration.rejectionReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            {!isAlreadyProcessed && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>
                    Approve or reject this registration request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {actionError && (
                    <div className="text-destructive text-sm bg-destructive/10 p-3 rounded mb-4">
                      {actionError}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="flex-1 sm:flex-none"
                    >
                      {isProcessing ? "Processing..." : "Approve Registration"}
                    </Button>
                    
                    <Button
                      onClick={handleReject}
                      disabled={isProcessing}
                      variant="destructive"
                      className="flex-1 sm:flex-none"
                    >
                      {isProcessing ? "Processing..." : "Reject Registration"}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    Approving will assign this teacher to your school: {adminClaims?.schoolId}
                  </p>
                </CardContent>
              </Card>
            )}

            {isAlreadyProcessed && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      This registration has already been{" "}
                      <span className="font-medium">
                        {registration.status}
                      </span>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}