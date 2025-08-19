"use client";

import { useAuth } from "@/contexts/auth-context";
import { PageLayout } from "@/components/layout/page-layout";
import { DefaultExamList } from "@/components/default-exams/default-exam-list";

export default function DefaultExamsPage() {
  const { adminClaims } = useAuth();

  return (
    <PageLayout title="Default Exams Management" requireSchool>
      <DefaultExamList schoolId={adminClaims?.schoolId ?? ""} />
    </PageLayout>
  );
}
