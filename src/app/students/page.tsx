"use client";

import { useAuth } from "@/contexts/auth-context";
import { PageLayout } from "@/components/layout/page-layout";
import { StudentList } from "@/components/students/student-list";

export default function StudentsPage() {
  const { adminClaims } = useAuth();

  return (
    <PageLayout title="Students Management" requireSchool>
      <StudentList schoolId={adminClaims?.schoolId ?? ""} />
    </PageLayout>
  );
}
