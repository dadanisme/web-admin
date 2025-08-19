"use client";

import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/contexts/auth-context";
import { PageHeader } from "./page-header";

interface PageLayoutProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  backHref?: string;
  backLabel?: string;
  showSignOut?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSchool?: boolean;
}

export function PageLayout({
  title,
  subtitle,
  backHref,
  backLabel,
  showSignOut = true,
  actions,
  children,
  requireAdmin = false,
  requireSchool = false,
}: PageLayoutProps) {
  const { adminClaims } = useAuth();

  // If requireSchool is true and user doesn't have schoolId, show error
  if (requireSchool && !adminClaims?.schoolId) {
    return (
      <AuthGuard requireAdmin={requireAdmin}>
        <div className="min-h-screen bg-background">
          <PageHeader
            title={title}
            subtitle="No school assignment found"
            backHref={backHref}
            backLabel={backLabel}
            showSignOut={showSignOut}
            actions={actions}
          />
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
    <AuthGuard requireAdmin={requireAdmin}>
      <div className="min-h-screen bg-background">
        <PageHeader
          title={title}
          subtitle={subtitle}
          backHref={backHref}
          backLabel={backLabel}
          showSignOut={showSignOut}
          actions={actions}
        />
        <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}