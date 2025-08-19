"use client";

import { useAuth } from "@/contexts/auth-context";
import { PageLayout } from "@/components/layout/page-layout";
import { SubjectList } from "@/components/subjects/subject-list";

export default function SubjectsPage() {
  const { adminClaims } = useAuth();

  return (
    <PageLayout title="Subjects Management" requireSchool>
      <SubjectList schoolId={adminClaims?.schoolId ?? ""} />
    </PageLayout>
  );
}
