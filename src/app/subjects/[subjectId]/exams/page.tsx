"use client";

import { use } from "react";
import { useAuth } from "@/contexts/auth-context";
import { PageLayout } from "@/components/layout/page-layout";
import { ExamList } from "@/components/exams/exam-list";
import { useSubject } from "@/hooks/useSubjects";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/paths";

interface SubjectExamsPageProps {
  params: Promise<{
    subjectId: string;
  }>;
}

export default function SubjectExamsPage({ params }: SubjectExamsPageProps) {
  const { subjectId } = use(params);
  const { adminClaims } = useAuth();
  const {
    subject,
    loading: subjectLoading,
    error: subjectError,
  } = useSubject(adminClaims?.schoolId || "", subjectId);

  if (subjectLoading) {
    return (
      <PageLayout
        title={<Skeleton className="h-8 w-64" />}
        subtitle={<Skeleton className="h-4 w-48" />}
        backHref={ROUTES.SUBJECTS}
        backLabel="Back to Subjects"
        requireSchool
      >
        <Skeleton className="h-64 w-full" />
      </PageLayout>
    );
  }

  if (subjectError || !subject) {
    return (
      <PageLayout
        title="Subject Not Found"
        subtitle={subjectError || "Subject not found"}
        backHref={ROUTES.SUBJECTS}
        backLabel="Back to Subjects"
        requireSchool
      >
        <div className="text-center text-destructive">
          Subject not found or you don&apos;t have permission to access it.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={`${subject.name} - Exams`}
      backHref={ROUTES.SUBJECTS}
      backLabel="Back to Subjects"
      requireSchool
    >
      <ExamList
        schoolId={adminClaims?.schoolId ?? ""}
        subjectId={subjectId}
        subjectName={subject.name}
      />
    </PageLayout>
  );
}
