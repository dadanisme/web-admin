"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/paths";

interface PageHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  backHref?: string;
  backLabel?: string;
  showSignOut?: boolean;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  backHref = ROUTES.HOME,
  backLabel = "Back to Dashboard", 
  showSignOut = true,
  actions,
}: PageHeaderProps) {
  const { user, logout } = useAuth();

  const defaultSubtitle = `Welcome back, ${user?.displayName || user?.email}`;

  return (
    <header className="bg-card shadow border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
          <div className="flex-1 min-w-0">
            {typeof title === 'string' ? (
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                {title}
              </h1>
            ) : (
              <div className="mb-2">{title}</div>
            )}
            {typeof subtitle === 'string' ? (
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                {subtitle}
              </p>
            ) : subtitle ? (
              <div className="mt-1">{subtitle}</div>
            ) : (
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                {defaultSubtitle}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 flex gap-2">
            {actions}
            {backHref && (
              <Button asChild variant="outline" size="sm">
                <Link href={backHref}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backLabel}
                </Link>
              </Button>
            )}
            {showSignOut && (
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}