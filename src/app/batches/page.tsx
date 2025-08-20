"use client";

import { useAuth } from "@/contexts/auth-context";
import { PageLayout } from "@/components/layout/page-layout";
import { BatchList } from "@/components/batches/batch-list";

export default function BatchesPage() {
  const { adminClaims } = useAuth();

  return (
    <PageLayout title="Batch Management" requireSchool>
      <BatchList schoolId={adminClaims?.schoolId ?? ""} />
    </PageLayout>
  );
}
